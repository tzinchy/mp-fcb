from sqlalchemy import Column, Integer, String, TIMESTAMP
from core.database import Base
from sqlalchemy.sql import func

class Problems(Base):
    __tablename__ = "problems"

    problem_id = Column(Integer, primary_key=True)
    problem = Column(String)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())
    updated_at = Column(TIMESTAMP(timezone=True), server_default=func.now(), onupdate=func.now())
