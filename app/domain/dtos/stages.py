from pydantic import BaseModel
from typing import Dict, List, Any

class StageHistoryResponse(BaseModel):
    affair_id: int
    problem_stages: Dict[str, List[Dict[str, Any]]]