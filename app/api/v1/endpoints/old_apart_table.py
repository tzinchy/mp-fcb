from api.v1.dependencies import old_apart_repository
from domain.dtos.stages import SetNewStage, StageHistoryResponse
from fastapi import APIRouter
from domain.dtos.old_apart import OldApartBase
from domain.services.rsm_service import RsmService

router = APIRouter(prefix='/old_apart', tags=['Проблемные квартиры'])

@router.get('')
async def get_old_apart():
    result = await (old_apart_repository.get_old_apart())
    # rsm = RsmService()
    # await rsm.get_kpu_info(1033628)
    return result

@router.get('/{affair_id}/get_stages')
async def get_stages(affair_id : int): 
    result = await (old_apart_repository.get_stage_history(affair_id=affair_id))
    return result

@router.post('/set_next_stage')
async def next_stages_for_apart(set_new_stage : SetNewStage):
    result = await old_apart_repository.set_new_stage(affair_id=set_new_stage.affair_id, 
                                                    currentStageId=set_new_stage.currentStageId,
                                                    current_stage_history_id=set_new_stage.current_stage_history_id, 
                                                    doc_date=set_new_stage.doc_date, 
                                                    doc_number=set_new_stage.doc_number,
                                                    next_stage_id=set_new_stage.next_stage_id, notes=set_new_stage.notes)
    return result

@router.post('/create_old_apart')
async def create_old_apart(
    old_apart : OldApartBase
):
    return await old_apart_repository.create_old_apart(old_apart=old_apart)