from sqlalchemy import Column, Integer, String, TIMESTAMP
from core.database import Base
from sqlalchemy.sql import func

class Status(Base):
    __tablename__ = "status"

    status_id = Column(Integer, primary_key=True)
    status = Column(String)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())
    updated_at = Column(TIMESTAMP(timezone=True), server_default=func.now(), onupdate=func.now())
