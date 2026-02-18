# import fastapi_app.django_setup
# from fastapi import APIRouter, HTTPException, Depends
# from pydantic import BaseModel
# from typing import List, Optional, Dict, Any
# from datetime import datetime
# from creator_app.models import SubscriptionPlan, UserData

# # ✅ Import verify_admin to secure the routes
# from fastapi_app.routes.admin_dashboard import verify_admin

# router = APIRouter(prefix="/plans", tags=["Subscription Plans"])

# # =========================================
# # SCHEMAS (Data Validation)
# # =========================================

# # Schema for CREATING a plan
# class CreatePlanSchema(BaseModel):
#     name: str
#     price: float
#     duration: str  # "monthly", "yearly", "lifetime"
#     # expiry_date: Optional[datetime] = None
#     features: List[str]
#     # ✅ ADDED LIMITS (Fixes Swagger not sending data)
#     limits: Dict[str, int] 

# # Schema for EDITING a plan
# class EditPlanSchema(BaseModel):
#     name: Optional[str] = None
#     price: Optional[float] = None
#     duration: Optional[str] = None
#     # expiry_date: Optional[datetime] = None
#     features: Optional[List[str]] = None
#     # ✅ ADDED OPTIONAL LIMITS
#     limits: Optional[Dict[str, int]] = None

# # =========================================
# # 1. ADMIN – CREATE PLAN (POST)
# # =========================================
# @router.post("/admin/create-plan")
# def create_plan(
#     plan_data: CreatePlanSchema, 
#     admin: UserData = Depends(verify_admin)
# ):
#     try:
#         # Check if Name + Duration already exists
#         if SubscriptionPlan.objects.filter(
#             name=plan_data.name, 
#             duration=plan_data.duration.lower()
#         ).exists():
#             raise HTTPException(
#                 status_code=400, 
#                 detail=f"Plan '{plan_data.name}' with duration '{plan_data.duration}' already exists"
#             )

#         # Create the plan
#         plan = SubscriptionPlan.objects.create(
#             name=plan_data.name,
#             price=plan_data.price,
#             duration=plan_data.duration.lower(),
#             # expiry_date=plan_data.expiry_date,
#             features=plan_data.features,
#             limits=plan_data.limits,  # ✅ Saving the limits to DB
#             is_active=True
#         )

#         return {
#             "message": "Plan created successfully",
#             "plan": {
#                 "id": plan.id,
#                 "name": plan.name,
#                 "price": plan.price,
#                 "duration": plan.duration,
#                 "features": plan.features,
#                 "limits": plan.limits
#             }
#         }
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))


# # =========================================
# # 2. ADMIN – EDIT PLAN (PUT)
# # =========================================
# @router.put("/admin/edit-plan/{plan_id}")
# def edit_plan(
#     plan_id: int,
#     plan_data: EditPlanSchema, 
#     admin: UserData = Depends(verify_admin)
# ):
#     try:
#         plan = SubscriptionPlan.objects.get(id=plan_id)

#         if plan_data.name is not None:
#             plan.name = plan_data.name
#         if plan_data.price is not None:
#             plan.price = plan_data.price
#         if plan_data.duration is not None:
#             plan.duration = plan_data.duration.lower()
#         # if plan_data.expiry_date is not None:
#         #     plan.expiry_date = plan_data.expiry_date
#         if plan_data.features is not None:
#             plan.features = plan_data.features
        
#         # ✅ Update limits if provided
#         if plan_data.limits is not None:
#             plan.limits = plan_data.limits
            
#         plan.save()

#         return {
#             "message": "Plan updated successfully",
#             "plan": {
#                 "id": plan.id,
#                 "name": plan.name,
#                 "price": plan.price,
#                 "duration": plan.duration,
#                 "features": plan.features,
#                 "limits": plan.limits
#             }
#         }

#     except SubscriptionPlan.DoesNotExist:
#         raise HTTPException(status_code=404, detail="Plan not found")
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))


# # =========================================
# # 3. ADMIN – DELETE PLAN (DELETE)
# # =========================================
# @router.delete("/admin/delete-plan/{plan_id}")
# def delete_plan(
#     plan_id: int, 
#     admin: UserData = Depends(verify_admin)
# ):
#     try:
#         plan = SubscriptionPlan.objects.get(id=plan_id)
#         plan.delete()
#         return {"message": "Plan deleted successfully"}

#     except SubscriptionPlan.DoesNotExist:
#         raise HTTPException(status_code=404, detail="Plan not found")
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))


# # =========================================
# # 4. PUBLIC – LIST ACTIVE PLANS (GET)
# # =========================================
# @router.get("/list")
# def list_active_plans():
#     # Sort by price so they appear in order
#     plans = SubscriptionPlan.objects.filter(is_active=True).order_by("price")

#     data = []
#     for plan in plans:
#         data.append({
#             "id": plan.id,
#             "name": plan.name,
#             "price": float(plan.price),
#             "duration": plan.duration,
#             # "expiry_date": plan.expiry_date,
#             "features": plan.features, 
#             "limits": plan.limits # ✅ Return limits to frontend too
#         })

#     return {"plans": data}

import fastapi_app.django_setup
from fastapi import APIRouter, HTTPException, Depends, Query
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime
from creator_app.models import SubscriptionPlan, UserData
from enum import Enum
import json

# ✅ Import verify_admin to secure the routes
from fastapi_app.routes.admin_dashboard import verify_admin

router = APIRouter(prefix="/plans", tags=["Subscription Plans"])

# =========================================
# ENUMS & CONSTANTS
# =========================================

class PlanStatus(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"

class BillingCycle(str, Enum):
    MONTHLY = "monthly"
    YEARLY = "yearly"
    LIFETIME = "lifetime"

# =========================================
# SCHEMAS (Data Validation)
# =========================================

class FeatureSchema(BaseModel):
    title: str
    description: str
    is_active: bool = True

# Schema for CREATING a plan
class CreatePlanSchema(BaseModel):
    name: str
    price: float
    billing_cycle: BillingCycle
    max_users: int
    max_upload_storage_gb: int
    max_proposals: int
    max_job_posts: int
    max_invitations: int
    description: str
    is_popular: bool = False
    status: PlanStatus = PlanStatus.ACTIVE
    features: List[FeatureSchema]

# Schema for EDITING a plan
class EditPlanSchema(BaseModel):
    name: Optional[str] = None
    price: Optional[float] = None
    billing_cycle: Optional[BillingCycle] = None
    max_users: Optional[int] = None
    max_upload_storage_gb: Optional[int] = None
    max_proposals: Optional[int] = None
    max_job_posts: Optional[int] = None
    max_invitations: Optional[int] = None
    description: Optional[str] = None
    is_popular: Optional[bool] = None
    status: Optional[PlanStatus] = None
    features: Optional[List[FeatureSchema]] = None

# Schema for RESPONSE
class PlanResponseSchema(BaseModel):
    id: int
    name: str
    price: float
    billing_cycle: str
    max_users: int
    max_upload_storage_gb: int
    max_proposals: int
    max_job_posts: int
    max_invitations: int
    description: str
    is_popular: bool
    status: str
    features: List[Dict[str, Any]]
    created_at: datetime
    updated_at: datetime
    created_by: Optional[str] = None
    updated_by: Optional[str] = None

    class Config:
        from_attributes = True

# =========================================
# 1. ADMIN – CREATE PLAN (POST)
# =========================================
@router.post("/admin/create-plan", response_model=PlanResponseSchema)
def create_plan(
    plan_data: CreatePlanSchema, 
    admin: UserData = Depends(verify_admin)
):
    try:
        # Check if Name + Billing Cycle already exists
        if SubscriptionPlan.objects.filter(
            name=plan_data.name, 
            duration=plan_data.billing_cycle.value
        ).exists():
            raise HTTPException(
                status_code=400, 
                detail=f"Plan '{plan_data.name}' with billing cycle '{plan_data.billing_cycle}' already exists"
            )

        # Prepare features as JSON list
        features_data = [
            {
                "title": feature.title,
                "description": feature.description,
                "is_active": feature.is_active
            }
            for feature in plan_data.features
        ]

        # Prepare limits as JSON
        limits_data = {
            "max_users": plan_data.max_users,
            "max_upload_storage_gb": plan_data.max_upload_storage_gb,
            "max_proposals": plan_data.max_proposals,
            "max_job_posts": plan_data.max_job_posts,
            "max_invitations": plan_data.max_invitations
        }

        # Create the plan
        plan = SubscriptionPlan.objects.create(
            name=plan_data.name,
            price=plan_data.price,
            duration=plan_data.billing_cycle.value,
            description=plan_data.description,
            is_popular=plan_data.is_popular,
            is_active=(plan_data.status == PlanStatus.ACTIVE),
            features=features_data,
            limits=limits_data,
            created_by=admin.email,
            updated_by=admin.email
        )

        # Prepare response data
        response_data = {
            "id": plan.id,
            "name": plan.name,
            "price": float(plan.price),
            "billing_cycle": plan.duration,
            "max_users": plan.limits.get("max_users", 0),
            "max_upload_storage_gb": plan.limits.get("max_upload_storage_gb", 0),
            "max_proposals": plan.limits.get("max_proposals", 0),
            "max_job_posts": plan.limits.get("max_job_posts", 0),
            "max_invitations": plan.limits.get("max_invitations", 0),
            "description": plan.description,
            "is_popular": plan.is_popular,
            "status": "active" if plan.is_active else "inactive",
            "features": plan.features,
            "created_at": plan.created_at,
            "updated_at": plan.updated_at,
            "created_by": plan.created_by,
            "updated_by": plan.updated_by
        }

        return response_data

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# =========================================
# 2. ADMIN – EDIT PLAN (PUT)
# =========================================
@router.put("/admin/edit-plan/{plan_id}", response_model=PlanResponseSchema)
def edit_plan(
    plan_id: int,
    plan_data: EditPlanSchema, 
    admin: UserData = Depends(verify_admin)
):
    try:
        plan = SubscriptionPlan.objects.get(id=plan_id)

        # Update basic fields
        if plan_data.name is not None:
            plan.name = plan_data.name
        if plan_data.price is not None:
            plan.price = plan_data.price
        if plan_data.billing_cycle is not None:
            plan.duration = plan_data.billing_cycle.value
        if plan_data.description is not None:
            plan.description = plan_data.description
        if plan_data.is_popular is not None:
            plan.is_popular = plan_data.is_popular
        if plan_data.status is not None:
            plan.is_active = (plan_data.status == PlanStatus.ACTIVE)

        # Update limits if provided
        if any([
            plan_data.max_users is not None,
            plan_data.max_upload_storage_gb is not None,
            plan_data.max_proposals is not None,
            plan_data.max_job_posts is not None,
            plan_data.max_invitations is not None
        ]):
            current_limits = plan.limits.copy()
            if plan_data.max_users is not None:
                current_limits["max_users"] = plan_data.max_users
            if plan_data.max_upload_storage_gb is not None:
                current_limits["max_upload_storage_gb"] = plan_data.max_upload_storage_gb
            if plan_data.max_proposals is not None:
                current_limits["max_proposals"] = plan_data.max_proposals
            if plan_data.max_job_posts is not None:
                current_limits["max_job_posts"] = plan_data.max_job_posts
            if plan_data.max_invitations is not None:
                current_limits["max_invitations"] = plan_data.max_invitations
            plan.limits = current_limits

        # Update features if provided
        if plan_data.features is not None:
            features_data = [
                {
                    "title": feature.title,
                    "description": feature.description,
                    "is_active": feature.is_active
                }
                for feature in plan_data.features
            ]
            plan.features = features_data

        # Update admin info
        plan.updated_by = admin.email
        plan.save()

        # Prepare response data
        response_data = {
            "id": plan.id,
            "name": plan.name,
            "price": float(plan.price),
            "billing_cycle": plan.duration,
            "max_users": plan.limits.get("max_users", 0),
            "max_upload_storage_gb": plan.limits.get("max_upload_storage_gb", 0),
            "max_proposals": plan.limits.get("max_proposals", 0),
            "max_job_posts": plan.limits.get("max_job_posts", 0),
            "max_invitations": plan.limits.get("max_invitations", 0),
            "description": plan.description,
            "is_popular": plan.is_popular,
            "status": "active" if plan.is_active else "inactive",
            "features": plan.features,
            "created_at": plan.created_at,
            "updated_at": plan.updated_at,
            "created_by": plan.created_by,
            "updated_by": plan.updated_by
        }

        return response_data

    except SubscriptionPlan.DoesNotExist:
        raise HTTPException(status_code=404, detail="Plan not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# =========================================
# 3. ADMIN – DELETE PLAN (DELETE)
# =========================================
@router.delete("/admin/delete-plan/{plan_id}")
def delete_plan(
    plan_id: int, 
    admin: UserData = Depends(verify_admin)
):
    try:
        plan = SubscriptionPlan.objects.get(id=plan_id)
        plan.delete()
        return {"message": "Plan deleted successfully"}

    except SubscriptionPlan.DoesNotExist:
        raise HTTPException(status_code=404, detail="Plan not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# =========================================
# 4. PUBLIC – LIST ACTIVE PLANS (GET) - ONLY THIS ONE
# =========================================
@router.get("/list")
def list_active_plans(
    duration: Optional[str] = Query(None, description="Filter by duration: monthly, yearly, lifetime"),
    is_active: Optional[bool] = Query(True, description="Filter by active status")
):
    """
    List all active subscription plans.
    Optionally filter by duration and status.
    """
    try:
        # Start with base query
        query = SubscriptionPlan.objects.all()
        
        # Apply filters
        if is_active is not None:
            query = query.filter(is_active=is_active)
        
        if duration:
            query = query.filter(duration__iexact=duration.lower())
        
        # Sort by price so they appear in order
        query = query.order_by("price")
        
        data = []
        for plan in query:
            # Safely get limits with defaults
            limits = plan.limits or {}
            
            # Get features - ensure they're in the right format
            features = plan.features or []
            if isinstance(features, str):
                try:
                    features = json.loads(features)
                except:
                    features = []
            
            data.append({
                "id": plan.id,
                "name": plan.name,
                "price": float(plan.price) if plan.price else 0.0,
                "duration": plan.duration,
                "description": plan.description or "",
                "is_popular": plan.is_popular,
                "is_active": plan.is_active,
                "max_users": limits.get("max_users", 0),
                "max_upload_storage_gb": limits.get("max_upload_storage_gb", 0),
                "max_proposals": limits.get("max_proposals", 0),
                "max_job_posts": limits.get("max_job_posts", 0),
                "max_invitations": limits.get("max_invitations", 0),
                "features": features,
                "created_at": plan.created_at,
                "updated_at": plan.updated_at,
                "created_by": plan.created_by or "",
                "updated_by": plan.updated_by or ""
            })

        return {"plans": data}
    
    except Exception as e:
        print(f"Error in list_active_plans: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

# =========================================
# 5. ADMIN – LIST ALL PLANS (with status)
# =========================================
@router.get("/admin/list-all")
def list_all_plans(admin: UserData = Depends(verify_admin)):
    # Get all plans ordered by creation date
    plans = SubscriptionPlan.objects.all().order_by("-created_at")

    data = []
    for plan in plans:
        data.append({
            "id": plan.id,
            "name": plan.name,
            "price": float(plan.price),
            "billing_cycle": plan.duration,
            "max_users": plan.limits.get("max_users", 0),
            "max_upload_storage_gb": plan.limits.get("max_upload_storage_gb", 0),
            "max_proposals": plan.limits.get("max_proposals", 0),
            "max_job_posts": plan.limits.get("max_job_posts", 0),
            "max_invitations": plan.limits.get("max_invitations", 0),
            "description": plan.description,
            "is_popular": plan.is_popular,
            "status": "active" if plan.is_active else "inactive",
            "features": plan.features,
            "created_at": plan.created_at,
            "updated_at": plan.updated_at,
            "created_by": plan.created_by,
            "updated_by": plan.updated_by
        })

    return {"plans": data}