from sqlalchemy.orm import sessionmaker
from sqlalchemy import text

class ProblemsRepository: 
    def __init__(self, engine : sessionmaker):
        self.create_session = engine

    async def get_old_apart(self): 
        async with self.create_session() as session: 
            result = await session.execute(text('''
                SELECT problem_id, problem FROM mprg.problems
            '''))
            row = result.fetchone()
            return row[0] if row else {}
        

        

