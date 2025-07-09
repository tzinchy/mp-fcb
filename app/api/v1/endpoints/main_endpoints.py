from api.v1.dependencies import problem_repository
from fastapi import APIRouter


router = APIRouter(prefix='/main', tags=['Основные ручки'])

@router.get('/all_problems')
async def get_all_problems():
    result = await problem_repository.get_all_problems()
    return result


