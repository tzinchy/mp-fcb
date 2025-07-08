from pydantic import BaseModel
from typing import Dict, List, Any, Optional
from datetime import date

class StageHistoryResponse(BaseModel):
    affair_id: int
    problem_stages: Dict[str, List[Dict[str, Any]]]

class SetNewStage(BaseModel):
    affair_id : int 
    currentStageId : Optional[int]
    current_stage_history_id : int
    doc_date : Optional[date] = None 
    doc_number : Optional[str] = None
    next_stage_id : Optional[int] = None
    notes : Optional[str] = None


