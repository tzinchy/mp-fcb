from fastapi import FastAPI

from api.v1.endpoints.old_apart_table import router as old_apart_routrer 

app = FastAPI()

app.include_router(old_apart_routrer)