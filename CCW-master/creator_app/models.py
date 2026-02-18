#models.py

from django.db import models
from django.utils import timezone
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.contrib.auth.hashers import make_password, check_password

# ============================================================
# 1. ADMIN USER (For Dashboard Login & createsuperuser)
# ============================================================

class AdminUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Email is required')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', 'SuperAdmin') 
        return self.create_user(email, password, **extra_fields)

class AdminUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=100, default="Admin")
    role = models.CharField(max_length=50, default="Admin")

    # Required for Django Admin
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=True) 
    date_joined = models.DateTimeField(default=timezone.now)

    objects = AdminUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']

    def __str__(self):
        return f"Admin: {self.email}"


# ============================================================
# 2. APP USER DATA (For Creators & Collaborators)
# ============================================================

class UserData(models.Model):
    id = models.AutoField(primary_key=True)

    email = models.EmailField(unique=True, blank=True, null=True)
    first_name = models.CharField(max_length=100, blank=True, null=True)
    last_name = models.CharField(max_length=100, blank=True, null=True)
    password = models.CharField(max_length=255, blank=True, null=True)

    userid = models.CharField(max_length=255, unique=True, null=True, blank=True) # Auth0 ID
    provider = models.CharField(max_length=50, blank=True, null=True) 

    role = models.CharField(max_length=50, blank=True, null=True) # Creator or Collaborator
    status = models.CharField(max_length=20, default="Active")
    phone_number = models.CharField(max_length=15, blank=True, null=True)

    profile_picture = models.ImageField(upload_to='profile_pics/', null=True, blank=True)

    location = models.CharField(max_length=50, blank=True, null=True)
    address = models.CharField(max_length=255, blank=True, null=True)
    city = models.CharField(max_length=255, blank=True, null=True)
    state = models.CharField(max_length=255, blank=True, null=True)
    stripe_account_id = models.CharField(max_length=100, null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_active = models.DateTimeField(null=True, blank=True)
    is_typing = models.BooleanField(default=False)
    typing_with = models.IntegerField(null=True, blank=True)

    # Note: No 'is_staff' or 'is_superuser' here because these are NOT admins.

    def set_password(self, raw_password):
        self.password = make_password(raw_password)
        self.save()

    def check_password(self, raw_password):
        return check_password(raw_password, self.password)

    def __str__(self):
        return f"{self.email} ({self.role})"


# ============================================================
# 3. PROFILES (Linked to UserData)
# ============================================================

class CreatorProfile(models.Model):
    user = models.OneToOneField("creator_app.UserData", on_delete=models.CASCADE)
 
    creator_name = models.CharField(max_length=255)
    creator_type = models.CharField(max_length=255)
    experience_level = models.CharField(max_length=100)
 
    primary_niche = models.CharField(max_length=255)
    secondary_niche = models.CharField(max_length=255, blank=True, null=True)
    about = models.TextField(blank=True, null=True)
 
    platforms = models.CharField(max_length=255, blank=True, null=True)
    followers = models.IntegerField(blank=True, null=True)
 
    portfolio_category = models.CharField(max_length=255)

    collaboration_type = models.CharField(max_length=255)
    project_type = models.CharField(max_length=255)
 
    location = models.CharField(max_length=255, blank=True, null=True)
 
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
 
    def __str__(self):
        return f"{self.user.email} - Creator Profile"
 
 
# ============================================================
# COLLABORATOR PROFILE MODEL
# ============================================================
 
class CollaboratorProfile(models.Model):
    user = models.OneToOneField("creator_app.UserData", on_delete=models.CASCADE, related_name="collaborator_profile")
 
    name = models.CharField(max_length=255)
    language = models.CharField(max_length=100)
    skill_category = models.CharField(max_length=255)
    experience = models.CharField(max_length=100)
    skills = models.JSONField(default=list, blank=True)
    collaboration_type = models.CharField(max_length=255, blank=True, null=True)
    followers = models.IntegerField(default=0, blank=True, null=True)
    pricing_amount = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    pricing_unit = models.CharField(max_length=50, blank=True, null=True)
    availability = models.CharField(max_length=255, blank=True, null=True)
    timing = models.CharField(max_length=255, blank=True, null=True)
    social_link = models.URLField(blank=True, null=True)
    portfolio_link = models.URLField(max_length=500, blank=True, null=True)
    
    # REMOVED: portfolio_uploads and portfolio_headings - now using PortfolioItem model
    
    portfolio_category = models.CharField(max_length=255, blank=True, null=True)
    badges = models.CharField(max_length=255, blank=True, null=True)
    skills_rating = models.IntegerField(blank=True, null=True)
    about = models.TextField(blank=True, null=True)
    location = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
 
    def __str__(self):
        return f"{self.name} - {self.skill_category}"
 
 





# ============================================================
# 4. JOBS & PROPOSALS
# ============================================================

class JobPost(models.Model):
    TIMELINE_CHOICES = (("small", "Small"), ("medium", "Medium"), ("large", "Large"))
    DURATION_CHOICES = (("1-6 months", "1-6 months"), ("6-12 months", "6-12 months"), ("1+ year", "1+ year"), ("less than 1 month", "Less than 1 month"))
    EXPERTISE_CHOICES = (("fresher", "Fresher"), ("medium", "Medium"), ("experienced", "Experienced"))
    BUDGET_TYPE_CHOICES = (("fixed", "Fixed Price"), ("hourly", "Hourly"))
    STATUS_CHOICES = (("draft", "Draft"), ("posted", "Posted"), ("closed", "Closed"))

    employer = models.ForeignKey(UserData, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    description = models.TextField()
    skills = models.JSONField(default=list, blank=True)
    timeline = models.CharField(max_length=20, choices=TIMELINE_CHOICES)
    duration = models.CharField(max_length=50, choices=DURATION_CHOICES)
    expertise_level = models.CharField(max_length=20, choices=EXPERTISE_CHOICES)
    budget_type = models.CharField(max_length=20, choices=BUDGET_TYPE_CHOICES)
    budget_from = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    budget_to = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="posted")
    attachments = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self): return self.title

class Proposal(models.Model):
    STATUS_CHOICES = (("submitted", "Submitted"), ("withdrawn", "Withdrawn"), ("accepted", "Accepted"), ("rejected", "Rejected"))
    PAYMENT_CHOICES = (("project", "By Project"), ("milestone", "By Milestone"))

    job = models.ForeignKey(JobPost, on_delete=models.CASCADE, related_name="proposals")
    freelancer = models.ForeignKey(UserData, on_delete=models.CASCADE, related_name="my_proposals")
    payment_type = models.CharField(max_length=20, choices=PAYMENT_CHOICES, default="project")
    bid_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    milestone_description = models.TextField(blank=True, null=True)
    milestone_due_date = models.DateField(blank=True, null=True) 
    milestone_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    duration = models.CharField(max_length=100, blank=True, null=True)
    cover_letter = models.TextField(blank=True, null=True)
    skills = models.JSONField(default=list, blank=True, null=True)
    expertise = models.CharField(max_length=100, blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="submitted")
    attachments = models.JSONField(default=list, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self): return f"Proposal {self.id}"

class Contract(models.Model):
    STATUS_CHOICES = (("pending", "Pending"), ("awaiting", "Awaiting"), ("in_progress", "In Progress"), ("completed", "Completed"), ("cancelled", "Cancelled"))
    job = models.ForeignKey(JobPost, on_delete=models.CASCADE)
    creator = models.ForeignKey(UserData, on_delete=models.CASCADE, related_name="creator_contracts")
    collaborator = models.ForeignKey(UserData, on_delete=models.CASCADE, related_name="collaborator_contracts")
    budget = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    work_description = models.TextField(blank=True, null=True)
    work_attachment = models.FileField(upload_to="work_submissions/", null=True, blank=True)
    work_submitted_at = models.DateTimeField(null=True, blank=True)
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

class Invitation(models.Model):
    STATUS_CHOICES = (("Pending", "Pending"), ("Accepted", "Accepted"), ("Rejected", "Rejected"))
    sender = models.ForeignKey(UserData, on_delete=models.CASCADE, related_name="sent_invitations")
    receiver = models.ForeignKey(UserData, on_delete=models.CASCADE, related_name="received_invitations")
    job = models.ForeignKey(JobPost, on_delete=models.CASCADE, related_name="invitations", null=True, blank=True)
    client_name = models.CharField(max_length=255)
    project_name = models.CharField(max_length=255)
    date = models.DateField()
    revenue = models.DecimalField(max_digits=12, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="Pending")
    created_at = models.DateTimeField(auto_now_add=True)

# ============================================================
# 5. CHAT / MESSAGING
# ============================================================

class Conversation(models.Model):
    user1 = models.ForeignKey(UserData, on_delete=models.CASCADE, related_name="convo_user1")
    user2 = models.ForeignKey(UserData, on_delete=models.CASCADE, related_name="convo_user2")
    created_at = models.DateTimeField(auto_now_add=True)
    class Meta: unique_together = ('user1', 'user2')
    def __str__(self): return f"Convo: {self.user1.email} & {self.user2.email}"

class Message(models.Model):
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name="messages")
    sender = models.ForeignKey(UserData, on_delete=models.CASCADE)
    content = models.TextField()
    is_seen = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    seen_at = models.DateTimeField(null=True, blank=True)
    reply_to = models.ForeignKey("self", null=True, blank=True, on_delete=models.SET_NULL, related_name="replies")
    file = models.FileField(upload_to="message_files/", null=True, blank=True)
    message_type = models.CharField(max_length=20, default="text")
    def __str__(self): return f"Msg from {self.sender.email}"

# ============================================================
# 6. SUBSCRIPTIONS & PLANS
# ============================================================

class SubscriptionPlan(models.Model):
    DURATION_CHOICES = (
        ("monthly", "Monthly"),
        ("yearly", "Yearly"),
        ("lifetime", "Lifetime"),
    )
 
    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    duration = models.CharField(max_length=20, choices=DURATION_CHOICES, default="monthly")
 
    # Features stored as JSON - includes both display text and limits
    features = models.JSONField(default=list, blank=True)  # Changed from dict to list
    # Limits stored separately
    limits = models.JSONField(default=dict, blank=True)
 
    # Additional fields for better management
    description = models.TextField(blank=True, null=True)
    is_popular = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # ✅ ADD THESE FIELDS to store admin info
    created_by = models.EmailField(blank=True, null=True)
    updated_by = models.EmailField(blank=True, null=True)
 
    def __str__(self):
        return f"{self.name} - ${self.price}/{self.duration}"
 
    class Meta:
        ordering = ['price']  # Default ordering by price
 
    # =========================================================
    # ✅ SMART PROPERTIES (The Fix)
    # These allow code to access plan.max_workspaces like before
    # =========================================================
   
    @property
    def max_users(self):
        return self._get_limit("max_users", default=1)
 
    @property
    def max_workspaces(self):
        return self._get_limit("max_workspaces", default=1)
 
    @property
    def max_storage(self):
        return self._get_limit("max_storage", default=1)
 
    @property
    def max_invitations(self):
        return self._get_limit("max_invitations", default=5)
 
    @property
    def max_job_posts(self):
        return self._get_limit("max_job_posts", default=2)
 
    @property
    def max_proposals(self):
        return self._get_limit("max_proposals", default=5)
 
    # Helper function to read from JSON safely
    def _get_limit(self, key, default):
        if isinstance(self.features, dict):
            limits = self.features.get("limits", {})
            # Return value if it exists and is not None, else default
            val = limits.get(key)
            return val if val is not None else default
        return default
 
    def __str__(self):
        return f"{self.name} ({self.duration}) - ${self.price}"

# ============================================================
# USER SUBSCRIPTION MODEL
# ============================================================

class UserSubscription(models.Model):
    """Model for user subscriptions - COMPATIBLE WITH FASTAPI CODE"""
    user = models.OneToOneField(
        "creator_app.UserData", 
        on_delete=models.CASCADE,
        related_name="subscription"
    )
    email = models.EmailField()
    
    # Plan information - MUST HAVE THESE EXACT FIELD NAMES
    plan_name = models.CharField(max_length=100, blank=True, null=True)
    current_plan = models.CharField(max_length=100, default="Basic")
    duration = models.CharField(max_length=50, blank=True, null=True)
    
    # Pricing - MUST HAVE THIS FIELD
    plan_price = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        default=0.00,
        help_text="Price at the time of subscription"
    )
    
    # Subscription periods - MUST HAVE THESE EXACT FIELD NAMES
    plan_start_date = models.DateTimeField(blank=True, null=True)
    plan_end_date = models.DateTimeField(blank=True, null=True)
    renewal_date = models.DateTimeField(blank=True, null=True)
    
    # Stripe fields (KEEP existing)
    stripe_subscription_id = models.CharField(max_length=255, blank=True, null=True)
    stripe_customer_id = models.CharField(max_length=255, blank=True, null=True)
    # stripe_price_id = models.CharField(max_length=255, blank=True, null=True)
    
    # Status field - UPDATED CHOICES to match FastAPI
    status = models.CharField(
        max_length=20,
        default="active",
        choices=[
            ("active", "Active"),
            ("cancelled", "Cancelled"),
            ("expired", "Expired"),
            ("past_due", "Past Due"),
            ("trialing", "Trialing"),
            ("incomplete", "Incomplete"),
            ("pending", "Pending"),
            ("failed", "Failed"),
        ]
    )
    
    # Cancellation tracking
    # cancel_at_period_end = models.BooleanField(default=False)
    # canceled_at = models.DateTimeField(blank=True, null=True)
    
    # # Subscription periods (keep existing for backward compatibility)
    # current_period_start = models.DateTimeField(blank=True, null=True)
    # current_period_end = models.DateTimeField(blank=True, null=True)
    plan_started_at = models.DateTimeField(auto_now_add=True)
    plan_expires_at = models.DateTimeField(blank=True, null=True)
    
    # Invoice tracking - ADDED for FastAPI compatibility
    last_invoice_url = models.TextField(blank=True, null=True)
    last_invoice_number = models.CharField(max_length=100, blank=True, null=True)
    last_payment_amount = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        blank=True, 
        null=True
    )
    last_payment_date = models.DateTimeField(blank=True, null=True)
    
    # Trial information
    is_trial = models.BooleanField(default=False)
    trial_ends_at = models.DateTimeField(blank=True, null=True)
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "User Subscription"
        verbose_name_plural = "User Subscriptions"
        indexes = [
            models.Index(fields=['email']),
            models.Index(fields=['status']),
            models.Index(fields=['plan_end_date']),
        ]
    
    def __str__(self):
        return f"{self.email} - {self.current_plan} ({self.status})"
    
    @property
    def is_active(self):
        """Check if subscription is currently active - COMPATIBLE WITH FASTAPI"""
        now = timezone.now()
        
        # Check status
        if self.status not in ['active', 'trialing']:
            return False
        
        # Check expiration date (FastAPI checks plan_end_date first)
        if self.plan_end_date and self.plan_end_date < now:
            return False
        # Fallback to plan_expires_at if plan_end_date doesn't exist
        if self.plan_expires_at and self.plan_expires_at < now:
            return False
            
        return True
    
    @property
    def days_remaining(self):
        """Calculate days remaining in subscription - COMPATIBLE WITH FASTAPI"""
        if not self.is_active:
            return 0
            
        now = timezone.now()
        
        # Use plan_end_date first (as FastAPI expects)
        if self.plan_end_date:
            end_date = self.plan_end_date
        elif self.plan_expires_at:
            end_date = self.plan_expires_at
        else:
            return 0
            
        # For active subscriptions, calculate days remaining
        if end_date > now:
            delta = end_date - now
            return delta.days
        
        return 0
    
    @property
    def next_billing_date(self):
        """Get next billing date"""
        if self.renewal_date:
            return self.renewal_date
        elif self.current_period_end:
            return self.current_period_end
        elif self.plan_end_date:
            return self.plan_end_date
        return None
    
    @property
    def total_paid(self):
        """Calculate total amount paid"""
        if self.last_payment_amount:
            return self.last_payment_amount
        return self.plan_price
    
    def save(self, *args, **kwargs):
        """Override save to ensure email is synced with user and fields are consistent"""
        if not self.email and self.user:
            self.email = self.user.email
            
        # Sync plan_started_at with plan_start_date if not set
        if self.plan_start_date and not self.plan_started_at:
            self.plan_started_at = self.plan_start_date
        elif not self.plan_start_date and self.plan_started_at:
            self.plan_start_date = self.plan_started_at
            
        # Sync plan_expires_at with plan_end_date if not set
        if self.plan_end_date and not self.plan_expires_at:
            self.plan_expires_at = self.plan_end_date
        elif not self.plan_end_date and self.plan_expires_at:
            self.plan_end_date = self.plan_expires_at
            
        # Set renewal_date if not set
        if not self.renewal_date and self.plan_end_date:
            self.renewal_date = self.plan_end_date
            
        super().save(*args, **kwargs)
    
    def cancel_subscription(self, at_period_end=True):
        """Cancel the subscription"""
        self.cancel_at_period_end = at_period_end
        self.canceled_at = timezone.now()
        self.status = 'cancelled' if not at_period_end else 'active'
        self.save()
    
    def activate_subscription(self):
        """Activate the subscription"""
        self.status = 'active'
        self.cancel_at_period_end = False
        self.canceled_at = None
        self.save()


# ============================================================
# INVOICE MODEL (OPTIONAL - for better invoice management)
# ============================================================
class Invoice(models.Model):
    """Model to track invoices - COMPATIBLE WITH FASTAPI"""
    user = models.ForeignKey(
        "creator_app.UserData", 
        on_delete=models.CASCADE,
         related_name="stripe_invoices"
    )
    subscription = models.ForeignKey(
        UserSubscription,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name="invoices"
    )
    
    # Invoice details
    invoice_number = models.CharField(max_length=100, unique=True)
    stripe_invoice_id = models.CharField(max_length=255, blank=True, null=True)
    
    # Payment details
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=10, default='usd')
    tax_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    
    # Invoice status
    status = models.CharField(
        max_length=20,
        choices=[
            ('draft', 'Draft'),
            ('open', 'Open'),
            ('paid', 'Paid'),
            ('uncollectible', 'Uncollectible'),
            ('void', 'Void'),
        ],
        default='draft'
    )
    
    # Dates
    invoice_date = models.DateTimeField(auto_now_add=True)
    due_date = models.DateTimeField(blank=True, null=True)
    paid_date = models.DateTimeField(blank=True, null=True)
    
    # File storage
    pdf_file = models.FileField(
        upload_to='invoices/',
        blank=True,
        null=True,
        help_text="Downloaded invoice PDF"
    )
    pdf_url = models.URLField(blank=True, null=True)
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-invoice_date']
        verbose_name = "Invoice"
        verbose_name_plural = "Invoices"
    
    def __str__(self):
        return f"Invoice {self.invoice_number} - {self.user.email}"

# ============================================================
# 7. WALLET & BILLING
# ============================================================

class Wallet(models.Model):
    user = models.OneToOneField(UserData, on_delete=models.CASCADE, related_name="wallet")
    balance = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    currency = models.CharField(max_length=10, default="USD")
    updated_at = models.DateTimeField(auto_now=True)
    def __str__(self): return f"{self.user.email} - ${self.balance}"

class WalletTransaction(models.Model):
    wallet = models.ForeignKey(Wallet, on_delete=models.CASCADE, related_name="transactions")
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    transaction_type = models.CharField(max_length=255)
    user = models.ForeignKey(UserData, on_delete=models.SET_NULL, null=True, blank=True, related_name="my_wallet_actions")
    from_user = models.ForeignKey(UserData, on_delete=models.SET_NULL, null=True, blank=True, related_name="sent_transactions")
    to_user = models.ForeignKey(UserData, on_delete=models.SET_NULL, null=True, blank=True, related_name="received_transactions")
    created_at = models.DateTimeField(auto_now_add=True)

class BillingHistory(models.Model):
    user = models.ForeignKey(UserData, on_delete=models.CASCADE, related_name="invoices")
    plan_name = models.CharField(max_length=50)
    duration = models.CharField(max_length=20, blank=True, null=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(max_length=50, default="Card", blank=True, null=True)
    status = models.CharField(max_length=50)
    invoice_id = models.CharField(max_length=255, blank=True, null=True)
    transaction_id = models.CharField(max_length=255, blank=True, null=True)
    paid_on = models.DateTimeField(auto_now_add=True)

class BillingInfo(models.Model):
    user = models.OneToOneField(UserData, on_delete=models.CASCADE, related_name="billing_info")
    full_name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True, null=True)
    location = models.CharField(max_length=255, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)

# ============================================================
# 8. MISC & UTILITIES
# ============================================================

class UserVerification(models.Model):
    user = models.OneToOneField(UserData, on_delete=models.CASCADE, related_name="verification")
    phone_verified = models.BooleanField(default=False)
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    phone_otp = models.CharField(max_length=6, blank=True, null=True)
    email_verified = models.BooleanField(default=False)
    email = models.EmailField(blank=True, null=True)
    email_otp = models.CharField(max_length=6, blank=True, null=True)
    facebook_verified = models.BooleanField(default=False)
    facebook_user_id = models.CharField(max_length=100, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)
    def is_fully_verified(self): return all([self.phone_verified, self.email_verified])

class UserPreferences(models.Model):
    user = models.OneToOneField(UserData, on_delete=models.CASCADE, related_name='preferences')
    theme = models.CharField(max_length=20, default='System')
    time_zone = models.CharField(max_length=50, default='UTC')
    date_format = models.CharField(max_length=20, default='ISO Format')
    default_dashboard = models.CharField(max_length=50, default='Overview Dashboard')

class SavedJob(models.Model):
    user = models.ForeignKey(UserData, on_delete=models.CASCADE, related_name="saved_jobs")
    job = models.ForeignKey(JobPost, on_delete=models.CASCADE, related_name="saved_by_users")
    saved_at = models.DateTimeField(auto_now_add=True)
    class Meta: unique_together = ('user', 'job')

class RecentlyViewedJob(models.Model):
    user = models.ForeignKey(UserData, on_delete=models.CASCADE, related_name="viewed_jobs")
    job = models.ForeignKey(JobPost, on_delete=models.CASCADE, related_name="views")
    viewed_at = models.DateTimeField(auto_now=True)

class Review(models.Model):
    reviewer = models.ForeignKey(UserData, on_delete=models.CASCADE, related_name="given_reviews")
    recipient = models.ForeignKey(UserData, on_delete=models.CASCADE, related_name="received_reviews")
    rating = models.IntegerField(default=5)
    comment = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    class Meta: unique_together = ('reviewer', 'recipient')

class TransactionHistory(models.Model):
    STATUS_CHOICES = [('Success', 'Success'), ('Pending', 'Pending'), ('Rejected', 'Rejected')]
    user = models.ForeignKey(UserData, on_delete=models.CASCADE, related_name="transactions")
    date = models.DateField(auto_now_add=True)
    name = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    transaction_type = models.CharField(max_length=50, default="Card")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    class Meta: ordering = ['-date']

class TestModel(models.Model):
    name = models.CharField(max_length=255)
    def __str__(self): return self.name
    
# ==============================================================================
#                        P o r t f o l i o   I t e m   (FINAL CHECK)
# ==============================================================================
def portfolio_upload_path(instance, filename):
    return f"portfolio_uploads/{instance.role}/{filename}"

class PortfolioItem(models.Model):
    user = models.ForeignKey(
        "creator_app.UserData",
        on_delete=models.CASCADE,
        related_name="portfolio_items",
        null=True,
        blank=True
    )

    role = models.CharField(
        max_length=20,
        choices=[("creator", "Creator"), ("collaborator", "Collaborator")],
        default="creator",
        null=False,
        blank=False
    )

    # ✅ NO title field - COMPLETELY REMOVED
    
    media_link = models.URLField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)

    file = models.FileField(
        upload_to=portfolio_upload_path,
        blank=True,
        null=True,
        max_length=500
    )
    
    order = models.IntegerField(default=0, help_text="Order of display")
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['order', '-created_at']
    
    def __str__(self):
        return f"{self.role}: {self.description[:50]} - {self.user.email if self.user else 'No User'}"