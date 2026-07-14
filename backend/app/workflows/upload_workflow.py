"""Upload workflow — parse → graph build → completeness gate.

Runs asynchronously (Celery) so the API responds immediately with a job
handle while heavy parsing happens in a worker.
"""

from pathlib import Path

from app.constants import DocumentType
from app.utils.helpers import new_id
from app.utils.logger import get_logger

logger = get_logger(__name__)


class UploadWorkflow:
    def start(self, stored_path: Path, doc_type: DocumentType) -> dict:
        """Register the document and enqueue the processing job."""
        job_id = new_id()
        logger.info("Upload accepted", extra={"path": str(stored_path), "doc_type": doc_type})
        # TODO(workflow): persist Document row (status=uploaded) and enqueue
        # a Celery task running parse → graph build → completeness gate.
        return {"job_id": job_id, "status": "queued", "doc_type": doc_type}
