from app.proxy import ProxyPool, parse_proxies


def test_parse_normalizes_and_filters():
    raw = "socks5://1.2.3.4:1080, http://5.6.7.8:8080\n127.0.0.1:1080\n# comment\n\n"
    out = parse_proxies(raw)
    assert out == [
        "socks5://1.2.3.4:1080",
        "http://5.6.7.8:8080",
        "socks5://127.0.0.1:1080",  # bare host:port → socks5 (VPN port)
    ]


def test_pool_attempts_order_and_direct_fallback():
    pool = ProxyPool(["socks5://a:1", "http://b:2"])
    attempts = pool.attempts()
    assert attempts == ["socks5://a:1", "http://b:2", None]  # direct last


def test_pool_sticks_to_working_proxy():
    pool = ProxyPool(["socks5://a:1", "http://b:2"])
    pool.mark_ok("http://b:2")
    # working proxy is tried first next time (correlation)
    assert pool.attempts()[0] == "http://b:2"


def test_empty_pool_is_direct_only():
    pool = ProxyPool([])
    assert pool.attempts() == [None]
