from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import create_db_and_tables
from routes import login, file_link

app = FastAPI()

@app.on_event('startup')
def startup():
    create_db_and_tables()

origins = ["http://localhost:5173"]

app.add_middleware(CORSMiddleware, allow_origins=origins, allow_credentials=True,allow_methods=['*'],allow_headers=['*'])

app.include_router(login.routes)
app.include_router(file_link.route)