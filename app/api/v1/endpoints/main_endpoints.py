from api.v1.dependencies import problem_repository, rsm_service

from fastapi import APIRouter, Query


router = APIRouter(prefix='/main', tags=['Основные ручки'])

@router.get('/all_problems')
async def get_all_problems():
    result = await problem_repository.get_all_problems()
    return result

@router.get('/rsm/get_kpu_info')
async def get_rsm_kpu_info(affair_id: int = Query(...)):
    
    result = await rsm_service.get_kpu_info(affair_id)
    return result


