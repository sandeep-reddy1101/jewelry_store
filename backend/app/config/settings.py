from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # Database settings (no default values, import from .env)
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    POSTGRES_HOST: str
    POSTGRES_PORT: str
    POSTGRES_DB: str

    # SQLAlchemy database URL
    @property
    def DATABASE_URL(self) -> str:
        return f"postgresql://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"

    class Config:
        env_file = ".env"

# Create settings instance
settings = Settings()
