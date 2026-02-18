# import fastapi_app.django_setup
# from typing import Optional, List
# from django.db.models import Q
# from fastapi import APIRouter, HTTPException, Form

# # Import your Django Models
# from creator_app.models import (
#     UserData, 
#     CollaboratorProfile, 
#     JobPost, 
#     SavedJob, 
#     RecentlyViewedJob, 
#     Contract, 
#     Review
# )

# router = APIRouter(prefix="/collaborator", tags=["Collaborator"])

# # ==============================================================================
# # 🆕 1. GET DYNAMIC FILTER OPTIONS (Fetch Real DB Data)
# # ==============================================================================
# @router.get("/filters")
# def get_dynamic_filters():
#     """
#     Returns unique values for Skill Category, Location, and Experience
#     existing in the database to populate frontend dropdowns.
#     """
#     try:
#         # Fetch distinct values from DB
#         niches = CollaboratorProfile.objects.values_list('skill_category', flat=True).distinct()
#         locations = CollaboratorProfile.objects.values_list('location', flat=True).distinct()
#         experiences = CollaboratorProfile.objects.values_list('experience', flat=True).distinct()

#         # Clean up data (remove None/Empty) and sort
#         return {
#             "niches": sorted([n for n in niches if n and n.strip()]),
#             "locations": sorted([l for l in locations if l and l.strip()]),
#             "experiences": sorted([e for e in experiences if e and e.strip()])
#         }
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))

# # ==============================================================================
# #  2. SEARCH & FILTER
# # ==============================================================================
# @router.get("/search")
# def search_collaborators(
#     search: Optional[str] = None,
#     skill_category: Optional[str] = None,
#     location: Optional[str] = None,
#     min_price: Optional[float] = None,
#     max_price: Optional[float] = None,
#     experience: Optional[str] = None,
#     language: Optional[str] = None,
#     availability: Optional[str] = None
# ):
#     profiles = CollaboratorProfile.objects.all()

#     if search:
#         profiles = profiles.filter(
#             Q(name__icontains=search) |
#             Q(skill_category__icontains=search) |
#             Q(skills__icontains=search) # Also search inside the JSON list
#         )

#     if skill_category:
#         profiles = profiles.filter(skill_category__iexact=skill_category)

#     if location:
#         profiles = profiles.filter(location__icontains=location)

#     if min_price is not None:
#         profiles = profiles.filter(pricing_amount__gte=min_price)

#     if max_price is not None:
#         profiles = profiles.filter(pricing_amount__lte=max_price)

#     if experience:
#         profiles = profiles.filter(experience__iexact=experience)

#     if language:
#         profiles = profiles.filter(language__icontains=language)

#     if availability:
#         profiles = profiles.filter(availability__iexact=availability)

#     return [
#         {
#             "id": p.id,
#             "user_id": p.user.id, # Included for profile linking
#             "email": p.user.email,
#             "name": p.name,
#             "skill_category": p.skill_category,
#             "skills": p.skills,
#             "pricing": f"{p.pricing_amount} {p.pricing_unit}",
#             "location": p.location,
#             "experience": p.experience,
#             "language": p.language,
#             "availability": p.availability,
#             "social_link": p.social_link,
#             "portfolio_link": p.portfolio_link,
#             "rating": p.skills_rating
#         }
#         for p in profiles
#     ]

# # ... (Keep your save, edit, delete, and other endpoints as they were) ...

# # ==============================================================================
# #  2. PROFILE MANAGEMENT (Create, Get, Edit, Delete)
# # ==============================================================================

# @router.post("/save/{user_id}")
# def save_collaborator_profile(
#     user_id: int,
#     name: str,
#     language: str,
#     skill_category: str,
#     experience: str,
#     skills: str = "", # New field: Comma separated string e.g. "Python, React"
#     pricing_amount: float | None = None,
#     pricing_unit: str | None = None,
#     availability: str | None = None,
#     timing: str | None = None,
#     social_link: str | None = None,
#     portfolio_link: str | None = None,
#     badges: str | None = None,
#     about: str | None = None,
#     location: str | None = None,
# ):
#     try:
#         user = UserData.objects.get(id=user_id)
#     except UserData.DoesNotExist:
#         raise HTTPException(status_code=404, detail="User not found")

#     # Convert "Python, React" -> ["Python", "React"]
#     skills_list = [s.strip() for s in skills.split(',')] if skills else []

#     profile, created = CollaboratorProfile.objects.update_or_create(
#         user=user,
#         defaults={
#             "name": name,
#             "language": language,
#             "skill_category": skill_category,
#             "experience": experience,
#             "skills": skills_list,  # Save list to JSONField
#             "pricing_amount": pricing_amount,
#             "pricing_unit": pricing_unit,
#             "availability": availability,
#             "timing": timing,
#             "social_link": social_link,
#             "portfolio_link": portfolio_link,
#             "badges": badges,
#             "about": about,
#             "location": location,
#         },
#     )

#     # Ensure role is updated
#     user.role = "collaborator"
#     user.save()

#     return {"message": "Collaborator profile saved", "created": created, "skills": skills_list}


# @router.get("/get/{user_id}")
# def get_collaborator_profile(user_id: int):
#     try:
#         user = UserData.objects.get(id=user_id)
#         profile = CollaboratorProfile.objects.get(user=user)
#     except (UserData.DoesNotExist, CollaboratorProfile.DoesNotExist):
#         raise HTTPException(status_code=404, detail="Profile not found")

#     return {
#         "user_id": user_id,
#         "email": user.email,
#         "name": profile.name,
#         "language": profile.language,
#         "skill_category": profile.skill_category,
#         "skills": profile.skills, # Returns list
#         "experience": profile.experience,
#         "pricing_amount": profile.pricing_amount,
#         "pricing_unit": profile.pricing_unit,
#         "availability": profile.availability,
#         "timing": profile.timing,
#         "social_link": profile.social_link,
#         "portfolio_link": profile.portfolio_link,
#         "badges": profile.badges,
#         "skills_rating": profile.skills_rating,
#         "about": profile.about,
#         "location": profile.location,
#     }


# @router.put("/edit/{user_id}")
# def edit_collaborator_profile(
#     user_id: int,
#     name: str | None = None,
#     language: str | None = None,
#     skill_category: str | None = None,
#     experience: str | None = None,
#     skills: str | None = None, # Input as string "A, B"
#     pricing_amount: float | None = None,
#     pricing_unit: str | None = None,
#     availability: str | None = None,
#     timing: str | None = None,
#     social_link: str | None = None,
#     portfolio_link: str | None = None,
#     badges: str | None = None,
#     about: str | None = None,
#     location: str | None = None,
# ):
#     try:
#         user = UserData.objects.get(id=user_id)
#         profile = CollaboratorProfile.objects.get(user=user)
#     except (UserData.DoesNotExist, CollaboratorProfile.DoesNotExist):
#         raise HTTPException(status_code=404, detail="Collaborator profile not found")

#     if name is not None: profile.name = name
#     if language is not None: profile.language = language
#     if skill_category is not None: profile.skill_category = skill_category
#     if experience is not None: profile.experience = experience
    
#     # Handle Skills Update
#     if skills is not None:
#         profile.skills = [s.strip() for s in skills.split(',') if s.strip()]

#     if pricing_amount is not None: profile.pricing_amount = pricing_amount
#     if pricing_unit is not None: profile.pricing_unit = pricing_unit
#     if availability is not None: profile.availability = availability
#     if timing is not None: profile.timing = timing
#     if social_link is not None: profile.social_link = social_link
#     if portfolio_link is not None: profile.portfolio_link = portfolio_link
#     if badges is not None: profile.badges = badges
#     if about is not None: profile.about = about
#     if location is not None: profile.location = location

#     profile.save()

#     return {"message": "Collaborator profile updated successfully", "skills": profile.skills}


# @router.delete("/delete/{user_id}")
# def delete_collaborator_profile(user_id: int):
#     try:
#         user = UserData.objects.get(id=user_id)
#         CollaboratorProfile.objects.get(user=user).delete()
#     except (UserData.DoesNotExist, CollaboratorProfile.DoesNotExist):
#         raise HTTPException(status_code=404, detail="Profile not found")

#     return {"message": "Collaborator profile deleted"}


# @router.get("/list")
# def list_collaborators():
#     profiles = CollaboratorProfile.objects.all()
#     return [
#         {
#             "user_id": p.user.id,
#             "email": p.user.email,
#             "name": p.name,
#             "skill_category": p.skill_category,
#             "location": p.location,
#         }
#         for p in profiles
#     ]


# # ==============================================================================
# #  3. JOB ACTIONS (Save & View History)
# # ==============================================================================
# @router.post("/jobs/toggle-save")
# def toggle_save_job(user_id: int, job_id: int):
#     try:
#         user = UserData.objects.get(id=user_id)
#         job = JobPost.objects.get(id=job_id)

#         existing = SavedJob.objects.filter(user=user, job=job).first()
        
#         if existing:
#             existing.delete()
#             return {"status": "removed", "message": "Job removed from saved list"}
#         else:
#             SavedJob.objects.create(user=user, job=job)
#             return {"status": "saved", "message": "Job added to saved list"}

#     except (UserData.DoesNotExist, JobPost.DoesNotExist):
#         raise HTTPException(status_code=404, detail="User or Job not found")


# @router.post("/jobs/track-view")
# def track_job_view(user_id: int, job_id: int):
#     try:
#         user = UserData.objects.get(id=user_id)
#         job = JobPost.objects.get(id=job_id)
        
#         RecentlyViewedJob.objects.update_or_create(user=user, job=job)
#         return {"status": "success"}

#     except Exception:
#         raise HTTPException(status_code=404, detail="Error tracking view")


# # ==============================================================================
# #  4. FEEDS (Best Match, Saved, Recent)
# # ==============================================================================
# @router.get("/jobs/best-match/{user_id}")
# def get_best_match_jobs(user_id: int):
#     """
#     Returns jobs matching the user's skills.
#     """
#     try:
#         profile = CollaboratorProfile.objects.get(user_id=user_id)
        
#         # Safely get user skills
#         user_skills = getattr(profile, 'skills', [])
        
#         # Handle if stored as string by mistake in older DB entries
#         if isinstance(user_skills, str):
#             user_skills = [s.strip().lower() for s in user_skills.split(',') if s.strip()]
#         else:
#             # Ensure all lower case for comparison
#             user_skills = [s.lower() for s in user_skills]

#         # Add category as a keyword
#         if profile.skill_category:
#             user_skills.append(profile.skill_category.strip().lower())
        
#         if not user_skills:
#             return [] # No skills, no match

#         # Get all posted jobs
#         jobs = JobPost.objects.filter(status__iexact="posted").order_by('-created_at')
#         scored_jobs = []

#         for job in jobs:
#             score = 0
#             # Normalize job skills
#             job_skills = getattr(job, 'skills', [])
#             if isinstance(job_skills, str):
#                 job_skills = [s.strip().lower() for s in job_skills.split(',')]
#             else:
#                 job_skills = [s.lower() for s in job_skills]

#             job_title = job.title.lower()
#             job_desc = job.description.lower()

#             for my_skill in user_skills:
#                 # 10 Points: Exact Skill Match
#                 if my_skill in job_skills:
#                     score += 10
#                 # 5 Points: Skill in Title
#                 elif my_skill in job_title:
#                     score += 5
#                 # 2 Points: Skill in Description
#                 elif my_skill in job_desc:
#                     score += 2

#             if score > 0:
#                 scored_jobs.append({"job": job, "score": score})

#         # Sort by highest score
#         scored_jobs.sort(key=lambda x: x["score"], reverse=True)

#         return [
#             {
#                 "id": item["job"].id,
#                 "title": item["job"].title,
#                 "description": item["job"].description,
#                 "budget": f"{item['job'].budget_from} - {item['job'].budget_to}",
#                 "match_score": item["score"],
#                 "skills": item["job"].skills,
#                 "posted_at": item["job"].created_at.strftime("%d %b %Y")
#             }
#             for item in scored_jobs
#         ]

#     except CollaboratorProfile.DoesNotExist:
#         return [] # Return empty list if no profile found


# @router.get("/jobs/saved/{user_id}")
# def get_saved_jobs(user_id: int):
#     saved_entries = SavedJob.objects.filter(user_id=user_id).order_by('-saved_at')
    
#     return [
#         {
#             "id": entry.job.id,
#             "title": entry.job.title,
#             "description": entry.job.description,
#             "budget": f"{entry.job.budget_from} - {entry.job.budget_to}",
#             "saved_at": entry.saved_at.strftime("%d %b %Y"),
#             "skills": entry.job.skills
#         }
#         for entry in saved_entries
#     ]


# @router.get("/jobs/recent/{user_id}")
# def get_recent_jobs(user_id: int):
#     recent_entries = RecentlyViewedJob.objects.filter(user_id=user_id).order_by('-viewed_at')
    
#     return [
#         {
#             "id": entry.job.id,
#             "title": entry.job.title,
#             "description": entry.job.description,
#             "viewed_at": entry.viewed_at.strftime("%d %b %Y %H:%M"),
#             "skills": entry.job.skills
#         }
#         for entry in recent_entries
#     ]


# # ==============================================================================
# #  5. REVIEWS
# # ==============================================================================
# @router.post("/reviews/add-or-edit")
# def add_collaborator_review(
#     creator_id: int,
#     collaborator_id: int,
#     rating: int,
#     comment: str
# ):
#     try:
#         creator = UserData.objects.get(id=creator_id)
#         collaborator = UserData.objects.get(id=collaborator_id)

#         # 1. Security Check: Has completed work?
#         has_completed_work = Contract.objects.filter(
#             creator=creator,
#             collaborator=collaborator,
#             status__iexact="completed"
#         ).exists()

#         if not has_completed_work:
#             raise HTTPException(
#                 status_code=403,
#                 detail="You can only review collaborators you have completed work with."
#             )

#         # 2. Add/Edit Review
#         review, created = Review.objects.update_or_create(
#             reviewer=creator,
#             recipient=collaborator,
#             defaults={"rating": rating, "comment": comment}
#         )
        
#         # 3. Update Average Rating
#         try:
#             profile = CollaboratorProfile.objects.get(user=collaborator)
#             all_reviews = Review.objects.filter(recipient=collaborator)
#             if all_reviews.exists():
#                 avg = sum(r.rating for r in all_reviews) / all_reviews.count()
#                 profile.skills_rating = int(avg)
#                 profile.save()
#         except CollaboratorProfile.DoesNotExist:
#             pass

#         return {"status": "success", "message": "Review saved successfully"}

#     except UserData.DoesNotExist:
#         raise HTTPException(status_code=404, detail="User not found")


# @router.get("/reviews/list/{user_id}")
# def get_collaborator_reviews(user_id: int):
#     reviews = Review.objects.filter(recipient_id=user_id).order_by('-updated_at')
    
#     return [
#         {
#             "reviewer_name": f"{r.reviewer.first_name} {r.reviewer.last_name}",
#             "rating": r.rating,
#             "comment": r.comment,
#             "date": r.updated_at.strftime("%d %b %Y")
#         }
#         for r in reviews
#     ]


# import fastapi_app.django_setup
# from typing import Optional, List, Dict, Any
# from django.db.models import Q
# from fastapi import APIRouter, HTTPException, Form, UploadFile, File
# import random
# import string
# from pathlib import Path as PathLib
# from asgiref.sync import sync_to_async
# import os
# from django.conf import settings
# from fastapi.responses import FileResponse
# from fastapi.responses import StreamingResponse
# import mimetypes
# import json
# from datetime import datetime

# # Import your Django Models
# from creator_app.models import (
#     UserData, 
#     CollaboratorProfile, 
#     JobPost, 
#     SavedJob, 
#     RecentlyViewedJob, 
#     Contract, 
#     Review,
#     PortfolioItem
# )

# router = APIRouter(prefix="/collaborator", tags=["Collaborator"])

# FASTAPI_BASE_DIR = PathLib(__file__).resolve().parent.parent

# def generate_random_digits(length=6):
#     """Generate random digits for filename"""
#     return ''.join(random.choices(string.digits, k=length))

# # ==============================================================================
# #  FILE SERVER - FastAPI endpoint to serve files
# # ==============================================================================
# @router.get("/files/{file_path:path}")
# async def serve_file(file_path: str):
#     """
#     Serve files through FastAPI. This handles paths like:
#     /collaborator/files/profile_pics/filename.jpg
#     """
#     try:
#         # Security check: prevent directory traversal
#         if ".." in file_path or file_path.startswith("/"):
#             raise HTTPException(status_code=400, detail="Invalid file path")
        
#         # Define where files are stored
#         storage_base = FASTAPI_BASE_DIR.parent / "media"
        
#         # Alternative locations to check
#         possible_locations = [
#             storage_base / file_path,
#             FASTAPI_BASE_DIR / "media" / file_path,
#             FASTAPI_BASE_DIR / file_path,
#             FASTAPI_BASE_DIR.parent / file_path,
#         ]
        
#         # Try each location
#         for file_location in possible_locations:
#             if file_location.exists() and file_location.is_file():
#                 # Get MIME type
#                 mime_type, _ = mimetypes.guess_type(str(file_location))
#                 if not mime_type:
#                     mime_type = "application/octet-stream"
                
#                 # Return the file
#                 return FileResponse(
#                     path=str(file_location),
#                     media_type=mime_type,
#                     filename=file_location.name
#                 )
        
#         # File not found
#         raise HTTPException(status_code=404, detail=f"File not found: {file_path}")
        
#     except HTTPException:
#         raise
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Error serving file: {str(e)}")


# # ==============================================================================
# #  1. GET DYNAMIC FILTER OPTIONS
# # ==============================================================================
# @router.get("/filters")
# async def get_dynamic_filters():
#     try:
#         # Use sync_to_async for all database operations
#         niches = await sync_to_async(list)(CollaboratorProfile.objects.values_list('skill_category', flat=True).distinct())
#         locations = await sync_to_async(list)(CollaboratorProfile.objects.values_list('location', flat=True).distinct())
#         experiences = await sync_to_async(list)(CollaboratorProfile.objects.values_list('experience', flat=True).distinct())
#         collab_types = await sync_to_async(list)(CollaboratorProfile.objects.values_list('collaboration_type', flat=True).distinct())

#         return {
#             "niches": sorted([n for n in niches if n and n.strip()]),
#             "locations": sorted([l for l in locations if l and l.strip()]),
#             "experiences": sorted([e for e in experiences if e and e.strip()]),
#             "collaboration_types": sorted([c for c in collab_types if c and c.strip()])
#         }
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))


# # ==============================================================================
# #  2. SEARCH & FILTER (FIXED ASYNC ISSUE)
# # ==============================================================================
# @router.get("/search")
# async def search_collaborators(
#     search: Optional[str] = None,
#     skill_category: Optional[str] = None,
#     location: Optional[str] = None,
#     min_price: Optional[float] = None,
#     max_price: Optional[float] = None,
#     experience: Optional[str] = None,
#     language: Optional[str] = None,
#     availability: Optional[str] = None,
#     collaboration_type: Optional[str] = None,
#     audience: Optional[str] = None,
# ):
#     try:
#         # Get all profiles with select_related to optimize user access
#         profiles = await sync_to_async(list)(
#             CollaboratorProfile.objects.select_related('user').all()
#         )

#         # Filtering logic
#         filtered_profiles = []
#         for p in profiles:
#             include = True
            
#             # Text search
#             if search:
#                 search_lower = search.lower()
#                 name_match = search_lower in p.name.lower() if p.name else False
#                 skill_match = search_lower in p.skill_category.lower() if p.skill_category else False
                
#                 # Check skills if it's a string
#                 if not name_match and not skill_match:
#                     if isinstance(p.skills, str):
#                         skills_match = search_lower in p.skills.lower()
#                     elif isinstance(p.skills, list):
#                         skills_match = any(search_lower in str(skill).lower() for skill in p.skills)
#                     else:
#                         skills_match = False
                    
#                     if not skills_match:
#                         include = False
            
#             # Skill category filter
#             if skill_category and skill_category != "Niche":
#                 if not p.skill_category or p.skill_category.lower() != skill_category.lower():
#                     include = False
            
#             # Location filter
#             if location and location != "Location":
#                 if not p.location or location.lower() not in p.location.lower():
#                     include = False
            
#             # Price filter
#             if min_price is not None:
#                 if not p.pricing_amount or p.pricing_amount < min_price:
#                     include = False
            
#             if max_price is not None:
#                 if not p.pricing_amount or p.pricing_amount > max_price:
#                     include = False
            
#             # Experience filter
#             if experience and experience != "Audience":
#                 if not p.experience or p.experience.lower() != experience.lower():
#                     include = False
            
#             # Language filter
#             if language:
#                 if not p.language or language.lower() not in p.language.lower():
#                     include = False
            
#             # Availability filter
#             if availability:
#                 if not p.availability or availability.lower() not in p.availability.lower():
#                     include = False
            
#             # Collaboration type filter
#             if collaboration_type:
#                 if not p.collaboration_type or collaboration_type.lower() != p.collaboration_type.lower():
#                     include = False
            
#             # Audience/followers filter
#             if audience and audience != "Audience":
#                 def parse_k(val):
#                     if not val: return 0
#                     val = val.lower().replace('+', '').strip()
#                     try:
#                         if 'k' in val:
#                             return int(float(val.replace('k', '')) * 1000)
#                         if 'm' in val:
#                             return int(float(val.replace('m', '')) * 1000000)
#                         return int(val) if val.isdigit() else 0
#                     except ValueError:
#                         return 0

#                 try:
#                     min_f = 0
#                     max_f = None

#                     if '-' in audience:
#                         parts = audience.split('-')
#                         min_f = parse_k(parts[0])
#                         max_f = parse_k(parts[1])
#                     elif '+' in audience:
#                         min_f = parse_k(audience)
                    
#                     if min_f and (not p.followers or p.followers < min_f):
#                         include = False
#                     if max_f and (not p.followers or p.followers > max_f):
#                         include = False
                        
#                 except ValueError:
#                     pass
            
#             if include:
#                 filtered_profiles.append(p)

#         # Construct response
#         data = []
#         for p in filtered_profiles:
#             # Get profile picture URL - safely access user
#             profile_pic_url = None
#             if p.user and p.user.profile_picture:
#                 try:
#                     profile_pic_url = f"/collaborator/files/{p.user.profile_picture.name}"
#                 except Exception as e:
#                     print(f"DEBUG: Error getting profile picture: {e}")
#                     profile_pic_url = None
            
#             # Get portfolio items with headings
#             portfolio_items = await sync_to_async(list)(
#                 PortfolioItem.objects.filter(collaborator=p).order_by('order')
#             )
            
#             portfolio_data = []
#             for item in portfolio_items:
#                 portfolio_data.append({
#                     "id": item.id,
#                     "heading": item.heading,
#                     "file_url": f"/collaborator/files/{item.file.name}",
#                     "original_filename": item.file.name.split('/')[-1] if '/' in item.file.name else item.file.name,
#                     "upload_date": item.upload_date.strftime("%Y-%m-%d")
#                 })

#             # Format pricing
#             pricing_str = ""
#             if p.pricing_amount:
#                 pricing_str = f"{int(p.pricing_amount) if p.pricing_amount == int(p.pricing_amount) else p.pricing_amount}{p.pricing_unit or '$'}"
#             else:
#                 pricing_str = f"0{p.pricing_unit or '$'}" if p.pricing_unit else "0$"

#             data.append({
#                 "id": p.id,
#                 "user_id": p.user.id if p.user else None,
#                 "email": p.user.email if p.user else None,
#                 "name": p.name,
#                 "skill_category": p.skill_category,
#                 "skills": p.skills,
#                 "pricing": pricing_str,
#                 "location": p.location,
#                 "experience": p.experience,
#                 "language": p.language,
#                 "availability": p.availability,
#                 "collaboration_type": p.collaboration_type,
#                 "followers": p.followers if p.followers else 0,
#                 "about": p.about if p.about else "No description available.",
#                 "rating": p.skills_rating if p.skills_rating else 0,
#                 "social_link": p.social_link,
#                 "portfolio_link": p.portfolio_link,
#                 "profile_pic": profile_pic_url,
#                 "portfolio_items": portfolio_data,
#             })

#         return data

#     except Exception as e:
#         print(f"ERROR in search_collaborators: {str(e)}")
#         raise HTTPException(status_code=500, detail=f"Error searching collaborators: {str(e)}")


# # ==============================================================================
# #  3. PROFILE MANAGEMENT (Updated for multiple portfolio uploads)
# # ==============================================================================
# @router.post("/save/{user_id}")
# async def save_collaborator_profile(
#     user_id: int,
#     name: str = Form(...),
#     language: Optional[str] = Form(None),
#     skill_category: str = Form(...),
#     experience: str = Form(...),
#     skills: Optional[str] = Form(None),
#     pricing_amount: Optional[str] = Form(None),
#     pricing_unit: Optional[str] = Form(None),
#     availability: Optional[str] = Form(None),
#     timing: Optional[str] = Form(None),
#     portfolio_category: Optional[str] = Form(None),
#     social_link: Optional[str] = Form(None),
#     badges: Optional[str] = Form(None),
#     about: Optional[str] = Form(None),
#     location: str = Form(...),
#     skills_rating: Optional[int] = Form(None),
#     collaboration_type: Optional[str] = Form(None),
#     followers: Optional[int] = Form(None),
    
#     # Portfolio files and headings (up to 5)
#     portfolio_headings: List[str] = Form([]),
#     portfolio_files: List[UploadFile] = File([]),
#     profile_picture: Optional[UploadFile] = File(None),
# ):
#     try:
#         user = await sync_to_async(UserData.objects.get)(id=user_id)
#     except UserData.DoesNotExist:
#         raise HTTPException(status_code=404, detail="User not found")

#     random_digits = generate_random_digits()
#     name_prefix = f"collaborator_{user_id}_"

#     # --- Handle Profile Picture Upload ---
#     if profile_picture:
#         storage_dir = FASTAPI_BASE_DIR.parent / "media" / "profile_pics"
#         storage_dir.mkdir(parents=True, exist_ok=True)
        
#         ext = PathLib(profile_picture.filename).suffix
#         filename = f"{name_prefix}{random_digits}_profile{ext}"
#         file_path = storage_dir / filename
        
#         with open(file_path, "wb") as f:
#             content = await profile_picture.read()
#             f.write(content)
        
#         user.profile_picture.name = f"profile_pics/{filename}"
#         await sync_to_async(user.save)()

#     # --- Data Parsing ---
#     skills_list = [s.strip() for s in skills.split(',')] if skills else []
    
#     pricing_decimal = None
#     if pricing_amount:
#         try:
#             pricing_decimal = float(pricing_amount)
#         except ValueError:
#             pass

#     # --- Create or Update Collaborator Profile ---
#     profile, created = await sync_to_async(
#         lambda: CollaboratorProfile.objects.update_or_create(
#             user=user,
#             defaults={
#                 "name": name,
#                 "language": language,
#                 "skill_category": skill_category,
#                 "experience": experience,
#                 "skills": skills_list,
#                 "pricing_amount": pricing_decimal,
#                 "pricing_unit": pricing_unit,
#                 "availability": availability,
#                 "timing": timing,
#                 "portfolio_category": portfolio_category,
#                 "social_link": social_link,
#                 "badges": badges,
#                 "skills_rating": skills_rating,
#                 "about": about,
#                 "location": location,
#                 "collaboration_type": collaboration_type,
#                 "followers": followers,
#             }
#         )
#     )()

#     # --- Handle Portfolio Files Upload (up to 5) ---
#     portfolio_items_created = []
    
#     # Limit to 5 files
#     max_files = min(len(portfolio_files), 5)
    
#     for i in range(max_files):
#         portfolio_file = portfolio_files[i]
#         heading = portfolio_headings[i] if i < len(portfolio_headings) else f"Portfolio Item {i+1}"
        
#         if portfolio_file and portfolio_file.filename:
#             # Save to FastAPI storage location
#             storage_dir = FASTAPI_BASE_DIR.parent / "media" / "collaborator" / "portfolio_items"
#             storage_dir.mkdir(parents=True, exist_ok=True)
            
#             ext = PathLib(portfolio_file.filename).suffix
#             filename = f"{name_prefix}{random_digits}_portfolio_{i}{ext}"
#             file_path = storage_dir / filename
            
#             print(f"DEBUG: Saving portfolio file {i+1} to: {file_path}")
            
#             with open(file_path, "wb") as f:
#                 content = await portfolio_file.read()
#                 f.write(content)
            
#             # Create PortfolioItem record
#             portfolio_item = await sync_to_async(PortfolioItem.objects.create)(
#                 collaborator=profile,
#                 heading=heading,
#                 file=f"collaborator/portfolio_items/{filename}",
#                 order=i
#             )
#             portfolio_items_created.append(portfolio_item)

#     user.role = "collaborator"
#     await sync_to_async(user.save)()

#     return {
#         "message": "Collaborator profile saved successfully",
#         "portfolio_count": len(portfolio_items_created),
#         "profile_id": profile.id
#     }


# @router.get("/get/{user_id}")
# async def get_collaborator_profile(user_id: int):
#     try:
#         user = await sync_to_async(UserData.objects.get)(id=user_id)
#         profile = await sync_to_async(CollaboratorProfile.objects.get)(user=user)
#     except (UserData.DoesNotExist, CollaboratorProfile.DoesNotExist):
#         raise HTTPException(status_code=404, detail="Profile not found")

#     # Get portfolio items
#     portfolio_items = await sync_to_async(list)(
#         PortfolioItem.objects.filter(collaborator=profile).order_by('order')
#     )
    
#     portfolio_data = []
#     for item in portfolio_items:
#         portfolio_data.append({
#             "id": item.id,
#             "heading": item.heading,
#             "file_url": f"/collaborator/files/{item.file.name}",
#             "original_filename": item.file.name.split('/')[-1] if '/' in item.file.name else item.file.name,
#             "upload_date": item.upload_date.strftime("%Y-%m-%d %H:%M:%S"),
#             "order": item.order
#         })

#     # Get profile picture URL
#     profile_pic_url = None
#     if user.profile_picture:
#         try:
#             profile_pic_url = f"/collaborator/files/{user.profile_picture.name}"
#         except:
#             pass

#     return {
#         "user_id": user_id,
#         "email": user.email,
#         "name": profile.name,
#         "language": profile.language,
#         "skill_category": profile.skill_category,
#         "skills": profile.skills,
#         "experience": profile.experience,
#         "pricing_amount": profile.pricing_amount,
#         "pricing_unit": profile.pricing_unit,
#         "availability": profile.availability,
#         "timing": profile.timing,
#         "social_link": profile.social_link,
#         "portfolio_link": profile.portfolio_link,
#         "badges": profile.badges,
#         "skills_rating": profile.skills_rating,
#         "about": profile.about,
#         "location": profile.location,
#         "collaboration_type": profile.collaboration_type,
#         "followers": profile.followers,
#         "profile_picture_url": profile_pic_url,
#         "portfolio_items": portfolio_data,
#     }


# @router.put("/edit/{user_id}")
# async def edit_collaborator_profile(
#     user_id: int,
#     name: Optional[str] = Form(None),
#     language: Optional[str] = Form(None),
#     skill_category: Optional[str] = Form(None),
#     experience: Optional[str] = Form(None),
#     skills: Optional[str] = Form(None),
#     pricing_amount: Optional[str] = Form(None),
#     pricing_unit: Optional[str] = Form(None),
#     availability: Optional[str] = Form(None),
#     timing: Optional[str] = Form(None),
#     social_link: Optional[str] = Form(None),
#     portfolio_link: Optional[str] = Form(None),
#     badges: Optional[str] = Form(None),
#     about: Optional[str] = Form(None),
#     location: Optional[str] = Form(None),
#     collaboration_type: Optional[str] = Form(None),
#     followers: Optional[int] = Form(None),
#     skills_rating: Optional[int] = Form(None),
    
#     # Portfolio updates
#     portfolio_headings: List[str] = Form([]),
#     portfolio_files: List[UploadFile] = File([]),
#     profile_picture: Optional[UploadFile] = File(None),
    
#     # Delete existing portfolio items (send list of IDs to delete)
#     delete_portfolio_ids: List[str] = Form([]),
# ):
#     try:
#         user = await sync_to_async(UserData.objects.get)(id=user_id)
#         profile = await sync_to_async(CollaboratorProfile.objects.get)(user=user)
#     except (UserData.DoesNotExist, CollaboratorProfile.DoesNotExist):
#         raise HTTPException(status_code=404, detail="Collaborator profile not found")

#     random_digits = generate_random_digits()
#     name_prefix = f"collaborator_{user_id}_"

#     # --- Handle Profile Picture Update ---
#     if profile_picture and profile_picture.filename:
#         storage_dir = FASTAPI_BASE_DIR.parent / "media" / "profile_pics"
#         storage_dir.mkdir(parents=True, exist_ok=True)
        
#         ext = PathLib(profile_picture.filename).suffix
#         filename = f"{name_prefix}{random_digits}_profile{ext}"
#         file_path = storage_dir / filename
        
#         with open(file_path, "wb") as f:
#             content = await profile_picture.read()
#             f.write(content)
        
#         user.profile_picture.name = f"profile_pics/{filename}"
#         await sync_to_async(user.save)()

#     # --- Update Profile Fields ---
#     update_fields = []
    
#     if name is not None: 
#         profile.name = name
#         update_fields.append('name')
#     if language is not None: 
#         profile.language = language
#         update_fields.append('language')
#     if skill_category is not None: 
#         profile.skill_category = skill_category
#         update_fields.append('skill_category')
#     if experience is not None: 
#         profile.experience = experience
#         update_fields.append('experience')
#     if skills is not None: 
#         profile.skills = [s.strip() for s in skills.split(',') if s.strip()]
#         update_fields.append('skills')
#     if pricing_amount is not None: 
#         try:
#             profile.pricing_amount = float(pricing_amount)
#             update_fields.append('pricing_amount')
#         except ValueError:
#             pass
#     if pricing_unit is not None: 
#         profile.pricing_unit = pricing_unit
#         update_fields.append('pricing_unit')
#     if availability is not None: 
#         profile.availability = availability
#         update_fields.append('availability')
#     if timing is not None: 
#         profile.timing = timing
#         update_fields.append('timing')
#     if social_link is not None: 
#         profile.social_link = social_link
#         update_fields.append('social_link')
#     if portfolio_link is not None: 
#         profile.portfolio_link = portfolio_link
#         update_fields.append('portfolio_link')
#     if badges is not None: 
#         profile.badges = badges
#         update_fields.append('badges')
#     if about is not None: 
#         profile.about = about
#         update_fields.append('about')
#     if location is not None: 
#         profile.location = location
#         update_fields.append('location')
#     if collaboration_type is not None: 
#         profile.collaboration_type = collaboration_type
#         update_fields.append('collaboration_type')
#     if followers is not None: 
#         profile.followers = followers
#         update_fields.append('followers')
#     if skills_rating is not None: 
#         profile.skills_rating = skills_rating
#         update_fields.append('skills_rating')
    
#     if update_fields:
#         await sync_to_async(profile.save)(update_fields=update_fields)

#     # --- Delete Portfolio Items ---
#     if delete_portfolio_ids:
#         for item_id in delete_portfolio_ids:
#             try:
#                 await sync_to_async(PortfolioItem.objects.filter(id=int(item_id), collaborator=profile).delete)()
#             except:
#                 pass

#     # --- Add New Portfolio Items ---
#     new_portfolio_count = 0
#     if portfolio_files and any(f.filename for f in portfolio_files):
#         # Get current count to determine order
#         current_count = await sync_to_async(lambda: PortfolioItem.objects.filter(collaborator=profile).count())()
        
#         # Limit to 5 total items
#         max_new_files = min(len(portfolio_files), 5 - current_count)
        
#         for i in range(max_new_files):
#             portfolio_file = portfolio_files[i]
#             if portfolio_file and portfolio_file.filename:
#                 heading = portfolio_headings[i] if i < len(portfolio_headings) else f"Portfolio Item {current_count + i + 1}"
                
#                 storage_dir = FASTAPI_BASE_DIR.parent / "media" / "collaborator" / "portfolio_items"
#                 storage_dir.mkdir(parents=True, exist_ok=True)
                
#                 ext = PathLib(portfolio_file.filename).suffix
#                 filename = f"{name_prefix}{random_digits}_portfolio_new_{i}{ext}"
#                 file_path = storage_dir / filename
                
#                 with open(file_path, "wb") as f:
#                     content = await portfolio_file.read()
#                     f.write(content)
                
#                 # Create PortfolioItem
#                 await sync_to_async(PortfolioItem.objects.create)(
#                     collaborator=profile,
#                     heading=heading,
#                     file=f"collaborator/portfolio_items/{filename}",
#                     order=current_count + i
#                 )
#                 new_portfolio_count += 1

#     return {
#         "message": "Collaborator profile updated successfully",
#         "new_portfolio_items_added": new_portfolio_count,
#         "portfolio_items_deleted": len(delete_portfolio_ids)
#     }


# # ==============================================================================
# #  4. PORTFOLIO MANAGEMENT ENDPOINTS
# # ==============================================================================
# @router.delete("/portfolio/item/{item_id}")
# async def delete_portfolio_item(item_id: int):
#     """Delete a specific portfolio item"""
#     try:
#         await sync_to_async(PortfolioItem.objects.filter(id=item_id).delete)()
#         return {"message": "Portfolio item deleted successfully"}
#     except Exception as e:
#         raise HTTPException(status_code=400, detail=str(e))


# @router.put("/portfolio/item/{item_id}")
# async def update_portfolio_item(
#     item_id: int,
#     heading: Optional[str] = Form(None),
#     order: Optional[int] = Form(None),
#     new_file: Optional[UploadFile] = File(None),
# ):
#     """Update portfolio item heading, order, or file"""
#     try:
#         item = await sync_to_async(PortfolioItem.objects.get)(id=item_id)
        
#         if heading is not None:
#             item.heading = heading
        
#         if order is not None:
#             item.order = order
        
#         if new_file and new_file.filename:
#             # Delete old file
#             old_file_path = FASTAPI_BASE_DIR.parent / "media" / item.file.name
#             if old_file_path.exists():
#                 old_file_path.unlink()
            
#             # Save new file
#             random_digits = generate_random_digits()
#             user_id = item.collaborator.user.id
#             name_prefix = f"collaborator_{user_id}_"
            
#             storage_dir = FASTAPI_BASE_DIR.parent / "media" / "collaborator" / "portfolio_items"
#             storage_dir.mkdir(parents=True, exist_ok=True)
            
#             ext = PathLib(new_file.filename).suffix
#             filename = f"{name_prefix}{random_digits}_updated{ext}"
#             file_path = storage_dir / filename
            
#             with open(file_path, "wb") as f:
#                 content = await new_file.read()
#                 f.write(content)
            
#             item.file.name = f"collaborator/portfolio_items/{filename}"
        
#         await sync_to_async(item.save)()
        
#         return {
#             "message": "Portfolio item updated successfully",
#             "item_id": item_id
#         }
        
#     except PortfolioItem.DoesNotExist:
#         raise HTTPException(status_code=404, detail="Portfolio item not found")
#     except Exception as e:
#         raise HTTPException(status_code=400, detail=str(e))


# # ==============================================================================
# #  REST OF THE ENDPOINTS (Keep as is but make async where needed)
# # ==============================================================================
# @router.delete("/delete/{user_id}")
# async def delete_collaborator_profile(user_id: int):
#     try:
#         user = await sync_to_async(UserData.objects.get)(id=user_id)
        
#         # Delete portfolio items first
#         try:
#             profile = await sync_to_async(CollaboratorProfile.objects.get)(user=user)
#             await sync_to_async(PortfolioItem.objects.filter(collaborator=profile).delete)()
#             await sync_to_async(profile.delete)()
#         except CollaboratorProfile.DoesNotExist:
#             pass
        
#         return {"message": "Collaborator profile deleted"}
#     except UserData.DoesNotExist:
#         raise HTTPException(status_code=404, detail="Profile not found")


# @router.get("/list")
# async def list_collaborators():
#     profiles = await sync_to_async(list)(CollaboratorProfile.objects.select_related('user').all())
#     return [
#         {
#             "user_id": p.user.id if p.user else None,
#             "email": p.user.email if p.user else None,
#             "name": p.name,
#             "skill_category": p.skill_category,
#             "location": p.location,
#             "collaboration_type": p.collaboration_type,
#         }
#         for p in profiles
#     ]


# # ==============================================================================
# #  5. JOB ACTIONS (Updated to async)
# # ==============================================================================
# @router.post("/jobs/toggle-save")
# async def toggle_save_job(user_id: int, job_id: int):
#     try:
#         user = await sync_to_async(UserData.objects.get)(id=user_id)
#         job = await sync_to_async(JobPost.objects.get)(id=job_id)
#         existing = await sync_to_async(lambda: SavedJob.objects.filter(user=user, job=job).first())()
#         if existing:
#             await sync_to_async(existing.delete)()
#             return {"status": "removed", "message": "Job removed from saved list"}
#         else:
#             await sync_to_async(SavedJob.objects.create)(user=user, job=job)
#             return {"status": "saved", "message": "Job added to saved list"}
#     except (UserData.DoesNotExist, JobPost.DoesNotExist):
#         raise HTTPException(status_code=404, detail="User or Job not found")


# @router.post("/jobs/track-view")
# async def track_job_view(user_id: int, job_id: int):
#     try:
#         user = await sync_to_async(UserData.objects.get)(id=user_id)
#         job = await sync_to_async(JobPost.objects.get)(id=job_id)
#         await sync_to_async(RecentlyViewedJob.objects.update_or_create)(user=user, job=job)
#         return {"status": "success"}
#     except Exception as e:
#         print(f"Error tracking view: {e}")
#         raise HTTPException(status_code=404, detail="Error tracking view")


# # ==============================================================================
# #  6. FEEDS (Updated to async)
# # ==============================================================================
# @router.get("/jobs/best-match/{user_id}")
# async def get_best_match_jobs(user_id: int):
#     try:
#         profile = await sync_to_async(CollaboratorProfile.objects.get)(user_id=user_id)
#         user_skills = getattr(profile, 'skills', [])
        
#         if isinstance(user_skills, str):
#             user_skills = [s.strip().lower() for s in user_skills.split(',') if s.strip()]
#         else:
#             user_skills = [s.lower() for s in user_skills]

#         if profile.skill_category:
#             user_skills.append(profile.skill_category.strip().lower())
        
#         if not user_skills: return []

#         jobs = await sync_to_async(list)(JobPost.objects.filter(status__iexact="posted").order_by('-created_at'))
#         scored_jobs = []

#         for job in jobs:
#             score = 0
#             job_skills = getattr(job, 'skills', [])
#             if isinstance(job_skills, str):
#                 job_skills = [s.strip().lower() for s in job_skills.split(',')]
#             else:
#                 job_skills = [s.lower() for s in job_skills]

#             job_title = job.title.lower()
#             job_desc = job.description.lower()

#             for my_skill in user_skills:
#                 if my_skill in job_skills: score += 10
#                 elif my_skill in job_title: score += 5
#                 elif my_skill in job_desc: score += 2

#             if score > 0:
#                 scored_jobs.append({"job": job, "score": score})

#         scored_jobs.sort(key=lambda x: x["score"], reverse=True)

#         return [
#             {
#                 "id": item["job"].id,
#                 "title": item["job"].title,
#                 "description": item["job"].description,
#                 "budget": f"{item['job'].budget_from} - {item['job'].budget_to}",
#                 "match_score": item["score"],
#                 "skills": item["job"].skills,
#                 "posted_at": item["job"].created_at.strftime("%d %b %Y")
#             }
#             for item in scored_jobs
#         ]
#     except CollaboratorProfile.DoesNotExist:
#         return []


# @router.get("/jobs/saved/{user_id}")
# async def get_saved_jobs(user_id: int):
#     saved_entries = await sync_to_async(list)(SavedJob.objects.filter(user_id=user_id).order_by('-saved_at'))
#     return [
#         {
#             "id": entry.job.id,
#             "title": entry.job.title,
#             "description": entry.job.description,
#             "budget": f"{entry.job.budget_from} - {entry.job.budget_to}",
#             "saved_at": entry.saved_at.strftime("%d %b %Y"),
#             "skills": entry.job.skills
#         }
#         for entry in saved_entries
#     ]


# @router.get("/jobs/recent/{user_id}")
# async def get_recent_jobs(user_id: int):
#     recent_entries = await sync_to_async(list)(RecentlyViewedJob.objects.filter(user_id=user_id).order_by('-viewed_at'))
#     return [
#         {
#             "id": entry.job.id,
#             "title": entry.job.title,
#             "description": entry.job.description,
#             "viewed_at": entry.viewed_at.strftime("%d %b %Y %H:%M"),
#             "skills": entry.job.skills
#         }
#         for entry in recent_entries
#     ]


# # ==============================================================================
# #  7. REVIEWS (Updated to async)
# # ==============================================================================
# @router.post("/reviews/add-or-edit")
# async def add_collaborator_review(creator_id: int, collaborator_id: int, rating: int, comment: str):
#     try:
#         creator = await sync_to_async(UserData.objects.get)(id=creator_id)
#         collaborator = await sync_to_async(UserData.objects.get)(id=collaborator_id)
#         has_completed_work = await sync_to_async(
#             lambda: Contract.objects.filter(
#                 creator=creator, collaborator=collaborator, status__iexact="completed"
#             ).exists()
#         )()

#         if not has_completed_work:
#             raise HTTPException(status_code=403, detail="No completed work found.")

#         review, _ = await sync_to_async(Review.objects.update_or_create)(
#             reviewer=creator, recipient=collaborator,
#             defaults={"rating": rating, "comment": comment}
#         )
        
#         # Update Avg Rating
#         try:
#             profile = await sync_to_async(CollaboratorProfile.objects.get)(user=collaborator)
#             all_reviews = await sync_to_async(list)(Review.objects.filter(recipient=collaborator))
#             if all_reviews:
#                 avg = sum(r.rating for r in all_reviews) / len(all_reviews)
#                 profile.skills_rating = int(avg)
#                 await sync_to_async(profile.save)()
#         except CollaboratorProfile.DoesNotExist:
#             pass

#         return {"status": "success", "message": "Review saved"}
#     except UserData.DoesNotExist:
#         raise HTTPException(status_code=404, detail="User not found")


# @router.get("/reviews/list/{user_id}")
# async def get_collaborator_reviews(user_id: int):
#     reviews = await sync_to_async(list)(Review.objects.filter(recipient_id=user_id).order_by('-updated_at'))
#     return [
#         {
#             "reviewer_name": f"{r.reviewer.first_name} {r.reviewer.last_name}",
#             "rating": r.rating,
#             "comment": r.comment,
#             "date": r.updated_at.strftime("%d %b %Y")
#         }
#         for r in reviews
#     ]
import fastapi_app.django_setup
from typing import Optional, List, Dict, Any
from django.db.models import Q
from fastapi import APIRouter, HTTPException, Form, UploadFile, File
import random
import string
from pathlib import Path as PathLib
from asgiref.sync import sync_to_async
import os
from django.conf import settings
from fastapi.responses import FileResponse
from fastapi.responses import StreamingResponse
import mimetypes
import json
from datetime import datetime
from django.core.files.base import ContentFile
from django.db.models import Avg, Count

# Import your Django Models
from creator_app.models import (
    UserData, 
    CollaboratorProfile, 
    JobPost, 
    SavedJob, 
    RecentlyViewedJob, 
    Contract, 
    Review,
    PortfolioItem,
    CreatorProfile
)

router = APIRouter(prefix="/collaborator", tags=["Collaborator"])

FASTAPI_BASE_DIR = PathLib(__file__).resolve().parent.parent

def get_country_code(country_name: str) -> str:
    """Simple mapping for country codes"""
    country_map = {
        "United States": "us",
        "USA": "us",
        "United Kingdom": "gb",
        "UK": "gb",
        "Canada": "ca",
        "Australia": "au",
        "Germany": "de",
        "France": "fr",
        "India": "in",
    }
    return country_map.get(country_name, country_name[:2].lower() if country_name else "us")

def generate_random_digits(length=4):
    """Generate random digits for filename"""
    return ''.join(random.choices(string.digits, k=length))

# ==============================================================================
#  FILE SERVER - FastAPI endpoint to serve files
# ==============================================================================
@router.get("/files/{file_path:path}")
async def serve_file(file_path: str):
    """
    Serve files through FastAPI. This handles paths like:
    /collaborator/files/profile_pics/filename.jpg
    /collaborator/files/portfolio_uploads/collaborator/filename.jpg
    """
    try:
        # Security check: prevent directory traversal
        if ".." in file_path or file_path.startswith("/"):
            raise HTTPException(status_code=400, detail="Invalid file path")
        
        # Define where files are stored
        storage_base = FASTAPI_BASE_DIR.parent / "media"
        
        # Alternative locations to check
        possible_locations = [
            storage_base / file_path,
            FASTAPI_BASE_DIR / "media" / file_path,
            FASTAPI_BASE_DIR / file_path,
            FASTAPI_BASE_DIR.parent / file_path,
        ]
        
        # Try each location
        for file_location in possible_locations:
            if file_location.exists() and file_location.is_file():
                # Get MIME type
                mime_type, _ = mimetypes.guess_type(str(file_location))
                if not mime_type:
                    mime_type = "application/octet-stream"
                
                # Return the file
                return FileResponse(
                    path=str(file_location),
                    media_type=mime_type,
                    filename=file_location.name
                )
        
        # File not found
        raise HTTPException(status_code=404, detail=f"File not found: {file_path}")
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error serving file: {str(e)}")


# ==============================================================================
#  1. GET DYNAMIC FILTER OPTIONS
# ==============================================================================
@router.get("/filters")
async def get_dynamic_filters():
    try:
        # Use sync_to_async for all database operations
        niches = await sync_to_async(list)(CollaboratorProfile.objects.values_list('skill_category', flat=True).distinct())
        locations = await sync_to_async(list)(CollaboratorProfile.objects.values_list('location', flat=True).distinct())
        experiences = await sync_to_async(list)(CollaboratorProfile.objects.values_list('experience', flat=True).distinct())
        collab_types = await sync_to_async(list)(CollaboratorProfile.objects.values_list('collaboration_type', flat=True).distinct())

        return {
            "niches": sorted([n for n in niches if n and n.strip()]),
            "locations": sorted([l for l in locations if l and l.strip()]),
            "experiences": sorted([e for e in experiences if e and e.strip()]),
            "collaboration_types": sorted([c for c in collab_types if c and c.strip()])
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ==============================================================================
#  2. SEARCH & FILTER
# ==============================================================================
@router.get("/search")
async def search_collaborators(
    search: Optional[str] = None,
    skill_category: Optional[str] = None,
    location: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    experience: Optional[str] = None,
    language: Optional[str] = None,
    availability: Optional[str] = None,
    collaboration_type: Optional[str] = None,
    audience: Optional[str] = None,
):
    try:
        # Get all profiles with select_related to optimize user access
        profiles = await sync_to_async(list)(
            CollaboratorProfile.objects.select_related('user').all()
        )

        # Filtering logic
        filtered_profiles = []
        for p in profiles:
            include = True
            
            # Text search
            if search:
                search_lower = search.lower()
                name_match = search_lower in p.name.lower() if p.name else False
                skill_match = search_lower in p.skill_category.lower() if p.skill_category else False
                
                # Check skills if it's a string or list
                if not name_match and not skill_match:
                    if isinstance(p.skills, str):
                        skills_match = search_lower in p.skills.lower()
                    elif isinstance(p.skills, list):
                        skills_match = any(search_lower in str(skill).lower() for skill in p.skills)
                    else:
                        skills_match = False
                    
                    if not skills_match:
                        include = False
            
            # Skill category filter
            if skill_category and skill_category != "Niche":
                if not p.skill_category or p.skill_category.lower() != skill_category.lower():
                    include = False
            
            # Location filter
            if location and location != "Location":
                if not p.location or location.lower() not in p.location.lower():
                    include = False
            
            # Price filter
            if min_price is not None:
                if not p.pricing_amount or p.pricing_amount < min_price:
                    include = False
            
            if max_price is not None:
                if not p.pricing_amount or p.pricing_amount > max_price:
                    include = False
            
            # Experience filter
            if experience and experience != "Experience":
                if not p.experience or p.experience.lower() != experience.lower():
                    include = False
            
            # Language filter
            if language:
                if not p.language or language.lower() not in p.language.lower():
                    include = False
            
            # Availability filter
            if availability:
                if not p.availability or availability.lower() not in p.availability.lower():
                    include = False
            
            # Collaboration type filter
            if collaboration_type and collaboration_type != "Collaboration Type":
                if not p.collaboration_type or collaboration_type.lower() != p.collaboration_type.lower():
                    include = False
            
            # Audience/followers filter
            if audience and audience != "Audience":
                def parse_k(val):
                    if not val: return 0
                    val = val.lower().replace('+', '').strip()
                    try:
                        if 'k' in val:
                            return int(float(val.replace('k', '')) * 1000)
                        if 'm' in val:
                            return int(float(val.replace('m', '')) * 1000000)
                        return int(val) if val.isdigit() else 0
                    except ValueError:
                        return 0

                try:
                    min_f = 0
                    max_f = None

                    if '-' in audience:
                        parts = audience.split('-')
                        min_f = parse_k(parts[0])
                        max_f = parse_k(parts[1])
                    elif '+' in audience:
                        min_f = parse_k(audience)
                    
                    if min_f and (not p.followers or p.followers < min_f):
                        include = False
                    if max_f and (not p.followers or p.followers > max_f):
                        include = False
                        
                except ValueError:
                    pass
            
            if include:
                filtered_profiles.append(p)

        # Construct response
        data = []
        for p in filtered_profiles:
            # Get profile picture URL - safely access user
            profile_pic_url = None
            if p.user and p.user.profile_picture:
                try:
                    profile_pic_url = f"/collaborator/files/{p.user.profile_picture.name}"
                except Exception:
                    profile_pic_url = None
            
            # Get portfolio items using the PortfolioItem model
            portfolio_items = await sync_to_async(list)(
                PortfolioItem.objects.filter(
                    user=p.user,
                    role="collaborator"
                ).order_by('order', '-created_at')
            )
            
            portfolio_data = []
            for item in portfolio_items:
                file_url = None
                if item.file:
                    file_url = f"/collaborator/files/{item.file.name}"
                
                portfolio_data.append({
                    "id": item.id,
                    "heading": item.description,  # Using description as heading
                    "description": item.description,
                    "media_link": item.media_link,
                    "file_url": file_url,
                    "original_filename": item.file.name.split('/')[-1] if item.file and '/' in item.file.name else (item.file.name if item.file else None),
                    "upload_date": item.created_at.strftime("%Y-%m-%d") if hasattr(item, 'created_at') else datetime.now().strftime("%Y-%m-%d")
                })

            # Format pricing
            pricing_str = ""
            if p.pricing_amount:
                pricing_str = f"{int(p.pricing_amount) if p.pricing_amount == int(p.pricing_amount) else p.pricing_amount}{p.pricing_unit or '$'}"
            else:
                pricing_str = f"0{p.pricing_unit or '$'}" if p.pricing_unit else "0$"

            data.append({
                "id": p.id,
                "user_id": p.user.id if p.user else None,
                "email": p.user.email if p.user else None,
                "name": p.name,
                "skill_category": p.skill_category,
                "skills": p.skills,
                "pricing": pricing_str,
                "location": p.location,
                "experience": p.experience,
                "language": p.language,
                "availability": p.availability,
                "collaboration_type": p.collaboration_type,
                "followers": p.followers if p.followers else 0,
                "about": p.about if p.about else "No description available.",
                "rating": p.skills_rating if p.skills_rating else 0,
                "social_link": p.social_link,
                "portfolio_link": p.portfolio_link,
                "profile_pic": profile_pic_url,
                "portfolio_items": portfolio_data,
            })

        return data

    except Exception as e:
        print(f"ERROR in search_collaborators: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error searching collaborators: {str(e)}")


# ==============================================================================
#  3. PROFILE MANAGEMENT - COMPLETELY FIXED - NO TITLE FIELD
# ==============================================================================
@router.post("/save/{user_id}")
async def save_collaborator_profile(
    user_id: int,
    name: str = Form(...),
    language: Optional[str] = Form(None),
    skill_category: str = Form(...),
    experience: str = Form(...),
    skills: Optional[str] = Form(None),
    pricing_amount: Optional[str] = Form(None),
    pricing_unit: Optional[str] = Form(None),
    availability: Optional[str] = Form(None),
    timing: Optional[str] = Form(None),
    portfolio_category: Optional[str] = Form(None),
    social_link: Optional[str] = Form(None),
    badges: Optional[str] = Form(None),
    about: Optional[str] = Form(None),
    location: str = Form(...),
    skills_rating: Optional[int] = Form(None),
    collaboration_type: Optional[str] = Form(None),
    followers: Optional[int] = Form(None),
    
    # Portfolio files and headings (up to 5)
    portfolio_headings: List[str] = Form([]),
    portfolio_files: List[UploadFile] = File([]),
    profile_picture: Optional[UploadFile] = File(None),
):
    try:
        # ========== 1. GET USER ==========
        user = await sync_to_async(UserData.objects.get)(id=user_id)
        print(f"✅ Found user: {user.email} (ID: {user.id})")
        
    except UserData.DoesNotExist:
        raise HTTPException(status_code=404, detail="User not found")
    except Exception as e:
        print(f"❌ Error getting user: {e}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

    random_digits = generate_random_digits()

    # ========== 2. HANDLE PROFILE PICTURE ==========
    if profile_picture and profile_picture.filename:
        try:
            # Ensure directory exists
            media_dir = FASTAPI_BASE_DIR.parent / "media" / "profile_pics"
            media_dir.mkdir(parents=True, exist_ok=True)
            
            ext = PathLib(profile_picture.filename).suffix
            filename = f"collaborator_{user_id}_{random_digits}{ext}"
            
            content = await profile_picture.read()
            
            # Save to Django storage
            await sync_to_async(user.profile_picture.save)(
                filename,
                ContentFile(content),
                save=True
            )
            print(f"✅ Saved profile picture: {filename}")
            
        except Exception as e:
            print(f"❌ Error saving profile picture: {e}")

    # ========== 3. PARSE SKILLS ==========
    skills_list = []
    if skills:
        skills_list = [s.strip() for s in skills.split(',') if s.strip()]
    
    # ========== 4. PARSE PRICING ==========
    pricing_decimal = None
    if pricing_amount:
        try:
            pricing_decimal = float(pricing_amount)
        except ValueError:
            pass

    # ========== 5. CREATE OR UPDATE COLLABORATOR PROFILE ==========
    defaults = {
        "name": name,
        "language": language,
        "skill_category": skill_category,
        "experience": experience,
        "skills": skills_list,
        "pricing_amount": pricing_decimal,
        "pricing_unit": pricing_unit,
        "availability": availability,
        "timing": timing,
        "portfolio_category": portfolio_category,
        "social_link": social_link,
        "badges": badges,
        "skills_rating": skills_rating,
        "about": about,
        "location": location,
        "collaboration_type": collaboration_type,
        "followers": followers,
    }

    try:
        profile, created = await sync_to_async(
            lambda: CollaboratorProfile.objects.update_or_create(
                user=user,
                defaults=defaults
            )
        )()
        print(f"✅ {'Created' if created else 'Updated'} collaborator profile")
        
    except Exception as e:
        print(f"❌ Error saving collaborator profile: {e}")
        raise HTTPException(status_code=500, detail=f"Profile save error: {str(e)}")

    # ========== 6. HANDLE PORTFOLIO ITEMS - NO TITLE FIELD ==========
    portfolio_items_created = []
    
    # Ensure portfolio directory exists
    portfolio_dir = FASTAPI_BASE_DIR.parent / "media" / "portfolio_uploads" / "collaborator"
    portfolio_dir.mkdir(parents=True, exist_ok=True)
    
    # Process each file
    max_files = min(len(portfolio_files), 5)
    
    for i in range(max_files):
        portfolio_file = portfolio_files[i]
        heading = portfolio_headings[i] if i < len(portfolio_headings) else f"Portfolio Item {i+1}"
        
        if not portfolio_file or not portfolio_file.filename:
            continue
        
        try:
            # Read file content
            content = await portfolio_file.read()
            
            if not content or len(content) == 0:
                continue
            
            # ✅ IMPORTANT: Create PortfolioItem with ONLY fields that exist in database
            portfolio_item = PortfolioItem(
                user=user,              # Foreign key to UserData - EXISTS
                role="collaborator",    # role column - EXISTS (you added it)
                description=heading,    # description column - EXISTS
                order=i                # order column - EXISTS
                # ⚠️ NO title field - this column DOES NOT EXIST
                # ⚠️ NO media_link - not needed for file upload
                # ⚠️ NO other fields that don't exist
            )
            
            # Save the object first to get an ID
            await sync_to_async(portfolio_item.save)()
            print(f"  ✅ Created portfolio record ID: {portfolio_item.id}")
            
            # Generate filename
            ext = PathLib(portfolio_file.filename).suffix
            if not ext:
                ext = '.jpg'
            filename = f"{user_id}_{random_digits}_portfolio_{i}{ext}"
            
            # Save the file
            await sync_to_async(portfolio_item.file.save)(
                filename,
                ContentFile(content),
                save=True
            )
            print(f"  ✅ Saved file: {filename}")
            
            portfolio_items_created.append(portfolio_item)
            print(f"✅ Created portfolio item {i+1}: {filename}")
            
        except Exception as e:
            print(f"❌ Error creating portfolio item {i+1}: {e}")
            import traceback
            traceback.print_exc()
            continue

    # ========== 7. UPDATE USER ROLE ==========
    if user.role != "collaborator":
        user.role = "collaborator"
        await sync_to_async(user.save)()
        print(f"✅ Updated user role to collaborator")

    # ========== 8. RETURN RESPONSE ==========
    return {
        "message": "Collaborator profile saved successfully",
        "portfolio_count": len(portfolio_items_created),
        "profile_id": profile.id,
        "user_id": user.id
    }


# ==============================================================================
#  DEBUG ENDPOINT - Check Portfolio Items
# ==============================================================================
@router.get("/debug/portfolio/{user_id}")
async def debug_portfolio(user_id: int):
    """Debug endpoint to check what's in the database"""
    try:
        # Get user
        user = await sync_to_async(UserData.objects.get)(id=user_id)
        
        # Get all portfolio items for this user
        items = await sync_to_async(list)(
            PortfolioItem.objects.filter(user=user, role="collaborator")
        )
        
        # Check if files exist on disk
        file_status = []
        for item in items:
            file_info = {
                "id": item.id,
                "description": item.description,
                "file_name": item.file.name if item.file else None,
                "file_exists_on_disk": False,
                "file_url": None,
                "created_at": str(item.created_at),
                "order": item.order,
                "role": item.role
            }
            
            if item.file:
                try:
                    exists = await sync_to_async(item.file.storage.exists)(item.file.name)
                    file_info["file_exists_on_disk"] = exists
                    file_info["file_url"] = f"/collaborator/files/{item.file.name}"
                    file_info["file_path"] = item.file.path
                except:
                    pass
            
            file_status.append(file_info)
        
        # Check media directory
        media_dir = FASTAPI_BASE_DIR.parent / "media"
        portfolio_dir = media_dir / "portfolio_uploads" / "collaborator"
        
        files_in_dir = []
        if portfolio_dir.exists():
            files_in_dir = [f.name for f in portfolio_dir.iterdir() if f.is_file()]
        
        return {
            "user_id": user_id,
            "user_email": user.email,
            "portfolio_items_in_db": len(items),
            "portfolio_items": file_status,
            "media_base_dir": str(media_dir),
            "portfolio_dir_exists": portfolio_dir.exists(),
            "portfolio_dir": str(portfolio_dir),
            "files_in_directory": files_in_dir[:20],
        }
        
    except UserData.DoesNotExist:
        raise HTTPException(status_code=404, detail="User not found")
    except Exception as e:
        return {"error": str(e)}


@router.get("/get/{user_id}")
async def get_collaborator_profile(user_id: int):
    try:
        user = await sync_to_async(UserData.objects.get)(id=user_id)
        profile = await sync_to_async(CollaboratorProfile.objects.get)(user=user)
    except (UserData.DoesNotExist, CollaboratorProfile.DoesNotExist):
        raise HTTPException(status_code=404, detail="Profile not found")

    # Get portfolio items - NO TITLE FIELD
    portfolio_items = await sync_to_async(list)(
        PortfolioItem.objects.filter(
            user=user,
            role="collaborator"
        ).order_by('order', '-created_at')
    )
    
    portfolio_data = []
    for item in portfolio_items:
        file_url = None
        if item.file:
            file_url = f"/collaborator/files/{item.file.name}"
        
        portfolio_data.append({
            "id": item.id,
            "heading": item.description,  # Use description as heading
            "description": item.description,
            "media_link": item.media_link,
            "file_url": file_url,
            "original_filename": item.file.name.split('/')[-1] if item.file and '/' in item.file.name else (item.file.name if item.file else None),
            "upload_date": item.created_at.strftime("%Y-%m-%d %H:%M:%S") if hasattr(item, 'created_at') else datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "order": item.order
        })

    # Get profile picture URL
    profile_pic_url = None
    if user.profile_picture:
        try:
            profile_pic_url = f"/collaborator/files/{user.profile_picture.name}"
        except:
            pass

    return {
        "user_id": user_id,
        "email": user.email,
        "name": profile.name,
        "language": profile.language,
        "skill_category": profile.skill_category,
        "skills": profile.skills,
        "experience": profile.experience,
        "pricing_amount": profile.pricing_amount,
        "pricing_unit": profile.pricing_unit,
        "availability": profile.availability,
        "timing": profile.timing,
        "social_link": profile.social_link,
        "portfolio_link": profile.portfolio_link,
        "badges": profile.badges,
        "skills_rating": profile.skills_rating,
        "about": profile.about,
        "location": profile.location,
        "collaboration_type": profile.collaboration_type,
        "followers": profile.followers,
        "profile_picture_url": profile_pic_url,
        "portfolio_items": portfolio_data,
    }


@router.put("/edit/{user_id}")
async def edit_collaborator_profile(
    user_id: int,
    name: Optional[str] = Form(None),
    language: Optional[str] = Form(None),
    skill_category: Optional[str] = Form(None),
    experience: Optional[str] = Form(None),
    skills: Optional[str] = Form(None),
    pricing_amount: Optional[str] = Form(None),
    pricing_unit: Optional[str] = Form(None),
    availability: Optional[str] = Form(None),
    timing: Optional[str] = Form(None),
    social_link: Optional[str] = Form(None),
    portfolio_link: Optional[str] = Form(None),
    badges: Optional[str] = Form(None),
    about: Optional[str] = Form(None),
    location: Optional[str] = Form(None),
    collaboration_type: Optional[str] = Form(None),
    followers: Optional[int] = Form(None),
    skills_rating: Optional[int] = Form(None),
    
    # Portfolio updates
    portfolio_headings: List[str] = Form([]),
    portfolio_files: List[UploadFile] = File([]),
    profile_picture: Optional[UploadFile] = File(None),
    
    # Delete existing portfolio items
    delete_portfolio_ids: List[str] = Form([]),
):
    try:
        user = await sync_to_async(UserData.objects.get)(id=user_id)
        profile = await sync_to_async(CollaboratorProfile.objects.get)(user=user)
    except (UserData.DoesNotExist, CollaboratorProfile.DoesNotExist):
        raise HTTPException(status_code=404, detail="Collaborator profile not found")

    random_digits = generate_random_digits()

    # --- Handle Profile Picture Update ---
    if profile_picture and profile_picture.filename:
        try:
            ext = PathLib(profile_picture.filename).suffix
            filename = f"collaborator_{user_id}_{random_digits}{ext}"
            
            content = await profile_picture.read()
            await sync_to_async(user.profile_picture.save)(
                filename,
                ContentFile(content),
                save=True
            )
        except Exception as e:
            print(f"❌ Error updating profile picture: {e}")

    # --- Update Profile Fields ---
    update_fields = []
    
    if name is not None: 
        profile.name = name
        update_fields.append('name')
    if language is not None: 
        profile.language = language
        update_fields.append('language')
    if skill_category is not None: 
        profile.skill_category = skill_category
        update_fields.append('skill_category')
    if experience is not None: 
        profile.experience = experience
        update_fields.append('experience')
    if skills is not None: 
        profile.skills = [s.strip() for s in skills.split(',') if s.strip()]
        update_fields.append('skills')
    if pricing_amount is not None: 
        try:
            profile.pricing_amount = float(pricing_amount)
            update_fields.append('pricing_amount')
        except ValueError:
            pass
    if pricing_unit is not None: 
        profile.pricing_unit = pricing_unit
        update_fields.append('pricing_unit')
    if availability is not None: 
        profile.availability = availability
        update_fields.append('availability')
    if timing is not None: 
        profile.timing = timing
        update_fields.append('timing')
    if social_link is not None: 
        profile.social_link = social_link
        update_fields.append('social_link')
    if portfolio_link is not None: 
        profile.portfolio_link = portfolio_link
        update_fields.append('portfolio_link')
    if badges is not None: 
        profile.badges = badges
        update_fields.append('badges')
    if about is not None: 
        profile.about = about
        update_fields.append('about')
    if location is not None: 
        profile.location = location
        update_fields.append('location')
    if collaboration_type is not None: 
        profile.collaboration_type = collaboration_type
        update_fields.append('collaboration_type')
    if followers is not None: 
        profile.followers = followers
        update_fields.append('followers')
    if skills_rating is not None: 
        profile.skills_rating = skills_rating
        update_fields.append('skills_rating')
    
    if update_fields:
        await sync_to_async(profile.save)(update_fields=update_fields)

    # --- Delete Portfolio Items ---
    if delete_portfolio_ids:
        for item_id in delete_portfolio_ids:
            try:
                item = await sync_to_async(PortfolioItem.objects.get)(
                    id=int(item_id), 
                    user=user, 
                    role="collaborator"
                )
                if item.file:
                    await sync_to_async(item.file.delete)(save=False)
                await sync_to_async(item.delete)()
            except:
                pass

    # --- Add New Portfolio Items - NO TITLE FIELD ---
    new_portfolio_count = 0
    if portfolio_files and any(f.filename for f in portfolio_files):
        current_count = await sync_to_async(
            lambda: PortfolioItem.objects.filter(user=user, role="collaborator").count()
        )()
        
        max_new_files = min(len(portfolio_files), 5 - current_count)
        
        for i in range(max_new_files):
            portfolio_file = portfolio_files[i]
            if portfolio_file and portfolio_file.filename:
                heading = portfolio_headings[i] if i < len(portfolio_headings) else f"Portfolio Item {current_count + i + 1}"
                
                try:
                    content = await portfolio_file.read()
                    
                    if content and len(content) > 0:
                        # ✅ Create PortfolioItem with ONLY existing fields
                        portfolio_item = PortfolioItem(
                            user=user,
                            role="collaborator",
                            description=heading,  # Store heading in description
                            order=current_count + i
                            # ⚠️ NO title field - this column DOES NOT EXIST
                        )
                        
                        await sync_to_async(portfolio_item.save)()
                        
                        ext = PathLib(portfolio_file.filename).suffix
                        filename = f"{user_id}_{random_digits}_portfolio_new_{i}{ext}"
                        
                        await sync_to_async(portfolio_item.file.save)(
                            filename,
                            ContentFile(content),
                            save=True
                        )
                        
                        new_portfolio_count += 1
                        
                except Exception as e:
                    print(f"❌ Error adding portfolio item: {e}")
                    continue

    return {
        "message": "Collaborator profile updated successfully",
        "new_portfolio_items_added": new_portfolio_count,
        "portfolio_items_deleted": len(delete_portfolio_ids)
    }


# ==============================================================================
#  4. PORTFOLIO MANAGEMENT ENDPOINTS - NO TITLE FIELD
# ==============================================================================
@router.delete("/portfolio/item/{item_id}")
async def delete_portfolio_item(item_id: int, user_id: Optional[int] = None):
    """Delete a specific portfolio item"""
    try:
        query = PortfolioItem.objects.filter(id=item_id, role="collaborator")
        if user_id:
            query = query.filter(user_id=user_id)
        
        item = await sync_to_async(query.first)()
        if not item:
            raise HTTPException(status_code=404, detail="Portfolio item not found")
        
        if item.file:
            await sync_to_async(item.file.delete)(save=False)
        
        await sync_to_async(item.delete)()
        return {"message": "Portfolio item deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.put("/portfolio/item/{item_id}")
async def update_portfolio_item(
    item_id: int,
    heading: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    order: Optional[int] = Form(None),
    media_link: Optional[str] = Form(None),
    new_file: Optional[UploadFile] = File(None),
    user_id: Optional[int] = Form(None),
):
    """Update portfolio item heading, order, description, or file"""
    try:
        query = PortfolioItem.objects.filter(id=item_id, role="collaborator")
        if user_id:
            query = query.filter(user_id=user_id)
        
        item = await sync_to_async(query.first)()
        if not item:
            raise HTTPException(status_code=404, detail="Portfolio item not found")
        
        # ✅ Update description only - NO title field
        if heading is not None:
            item.description = heading  # Update description with heading
        
        if description is not None:
            item.description = description
        
        if order is not None:
            item.order = order
        
        if media_link is not None:
            item.media_link = media_link
        
        if new_file and new_file.filename:
            if item.file:
                await sync_to_async(item.file.delete)(save=False)
            
            content = await new_file.read()
            if content and len(content) > 0:
                random_digits = generate_random_digits()
                ext = PathLib(new_file.filename).suffix
                filename = f"{item.user_id}_{random_digits}_updated{ext}"
                await sync_to_async(item.file.save)(
                    filename,
                    ContentFile(content),
                    save=True
                )
        
        await sync_to_async(item.save)()
        
        return {
            "message": "Portfolio item updated successfully",
            "item_id": item_id
        }
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/portfolio/list/{user_id}")
async def get_collaborator_portfolio(user_id: int):
    """Get all portfolio items for a collaborator"""
    try:
        items = await sync_to_async(list)(
            PortfolioItem.objects.filter(
                user_id=user_id,
                role="collaborator"
            ).order_by('order', '-created_at')
        )
        
        portfolio_data = []
        for item in items:
            file_url = None
            if item.file:
                file_url = f"/collaborator/files/{item.file.name}"
            
            portfolio_data.append({
                "id": item.id,
                "heading": item.description,  # Use description as heading
                "description": item.description,
                "media_link": item.media_link,
                "file_url": file_url,
                "original_filename": item.file.name.split('/')[-1] if item.file and '/' in item.file.name else (item.file.name if item.file else None),
                "upload_date": item.created_at.strftime("%Y-%m-%d %H:%M:%S") if hasattr(item, 'created_at') else datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                "order": item.order
            })
        
        return portfolio_data
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# ==============================================================================
#  PROFILE DELETE
# ==============================================================================
@router.delete("/delete/{user_id}")
async def delete_collaborator_profile(user_id: int):
    try:
        user = await sync_to_async(UserData.objects.get)(id=user_id)
        
        # Delete portfolio items first
        try:
            portfolio_items = await sync_to_async(list)(
                PortfolioItem.objects.filter(user=user, role="collaborator")
            )
            for item in portfolio_items:
                if item.file:
                    await sync_to_async(item.file.delete)(save=False)
                await sync_to_async(item.delete)()
            
            profile = await sync_to_async(CollaboratorProfile.objects.get)(user=user)
            await sync_to_async(profile.delete)()
        except CollaboratorProfile.DoesNotExist:
            pass
        
        return {"message": "Collaborator profile deleted"}
    except UserData.DoesNotExist:
        raise HTTPException(status_code=404, detail="Profile not found")


@router.get("/list")
async def list_collaborators():
    profiles = await sync_to_async(list)(CollaboratorProfile.objects.select_related('user').all())
    return [
        {
            "user_id": p.user.id if p.user else None,
            "email": p.user.email if p.user else None,
            "name": p.name,
            "skill_category": p.skill_category,
            "location": p.location,
            "collaboration_type": p.collaboration_type,
        }
        for p in profiles
    ]


# ==============================================================================
#  5. JOB ACTIONS
# ==============================================================================
@router.post("/jobs/toggle-save")
async def toggle_save_job(user_id: int, job_id: int):
    try:
        user = await sync_to_async(UserData.objects.get)(id=user_id)
        job = await sync_to_async(JobPost.objects.get)(id=job_id)
        existing = await sync_to_async(lambda: SavedJob.objects.filter(user=user, job=job).first())()
        if existing:
            await sync_to_async(existing.delete)()
            return {"status": "removed", "message": "Job removed from saved list"}
        else:
            await sync_to_async(SavedJob.objects.create)(user=user, job=job)
            return {"status": "saved", "message": "Job added to saved list"}
    except (UserData.DoesNotExist, JobPost.DoesNotExist):
        raise HTTPException(status_code=404, detail="User or Job not found")


@router.post("/jobs/track-view")
async def track_job_view(user_id: int, job_id: int):
    try:
        user = await sync_to_async(UserData.objects.get)(id=user_id)
        job = await sync_to_async(JobPost.objects.get)(id=job_id)
        await sync_to_async(RecentlyViewedJob.objects.update_or_create)(user=user, job=job)
        return {"status": "success"}
    except Exception as e:
        print(f"Error tracking view: {e}")
        raise HTTPException(status_code=404, detail="Error tracking view")


# ==============================================================================
#  6. FEEDS
# ==============================================================================
@router.get("/jobs/best-match/{user_id}")
async def get_best_match_jobs(user_id: int):
    try:
        profile = await sync_to_async(CollaboratorProfile.objects.get)(user_id=user_id)
        user_skills = getattr(profile, 'skills', [])
        
        if isinstance(user_skills, str):
            user_skills = [s.strip().lower() for s in user_skills.split(',') if s.strip()]
        else:
            user_skills = [s.lower() for s in user_skills]

        if profile.skill_category:
            user_skills.append(profile.skill_category.strip().lower())
        
        if not user_skills: return []

        jobs = await sync_to_async(list)(JobPost.objects.filter(status__iexact="posted").order_by('-created_at'))
        scored_jobs = []

        for job in jobs:
            score = 0
            job_skills = getattr(job, 'skills', [])
            if isinstance(job_skills, str):
                job_skills = [s.strip().lower() for s in job_skills.split(',')]
            else:
                job_skills = [s.lower() for s in job_skills]

            job_title = job.title.lower()
            job_desc = job.description.lower()

            for my_skill in user_skills:
                if my_skill in job_skills: score += 10
                elif my_skill in job_title: score += 5
                elif my_skill in job_desc: score += 2

            if score > 0:
                scored_jobs.append({"job": job, "score": score})

        scored_jobs.sort(key=lambda x: x["score"], reverse=True)

        return [
            {
                "id": item["job"].id,
                "title": item["job"].title,
                "description": item["job"].description,
                "budget": f"{item['job'].budget_from} - {item['job'].budget_to}",
                "match_score": item["score"],
                "skills": item["job"].skills,
                "posted_at": item["job"].created_at.strftime("%d %b %Y")
            }
            for item in scored_jobs
        ]
    except CollaboratorProfile.DoesNotExist:
        return []


@router.get("/jobs/saved/{user_id}")
async def get_saved_jobs(user_id: int):
    saved_entries = await sync_to_async(list)(SavedJob.objects.filter(user_id=user_id).order_by('-saved_at'))
    return [
        {
            "id": entry.job.id,
            "title": entry.job.title,
            "description": entry.job.description,
            "budget": f"{entry.job.budget_from} - {entry.job.budget_to}",
            "saved_at": entry.saved_at.strftime("%d %b %Y"),
            "skills": entry.job.skills
        }
        for entry in saved_entries
    ]


@router.get("/jobs/recent/{user_id}")
async def get_recent_jobs(user_id: int):
    recent_entries = await sync_to_async(list)(RecentlyViewedJob.objects.filter(user_id=user_id).order_by('-viewed_at'))
    return [
        {
            "id": entry.job.id,
            "title": entry.job.title,
            "description": entry.job.description,
            "viewed_at": entry.viewed_at.strftime("%d %b %Y %H:%M"),
            "skills": entry.job.skills
        }
        for entry in recent_entries
    ]


# ==============================================================================
#  7. REVIEWS
# ==============================================================================
@router.post("/reviews/add-or-edit")
async def add_collaborator_review(creator_id: int, collaborator_id: int, rating: int, comment: str):
    try:
        creator = await sync_to_async(UserData.objects.get)(id=creator_id)
        collaborator = await sync_to_async(UserData.objects.get)(id=collaborator_id)
        has_completed_work = await sync_to_async(
            lambda: Contract.objects.filter(
                creator=creator, collaborator=collaborator, status__iexact="completed"
            ).exists()
        )()

        if not has_completed_work:
            raise HTTPException(status_code=403, detail="No completed work found.")

        review, _ = await sync_to_async(Review.objects.update_or_create)(
            reviewer=creator, recipient=collaborator,
            defaults={"rating": rating, "comment": comment}
        )
        
        # Update Avg Rating
        try:
            profile = await sync_to_async(CollaboratorProfile.objects.get)(user=collaborator)
            all_reviews = await sync_to_async(list)(Review.objects.filter(recipient=collaborator))
            if all_reviews:
                avg = sum(r.rating for r in all_reviews) / len(all_reviews)
                profile.skills_rating = int(avg)
                await sync_to_async(profile.save)()
        except CollaboratorProfile.DoesNotExist:
            pass

        return {"status": "success", "message": "Review saved"}
    except UserData.DoesNotExist:
        raise HTTPException(status_code=404, detail="User not found")


@router.get("/reviews/list/{user_id}")
async def get_collaborator_reviews(user_id: int):
    reviews = await sync_to_async(list)(Review.objects.filter(recipient_id=user_id).order_by('-updated_at'))
    return [
        {
            "reviewer_name": f"{r.reviewer.first_name} {r.reviewer.last_name}",
            "rating": r.rating,
            "comment": r.comment,
            "date": r.updated_at.strftime("%d %b %Y")
        }
        for r in reviews
    ]


# ==============================================================================
#  8. JOB DETAILS
# ==============================================================================
@router.get("/jobs/{job_id}")
async def get_job_details(job_id: int):
    try:
        job = await sync_to_async(JobPost.objects.get)(id=job_id)
        
        # Creator = UserData
        creator = await sync_to_async(UserData.objects.get)(id=job.employer_id)
        
        # Location from UserData
        country = creator.location or "Unknown"
        state = creator.state or None
        country_code = get_country_code(country)
        
        # Rating & reviews (creator as recipient)
        review_stats = await sync_to_async(
            lambda: Review.objects.filter(recipient=creator).aggregate(
                avg_rating=Avg("rating"),
                total_reviews=Count("id")
            )
        )()
        
        rating = round(review_stats["avg_rating"] or 0, 1)
        reviews = review_stats["total_reviews"] or 0
        
        return {
            "id": job.id,
            "title": job.title,
            "description": job.description,
            "skills": job.skills,
            "timeline": job.timeline,
            "duration": job.duration,
            "expertise_level": job.expertise_level,
            "budget_type": job.budget_type,
            "budget_from": float(job.budget_from) if job.budget_from else None,
            "budget_to": float(job.budget_to) if job.budget_to else None,
            "status": job.status,
            "created_at": job.created_at.isoformat(),
            "employer_id": job.employer_id,
            "creator": {
                "state": state,
                "country": country,
                "country_code": country_code,
                "rating": rating,
                "reviews": reviews,
            },
        }
        
    except JobPost.DoesNotExist:
        raise HTTPException(status_code=404, detail="Job not found")
    except UserData.DoesNotExist:
        raise HTTPException(status_code=404, detail="Creator not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/job-search")
async def search_jobs(search: Optional[str] = None):
    jobs = await sync_to_async(list)(
        JobPost.objects.select_related(
            "employer",
            "employer__creatorprofile"
        ).filter(status="posted")
    )

    if search:
        filtered_jobs = []
        for job in jobs:
            search_lower = search.lower()
            cp = getattr(job.employer, "creatorprofile", None)
            
            if (search_lower in job.title.lower() or
                search_lower in job.description.lower() or
                (isinstance(job.skills, str) and search_lower in job.skills.lower()) or
                (isinstance(job.skills, list) and any(search_lower in str(s).lower() for s in job.skills)) or
                (cp and cp.creator_name and search_lower in cp.creator_name.lower()) or
                (cp and cp.location and search_lower in cp.location.lower())):
                filtered_jobs.append(job)
        jobs = filtered_jobs

    results = []
    for j in jobs:
        cp = getattr(j.employer, "creatorprofile", None)
        
        results.append({
            "id": j.id,
            "title": j.title,
            "description": j.description,
            "skills": j.skills,
            "budget_type": j.budget_type,
            "budget_from": j.budget_from,
            "budget_to": j.budget_to,
            "expertise_level": j.expertise_level,
            "created_at": j.created_at,
            "creator_name": cp.creator_name if cp else "Unknown",
            "location": cp.location if cp and cp.location else "Remote",
        })

    return results