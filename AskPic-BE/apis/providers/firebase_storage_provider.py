from apis.configs.firebase_configs import firebase_bucket

class FirebaseStorageProvider:
    def __init__(self, folder_name):
        self.folder_name = folder_name
        self.bucket = firebase_bucket

    def create_file(self, file_path):
        file_name = file_path.split("/")[-1]
        blob = self.bucket.blob(f"{self.folder_name}/{file_name}")
        blob.upload_from_filename(file_path)
        blob.make_public()
        return blob.public_url

    def delete_file(self, storage_file_path):
        try:
            blob = self.bucket.blob(storage_file_path)
            blob.delete()
            return True
        except Exception as e:
            print(f"Error: {e}")
            return False
