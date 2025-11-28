from dotenv import load_dotenv
import os

load_dotenv()

SQL_DATABASE_URL = os.getenv('Database_url')
SECRET_KEY = os.getenv('SECRET_KEY')
UPLOAD_DIR = os.getenv('UPLOAD_DIR')
BASE_URL = os.getenv('BASE_URL')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
