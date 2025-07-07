from pydantic import BaseModel
from typing import Dict, List, Any
from datetime import date

class StageHistoryResponse(BaseModel):
    affair_id: int
    problem_stages: Dict[str, List[Dict[str, Any]]]

class SetNewStage(BaseModel):
    affair_id : int 
    currentStageId : int
    current_stage_history_id : int
    doc_date : date 
    doc_number : str
<<<<<<< HEAD
    next_stage_id : int
=======
    next_stage : int
>>>>>>> e3603ba (add set_next_stage)


