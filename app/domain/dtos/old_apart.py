from pydantic import BaseModel

class OldApart(BaseModel):
    affair_id : int 
    fio : str 
    house_address : str 
    apart_number : str 
    problems : dict 
    