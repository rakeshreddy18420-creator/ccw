from django.utils.timezone import now
from datetime import timedelta
from creator_app.models import (
    Proposal,
    Message,
    Contract,
    Invitation,
    UserSubscription,
    BillingHistory,
    Review
)


def get_user_notifications(user):
    notifications = []

    # ---------------------------------------------------
    # Only show recent notifications (last 7 days)
    # ---------------------------------------------------
    recent_days = 7
    since_time = now() - timedelta(days=recent_days)

    # ---------------------------------------------------
    # PROPOSALS ON MY JOB
    # ---------------------------------------------------
    proposals = Proposal.objects.filter(
        job__employer=user,
        created_at__gte=since_time
    ).select_related("freelancer", "job").order_by("-created_at")[:5]

    for p in proposals:
        freelancer_name = (
            f"{p.freelancer.first_name} {p.freelancer.last_name}".strip()
            if p.freelancer.first_name
            else p.freelancer.email
        )

        job_title = p.job.title if p.job else "your job"

        notifications.append({
            "id": f"proposal_{p.id}",
            "type": "proposal",
            "title": f"{freelancer_name} submitted a proposal",
            "subtitle": f"For job: {job_title}",
            "time": p.created_at,
            "is_read": False
        })

    # ---------------------------------------------------
    # PROPOSAL STATUS UPDATE
    # ---------------------------------------------------
    my_proposals = Proposal.objects.filter(
        freelancer=user,
        updated_at__gte=since_time
    ).exclude(status="submitted").order_by("-updated_at")[:5]

    for p in my_proposals:
        job_title = p.job.title if p.job else "your job"

        notifications.append({
            "id": f"proposal_status_{p.id}",
            "type": "proposal_status",
            "title": f"Your proposal was {p.status}",
            "subtitle": f"Job: {job_title}",
            "time": p.updated_at,
            "is_read": False
        })

    # ---------------------------------------------------
    # NEW MESSAGES
    # ---------------------------------------------------
    messages = Message.objects.filter(
        is_seen=False,
        created_at__gte=since_time
    ).exclude(sender=user).select_related("sender", "conversation").order_by("-created_at")[:5]

    for m in messages:
        if user in [m.conversation.user1, m.conversation.user2]:

            sender_name = (
                f"{m.sender.first_name} {m.sender.last_name}".strip()
                if m.sender.first_name
                else m.sender.email
            )

            notifications.append({
                "id": f"message_{m.id}",
                "type": "message",
                "title": f"{sender_name} sent you a message",
                "subtitle": "Click to view conversation",
                "time": m.created_at,
                "is_read": False
            })

    # ---------------------------------------------------
    # CONTRACT UPDATES
    # ---------------------------------------------------
    contracts = (
        Contract.objects.filter(
            creator=user,
            updated_at__gte=since_time
        ) |
        Contract.objects.filter(
            collaborator=user,
            updated_at__gte=since_time
        )
    )

    for c in contracts.order_by("-updated_at")[:5]:
        notifications.append({
            "id": f"contract_{c.id}",
            "type": "contract",
            "title": f"Contract status updated to {c.status}",
            "subtitle": f"Contract ID: {c.id}",
            "time": c.updated_at,
            "is_read": False
        })

    # ---------------------------------------------------
    # INVITATIONS
    # ---------------------------------------------------
    invitations = Invitation.objects.filter(
        receiver=user,
        created_at__gte=since_time
    ).order_by("-created_at")[:5]

    for inv in invitations:
        notifications.append({
            "id": f"invite_{inv.id}",
            "type": "invitation",
            "title": f"You received an invitation",
            "subtitle": f"Project: {inv.project_name}",
            "time": inv.created_at,
            "is_read": False
        })

    # ---------------------------------------------------
    # SUBSCRIPTION EXPIRY
    # ---------------------------------------------------
    subscription = UserSubscription.objects.filter(user=user).first()

    if subscription and subscription.plan_expires_at:
        if subscription.plan_expires_at >= since_time and subscription.plan_expires_at < now() + timedelta(days=3):
            notifications.append({
                "id": f"subscription_{subscription.id}",
                "type": "subscription",
                "title": "Your subscription is about to expire",
                "subtitle": f"Expires on {subscription.plan_expires_at.strftime('%d %b %Y')}",
                "time": subscription.plan_expires_at,
                "is_read": False
            })

    # ---------------------------------------------------
    # PAYMENTS
    # ---------------------------------------------------
    payments = BillingHistory.objects.filter(
        user=user,
        status="Success",
        paid_on__gte=since_time
    ).order_by("-paid_on")[:3]

    for payment in payments:
        notifications.append({
            "id": f"payment_{payment.id}",
            "type": "payment",
            "title": f"Payment of ${payment.amount} successful",
            "subtitle": "Your transaction was completed",
            "time": payment.paid_on,
            "is_read": False
        })

    # ---------------------------------------------------
    # REVIEWS
    # ---------------------------------------------------
    reviews = Review.objects.filter(
        recipient=user,
        created_at__gte=since_time
    ).order_by("-created_at")[:3]

    for r in reviews:
        notifications.append({
            "id": f"review_{r.id}",
            "type": "review",
            "title": f"You received a {r.rating}-star review",
            "subtitle": "Click to view feedback",
            "time": r.created_at,
            "is_read": False
        })

    # ---------------------------------------------------
    # PROFILE UPDATED
    # ---------------------------------------------------
    if hasattr(user, "updated_at") and user.updated_at:
        if user.updated_at >= since_time:
            notifications.append({
                "id": f"profile_update_{user.id}",
                "type": "profile",
                "title": "You updated your profile successfully",
                "subtitle": "Your profile information was changed",
                "time": user.updated_at,
                "is_read": False
            })

    # ---------------------------------------------------
    # Remove duplicate notifications
    # ---------------------------------------------------
    unique_notifications = {n["id"]: n for n in notifications}.values()
    notifications = list(unique_notifications)

    # ---------------------------------------------------
    # Sort newest first
    # ---------------------------------------------------
    notifications.sort(key=lambda x: x["time"], reverse=True)

    return notifications[:10]
