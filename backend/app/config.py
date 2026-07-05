from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application configuration, loaded from environment / .env."""

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str = ""
    bot_token: str = ""
    telegram_chat_id: str = ""
    telegram_webhook_secret: str = ""
    # Comma/newline separated proxy list for reaching Telegram (RU hosts).
    telegram_proxies: str = ""
    admin_username: str = "admin"
    admin_password: str = "change-me"
    cors_origins: str = "http://localhost:3000,http://localhost:5173"
    media_dir: str = "uploads"
    session_ttl_hours: int = 168

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
