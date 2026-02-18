from fastapi import APIRouter, Depends
from asgiref.sync import sync_to_async
from fastapi_app.routes.auth import get_current_user
from fastapi_app.services.notification_service import get_user_notifications

router = APIRouter(
    prefix="/api/notifications",
    tags=["Notifications"]
)


@router.get("/")
async def fetch_notifications(current_user=Depends(get_current_user)):
    notifications = await sync_to_async(get_user_notifications)(current_user)
    return notifications
