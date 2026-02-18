import fastapi_app.django_setup

from fastapi import HTTPException
from django.utils import timezone
from creator_app.models import (
    UserData,
    UserSubscription,
    SubscriptionPlan,
    JobPost,
    Invitation,
    Contract
)


# =========================================================
# 🔹 GET USER PLAN (STRICT – NO BYPASS)
# =========================================================
def get_user_plan(user: UserData):
    sub = UserSubscription.objects.filter(user=user).first()
    if not sub:
        raise HTTPException(
            status_code=403,
            detail="No active subscription. Please subscribe to a plan."
        )

    plan_name = (sub.current_plan or "").strip()

    if not plan_name:
        raise HTTPException(
            status_code=403,
            detail="Subscription plan not set. Contact admin."
        )

    plan = SubscriptionPlan.objects.filter(name__iexact=plan_name).first()

    if not plan:
        raise HTTPException(
            status_code=500,
            detail=f"Plan '{plan_name}' not found in SubscriptionPlan table. Fix admin config."
        )

    return plan


# =========================================================
# 🔹 REQUIRE ANALYTICS ACCESS
# =========================================================
def require_analytics_access(user: UserData):
    plan = get_user_plan(user)
    if not plan.can_use_analytics:
        raise HTTPException(
            status_code=403,
            detail="Upgrade your plan to access analytics"
        )


# =========================================================
# 🔹 REQUIRE REVENUE SPLIT ACCESS
# =========================================================
def require_revenue_split_access(user: UserData):
    plan = get_user_plan(user)
    if not plan.can_use_revenue_split:
        raise HTTPException(
            status_code=403,
            detail="Revenue split is available only on Agent plan"
        )


# =========================================================
# 🔹 CHECK JOB LIMIT
# =========================================================
def check_job_limit(user: UserData):
    plan = get_user_plan(user)

    current_jobs = JobPost.objects.filter(employer=user).count()

    print("DEBUG → Jobs:", current_jobs, "/", plan.max_workspaces)

    if current_jobs >= plan.max_workspaces:
        raise HTTPException(
            status_code=403,
            detail=f"Job limit reached ({plan.max_workspaces}). Upgrade your plan."
        )


# =========================================================
# 🔹 CHECK INVITE LIMIT
# =========================================================
def check_invite_limit(user: UserData):
    plan = get_user_plan(user)

    sent_this_month = Invitation.objects.filter(
        sender=user,
        date__year=timezone.now().year,
        date__month=timezone.now().month
    ).count()

    print(f"DEBUG → Invites: {sent_this_month} / {plan.max_invites_per_month}")

    if sent_this_month >= plan.max_invites_per_month:
        raise HTTPException(
            status_code=403,
            detail=f"Invite limit reached ({plan.max_invites_per_month}). Upgrade your plan."
        )


# =========================================================
# 🔹 CHECK CONTRACT LIMIT
# =========================================================
def check_contract_limit(user: UserData):
    plan = get_user_plan(user)

    active_contracts = Contract.objects.filter(creator=user).count()

    print("DEBUG → Contracts:", active_contracts, "/", plan.max_workspaces)

    if active_contracts >= plan.max_workspaces:
        raise HTTPException(
            status_code=403,
            detail=f"Contract limit reached ({plan.max_workspaces}). Upgrade your plan."
        )

