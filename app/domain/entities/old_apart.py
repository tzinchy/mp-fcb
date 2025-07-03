from sqlalchemy import Column, Integer, String, JSON, TIMESTAMP
from core.database import Base
from sqlalchemy.sql import func

class OldApart(Base):
    __tablename__ = "old_apart"

    affair_id = Column(Integer, primary_key=True)
    fio = Column(String)
    house_address = Column(String)
    apart_number = Column(String)
    status_id = Column(Integer)
    problems = Column(JSON)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())
    updated_at = Column(TIMESTAMP(timezone=True), server_default=func.now(), onupdate=func.now())