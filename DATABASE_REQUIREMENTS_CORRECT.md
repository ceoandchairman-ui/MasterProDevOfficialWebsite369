# MasterProDev - CORRECT Database Requirements

## Project Overview

**MasterProDev** is a **Multi-Sided Tech & AI Consulting Platform** operating across multiple business models:

### Business Models (B2B + B2C + D2C + C2C)

**B2B (Business to Business)**
- Businesses hire consultants for AI solutions
- B2B lead generation, sales automation services
- Enterprise consulting engagements

**B2C (Business to Consumer)**
- Individual professionals seeking career advancement
- Freelancers wanting to scale with AI automation
- SMB owners needing AI strategy

**D2C (Direct to Consumer)**
- MasterProDev's own team delivers services directly
- No middleman - direct engagement with your consultants
- Premium service delivery model

**C2C (Consumer to Consumer)**
- Consultants offer peer-to-peer consulting
- Knowledge sharing & collaboration
- Community-driven expertise marketplace

### Service Categories (Core Pillars)
1. **AI Powered Job Search & Professional Development** - Resume optimization, career advancement (B2C, D2C)
2. **AI Powered Business Development** - Lead generation, sales automation, market expansion (B2B, B2C)
3. **AI Agents & Automations** - Custom AI solutions, workflow automation, RPA (B2B, B2C, D2C)
4. **AI Consulting** - Strategic guidance, AI transformation roadmaps (B2B, D2C)
5. **AI Optimized Chatbots & Support Systems** - Customer support automation, engagement systems (B2B, D2C)

### Target Users
- **Consultants/Experts**: Provide AI consulting services (C2C, B2B broker model)
- **Businesses**: Hire consultants OR buy direct MasterProDev services (B2B)
- **Individual Professionals**: Seek career transformation and AI expertise (B2C)
- **Entrepreneurs/SMB Owners**: Leverage AI for business scaling (B2C, D2C)
- **Internal Team**: Your own consultants deliver services (D2C)

---

## Core Entities & Tables

### 1. **USERS Table**
**Purpose:** Unified authentication and user profiles supporting B2B, B2C, D2C, and C2C models

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique user identifier |
| name | VARCHAR(255) | NOT NULL | Full name |
| email | VARCHAR(255) | NOT NULL, UNIQUE | Email for login |
| password_hash | VARCHAR(255) | NOT NULL | Hashed password |
| phone | VARCHAR(20) | | Contact phone |
| user_roles | JSON | NOT NULL | Array of roles: ['individual', 'consultant', 'business_owner', 'internal_team', 'admin'] |
| profile_photo | VARCHAR(500) | | Profile photo URL |
| bio | TEXT | | User biography |
| country | VARCHAR(100) | | Geographic location |
| timezone | VARCHAR(50) | | User timezone |
| company_name | VARCHAR(255) | | For business_owner role |
| company_size | VARCHAR(50) | | Small/Medium/Large/Enterprise |
| is_verified | BOOLEAN | DEFAULT FALSE | Email/identity verified |
| is_active | BOOLEAN | DEFAULT TRUE | Account status |
| created_at | TIMESTAMP | DEFAULT NOW | Signup date |
| updated_at | TIMESTAMP | DEFAULT NOW | Last update |
| last_login | TIMESTAMP | | Last login timestamp |

**User Roles Supported:**
- `individual`: Professional seeking services (B2C buyer)
- `consultant`: Expert offering services (C2C provider, B2B broker)
- `business_owner`: Business hiring consultants or services (B2B buyer)
- `internal_team`: MasterProDev's own team (D2C provider)
- `admin`: Platform administrator

**Role Combinations:** A user can have multiple roles:
- Consultant + Business Owner = Freelancer who also hires contractors
- Internal Team + Consultant = Team member offering external consulting
- Individual + Business Owner = Professional who runs side business

**API Endpoints:**
- POST `/auth/signup` - Register new user
- POST `/auth/login` - Authenticate user
- GET `/auth/me` - Get current user
- POST `/auth/logout` - Logout
- PUT `/auth/profile` - Update user profile

---

### 2. **CONSULTANTS Table**
**Purpose:** Professional profiles for consultants available on marketplace

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique consultant ID |
| user_id | UUID | NOT NULL, UNIQUE, FK | References USERS.id |
| title | VARCHAR(255) | NOT NULL | Professional title (e.g., "AI Strategy Consultant") |
| tagline | TEXT | | Short description (50-100 chars) |
| bio | TEXT | | Detailed biography |
| photo_url | VARCHAR(500) | | Profile photo URL |
| location | VARCHAR(255) | | Geographic location/timezone |
| hourly_rate | DECIMAL(10,2) | NOT NULL | Hourly rate for consulting |
| min_budget | DECIMAL(10,2) | | Minimum project budget |
| years_experience | INT | | Years in field |
| average_rating | DECIMAL(3,2) | DEFAULT 0 | Calculated from REVIEWS |
| total_reviews | INT | DEFAULT 0 | Count of reviews |
| is_verified | BOOLEAN | DEFAULT FALSE | Verified expert status |
| portfolio_url | VARCHAR(500) | | Link to portfolio/website |
| availability_status | ENUM | DEFAULT 'available' | (available, booked, unavailable) |
| created_at | TIMESTAMP | DEFAULT NOW | Profile creation |
| updated_at | TIMESTAMP | DEFAULT NOW | Last updated |

**API Endpoints:**
- GET `/consultants` - List all consultants
- GET `/consultants/:id` - Get consultant profile
- GET `/consultants/search?q=query` - Search by name/expertise
- POST `/consultants` - Create consultant profile (from signup)
- PUT `/consultants/:id` - Update consultant profile
- DELETE `/consultants/:id` - Deactivate consultant

**Code Location:** [src/pages/HireConsultant.jsx](src/pages/HireConsultant.jsx), [src/pages/ConsultantDetail.jsx](src/pages/ConsultantDetail.jsx), [src/components/home/BecomeConsultantSection.jsx](src/components/home/BecomeConsultantSection.jsx)

---

### 3. **SERVICES Table**
**Purpose:** Define available consulting services/offerings

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique service ID |
| name | VARCHAR(255) | NOT NULL, UNIQUE | Service name (e.g., "AI Resume Optimization") |
| description | TEXT | | Detailed service description |
| category | VARCHAR(100) | NOT NULL | Service pillar/category |
| icon | VARCHAR(100) | | Icon name or emoji |
| base_price | DECIMAL(10,2) | | Starting price for this service |
| estimated_duration_hours | INT | | Typical hours needed |
| is_active | BOOLEAN | DEFAULT TRUE | Service available status |
| created_at | TIMESTAMP | DEFAULT NOW | Created date |
| updated_at | TIMESTAMP | DEFAULT NOW | Last updated |

**Categories:**
- AI Powered Job Search & Professional Development
- AI Powered Business Development
- AI Agents & Automations
- AI Consulting
- AI Optimized Chatbots & Support Systems

**Code Location:** [src/pages/ServicesPage.jsx](src/pages/ServicesPage.jsx), [src/components/home/ServicesSection.jsx](src/components/home/ServicesSection.jsx)

---

### 4. **CONSULTANT_SERVICES (Junction Table)**
**Purpose:** Map which services each consultant offers

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | |
| consultant_id | UUID | NOT NULL, FK | References CONSULTANTS.id |
| service_id | UUID | NOT NULL, FK | References SERVICES.id |
| proficiency_level | ENUM | DEFAULT 'intermediate' | (beginner, intermediate, expert) |
| years_offering | INT | | Years offering this service |
| UNIQUE(consultant_id, service_id) | | | Prevent duplicates |

---

### 5. **LANGUAGES Table**
**Purpose:** Languages consultants can work in

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | |
| language_name | VARCHAR(100) | NOT NULL, UNIQUE | Language name |

---

### 6. **CONSULTANT_LANGUAGES (Junction Table)**
**Purpose:** Map languages for each consultant

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | |
| consultant_id | UUID | NOT NULL, FK | References CONSULTANTS.id |
| language_id | UUID | NOT NULL, FK | References LANGUAGES.id |
| proficiency | ENUM | DEFAULT 'fluent' | (basic, intermediate, fluent, native) |
| UNIQUE(consultant_id, language_id) | | | |

---

### 7. **BOOKINGS/ENGAGEMENTS Table** ⭐ **CRITICAL**
**Purpose:** Track consulting engagements across all business models (B2B, B2C, D2C, C2C)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique booking/engagement ID |
| client_id | UUID | NOT NULL, FK | References USERS.id (buyer) |
| provider_id | UUID | NOT NULL, FK | References USERS.id (seller - consultant, internal team, or business) |
| service_id | UUID | | FK to SERVICES (optional) |
| engagement_type | ENUM | NOT NULL | (b2b, b2c, d2c, c2c) - Business model type |
| title | VARCHAR(255) | NOT NULL | Project/engagement name |
| description | TEXT | | Detailed scope of work |
| budget | DECIMAL(10,2) | NOT NULL | Total budget for engagement |
| hourly_rate | DECIMAL(10,2) | NOT NULL | Rate locked at booking time |
| estimated_hours | INT | | Estimated hours needed |
| actual_hours | INT | | Actual hours worked |
| status | ENUM | DEFAULT 'pending' | (pending, accepted, in_progress, completed, cancelled, disputed) |
| payment_status | ENUM | DEFAULT 'unpaid' | (unpaid, partial, paid) |
| start_date | TIMESTAMP | | When engagement starts |
| expected_end_date | TIMESTAMP | | Expected completion date |
| actual_end_date | TIMESTAMP | | Actual completion date |
| created_at | TIMESTAMP | DEFAULT NOW | Booking created |
| updated_at | TIMESTAMP | DEFAULT NOW | Last status change |

**Engagement Type Definitions:**
- **B2B**: Business hiring consultant (via marketplace broker model)
- **B2C**: Business offering service directly to individual professional
- **C2C**: Consultant hiring another consultant for collaboration/subcontracting
- **D2C**: MasterProDev's internal team delivering service directly (highest trust/premium)

**API Endpoints:**
- GET `/bookings` - List user's bookings
- GET `/bookings/:id` - Get booking details
- POST `/bookings` - Create new booking (when client hires provider)
- PUT `/bookings/:id` - Update booking status
- DELETE `/bookings/:id` - Cancel booking
- GET `/bookings?engagement_type=b2b` - Filter by business model

**Code Location:** [src/pages/HireConsultant.jsx](src/pages/HireConsultant.jsx) ("Hire Now" button), [src/pages/ConsultantDetail.jsx](src/pages/ConsultantDetail.jsx)

---

### 8. **REVIEWS Table**
**Purpose:** Client reviews and ratings for consultants

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique review ID |
| booking_id | UUID | NOT NULL, FK | References BOOKINGS.id |
| consultant_id | UUID | NOT NULL, FK | References CONSULTANTS.id |
| client_id | UUID | NOT NULL, FK | References USERS.id |
| rating | INT | NOT NULL, CHECK(1-5) | Star rating 1-5 |
| comment | TEXT | | Review comment |
| professionalism | INT | CHECK(1-5) | Rating for professionalism |
| delivery_quality | INT | CHECK(1-5) | Rating for quality |
| communication | INT | CHECK(1-5) | Rating for communication |
| is_public | BOOLEAN | DEFAULT TRUE | Display on profile |
| created_at | TIMESTAMP | DEFAULT NOW | Review posted |
| updated_at | TIMESTAMP | DEFAULT NOW | Last edited |

**API Endpoints:**
- GET `/reviews` - List all reviews
- GET `/reviews?consultantId=:id` - Get reviews for consultant
- POST `/reviews` - Submit review (after booking completed)
- PUT `/reviews/:id` - Edit review
- DELETE `/reviews/:id` - Remove review

**Code Location:** [src/pages/ConsultantDetail.jsx](src/pages/ConsultantDetail.jsx), [src/components/home/ReviewsSection.jsx](src/components/home/ReviewsSection.jsx), [src/components/home/PostYourRatingSection.jsx](src/components/home/PostYourRatingSection.jsx)

---

### 9. **CONTACT_INQUIRIES Table**
**Purpose:** General contact form submissions

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | |
| name | VARCHAR(255) | NOT NULL | Submitter name |
| email | VARCHAR(255) | NOT NULL | Submitter email |
| phone | VARCHAR(20) | | Phone number |
| subject | VARCHAR(255) | | Inquiry subject |
| message | TEXT | NOT NULL | Message body |
| inquiry_type | ENUM | DEFAULT 'general' | (general, partnership, feedback, complaint) |
| status | ENUM | DEFAULT 'new' | (new, read, responded, closed) |
| assigned_to | UUID | FK | References USERS.id (staff member) |
| created_at | TIMESTAMP | DEFAULT NOW | |
| updated_at | TIMESTAMP | DEFAULT NOW | |

**Code Location:** [src/components/home/ContactSection.jsx](src/components/home/ContactSection.jsx)

---

### 10. **IDEAS_SUBMISSIONS Table**
**Purpose:** "Tell Your Idea" form - clients submit project ideas/briefs

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | |
| name | VARCHAR(255) | NOT NULL | Submitter name |
| email | VARCHAR(255) | NOT NULL | Submitter email |
| phone | VARCHAR(20) | | Phone number |
| idea_title | VARCHAR(255) | | Project/idea title |
| idea_description | TEXT | | Detailed idea/requirements |
| budget_estimate | VARCHAR(100) | | Budget range (e.g., "$5k-10k") |
| timeline | VARCHAR(255) | | Expected timeline |
| status | ENUM | DEFAULT 'submitted' | (submitted, reviewing, contacted, converted_to_booking, rejected) |
| assigned_consultant_id | UUID | FK | References CONSULTANTS.id |
| created_at | TIMESTAMP | DEFAULT NOW | |
| updated_at | TIMESTAMP | DEFAULT NOW | |

**Junction Table:** `IDEA_SUBMISSION_FILES`

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | PRIMARY KEY |
| submission_id | UUID | FK to IDEAS_SUBMISSIONS |
| file_type | ENUM | (document, image, video, audio, link) |
| file_url | VARCHAR(500) | Cloud storage URL |
| file_name | VARCHAR(255) | Original filename |
| file_size | BIGINT | Size in bytes |
| created_at | TIMESTAMP | |

**Code Location:** [src/pages/TellYourIdeaPage.jsx](src/pages/TellYourIdeaPage.jsx)

---

### 11. **CONSULTANT_APPLICATIONS Table**
**Purpose:** Track applications to become a consultant (from BecomeConsultantSection)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | |
| full_name | VARCHAR(255) | NOT NULL | Applicant name |
| email | VARCHAR(255) | NOT NULL, UNIQUE | Applicant email |
| professional_title | VARCHAR(255) | | Current/desired title |
| years_experience | INT | | Years in field |
| areas_of_expertise | TEXT | NOT NULL | Comma-separated expertise areas |
| why_join_us | TEXT | | Motivation for joining |
| portfolio_url | VARCHAR(500) | | Link to portfolio |
| status | ENUM | DEFAULT 'pending' | (pending, reviewing, approved, rejected) |
| reviewer_notes | TEXT | | Admin notes |
| created_at | TIMESTAMP | DEFAULT NOW | Application date |
| reviewed_at | TIMESTAMP | | Review date |
| reviewed_by_id | UUID | FK | References USERS.id (admin) |

**Code Location:** [src/components/home/BecomeConsultantSection.jsx](src/components/home/BecomeConsultantSection.jsx)

---

### 12. **EMAIL_LOGS Table** (Optional)
**Purpose:** Log all emails sent through platform

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | |
| recipient_email | VARCHAR(255) | NOT NULL | Email recipient |
| subject | VARCHAR(255) | NOT NULL | Subject line |
| body | LONGTEXT | | Email body |
| email_type | ENUM | NOT NULL | (contact_response, booking_confirmation, review_reminder, consultant_inquiry, password_reset) |
| status | ENUM | DEFAULT 'pending' | (pending, sent, failed, bounced) |
| sent_at | TIMESTAMP | | When email sent |
| error_message | TEXT | | If failed, error details |
| created_at | TIMESTAMP | DEFAULT NOW | |

---

### 13. **CHATBOT_CONVERSATIONS Table** (Optional)
**Purpose:** Track AI chatbot interactions

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | |
| user_id | UUID | FK | References USERS.id (optional) |
| session_id | VARCHAR(255) | NOT NULL, UNIQUE | Browser session ID |
| messages_json | LONGTEXT | | JSON array of conversation messages |
| context_data | LONGTEXT | | JSON context (page, user intent, etc.) |
| current_page | VARCHAR(255) | | Page where chat occurred |
| user_feedback_rating | INT | CHECK(1-5) | User rating of chat |
| feedback_comment | TEXT | | User feedback text |
| created_at | TIMESTAMP | DEFAULT NOW | |
| updated_at | TIMESTAMP | DEFAULT NOW | |

**Code Location:** [src/components/shared/FloatingChatbot.jsx](src/components/shared/FloatingChatbot.jsx), [src/pages/TellYourIdeaPage.jsx](src/pages/TellYourIdeaPage.jsx)

---

## Relational Diagram

```
USERS (Base entity)
├── CONSULTANTS (1-to-1: user_id)
│   ├── CONSULTANT_SERVICES (M-to-M junction)
│   │   └── SERVICES
│   ├── CONSULTANT_LANGUAGES (M-to-M junction)
│   │   └── LANGUAGES
│   ├── BOOKINGS (1-to-Many: consultant_id) ⭐
│   │   ├── CLIENTS (reverse FK: client_id to USERS)
│   │   └── REVIEWS (1-to-Many: booking_id)
│   └── CONSULTANT_APPLICATIONS (referencing applications)
│
├── BOOKINGS (1-to-Many: client_id) ⭐
│   ├── CONSULTANTS
│   └── REVIEWS
│
├── CHATBOT_CONVERSATIONS (1-to-Many: user_id)

CONTACT_INQUIRIES (Standalone)

IDEAS_SUBMISSIONS (Standalone)
└── IDEA_SUBMISSION_FILES (1-to-Many)

CONSULTANT_APPLICATIONS (Standalone - intake form)

EMAIL_LOGS (Audit logging)
```

---

## Implementation Locations

### Backend Structure
```
backend/
├── models/
│   ├── User.js
│   ├── Consultant.js
│   ├── Service.js
│   ├── Booking.js
│   ├── Review.js
│   ├── ContactInquiry.js
│   ├── IdeaSubmission.js
│   └── ConsultantApplication.js
├── routes/
│   ├── auth.js
│   ├── consultants.js
│   ├── services.js
│   ├── bookings.js
│   ├── reviews.js
│   ├── contact.js
│   ├── ideas.js
│   └── applications.js
├── middleware/
│   ├── auth.js (JWT verification)
│   └── errorHandler.js
├── db/
│   ├── migrations/
│   └── connection.js
└── server.js
```

### Tech Stack
- **Backend**: Node.js + Express.js
- **Database**: PostgreSQL (recommended) or MySQL
- **ORM**: Prisma or Sequelize
- **File Storage**: AWS S3, Cloudinary, or Firebase Storage
- **Email**: SendGrid, Mailgun, or AWS SES

---

## Critical Data Flows

### 1. **User Registers as Consultant**
```
BecomeConsultantSection form submission
  ↓
POST /applications (Create CONSULTANT_APPLICATIONS)
  ↓
Email sent to admin
  ↓
Admin reviews application
  ↓
If approved: Create USERS + CONSULTANTS records
```

### 2. **Client Hires Consultant**
```
Client clicks "Hire Now" on ConsultantDetail
  ↓
Booking form opens
  ↓
POST /bookings (Create BOOKINGS record)
  ↓
Status: pending (waiting for consultant acceptance)
  ↓
Consultant reviews booking
  ↓
PUT /bookings/:id (Update status to accepted/in_progress)
  ↓
Work happens
  ↓
PUT /bookings/:id (Update status to completed)
  ↓
Client submits REVIEWS record
  ↓
CONSULTANTS.average_rating auto-updates
```

### 3. **Client Submits Idea**
```
TellYourIdeaPage form submission
  ↓
POST /ideas/submit
  ↓
Create IDEAS_SUBMISSIONS + IDEA_SUBMISSION_FILES
  ↓
Chatbot opens with context
  ↓
Admin reviews idea
  ↓
Assign consultant or convert to BOOKINGS
```

---

## Multi-Sided Marketplace Model Details

### Business Model Breakdown

**B2B (Business to Business)**
- Businesses ("business_owner" role) hire consultants/experts
- MasterProDev acts as technology broker/marketplace
- Use case: "Hire a specialized AI consultant"
- Booking.engagement_type = 'b2b'
- Revenue: Commission on booking value

**B2C (Business to Consumer)**
- MasterProDev or partner businesses offer services to individual professionals
- High-volume service delivery (career optimization, job search, etc.)
- Use case: Individual wants "AI Resume Optimization"
- Booking.engagement_type = 'b2c'
- Revenue: Direct service fees

**D2C (Direct to Consumer)**
- MasterProDev's internal team (provider_id with "internal_team" role) delivers premium services
- No middleman - direct engagement
- Highest trust/premium positioning
- Use case: Custom AI strategy/implementation
- Booking.engagement_type = 'd2c'
- Revenue: Premium direct service fees

**C2C (Consumer to Consumer)**
- Expert consultants hire other consultants for collaboration/subcontracting
- Peer-to-peer expertise marketplace
- Use case: Senior consultant subcontracts specialized AI task
- Booking.engagement_type = 'c2c'
- Revenue: Commission on marketplace transaction

### Provider Types in System

**Type 1: Consultant (user_roles includes 'consultant')**
- Individual experts available on marketplace
- Can engage in B2B, C2C models
- Has CONSULTANTS profile
- Can also be business_owner (hires for C2C)

**Type 2: Business Owner (user_roles includes 'business_owner')**
- Represents business entity
- Can hire consultants (B2B buyer)
- Can engage in C2C (subcontracting)
- Can offer services to individuals (B2C seller)
- Has company profile data

**Type 3: Internal Team (user_roles includes 'internal_team')**
- MasterProDev's own service providers
- Delivers D2C premium services
- Not listed on marketplace like consultants
- Higher rates, higher trust tier
- Direct relationship with clients

**Type 4: Individual Professional (user_roles includes 'individual')**
- Seeks services (B2C buyer)
- Career advancement, AI learning
- Can become consultant later
- Single-role or multi-role user

### Query Examples

**Find all B2B engagements:**
```sql
SELECT * FROM BOOKINGS 
WHERE engagement_type = 'b2b' 
AND status IN ('in_progress', 'completed')
```

**Revenue by business model:**
```sql
SELECT engagement_type, SUM(budget) as total_revenue
FROM BOOKINGS
WHERE status = 'completed'
GROUP BY engagement_type
```

**Top D2C providers (internal team):**
```sql
SELECT u.id, u.name, COUNT(b.id) as engagements
FROM USERS u
JOIN BOOKINGS b ON u.id = b.provider_id
WHERE JSON_CONTAINS(u.user_roles, '"internal_team"')
AND b.engagement_type = 'd2c'
GROUP BY u.id
ORDER BY engagements DESC
```

**Multi-role users (e.g., Consultant + Business Owner):**
```sql
SELECT * FROM USERS
WHERE JSON_LENGTH(user_roles) > 1
```

---

## Summary

### Total Tables: 13

**Must-Have (Core):**
1. USERS (now supports multi-role)
2. CONSULTANTS
3. SERVICES
4. CONSULTANT_SERVICES
5. LANGUAGES
6. CONSULTANT_LANGUAGES
7. BOOKINGS ⭐ (now tracks engagement_type: b2b, b2c, d2c, c2c)
8. REVIEWS
9. CONTACT_INQUIRIES
10. IDEAS_SUBMISSIONS + IDEA_SUBMISSION_FILES
11. CONSULTANT_APPLICATIONS

**Nice-to-Have (Analytics/Operational):**
12. EMAIL_LOGS
13. CHATBOT_CONVERSATIONS

### Key Changes for Multi-Sided Model

| Aspect | Before | After |
|--------|--------|-------|
| User Types | 3 roles (consultant, client, admin) | 5 roles with multi-role support |
| Consultant Field | Hard-coded provider type | Dynamic via user_roles JSON |
| Booking Providers | consultants.id only | Any user.id with relevant role |
| Revenue Models | Single marketplace fee | B2B broker, B2C direct, D2C premium, C2C commission |
| Internal Team | No representation | "internal_team" role for premium D2C |
| Business Owners | Simple "client" | Full business profile with company info |

---

## Implementation Priority

**Phase 1 (MVP):**
- USERS + Auth (multi-role support)
- CONSULTANTS
- SERVICES

- BOOKINGS
- REVIEWS

**Phase 2:**
- CONSULTANT_LANGUAGES
- CONTACT_INQUIRIES
- CONSULTANT_APPLICATIONS
- IDEAS_SUBMISSIONS

**Phase 3 (Enhancements):**
- EMAIL_LOGS
- CHATBOT_CONVERSATIONS
- Payment integration (would add TRANSACTIONS table)
- Analytics & reporting

---

## Key Differences from Initial (Wrong) Analysis

| Aspect | Initial | Corrected |
|--------|---------|-----------|
| Business Model | Generic marketplace | B2B tech consulting + consultant broker |
| Focus | Transaction tracking | Consultant matching + engagement management |
| BOOKINGS | Complex project management | Simple consultant hiring workflow |
| Services | Generic offerings | 5 specific AI service pillars |
| Applications | Not captured | Full consultant application pipeline |
| Ideas | Complex multi-type | Simple project idea capture |
| Target | Broad audience | Businesses + AI professionals |

