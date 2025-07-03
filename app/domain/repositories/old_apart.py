from sqlalchemy.orm import sessionmaker
from sqlalchemy import Select, text
from domain.entities.old_apart import OldApart

class OldApartRepository: 
    def __init__(self, engine : sessionmaker):
        self.create_session = engine

    async def create_old_apart(self, affair_id, fio, house_address, apart_number, problems):
        pass
        
    async def get_old_apart(self): 
        async with self.create_session() as session: 
            result = await session.execute(text('''
            SELECT jsonb_object_agg(
                o.affair_id,
                jsonb_build_object(
                    'fio', o.fio,
                    'house_address', o.house_address,
                    'apart_number', o.apart_number,
                    'status', s.status,
                    'problems', o.problems
                )
            ) AS combined_json
            FROM 
                mprg.old_apart o
            JOIN 
                mprg.status s ON o.status_id = s.status_id;'''))
            
            row = result.fetchone()
            return row[0] if row else {}
        
    async def get_old_apart_stages(): 
        async with self.create_session() as session: 
            pass
        

        

