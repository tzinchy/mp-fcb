import os
from dataclasses import dataclass
from dotenv import load_dotenv

from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
load_dotenv()

@dataclass
class DatabaseSettings:
    DB_HOST: str = os.getenv("DB_HOST")
    DB_PORT: str = os.getenv("DB_PORT")
    DB_USER: str = os.getenv("DB_USER")
    DB_PASS: str = os.getenv("DB_PASS")
    DB_NAME: str = os.getenv("DB_NAME")
    DB_SCHEMA: str = os.getenv("DB_SCHEMA", "public")

    @property
    def DATABASE_URL(self) -> str:
        return f"postgresql+asyncpg://{self.DB_USER}:{self.DB_PASS}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"

db_settings = DatabaseSettings()

Base = declarative_base()

engine = create_async_engine(
    db_settings.DATABASE_URL,
    pool_size=10,
    max_overflow=20,
    connect_args={
        "server_settings": {
            "search_path": db_settings.DB_SCHEMA  
        }
    }
)

AsyncSessionLocal = sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False
)

