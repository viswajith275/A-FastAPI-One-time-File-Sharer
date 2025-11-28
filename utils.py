import os



def delete_file(path):
    try:
        os.remove(path)
        print(f"File deleted: {path}")
    except Exception as e:
        print(f"Error deleting file: {e}")