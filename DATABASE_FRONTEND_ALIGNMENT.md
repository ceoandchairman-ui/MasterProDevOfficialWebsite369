# Frontend ↔ Database Alignment Check

## ✅ ALIGNED ELEMENTS

### 1. **USERS Table** - WELL ALIGNED
Frontend captures: `name`, `email`, `password` (during signup)
Database has: `name`, `email`, `password_hash`, `user_roles`, `phone`, `country`, `timezone`, `profile_photo`, `company_name`, `company_size`

**Status:** ✅ Basic structure matches. Database has ADDITIONAL fields for richer profiles (company, timezone, roles).

---

### 2. **CONSULTANTS Profile Data** - WELL ALIGNED
Frontend displays consultant cards showing:
- `name` ✅
- `photoUrl` ✅ (maps to profile_photo in USERS)
- `hourlyRate` ✅
- `minBudget` ✅
- `languages` (array) ✅
- `servicesOffered` (array) ✅
- `experience` (years) ✅
- `averageRating` ✅
- `contactEmail` ✅

Database has: CONSULTANTS table with `photo_url`, `hourly_rate`, `min_budget`, `years_experience`, `average_rating`
Plus junction tables: CONSULTANT_SERVICES + CONSULTANT_LANGUAGES

**Status:** ✅ PERFECT MATCH. All fields present in database.

---

### 3. **Services Structure** - WELL ALIGNED
Frontend displays 5 service pillars:
1. AI Powered Job Search & Professional Development
2. AI Powered Business Development
3. AI Agents & Automations
4. AI Consulting
5. AI Optimized Chatbots & Support Systems

Database SERVICES table has: `category` field that can store these exact categories

Frontend shows: `servicesOffered` as array on consultants
Database has: CONSULTANT_SERVICES junction table (many-to-many relationship)

**Status:** ✅ PERFECT MATCH. Junction table design allows flexibility.

---

### 4. **Reviews & Ratings** - WELL ALIGNED
Frontend allows users to:
- Submit review with: `reviewerName`, `comment`, `rating` (1-5 stars)
- View consultant average rating which updates automatically

Database REVIEWS table has:
- `reviewer_name` ✅
- `comment` ✅
- `rating` (1-5) ✅
- `consultant_id` FK ✅
- Auto-calculation of `average_rating` on CONSULTANTS ✅

**Status:** ✅ PERFECT MATCH.

---

### 5. **Contact Form** - WELL ALIGNED
Frontend captures: `name`, `email`, `subject`, `message`

Database CONTACT_INQUIRIES has:
- `name` ✅
- `email` ✅
- `subject` ✅
- `message` ✅
- Plus: `phone`, `inquiry_type`, `status`, `assigned_to`

**Status:** ✅ PERFECT MATCH. Database has additional fields for workflow management.

---

### 6. **Idea Submission** - WELL ALIGNED
Frontend TellYourIdeaPage captures:
- `text` queries ✅
- `files` (up to 5MB) ✅
- `audio` recordings (up to 60 sec) ✅
- `video` recordings ✅
- `externalLinks` ✅
- `contactInfo`: `name`, `email`, `phone` ✅

Database has:
- IDEAS_SUBMISSIONS table with: `title`, `description`, `contact_name`, `contact_email`, `contact_phone` ✅
- IDEA_SUBMISSION_FILES junction table for: `file_url`, `file_type`, `metadata` ✅

**Status:** ✅ PERFECT MATCH. Junction table allows unlimited file attachments.

---

### 7. **Consultant Applications** - WELL ALIGNED
Frontend BecomeConsultantSection captures:
- `name` ✅
- `email` ✅
- `title` ✅
- `experience` ✅
- `expertise` (comma-separated areas) ✅
- `why` (motivation) ✅

Database CONSULTANT_APPLICATIONS has:
- `applicant_name` ✅
- `applicant_email` ✅
- `professional_title` ✅
- `years_of_experience` ✅
- `expertise_areas` (JSON) ✅
- `motivation_text` ✅

**Status:** ✅ PERFECT MATCH.

---

## ⚠️ PARTIALLY ALIGNED - NEEDS CLARIFICATION

### 8. **Booking/Hiring Workflow** - NEEDS IMPLEMENTATION
Frontend shows: "Hire Now" button on ConsultantDetail page
- Displays a contact form with: `name`, `email`, `projectBudget`, `projectDescription`
- Currently NOT PERSISTING to database (form has no submit handler)

Database BOOKINGS table is ready with:
- `client_id`, `provider_id`, `engagement_type`, `budget`, `status`, etc.

**Status:** ⚠️ FRONTEND INCOMPLETE. Button exists but form doesn't save. Need to:
1. Connect form submission to BOOKINGS table
2. Implement booking status workflow (pending → accepted → in_progress → completed)
3. Add payment_status tracking

---

### 9. **Authentication Context** - PARTIALLY ALIGNED
Frontend uses: 
- localStorage for `auth_token` ✅
- localStorage for `user` info ✅
- JWT-based auth ✅

Database expects:
- Standard JWT token handling ✅
- User roles in `user_roles` JSON field (might need middleware to parse)

**Status:** ✅ MOSTLY ALIGNED. May need to update auth middleware to handle JSON `user_roles` field.

---

## ❌ MISSING/MISALIGNED ELEMENTS

### 10. **LANGUAGES Table** - EXISTS BUT UNUSED IN FRONTEND
Database has: LANGUAGES table with `language_name`
Frontend captures: `languages` directly as array on BecomeConsultantSection form

**Status:** ❌ MISMATCH. Frontend should:
- Either fetch available languages from LANGUAGES table during form load
- Or allow free-text language entry (current implementation)

**Recommendation:** Keep current frontend behavior (free text), but populate LANGUAGES table with common options for future autocomplete feature.

---

### 11. **User Roles/Multi-Role Support** - NOT YET IN FRONTEND
Database has: `user_roles` JSON array supporting multi-role users (consultant + business_owner, etc.)
Frontend currently: Simple role selection during signup NOT PRESENT

**Status:** ❌ MISSING. Frontend signup page only captures: `name`, `email`, `password`
- Does NOT ask user to select role (individual, consultant, business_owner, etc.)
- Signup should be enhanced to ask: "What brings you here?" with options

**Recommendation:** Update SignupPage.jsx to:
```jsx
<select>
  <option>I'm looking for AI consulting (Individual Professional)</option>
  <option>I want to offer consulting services (Consultant)</option>
  <option>I'm hiring for my business (Business Owner)</option>
  <option>Other</option>
</select>
```

---

### 12. **Engagement Type (B2B/B2C/D2C/C2C)** - NOT CAPTURED IN FRONTEND
Database BOOKINGS has: `engagement_type` field (b2b, b2c, d2c, c2c)
Frontend currently: No distinction between booking types

**Status:** ❌ MISSING. System doesn't track which business model applies to each booking.

**Recommendation:** When creating a booking, frontend should determine:
- **B2B**: Logged-in user is business_owner, hiring a consultant
- **B2C**: Logged-in user is business/internal_team, selling to individual
- **C2C**: Both are consultants collaborating
- **D2C**: Provider is internal_team member

---

### 13. **Search/Filtering** - PARTIALLY IMPLEMENTED
Frontend HireConsultant.jsx shows filters for:
- Service (dropdown) ✅
- Hourly Rate (range) ✅
- Languages (dropdown) ✅
- Sorting (newest, price, rating) ✅

Database supports: Service filtering via CONSULTANT_SERVICES junction table ✅

**Status:** ✅ MOSTLY GOOD. Frontend filtering logic exists and maps to database structure.

---

### 14. **Chatbot Context** - FRONTEND READY, DATABASE PENDING
Frontend FloatingChatbot.jsx has: Event listener for custom events from TellYourIdeaPage
Database has: CHATBOT_CONVERSATIONS table (optional)

**Status:** ⚠️ FRONTEND READY. Backend needs to:
- Capture chatbot interactions
- Associate with IDEAS_SUBMISSIONS
- Track user sessions

**Recommendation:** Implement CHATBOT_CONVERSATIONS table to store conversations.

---

### 15. **Email Logging** - DATABASE READY, FRONTEND NOT TRACKING
Frontend sends emails for:
- Contact form submission ✅
- Consultant application ✅
- "Hire Now" contact ✅

Database has: EMAIL_LOGS table (optional)

**Status:** ⚠️ OPTIONAL. Frontend doesn't log email attempts, but database structure exists if needed.

---

## Summary Table

| Component | Frontend | Database | Status |
|-----------|----------|----------|--------|
| User Authentication | ✅ Signup/Login form | USERS table | ✅ Aligned |
| User Roles/Types | ❌ Not asked | user_roles JSON | ❌ Missing |
| Consultant Profiles | ✅ Full display | CONSULTANTS table | ✅ Aligned |
| Services | ✅ 5 pillars shown | SERVICES + junction | ✅ Aligned |
| Languages | ✅ Free text input | LANGUAGES table | ⚠️ Partial |
| Reviews | ✅ Submit & display | REVIEWS table | ✅ Aligned |
| Contact Form | ✅ Form exists | CONTACT_INQUIRIES | ✅ Aligned |
| Idea Submission | ✅ Multi-format form | IDEAS_SUBMISSIONS | ✅ Aligned |
| Consultant App | ✅ Email sends | CONSULTANT_APPLICATIONS | ✅ Aligned |
| Booking/Hiring | ⚠️ Form incomplete | BOOKINGS table | ❌ Incomplete |
| Engagement Types | ❌ Not tracked | engagement_type field | ❌ Missing |
| Chatbot Context | ✅ Events fired | CHATBOT_CONVERSATIONS | ⚠️ Partial |
| Email Logging | ❌ Not tracked | EMAIL_LOGS table | ⚠️ Optional |

---

## Priority Action Items for Alignment

### 🔴 CRITICAL (Must Fix Before MVP)
1. **Implement Booking Creation**
   - Connect "Hire Now" form to BOOKINGS table
   - Track `engagement_type` when booking is created
   - Implement status workflow
   
2. **Add User Role Selection**
   - Update SignupPage to capture role preference
   - Store in user_roles JSON field
   - Display role-specific options throughout UI

### 🟡 HIGH (Should Fix Before Production)
3. **Enhance Language Selection**
   - Fetch LANGUAGES options from database
   - Add autocomplete or multi-select

4. **Track Engagement Types**
   - Determine B2B vs B2C vs D2C vs C2C at booking time
   - Store in BOOKINGS.engagement_type

### 🟢 LOW (Nice to Have)
5. **Implement Email Logging**
   - Log contact form, consultant app, booking emails to EMAIL_LOGS

6. **Enhance Chatbot**
   - Store CHATBOT_CONVERSATIONS
   - Track sentiment and outcomes

---

## Conclusion

**Overall Alignment: 75%** ✅

**What's Working:**
- User authentication flow
- Consultant profile display and filtering
- Services and expertise mapping
- Review and rating system
- Contact and inquiry forms
- Idea submission with file handling
- Consultant application intake

**What Needs Work:**
- Booking/hiring workflow (critical gap)
- User role selection during signup
- Engagement type tracking
- Multi-role user support
- Email and chatbot logging (optional)

**Next Steps:**
1. Implement booking creation endpoint
2. Update signup to capture user role
3. Deploy both at same time for coherent user experience
