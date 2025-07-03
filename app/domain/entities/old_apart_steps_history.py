from sqlalchemy import Column, Integer, TIMESTAMP
from core.database import Base
from sqlalchemy.sql import func

class OldApartStatusHistory(Base):
    __tablename__ = "old_apart_status_history"

    old_apart_status_history_id = Column(Integer, primary_key=True)
    affair_id = Column(Integer)
    step_id = Column(Integer)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())
    updated_at = Column(TIMESTAMP(timezone=True), server_default=func.now(), onupdate=func.now())