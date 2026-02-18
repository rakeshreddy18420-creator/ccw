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
    # PROPOSALS ON MY JOB
    # ---------------------------------------------------
    proposals = Proposal.objects.filter(
        job__employer=user
    ).select_related("freelancer").order_by("-created_at")[:5]

    for p in proposals:
        freelancer_name = (
            f"{p.freelancer.first_name} {p.freelancer.last_name}".strip()
            if p.freelancer.first_name
            else p.freelancer.email
        )

        job_title = p.job.title if p.job else "your job"

        notifications.append({
            "id": f"proposal_{p.id}",
            "title": f"{freelancer_name} submitted a proposal for '{job_title}'",
            "time": p.created_at,
            "is_read": False
        })


    # ---------------------------------------------------
    # PROPOSAL STATUS UPDATE
    # ---------------------------------------------------
    my_proposals = Proposal.objects.filter(
        freelancer=user
    ).exclude(status="submitted").order_by("-updated_at")[:5]

    for p in my_proposals:
        notifications.append({
            "id": f"proposal_status_{p.id}",
            "title": f"Your proposal was {p.status}",
            "time": p.updated_at,
            "is_read": False
        })

    # ---------------------------------------------------
    # NEW MESSAGES
    # ---------------------------------------------------
    messages = Message.objects.filter(
        is_seen=False
    ).exclude(sender=user).select_related("sender", "conversation").order_by("-created_at")[:5]

    for m in messages:
        if user in [m.conversation.user1, m.conversation.user2]:
            notifications.append({
                "id": f"message_{m.id}",
                "title": f"{m.sender.first_name or 'Someone'} sent you a message",
                "time": m.created_at,
                "is_read": False
            })

    # ---------------------------------------------------
    # CONTRACT UPDATES
    # ---------------------------------------------------
    contracts = Contract.objects.filter(
        creator=user
    ) | Contract.objects.filter(
        collaborator=user
    )

    for c in contracts.order_by("-updated_at")[:5]:
        notifications.append({
            "id": f"contract_{c.id}",
            "title": f"Contract status updated to {c.status}",
            "time": c.updated_at,
            "is_read": False
        })

    # ---------------------------------------------------
    # INVITATIONS
    # ---------------------------------------------------
    invitations = Invitation.objects.filter(
        receiver=user
    ).order_by("-created_at")[:5]

    for inv in invitations:
        notifications.append({
            "id": f"invite_{inv.id}",
            "title": f"You received invitation for {inv.project_name}",
            "time": inv.created_at,
            "is_read": False
        })

    # ---------------------------------------------------
    # SUBSCRIPTION EXPIRY
    # ---------------------------------------------------
    subscription = UserSubscription.objects.filter(user=user).first()

    if subscription and subscription.plan_expires_at:
        if subscription.plan_expires_at < now() + timedelta(days=3):
            notifications.append({
                "id": f"subscription_{subscription.id}",
                "title": "Your subscription is about to expire",
                "time": subscription.plan_expires_at,
                "is_read": False
            })

    # ---------------------------------------------------
    # PAYMENTS
    # ---------------------------------------------------
    payments = BillingHistory.objects.filter(
        user=user,
        status="Success"
    ).order_by("-paid_on")[:3]

    for payment in payments:
        notifications.append({
            "id": f"payment_{payment.id}",
            "title": f"Payment of ${payment.amount} successful",
            "time": payment.paid_on,
            "is_read": False
        })

    # ---------------------------------------------------
    # REVIEWS
    # ---------------------------------------------------
    reviews = Review.objects.filter(
        recipient=user
    ).order_by("-created_at")[:3]

    for r in reviews:
        notifications.append({
            "id": f"review_{r.id}",
            "title": f"You received {r.rating}-star review",
            "time": r.created_at,
            "is_read": False
        })

    # Sort newest first
    notifications.sort(key=lambda x: x["time"], reverse=True)

    return notifications[:10]
