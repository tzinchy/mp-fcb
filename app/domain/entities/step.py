from sqlalchemy import Column, Integer, String, TIMESTAMP
from sqlalchemy.sql import func
from core.database import Base


class Step(Base):
    __tablename__ = "step"

    step_id = Column(Integer, primary_key=True)
    promleb_id = Column(Integer)
    status_id = Column(Integer)
    step = Column(String)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())
    updated_at = Column(TIMESTAMP(timezone=True), server_default=func.now(), onupdate=func.now())

    def __repr__(self):
        return f"<Step(step_id={self.step_id}, promleb_id={self.promleb_id}, status_id={self.status_id}, step='{self.step}')>"
