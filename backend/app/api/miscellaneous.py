from fastapi import APIRouter

router = APIRouter(tags=["Miscellaneous"])

@router.get("/health")
def health_check():
    return {"status": "ok"}

@router.get("/settings")
def get_settings():
    # Placeholder for application settings
    settings = {
        "app_name": "Jewelry Store Backend",
        "version": "1.0.0",
        "environment": "development"
    }
    return settings

@router.put("/settings")
def update_settings(new_settings: dict):
    # Placeholder for updating application settings
    return {"message": "Settings updated successfully", "new_settings": new_settings}
