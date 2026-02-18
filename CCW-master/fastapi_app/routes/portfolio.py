import fastapi_app.django_setup
from fastapi import APIRouter, HTTPException, Form, File, UploadFile
from typing import Optional, List
from pathlib import Path as PathLib

from django.core.files.base import ContentFile
from django.conf import settings

from creator_app.models import UserData, PortfolioItem


router = APIRouter(prefix="/portfolio", tags=["Creator Portfolio"])

FASTAPI_BASE_DIR = PathLib(__file__).resolve().parent.parent


def get_creator_user(user_id: int):
    try:
        user = UserData.objects.get(id=user_id)
        if str(user.role).lower() != "creator":
            raise HTTPException(
                status_code=403,
                detail="Access Denied: Only creators can manage portfolios."
            )
        return user
    except UserData.DoesNotExist:
        raise HTTPException(status_code=404, detail="User not found")


# ==========================================
#  FILE SERVER - For portfolio files
# ==========================================
@router.get("/files/{file_path:path}")
async def serve_portfolio_file(file_path: str):
    """
    Serve portfolio files through FastAPI.
    """
    try:
        # Security check
        if ".." in file_path or file_path.startswith("/"):
            raise HTTPException(status_code=400, detail="Invalid file path")
        
        storage_base = FASTAPI_BASE_DIR.parent / "media"
        
        possible_locations = [
            storage_base / file_path,
            FASTAPI_BASE_DIR / "media" / file_path,
            FASTAPI_BASE_DIR / file_path,
        ]
        
        for file_location in possible_locations:
            if file_location.exists() and file_location.is_file():
                from fastapi.responses import FileResponse
                import mimetypes
                
                mime_type, _ = mimetypes.guess_type(str(file_location))
                if not mime_type:
                    mime_type = "application/octet-stream"
                
                return FileResponse(
                    path=str(file_location),
                    media_type=mime_type,
                    filename=file_location.name
                )
        
        raise HTTPException(status_code=404, detail=f"File not found: {file_path}")
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error serving file: {str(e)}")


# ==========================================
# 1. ADD PORTFOLIO ITEM (Creator Only)
# ==========================================
@router.post("/add")
async def add_portfolio_item(
    user_id: int = Form(...),
    title: str = Form(...),
    media_link: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
):
    user = get_creator_user(user_id)

    item = PortfolioItem(
        user=user,
        role="creator",
        title=title,
        media_link=media_link,
        description=description,
    )

    if file and file.filename:
        content = await file.read()
        if content:
            from django.core.files.base import ContentFile
            import random
            import string
            
            def generate_random_digits(length=4):
                return ''.join(random.choices(string.digits, k=length))
            
            random_digits = generate_random_digits()
            ext = PathLib(file.filename).suffix
            filename = f"creator_{user_id}_{random_digits}{ext}"
            
            item.file.save(
                filename,
                ContentFile(content),
                save=True
            )

    await item.asave() if hasattr(item, 'asave') else item.save()
    
    file_url = None
    if item.file:
        file_url = f"/portfolio/files/{item.file.name}"
    
    return {
        "status": "success",
        "message": "Portfolio item added successfully",
        "id": item.id,
        "file_url": file_url
    }


# ==========================================
# 2. LIST PORTFOLIO (For the 'My Portfolio' Card)
# ==========================================
@router.get("/list/{user_id}")
async def get_portfolio_list(user_id: int):
    items = await PortfolioItem.objects.filter(
        user_id=user_id,
        role="creator"
    ).order_by("-created_at").alist() if hasattr(PortfolioItem.objects, 'alist') else list(
        PortfolioItem.objects.filter(
            user_id=user_id,
            role="creator"
        ).order_by("-created_at")
    )

    return [
        {
            "id": i.id,
            "title": i.title,
            "media_link": i.media_link,
            "description": i.description,
            "file": (
                f"/portfolio/files/{i.file.name}"
                if i.file else None
            ),
            "created_at": i.created_at.isoformat() if hasattr(i, 'created_at') else None,
        }
        for i in items
    ]


# ==========================================
# 3. EDIT PORTFOLIO ITEM
# ==========================================
@router.put("/edit/{item_id}")
async def edit_portfolio_item(
    item_id: int,
    title: Optional[str] = Form(None),
    media_link: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
):
    try:
        item = await PortfolioItem.objects.aget(id=item_id, role="creator") if hasattr(PortfolioItem.objects, 'aget') else PortfolioItem.objects.get(id=item_id, role="creator")
    except PortfolioItem.DoesNotExist:
        raise HTTPException(status_code=404, detail="Portfolio item not found")

    if title is not None:
        item.title = title
    if media_link is not None:
        item.media_link = media_link
    if description is not None:
        item.description = description

    if file and file.filename:
        content = await file.read()
        if content:
            # Delete old file
            if item.file:
                await item.file.delete(save=False) if hasattr(item.file, 'adelete') else item.file.delete(save=False)
            
            from django.core.files.base import ContentFile
            import random
            import string
            from pathlib import Path as PathLib
            
            def generate_random_digits(length=4):
                return ''.join(random.choices(string.digits, k=length))
            
            random_digits = generate_random_digits()
            ext = PathLib(file.filename).suffix
            filename = f"creator_updated_{item.user_id}_{random_digits}{ext}"
            
            item.file.save(
                filename,
                ContentFile(content),
                save=True
            )

    await item.asave() if hasattr(item, 'asave') else item.save()
    
    file_url = None
    if item.file:
        file_url = f"/portfolio/files/{item.file.name}"
    
    return {
        "status": "success",
        "message": "Portfolio updated",
        "file_url": file_url
    }


# ==========================================
# 4. DELETE PORTFOLIO ITEM
# ==========================================
@router.delete("/delete/{item_id}")
async def delete_portfolio_item(item_id: int):
    try:
        item = await PortfolioItem.objects.aget(id=item_id, role="creator") if hasattr(PortfolioItem.objects, 'aget') else PortfolioItem.objects.get(id=item_id, role="creator")
    except PortfolioItem.DoesNotExist:
        raise HTTPException(status_code=404, detail="Item not found")

    # delete file from storage
    if item.file:
        await item.file.delete(save=False) if hasattr(item.file, 'adelete') else item.file.delete(save=False)

    await item.adelete() if hasattr(item, 'adelete') else item.delete()
    
    return {
        "status": "success",
        "message": "Item deleted"
    }