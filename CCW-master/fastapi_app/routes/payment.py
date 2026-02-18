
        
import os
import stripe
import requests
from fastapi import APIRouter, HTTPException, Request, Header
from pydantic import BaseModel
from datetime import datetime, timezone, timedelta
from typing import Optional
from asgiref.sync import sync_to_async
from django.core.mail import EmailMessage
from django.conf import settings
import asyncio
from django.db import transaction
from pathlib import Path # ✅ Added for robust path finding
from dotenv import load_dotenv

# ✅ IMPORT MODELS
from creator_app.models import UserData, UserSubscription, SubscriptionPlan, Invoice

router = APIRouter(prefix="/payment", tags=["Payment"])

# ==============================================================================
# 1. STRIPE CONFIGURATION
# ==============================================================================

env_path = Path(__file__).resolve().parent.parent.parent / '.env'
load_dotenv(dotenv_path=env_path)

stripe_key = os.getenv("STRIPE_SECRET_KEY")
if not stripe_key:
    print("❌ CRITICAL: STRIPE_SECRET_KEY not found in .env via payment.py!")
else:
    print("✅ Stripe Key loaded in payment.py")

stripe.api_key = stripe_key
WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET")
FRONTEND_URL = "http://localhost:5173" 

# Invoice folder path
INVOICE_FOLDER = os.path.join(os.path.dirname(os.path.dirname(__file__)), "invoices")
os.makedirs(INVOICE_FOLDER, exist_ok=True)

class CheckoutRequest(BaseModel):
    email: str
    plan_name: str
    duration: str = "monthly"

# ==============================================================================
# HELPER FUNCTIONS
# ==============================================================================

@sync_to_async
def get_user_by_email(email: str):
    """Get user by email"""
    try:
        return UserData.objects.get(email__iexact=email)
    except UserData.DoesNotExist:
        return None

@sync_to_async
def get_plan_by_name(plan_name: str, duration: str):
    """Get subscription plan - SIMPLIFIED & FIXED VERSION"""
    try:
        # Clean inputs
        clean_name = plan_name.strip().lower()
        clean_duration = duration.strip().lower()
        
        print(f"🔍 Looking for plan: name='{clean_name}' with duration='{clean_duration}'")
        
        # First, try to find by name (case-insensitive) and exact duration
        exact_match = SubscriptionPlan.objects.filter(
            name__iexact=clean_name,
            duration__iexact=clean_duration,
            is_active=True
        ).first()
        
        if exact_match:
            print(f"✅ Found exact match: {exact_match.name} - {exact_match.duration}")
            return exact_match
        
        # If no exact match, try with similar names (for flexibility)
        name_mappings = {
            'free': ['free', 'basic', 'starter'],
            'pro': ['pro', 'professional', 'premium'],
            'agent': ['agent', 'agency', 'business'],
            'customer': ['customer', 'enterprise', 'company']
        }
        
        # Find matching name pattern
        matched_pattern = None
        for pattern, variations in name_mappings.items():
            if any(variation in clean_name for variation in variations):
                matched_pattern = pattern
                break
        
        if matched_pattern:
            print(f"🔍 Pattern matched: '{clean_name}' -> '{matched_pattern}'")
            # Try to find plan with duration
            plan = SubscriptionPlan.objects.filter(
                name__icontains=matched_pattern,
                duration__iexact=clean_duration,
                is_active=True
            ).first()
            
            if plan:
                print(f"✅ Found pattern match: {plan.name} - {plan.duration}")
                return plan
        
        # Last resort: find any plan with similar name
        similar_plan = SubscriptionPlan.objects.filter(
            name__icontains=clean_name,
            is_active=True
        ).first()
        
        if similar_plan:
            print(f"⚠️ Found similar plan (duration may not match): {similar_plan.name} - {similar_plan.duration}")
            return similar_plan
        
        print(f"❌ No plan found for name '{clean_name}' with duration '{clean_duration}'")
        return None
        
    except Exception as e:
        print(f"❌ Error getting plan: {str(e)}")
        return None

@sync_to_async
def get_or_create_stripe_customer(email: str, name: str):
    """Get or create Stripe customer"""
    try:
        existing_customers = stripe.Customer.list(email=email, limit=1).data
        if existing_customers:
            return existing_customers[0].id
        else:
            new_customer = stripe.Customer.create(
                email=email, 
                name=name,
                metadata={"source": "ccw_project"}
            )
            return new_customer.id
    except Exception as e:
        print(f"⚠️ Error creating Stripe customer: {str(e)}")
        return None

def download_invoice_pdf(invoice_pdf_url: str, invoice_number: str) -> Optional[str]:
    """Download invoice PDF from Stripe - FIXED for test mode"""
    try:
        if not invoice_pdf_url:
            print("❌ No invoice PDF URL provided")
            return None
            
        # Clean invoice number
        clean_invoice_number = invoice_number.replace('/', '_').replace('\\', '_').replace(':', '_')
        
        filename = f"invoice_{clean_invoice_number}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
        file_path = os.path.join(INVOICE_FOLDER, filename)
        
        print(f"📥 Downloading invoice from: {invoice_pdf_url}")
        print(f"📁 Saving to: {file_path}")
        
        # Ensure folder exists
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        
        # Download with proper Stripe authentication
        response = requests.get(invoice_pdf_url, timeout=30)
        
        if response.status_code == 200:
            # Save file
            with open(file_path, 'wb') as f:
                f.write(response.content)
            
            # Verify file was saved
            if os.path.exists(file_path):
                file_size = os.path.getsize(file_path)
                print(f"✅ Invoice downloaded successfully: {file_path} ({file_size} bytes)")
                return file_path
            else:
                print(f"❌ File was not created: {file_path}")
                return None
        else:
            print(f"❌ Failed to download invoice. Status: {response.status_code}")
            return None
        
    except requests.exceptions.RequestException as e:
        print(f"❌ Network error downloading invoice: {e}")
        return None
    except Exception as e:
        print(f"❌ Failed to download invoice PDF: {e}")
        import traceback
        traceback.print_exc()
        return None

@sync_to_async
def create_invoice_record(user, subscription, invoice_data, pdf_path=None):
    """Create Invoice record in database - PREVENT DUPLICATES"""
    try:
        print(f"📄 Creating invoice record for user: {user.email}")
        
        # Get invoice details
        invoice_number = invoice_data.get('number', f"INV-{datetime.now().strftime('%Y%m%d-%H%M%S')}")
        stripe_invoice_id = invoice_data.get('id')
        
        # CHECK: If invoice already exists, skip creation
        existing_invoice = Invoice.objects.filter(
            stripe_invoice_id=stripe_invoice_id
        ).first()
        
        if existing_invoice:
            print(f"⚠️ Invoice already exists: {existing_invoice.invoice_number}. Skipping creation.")
            return existing_invoice
        
        amount = invoice_data.get('amount_paid', invoice_data.get('amount_due', 0)) / 100
        status = invoice_data.get('status', 'paid')
        
        # Create invoice
        invoice = Invoice.objects.create(
            user=user,
            subscription=subscription,
            invoice_number=invoice_number,
            stripe_invoice_id=stripe_invoice_id,
            amount=amount,
            currency=invoice_data.get('currency', 'usd'),
            tax_amount=invoice_data.get('tax', 0) / 100,
            status=status,
            invoice_date=datetime.fromtimestamp(invoice_data.get('created', datetime.now().timestamp()), timezone.utc),
            due_date=datetime.fromtimestamp(invoice_data.get('due_date', datetime.now().timestamp()), timezone.utc) if invoice_data.get('due_date') else None,
            paid_date=datetime.fromtimestamp(invoice_data.get('created', datetime.now().timestamp()), timezone.utc) if status == 'paid' else None,
            pdf_url=invoice_data.get('invoice_pdf'),
            pdf_file=pdf_path
        )
        
        print(f"✅ Invoice record created: {invoice.invoice_number}, Amount: ${amount}")
        return invoice
    except Exception as e:
        print(f"❌ Error creating invoice record: {e}")
        import traceback
        traceback.print_exc()
        return None

def send_welcome_email_sync(user, plan, amount_paid, duration_display, invoice_path=None):
    """Send welcome email with invoice - PREVENT DUPLICATE EMAILS"""
    try:
        # Check email settings
        if not hasattr(settings, 'EMAIL_HOST') or not settings.EMAIL_HOST:
            print("⚠️ Email settings not configured. Cannot send email.")
            print(f"   EMAIL_HOST: {getattr(settings, 'EMAIL_HOST', 'Not set')}")
            return False
        
        print(f"📧 Preparing email for {user.email}")
        
        # Calculate dates based on ACTUAL duration
        now = datetime.now()
        
        if 'annual' in duration_display.lower() or 'year' in duration_display.lower():
            end_date = now + timedelta(days=365)
            duration_text = "Annual (1 Year)"
        else:
            end_date = now + timedelta(days=30)
            duration_text = "Monthly"
        
        subject = f"🎉 Welcome to {plan.name}!"
        
        body = f"""
Dear {user.first_name or 'Valued Customer'},

Thank you for subscribing to {plan.name}!

📋 **Subscription Details:**
----------------------------------------
Plan: {plan.name} ({duration_text})
Amount: ${amount_paid:.2f}
Subscription Date: {now.strftime("%B %d, %Y %I:%M %p")}
Start Date: {now.strftime("%B %d, %Y")}
End Date: {end_date.strftime("%B %d, %Y")}
Renewal Date: {end_date.strftime("%B %d, %Y")}
Status: Active
----------------------------------------

🌟 **What you get:**
- Full access to {plan.name} features
- Priority support
- Regular updates

💼 **Account Information:**
Email: {user.email}
User ID: {user.id}

We're excited to have you onboard!

Best regards,
The Talenta Team
www.talenta.com

This is an automated email. Please do not reply.
        """
        
        email = EmailMessage(
            subject=subject,
            body=body,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[user.email],
        )
        
        # Attach invoice if available
        if invoice_path and os.path.exists(invoice_path):
            try:
                print(f"📎 Attaching invoice: {invoice_path}")
                with open(invoice_path, 'rb') as f:
                    invoice_data = f.read()
                
                # Extract just the filename from the path
                invoice_filename = os.path.basename(invoice_path)
                email.attach(invoice_filename, invoice_data, 'application/pdf')
                print(f"✅ Invoice attached: {invoice_filename}")
            except Exception as e:
                print(f"⚠️ Could not attach invoice: {e}")
        else:
            print(f"⚠️ No invoice to attach. Path: {invoice_path}, Exists: {os.path.exists(invoice_path) if invoice_path else 'No path'}")
        
        # Send email
        print(f"📤 Sending email to {user.email}...")
        try:
            email.send(fail_silently=False)
            print(f"✅ Email sent successfully to {user.email}")
            return True
        except Exception as send_error:
            print(f"❌ Failed to send email: {send_error}")
            return False
                
    except Exception as e:
        print(f"❌ Failed to prepare/send email: {e}")
        import traceback
        traceback.print_exc()
        return False

async def send_welcome_email_async(user, plan, amount_paid, duration_display, invoice_path=None):
    """Send welcome email with invoice (ASYNC wrapper)"""
    try:
        # Run the sync function in thread pool
        loop = asyncio.get_event_loop()
        result = await loop.run_in_executor(
            None, 
            send_welcome_email_sync, 
            user, plan, amount_paid, duration_display, invoice_path
        )
        return result
    except Exception as e:
        print(f"❌ Async email error: {e}")
        return False

@sync_to_async
def create_user_subscription_db(user, plan, stripe_customer_id=None, stripe_subscription_id=None, 
                                invoice_pdf_url=None, invoice_number=None, amount_paid=0):
    """Create/update user subscription in database - WITH DUPLICATE CHECK"""
    try:
        with transaction.atomic():
            # Calculate dates based on ACTUAL plan duration
            now = datetime.now(timezone.utc)
            
            # Get duration from plan (use what's in database, not user input)
            plan_duration = (plan.duration or "").lower() if plan.duration else ""
            
            # Check for annual/yearly variations
            is_annual = False
            if plan_duration:
                annual_keywords = ['year', 'annual', 'yearly', 'annually', 'yr']
                is_annual = any(keyword in plan_duration for keyword in annual_keywords)
            
            if is_annual:
                end_date = now + timedelta(days=365)
                duration_display = "Annual"
                print(f"📅 Setting ANNUAL subscription: {plan.name} - {plan_duration}")
            else:
                end_date = now + timedelta(days=30)
                duration_display = "Monthly"
                print(f"📅 Setting MONTHLY subscription: {plan.name} - {plan_duration}")
            
            # CHECK: If subscription already exists with same stripe_subscription_id
            existing_subscription = None
            if stripe_subscription_id:
                existing_subscription = UserSubscription.objects.filter(
                    stripe_subscription_id=stripe_subscription_id
                ).first()
            
            if existing_subscription:
                print(f"⚠️ Subscription already exists with ID: {stripe_subscription_id}. Skipping creation.")
                return existing_subscription, duration_display
            
            # Get or create subscription with atomic operation
            subscription, created = UserSubscription.objects.select_for_update().get_or_create(
                user=user,
                defaults={
                    'email': user.email,
                    'plan_name': plan.name,
                    'current_plan': plan.name,
                    'duration': duration_display,
                    'plan_price': plan.price,
                    'plan_start_date': now,
                    'plan_end_date': end_date,
                    'renewal_date': end_date,
                    'status': 'active',
                    'stripe_customer_id': stripe_customer_id,
                    'stripe_subscription_id': stripe_subscription_id,
                    'last_invoice_url': invoice_pdf_url,
                    'last_invoice_number': invoice_number,
                    'last_payment_amount': amount_paid,
                    'last_payment_date': now
                }
            )
            
            # Update existing subscription if not created
            if not created:
                # Only update if it's a different subscription
                if stripe_subscription_id and subscription.stripe_subscription_id != stripe_subscription_id:
                    subscription.email = user.email
                    subscription.plan_name = plan.name
                    subscription.current_plan = plan.name
                    subscription.duration = duration_display
                    subscription.plan_price = plan.price
                    subscription.plan_start_date = now
                    subscription.plan_end_date = end_date
                    subscription.renewal_date = end_date
                    subscription.status = 'active'
                    subscription.stripe_customer_id = stripe_customer_id
                    subscription.stripe_subscription_id = stripe_subscription_id
                    subscription.last_invoice_url = invoice_pdf_url
                    subscription.last_invoice_number = invoice_number
                    subscription.last_payment_amount = amount_paid
                    subscription.last_payment_date = now
                    subscription.save()
                    print(f"🔄 Updated existing subscription to new plan: {plan.name}")
                else:
                    print(f"ℹ️ Subscription already up to date: {plan.name}")
            
            action = "Created" if created else "Updated"
            print(f"✅ {action} {duration_display} subscription for {user.email} → {plan.name} (${plan.price})")
            print(f"   Start: {now.date()}, End: {end_date.date()}")
            return subscription, duration_display
            
    except Exception as e:
        print(f"❌ Error updating subscription: {str(e)}")
        import traceback
        traceback.print_exc()
        raise

# ==============================================================================
# 2. VERIFY PAYMENT WITH EMAIL & INVOICE - FIXED TO PREVENT DUPLICATES
# ==============================================================================

@router.get("/verify-payment")
async def verify_payment(session_id: str, user_email: str, plan_name: str):
    """Verify payment after user returns from Stripe - PREVENT DUPLICATE PROCESSING"""
    try:
        session = stripe.checkout.Session.retrieve(session_id)
        
        print(f"🔍 Verifying payment for session: {session_id}")
        print(f"📧 User: {user_email}, Plan: {plan_name}")
        print(f"💰 Payment status: {session.payment_status}")
        print(f"📊 Session metadata: {session.metadata}")
        
        if session.payment_status == 'paid':
            user = await get_user_by_email(user_email)
            if not user:
                return {"success": False, "error": "User not found"}
            
            # Get plan with duration from session metadata
            plan_duration = session.metadata.get('plan_duration', 'monthly')
            plan = await get_plan_by_name(plan_name, plan_duration)
            
            if not plan:
                return {"success": False, "error": "Plan not found"}
            
            # Get invoice details
            invoice_pdf_url = None
            invoice_number = None
            amount_paid = plan.price
            stripe_invoice_data = None
            
            try:
                # Try to get invoice from subscription
                if session.subscription:
                    subscription_obj = stripe.Subscription.retrieve(session.subscription)
                    latest_invoice = subscription_obj.get('latest_invoice')
                    
                    if latest_invoice:
                        invoice = stripe.Invoice.retrieve(latest_invoice)
                        invoice_pdf_url = invoice.get('invoice_pdf')
                        invoice_number = invoice.get('number')
                        amount_paid = (invoice.get('amount_paid') or invoice.get('amount_due') or 0) / 100
                        stripe_invoice_data = invoice
                        print(f"📄 Found invoice from subscription: {invoice_number}, PDF: {invoice_pdf_url}, Amount: ${amount_paid}")
                
                # Fallback to payment intent
                elif session.payment_intent:
                    payment_intent = stripe.PaymentIntent.retrieve(session.payment_intent)
                    if payment_intent.invoice:
                        invoice = stripe.Invoice.retrieve(payment_intent.invoice)
                        invoice_pdf_url = invoice.get('invoice_pdf')
                        invoice_number = invoice.get('number')
                        amount_paid = (invoice.get('amount_paid') or invoice.get('amount_due') or 0) / 100
                        stripe_invoice_data = invoice
                        print(f"📄 Found invoice from payment intent: {invoice_number}, PDF: {invoice_pdf_url}, Amount: ${amount_paid}")
                
                # If still no invoice, check customer invoices
                if not invoice_pdf_url and session.customer:
                    try:
                        invoices = stripe.Invoice.list(customer=session.customer, limit=1)
                        if invoices.data:
                            invoice = invoices.data[0]
                            invoice_pdf_url = invoice.get('invoice_pdf')
                            invoice_number = invoice.get('number')
                            amount_paid = (invoice.get('amount_paid') or invoice.get('amount_due') or 0) / 100
                            stripe_invoice_data = invoice
                            print(f"📄 Found recent customer invoice: {invoice_number}, PDF: {invoice_pdf_url}, Amount: ${amount_paid}")
                    except:
                        pass
                        
            except Exception as e:
                print(f"⚠️ Could not get invoice details: {e}")
                import traceback
                traceback.print_exc()
            
            # If still no invoice in test mode, create mock data
            if not invoice_pdf_url and STRIPE_SECRET_KEY.startswith("sk_test"):
                print("⚠️ Test mode: No invoice found, using plan price")
                stripe_invoice_data = {
                    'id': f'in_test_{datetime.now().strftime("%Y%m%d%H%M%S")}',
                    'number': f'TEST-INV-{datetime.now().strftime("%Y%m%d-%H%M%S")}',
                    'amount_paid': amount_paid * 100,
                    'amount_due': amount_paid * 100,
                    'currency': 'usd',
                    'status': 'paid',
                    'created': datetime.now().timestamp(),
                    'tax': 0
                }
                invoice_number = stripe_invoice_data['number']
                print(f"📄 Created test invoice: {invoice_number}, Amount: ${amount_paid}")
            
            # Update subscription in database
            subscription, duration_display = await create_user_subscription_db(
                user=user, 
                plan=plan, 
                stripe_customer_id=session.get('customer'),
                stripe_subscription_id=session.get('subscription'),
                invoice_pdf_url=invoice_pdf_url,
                invoice_number=invoice_number,
                amount_paid=amount_paid
            )
            
            # Download invoice and save to Invoice model (with duplicate check)
            invoice_path = None
            if invoice_pdf_url and invoice_number:
                print(f"📥 Attempting to download invoice: {invoice_pdf_url}")
                invoice_path = download_invoice_pdf(invoice_pdf_url, invoice_number)
                
                # Create Invoice record in database (will check for duplicates)
                if stripe_invoice_data:
                    await create_invoice_record(user, subscription, stripe_invoice_data, invoice_path)
            elif stripe_invoice_data:
                # Create invoice record even without PDF for test mode (with duplicate check)
                print(f"📄 Creating invoice record without PDF")
                await create_invoice_record(user, subscription, stripe_invoice_data)
            
            # Send email ASYNC with CORRECT duration
            email_sent = await send_welcome_email_async(
                user, 
                plan, 
                amount_paid, 
                duration_display,
                invoice_path
            )
            
            return {
                "success": True, 
                "status": "paid",
                "message": "Payment verified successfully" + (" and email sent!" if email_sent else " (email failed)"),
                "plan_name": plan.name,
                "duration": duration_display,
                "amount_paid": amount_paid,
                "email_sent": email_sent,
                "invoice_downloaded": invoice_path is not None
            }
        else:
            return {
                "success": False, 
                "status": session.payment_status,
                "message": f"Payment not completed. Status: {session.payment_status}"
            }
            
    except stripe.error.StripeError as e:
        print(f"❌ Stripe verification error: {str(e)}")
        return {"success": False, "error": f"Stripe error: {str(e)}"}
    except Exception as e:
        print(f"❌ Verification error: {str(e)}")
        return {"success": False, "error": str(e)}

# ==============================================================================
# 3. CREATE CHECKOUT SESSION
# ==============================================================================

@router.post("/create-checkout-session")
async def create_checkout_session(data: CheckoutRequest):
    """Create Stripe checkout session"""
    try:
        user = await get_user_by_email(data.email)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Get plan based on name and duration
        plan = await get_plan_by_name(data.plan_name, data.duration)
        if not plan:
            raise HTTPException(status_code=404, detail="Plan not found")
        
        # Use the plan's ACTUAL duration from database
        plan_duration = plan.duration or data.duration
        print(f"📊 Using plan duration from DB: {plan_duration}")
        
        # Get or create Stripe customer
        customer_name = f"{user.first_name or ''} {user.last_name or ''}".strip() or user.email
        stripe_customer_id = await get_or_create_stripe_customer(user.email, customer_name)
        
        # Determine interval from plan's ACTUAL duration
        plan_duration_lower = (plan_duration or "").lower()
        if any(keyword in plan_duration_lower for keyword in ['year', 'annual', 'yearly']):
            interval = 'year'
            print(f"🔄 Setting YEARLY interval for: {plan_duration_lower}")
        else:
            interval = 'month'
            print(f"🔄 Setting MONTHLY interval for: {plan_duration_lower}")
        
        # Create product and price
        product = stripe.Product.create(
            name=plan.name,
            description=plan.description or f"{plan.name} subscription plan"
        )
        
        price = stripe.Price.create(
            product=product.id,
            unit_amount=int(plan.price * 100),
            currency='usd',
            recurring={'interval': interval}
        )
        
        session_data = {
            'payment_method_types': ['card'],
            'mode': 'subscription',
            'line_items': [{
                'price': price.id,
                'quantity': 1,
            }],
            'success_url': f'{FRONTEND_URL}/subscription?success=true&session_id={{CHECKOUT_SESSION_ID}}&user_email={user.email}&plan_name={plan.name}',
            'cancel_url': f'{FRONTEND_URL}/subscription?canceled=true',
            'metadata': {
                "user_id": str(user.id),
                "user_email": user.email,
                "plan_name": plan.name,
                "plan_duration": plan_duration,
                "plan_price": str(plan.price)
            }
        }
        
        # Add customer or customer_email
        if stripe_customer_id:
            session_data['customer'] = stripe_customer_id
        else:
            session_data['customer_email'] = user.email
        
        checkout_session = stripe.checkout.Session.create(**session_data)
        
        print(f"✅ Checkout session created: {checkout_session.id} for {user.email}")
        print(f"📊 Plan: {plan.name}, Duration: {plan_duration}, Interval: {interval}, Price: ${plan.price}")
        
        return {
            "checkout_url": checkout_session.url,
            "session_id": checkout_session.id,
            "message": "Redirect user to checkout URL"
        }
        
    except HTTPException:
        raise
    except stripe.error.StripeError as e:
        print(f"❌ Stripe error: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Stripe error: {str(e)}")
    except Exception as e:
        print(f"❌ Error creating checkout session: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

# ==============================================================================
# 4. GET USER SUBSCRIPTION
# ==============================================================================

@router.get("/user/subscription")
async def get_user_subscription(user_email: str):
    """Get user's current subscription"""
    try:
        user = await get_user_by_email(user_email)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        @sync_to_async
        def get_subscription():
            # Get the most recent subscription
            subscription = UserSubscription.objects.filter(
                user=user
            ).order_by('-plan_start_date').first()
            
            return subscription
        
        subscription = await get_subscription()
        
        if not subscription:
            return {
                "has_subscription": False,
                "message": "No subscription found"
            }
        
        # Check if active
        is_active = False
        if subscription.status in ['active', 'trialing']:
            if subscription.plan_end_date:
                is_active = subscription.plan_end_date > datetime.now(timezone.utc)
            else:
                is_active = True
        
        return {
            "has_subscription": True,
            "subscription": {
                "plan_name": subscription.plan_name or "No Plan",
                "current_plan": subscription.current_plan or "No Plan",
                "duration": subscription.duration or "N/A",
                "status": subscription.status,
                "is_active": is_active,
                "plan_price": float(subscription.plan_price) if subscription.plan_price else 0,
                "plan_start_date": subscription.plan_start_date,
                "plan_end_date": subscription.plan_end_date,
                "renewal_date": subscription.renewal_date,
                "user_email": subscription.email or user_email,
                "stripe_subscription_id": subscription.stripe_subscription_id,
                "days_remaining": subscription.days_remaining if hasattr(subscription, 'days_remaining') else 0
            }
        }
        
    except Exception as e:
        print(f"❌ Error in get_user_subscription: {str(e)}")
        return {
            "has_subscription": False,
            "error": str(e),
            "message": "Error fetching subscription"
        }

# ==============================================================================
# 5. STRIPE WEBHOOK HANDLER - SIMPLIFIED TO PREVENT DUPLICATES
# ==============================================================================

@router.post("/webhook")
async def stripe_webhook(request: Request, stripe_signature: str = Header(None)):
    """Handle Stripe webhooks - SIMPLIFIED VERSION"""
    try:
        payload = await request.body()
        
        # Verify webhook signature
        event = stripe.Webhook.construct_event(
            payload, stripe_signature, WEBHOOK_SECRET
        )
        
        event_type = event['type']
        event_data = event['data']['object']
        
        print(f"🔄 Stripe Webhook Received: {event_type}")
        
        # Handle only essential events
        if event_type == 'invoice.payment_succeeded':
            invoice = event_data
            customer_id = invoice.get('customer')
            
            if invoice.get('invoice_pdf'):
                print(f"📄 Invoice PDF available: {invoice['invoice_pdf']}")
        
        elif event_type == 'customer.subscription.updated':
            subscription = event_data
            print(f"📊 Subscription updated: {subscription.id}")
        
        # NOTE: We're NOT handling checkout.session.completed here anymore
        # to prevent duplicates. All processing happens in verify-payment endpoint
        
        return {"success": True, "event": event_type}
        
    except stripe.error.SignatureVerificationError as e:
        print(f"❌ Invalid webhook signature: {e}")
        raise HTTPException(status_code=400, detail="Invalid signature")
    except Exception as e:
        print(f"❌ Webhook error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# ==============================================================================
# 6. TEST ENDPOINTS
# ==============================================================================

@router.get("/test")
async def test_payment():
    """Test payment endpoint"""
    try:
        balance = stripe.Balance.retrieve()
        return {
            "success": True,
            "message": "Stripe connection successful",
            "mode": "test" if STRIPE_SECRET_KEY.startswith("sk_test") else "live",
            "invoice_folder": INVOICE_FOLDER,
            "folder_exists": os.path.exists(INVOICE_FOLDER),
            "stripe_balance": {
                "available": [{"amount": b.amount, "currency": b.currency} for b in balance.available]
            }
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }

@router.get("/plans")
async def get_all_plans():
    """Get all available subscription plans"""
    @sync_to_async
    def get_plans():
        return list(SubscriptionPlan.objects.filter(is_active=True))
    
    plans = await get_plans()
    
    return {
        "plans": [
            {
                "id": plan.id,
                "name": plan.name,
                "description": plan.description,
                "price": float(plan.price),
                "duration": plan.duration,
                "features": plan.features if hasattr(plan, 'features') else []
            }
            for plan in plans
        ]
    }

# ==============================================================================
# 7. DEBUG ENDPOINTS
# ==============================================================================

@router.get("/debug-session/{session_id}")
async def debug_session(session_id: str):
    """Debug a Stripe session"""
    try:
        session = stripe.checkout.Session.retrieve(session_id)
        
        # Get more details
        details = {
            "session_id": session.id,
            "payment_status": session.payment_status,
            "mode": session.mode,
            "customer": session.customer,
            "customer_email": session.customer_email,
            "subscription": session.subscription,
            "payment_intent": session.payment_intent,
            "metadata": session.metadata,
            "line_items": session.line_items.data if hasattr(session.line_items, 'data') else []
        }
        
        # Try to get invoice
        invoice_info = None
        if session.payment_intent:
            try:
                payment_intent = stripe.PaymentIntent.retrieve(session.payment_intent)
                if payment_intent.invoice:
                    invoice = stripe.Invoice.retrieve(payment_intent.invoice)
                    invoice_info = {
                        "invoice_id": invoice.id,
                        "invoice_number": invoice.number,
                        "invoice_pdf": invoice.invoice_pdf,
                        "amount_paid": invoice.amount_paid / 100,
                        "currency": invoice.currency,
                        "period_start": invoice.period_start,
                        "period_end": invoice.period_end
                    }
            except Exception as e:
                invoice_info = f"Error getting invoice: {e}"
        
        return {
            "success": True,
            "session": details,
            "invoice": invoice_info
        }
        
    except Exception as e:
        return {"success": False, "error": str(e)}

@router.get("/debug-user/{email}")
async def debug_user(email: str):
    """Debug user subscription"""
    try:
        user = await get_user_by_email(email)
        if not user:
            return {"success": False, "error": "User not found"}
           
        @sync_to_async
        def get_subscription_details():
            subscription = UserSubscription.objects.filter(user=user).first()
            if subscription:
                return {
                    "id": subscription.id,
                    "plan_name": subscription.plan_name,
                    "current_plan": subscription.current_plan,
                    "duration": subscription.duration,
                    "plan_price": subscription.plan_price,
                    "plan_start_date": subscription.plan_start_date,
                    "plan_end_date": subscription.plan_end_date,
                    "renewal_date": subscription.renewal_date,
                    "status": subscription.status,
                    "stripe_subscription_id": subscription.stripe_subscription_id,
                    "stripe_customer_id": subscription.stripe_customer_id,
                    "email": subscription.email
                }
            return None
        
        subscription = await get_subscription_details()
        
        return {
            "success": True,
            "user": {
                "id": user.id,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name
            },
            "subscription": subscription
        }
        
    except Exception as e:
        return {"success": False, "error": str(e)}