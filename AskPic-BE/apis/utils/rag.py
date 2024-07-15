from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import PyPDFLoader, Docx2txtLoader, UnstructuredPDFLoader, UnstructuredWordDocumentLoader

def load_documents(path):

    if path.endswith(".pdf"):
        loader = UnstructuredPDFLoader(file_path=path)
        # loader = PyPDFLoader(file_path=path)
    elif path.endswith(".docx"):
        loader = UnstructuredWordDocumentLoader(file_path=path)
        # loader = Docx2txtLoader(file_path=path)

    docs = loader.load()

    return docs

def split_text(docs):

    text_splitter = RecursiveCharacterTextSplitter(chunk_size=10000, chunk_overlap=5000)
    splits = text_splitter.split_documents(docs)

    return splits
