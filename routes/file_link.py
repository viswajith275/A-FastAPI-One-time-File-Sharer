from fastapi import APIRouter, Depends, HTTPException, status, File ,UploadFile, BackgroundTasks,Query,Response
import os
from database import SessionDep
from oauth2 import UserDep
from utils import delete_file
import uuid
from cryptography.fernet import Fernet
import urllib
from config import UPLOAD_DIR, BASE_URL

os.makedirs(UPLOAD_DIR, exist_ok=True)

route = APIRouter(prefix='/files')

@route.post('/Uploads')
async def upload_file(user : UserDep, db : SessionDep,file: UploadFile = File(...)):

    key = Fernet.generate_key()
    cipher = Fernet(key)

    file_data = await file.read()

    encrypted_data = cipher.encrypt(file_data)

    file_id = str(uuid.uuid4())
    secure_filename = f"{file_id}.enc"
    file_path = os.path.join(UPLOAD_DIR, secure_filename)


    with open(file_path,'wb') as f:
        f.write(encrypted_data)
    
    safe_filename = urllib.parse.quote(file.filename)

    return {
        "filename": file.filename,
        "one_time_link": f"{BASE_URL}/files/download/{secure_filename}/?key={key.decode()}&name={safe_filename}",
        "note": "This link will work exactly once."
    }

@route.get('/download/{file_name}')
def download(file_name :str, background_task: BackgroundTasks, key: str = Query(...), name: str = Query(...)):
    file_path = os.path.join(UPLOAD_DIR, file_name)

    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found or already deleted.")

    with open(file_path,'r') as f:
        enc_data = f.read()
    
    try:
        cipher = Fernet(key.encode())
        decrypted_data = cipher.decrypt(enc_data)
    except:

        raise HTTPException(status_code=400, detail="Invalid Key. Cannot Decrypt.")
    
    background_task.add_task(delete_file, file_path)
    headers = {
        "Content-Disposition": f'attachment; filename="{name}"'
    }
    return Response(content=decrypted_data, media_type='application/octet-stream', headers=headers)
