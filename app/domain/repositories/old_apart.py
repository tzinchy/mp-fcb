from datetime import date

from domain.entities.old_apart import OldApart
from sqlalchemy import Select, text
from sqlalchemy.orm import sessionmaker


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
                    'problems', o.problems,
					'affair_id', affair_id
                )
            ) AS combined_json
            FROM 
                mprg.old_apart o
            JOIN 
                mprg.status s ON o.status_id = s.status_id;'''))
            
            row = result.fetchone()
            return row[0] if row else {}
        
    async def get_stage_history(self, affair_id : int): 
        async with self.create_session() as session: 
            result = await session.execute(text("""
            WITH stage_info AS (
                SELECT 
                    o.affair_id,
                    p.problem_id,
                    p.problem as problem_name,
                    jsonb_build_object(
                        'id', sh.stage_id,
                        'stage_history_id', sh.stage_history_id,                       
                        'stage_id', sh.stage_id,
                        'label', s.stage,
                        'date', sh.doc_date,
                        'number', sh.document_number,
                        'created_at', sh.created_at,
                        'updated_at', sh.updated_at,
                        'documents', sh.documents,
                        'stage_status', ss.stage_status,
                        'next_stage', s.next_stage
                    ) AS stage_json,
                    sh.created_at
                FROM 
                    mprg.stage_history sh
                JOIN mprg.stage s USING (stage_id)
                JOIN mprg.old_apart o USING (affair_id)
                JOIN mprg.problems p USING (problem_id)
                JOIN mprg.stage_status ss USING (stage_status_id)
                WHERE affair_id = :affair_id
            )
            SELECT 
                problem_id,
                problem_name,
                jsonb_agg(stage_json ORDER BY created_at) AS stages
            FROM 
                stage_info
            GROUP BY 
                problem_id,
                problem_name;
            """
            ), {'affair_id' : affair_id})
            result = result.fetchall()
            return [row._mapping for row in result]
<<<<<<< HEAD
        
    async def update_stage_history(self, params: dict):

        return
=======
    
    async def set_new_stage(self, affair_id : int, currentStageId : int, current_stage_history_id : int, doc_date : date, doc_number : str, next_stage : int):
        async with self.create_session() as session: 
            result = await session.execute(text(
                """
                WITH update_center AS (
                    UPDATE mprg.stage_history 
                    SET stage_status_id = 3
                    WHERE affair_id = :affair_id 
                    AND stage_history_id = :current_stage_history_id
                )
                INSERT INTO mprg.stage_history (affair_id, stage_id, document_number, stage_status_id) 
                VALUES (:affair_id, :next_stage, :doc_number, 1)
                """
            ), {'affair_id' : affair_id, 
                'currentStageId' : currentStageId,
                'current_stage_history_id':current_stage_history_id, 
                'doc_date' : doc_date, 
                'doc_number' : doc_number, 
                'next_stage' : next_stage,
                'doc_number' : doc_number}
                )
            
            await session.commit()
            return result.rowcount
        
        
>>>>>>> e3603ba (add set_next_stage)
