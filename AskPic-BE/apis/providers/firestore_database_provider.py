from apis.configs.firebase_configs import firebase_db

class FirestoreDatabaseProvider:
    def __init__(self, collection_name):
        self.db = firebase_db
        self.collection_name = collection_name

    def create_document(self, data):
        doc_ref = self.db.collection(self.collection_name).add(data)
        return doc_ref[1].id
    
    def read_document(self, document_id):
        doc_ref = self.db.collection(self.collection_name).document(document_id).get()
        return doc_ref.to_dict()
    
    def read_all_documents(self):
        docs = self.db.collection(self.collection_name).stream()
        return [doc.to_dict() for doc in docs]
    
    def update_document(self, document_id, data):
        try:
            self.db.collection(self.collection_name).document(document_id).update(data)
            return True
        except Exception as e:
            print(f"Error: {e}")
            return False
    
    def delete_document(self, document_id):
        try:
            self.db.collection(self.collection_name).document(document_id).delete()
            return True
        except Exception as e:
            print(f"Error: {e}")
            return False
