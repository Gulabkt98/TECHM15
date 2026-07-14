"""Document upload — entry point of the analysis pipeline.

Accepts PDF/DOCX, persists the original, and hands off to the upload
workflow (parse → graph → completeness gate) asynchronously.
"""

from fastapi import APIRouter, HTTPException, UploadFile, status

from app.constants import DocumentType
from app.utils.file_utils import save_upload
from app.utils.response import success
from app.utils.validators import is_allowed_file, is_within_size_limit
from app.workflows.upload_workflow import UploadWorkflow

router = APIRouter()


@router.post("")
async def upload_document(file: UploadFile, doc_type: DocumentType) -> dict:
    if not file.filename or not is_allowed_file(file.filename):
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_ENTITY, "Only PDF and DOCX files are supported.")

    content = await file.read()
    if not is_within_size_limit(len(content)):
        raise HTTPException(status.HTTP_413_REQUEST_ENTITY_TOO_LARGE, "File exceeds the 50 MB upload limit.")

    stored_path = save_upload(file.filename, content)
    job = UploadWorkflow().start(stored_path, doc_type)
    return success({"document_path": stored_path.name, "job": job}, "Document accepted for processing")
