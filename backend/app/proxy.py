"""Proxy/VPN rotation for outbound Telegram calls.

Telegram is often unreachable from RU hosts, so requests go through a list of
proxies (or local VPN ports). The pool tries them in order, *sticks* to the one
that last worked (correlation), and rotates to the next on failure. A direct
connection is attempted last as a fallback.

Config sources (DB setting overrides env):
  - env  TELEGRAM_PROXIES        (comma/newline separated)
  - DB   setting "telegram_proxies"

Each entry is a proxy URL. Bare `host:port` is treated as `socks5://host:port`
(handy for a local VPN client exposing a SOCKS port). Examples:
  socks5://user:pass@1.2.3.4:1080
  http://1.2.3.4:8080
  127.0.0.1:1080          # local VPN port → socks5://127.0.0.1:1080
"""

import threading


def parse_proxies(raw: str) -> list[str]:
    if not raw:
        return []
    parts: list[str] = []
    for chunk in raw.replace(",", "\n").splitlines():
        entry = chunk.strip()
        if not entry or entry.startswith("#"):
            continue
        if "://" not in entry:
            entry = f"socks5://{entry}"  # bare host:port → socks (VPN port)
        parts.append(entry)
    return parts


class ProxyPool:
    """Ordered proxy list with a sticky pointer to the last working proxy."""

    def __init__(self, proxies: list[str], direct_fallback: bool = True):
        self._proxies = proxies
        self._direct_fallback = direct_fallback
        self._sticky: str | None = None
        self._lock = threading.Lock()

    def attempts(self) -> list[str | None]:
        """Proxies to try, sticky-first, then the rest, then direct (None)."""
        with self._lock:
            sticky = self._sticky
        ordered: list[str | None] = []
        if sticky and sticky in self._proxies:
            ordered.append(sticky)
        ordered += [p for p in self._proxies if p != sticky]
        if self._direct_fallback or not self._proxies:
            ordered.append(None)  # direct connection as last resort
        return ordered

    def mark_ok(self, proxy: str | None) -> None:
        with self._lock:
            self._sticky = proxy

    def __len__(self) -> int:
        return len(self._proxies)
