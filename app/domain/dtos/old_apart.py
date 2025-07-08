from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel

class OldApartBase(BaseModel):
    affair_id : int
    fio: Optional[str] = None
    house_address: Optional[str] = None
    apart_number: Optional[str] = None
    status_id: Optional[int] = 1
    problems: Optional[List[int]] = None
    kpu: Optional[str] = None
    problem_category: Optional[str] = None
    unom: Optional[int] = None
    district: Optional[str] = None
    municipal_district: Optional[str] = None
    room_apart_number: Optional[str] = None