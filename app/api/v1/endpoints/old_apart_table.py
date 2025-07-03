from fastapi import APIRouter, Query, Body, BackgroundTasks
from api.v1.dependencies import old_apart_repository

router = APIRouter(prefix='/old_apart', tags=['Проблемные квартиры'])

@router.get('')
async def get_old_apart():
    result = await (old_apart_repository.get_old_apart())
    return result

@router.get('{affair_id}/get_stages')
async def get_stages(affair_id : int): 
    pass 

@router.get('{affair_id}/{problem_id}/next_stages')
async def next_stages_for_apart(affair_id : int, problem_id : int):
    pass