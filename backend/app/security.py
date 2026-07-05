import hashlib
import hmac
import secrets

_ITERATIONS = 160_000


def hash_password(password: str, salt: str | None = None) -> tuple[str, str]:
    """Return (hex_hash, salt) using PBKDF2-HMAC-SHA256."""
    salt = salt or secrets.token_urlsafe(16)
    dk = hashlib.pbkdf2_hmac(
        "sha256", password.encode(), salt.encode(), _ITERATIONS
    )
    return dk.hex(), salt


def verify_password(password: str, password_hash: str, salt: str) -> bool:
    candidate, _ = hash_password(password, salt)
    return hmac.compare_digest(candidate, password_hash)


def new_token() -> str:
    return secrets.token_urlsafe(32)


def new_order_id() -> str:
    return f"BB-{secrets.randbelow(90000) + 10000}"
