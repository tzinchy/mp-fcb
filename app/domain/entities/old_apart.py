from datetime import datetime
from typing import List, Optional

from sqlalchemy import Column, Integer, String, DateTime, ARRAY
from sqlalchemy.dialects.postgresql import ARRAY 
from sqlalchemy.ext.declarative import declarative_base
from core.database import Base

class OldApart(Base):
    __tablename__ = 'old_apart'
    __table_args__ = {'schema': 'mprg'}

    affair_id = Column(Integer, primary_key=True, autoincrement=True)
    fio = Column(String)
    house_address = Column(String)
    apart_number = Column(String)
    status_id = Column(Integer, default=1)
    # created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    # updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)
    problems = Column(ARRAY(Integer))  
    kpu = Column(String)
    problem_category = Column(String)
    unom = Column(Integer)
    district = Column(String)
    municipal_district = Column(String)
    room_apart_number = Column(String)

    def __repr__(self):
        return f"<OldApart(affair_id={self.affair_id}, address={self.house_address}/{self.apart_number})>"