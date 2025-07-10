from core.database import AsyncSessionLocal
from domain.repositories.old_apart import OldApartRepository
from domain.repositories.problems import ProblemsRepository
from domain.services.rsm_service import RsmService

old_apart_repository = OldApartRepository(AsyncSessionLocal)
problem_repository = ProblemsRepository(AsyncSessionLocal)
rsm_service = RsmService()