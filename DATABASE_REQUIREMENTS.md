# MasterProDev - Relational Database Requirements

## Project Overview
**MasterProDev** is an AI-focused **consultant hiring platform** with a dual-sided marketplace:

**Client Side:** Professionals & organizations seeking AI consultants for:
- Career advancement (AI-optimized resumes, strategic guidance)
- Business acceleration (AI implementation, automation workflows, business strategy)
- Project execution (custom AI solutions, consulting)

**Consultant Side:** Elite AI experts offering services like:
- AI Strategy consulting
- Career transformation/Resume optimization
- Business acceleration & automation
- Custom AI implementations
- Project-based engagements

The platform requires a relational database to manage users (clients & consultants), consultant profiles, services, reviews, bookings/engagements, and inquiries.

---

## Core Entities & Tables

### 1. **USERS Table**
**Purpose:** Store user account information (both regular users and consultants)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID/INT | PRIMARY KEY | Unique user identifier |
| name | VARCHAR(255) | NOT NULL | Full name |
| email | VARCHAR(255) | NOT NULL, UNIQUE | Email address for login |
| password_hash | VARCHAR(255) | NOT NULL | Hashed password |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Account creation date |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Last update |
| is_active | BOOLEAN | DEFAULT TRUE | Account status |
| user_type | ENUM | ('client', 'consultant') | User role |

**API Endpoints Using This:**
- POST `/auth/signup` (SignupPage.jsx)
- POST `/auth/login` (LoginPage.jsx)
- GET `/auth/me` (User.js)
- POST `/auth/logout` (User.js)

**Location in Code:** [src/pages/SignupPage.jsx](src/pages/SignupPage.jsx), [src/pages/LoginPage.jsx](src/pages/LoginPage.jsx), [src/entities/User.js](src/entities/User.js)

---

### 2. **CONSULTANTS Table**
**Purpose:** Store consultant profile information

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID/INT | PRIMARY KEY | Unique consultant identifier |
| user_id | UUID/INT | NOT NULL, FOREIGN KEY | References USERS.id |
| title | VARCHAR(255) | NOT NULL | Job title/specialization |
| tagline | TEXT | | Short description |
| bio | TEXT | | Detailed biography |
| photo_url | VARCHAR(500) | | Profile photo URL |
| location | VARCHAR(255) | | Geographic location |
| hourly_rate | DECIMAL(10,2) | NOT NULL | Hourly consultation rate |
| min_budget | DECIMAL(10,2) | | Minimum project budget |
| average_rating | DECIMAL(3,2) | DEFAULT 0 | Calculated average of reviews |
| years_experience | INT | | Years in the field |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Profile creation date |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Last profile update |

**API Endpoints Using This:**
- GET `/consultants` (HireConsultant.jsx, Consultant.list())
- GET `/consultants/:id` (ConsultantDetail.jsx)
- GET `/consultants/search?q=query` (Consultant.search())
- POST `/consultants` (Consultant.create())
- PUT `/consultants/:id` (Consultant.update(), ConsultantDetail.jsx)

**Location in Code:** [src/pages/HireConsultant.jsx](src/pages/HireConsultant.jsx), [src/pages/ConsultantDetail.jsx](src/pages/ConsultantDetail.jsx), [src/entities/Consultant.js](src/entities/Consultant.js)

---

### 3. **SERVICES Table**
**Purpose:** Store available services/offerings

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID/INT | PRIMARY KEY | Unique service identifier |
| name | VARCHAR(255) | NOT NULL, UNIQUE | Service name |
| description | TEXT | | Detailed description |
| category | VARCHAR(100) | | Service category |
| icon | VARCHAR(100) | | Icon/emoji identifier |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Creation date |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Last update |

**Junction Table:** `CONSULTANT_SERVICES`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID/INT | PRIMARY KEY | |
| consultant_id | UUID/INT | NOT NULL, FOREIGN KEY | References CONSULTANTS.id |
| service_id | UUID/INT | NOT NULL, FOREIGN KEY | References SERVICES.id |
| UNIQUE (consultant_id, service_id) | | | Prevent duplicates |

**API Endpoints Using This:**
- GET `/services` (Service.list())
- GET `/services/:id` (Service.getById())
- GET `/services/search?q=query` (Service.search())
- POST `/services` (Service.create())
- PUT `/services/:id` (Service.update())
- DELETE `/services/:id` (Service.delete())

**Location in Code:** [src/entities/Service.js](src/entities/Service.js), [src/pages/ServicesPage.jsx](src/pages/ServicesPage.jsx)

---

### 4. **REVIEWS Table**
**Purpose:** Store consultant reviews and ratings

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID/INT | PRIMARY KEY | Unique review identifier |
| consultant_id | UUID/INT | NOT NULL, FOREIGN KEY | References CONSULTANTS.id |
| client_id | UUID/INT | | References USERS.id (optional) |
| reviewer_name | VARCHAR(255) | NOT NULL | Name of reviewer |
| comment | TEXT | NOT NULL | Review comment |
| rating | INT | NOT NULL, CHECK (rating >= 1 AND rating <= 5) | Star rating 1-5 |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Review date |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Last update |

**API Endpoints Using This:**
- GET `/reviews` (Review.list(), ReviewsSection.jsx)
- GET `/reviews?consultantId=:id` (Review.filter(), ConsultantDetail.jsx)
- GET `/reviews/:id` (Review.getById())
- POST `/reviews` (Review.create(), ConsultantDetail.jsx)
- PUT `/reviews/:id` (Review.update())
- DELETE `/reviews/:id` (Review.delete())

**Location in Code:** [src/entities/Review.js](src/entities/Review.js), [src/components/home/ReviewsSection.jsx](src/components/home/ReviewsSection.jsx), [src/pages/ConsultantDetail.jsx](src/pages/ConsultantDetail.jsx)

---

### 5. **LANGUAGES Table**
**Purpose:** Store consultant language proficiencies

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID/INT | PRIMARY KEY | |
| language_name | VARCHAR(100) | NOT NULL, UNIQUE | Language name |

**Junction Table:** `CONSULTANT_LANGUAGES`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID/INT | PRIMARY KEY | |
| consultant_id | UUID/INT | NOT NULL, FOREIGN KEY | References CONSULTANTS.id |
| language_id | UUID/INT | NOT NULL, FOREIGN KEY | References LANGUAGES.id |
| UNIQUE (consultant_id, language_id) | | | Prevent duplicates |

**Usage Context:** Used in HireConsultant.jsx for language filtering

**Location in Code:** [src/pages/HireConsultant.jsx](src/pages/HireConsultant.jsx#L37)

---

### 6. **CONTACT_INQUIRIES Table**
**Purpose:** Store contact form submissions and inquiries

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID/INT | PRIMARY KEY | Unique inquiry identifier |
| name | VARCHAR(255) | NOT NULL | Submitter's name |
| email | VARCHAR(255) | NOT NULL | Email address |
| phone | VARCHAR(20) | | Phone number |
| subject | VARCHAR(255) | | Inquiry subject |
| message | TEXT | NOT NULL | Inquiry message |
| status | ENUM | DEFAULT 'new' | ('new', 'read', 'responded', 'closed') |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Submission date |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Last update |

**API Endpoints Using This:**
- POST `/contact` (ContactSection.jsx form submission)

**Location in Code:** [src/components/home/ContactSection.jsx](src/components/home/ContactSection.jsx)

---

### 7. **IDEAS_SUBMISSIONS Table**
**Purpose:** Store "Tell Your Idea" form submissions with attachments

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID/INT | PRIMARY KEY | Unique submission identifier |
| name | VARCHAR(255) | NOT NULL | Submitter's name |
| email | VARCHAR(255) | NOT NULL | Email address |
| phone | VARCHAR(20) | | Phone number |
| status | ENUM | DEFAULT 'submitted' | ('submitted', 'reviewing', 'approved', 'rejected') |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Submission date |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Last update |

**Junction Table:** `IDEA_SUBMISSION_ITEMS`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID/INT | PRIMARY KEY | |
| submission_id | UUID/INT | NOT NULL, FOREIGN KEY | References IDEAS_SUBMISSIONS.id |
| item_type | ENUM | NOT NULL | ('text', 'file', 'audio', 'video', 'link') |
| item_name | VARCHAR(255) | | Name/title of item |
| item_content | LONGTEXT | | Text content |
| file_url | VARCHAR(500) | | URL to uploaded file |
| file_size | BIGINT | | File size in bytes |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | |

**API Endpoints Using This:**
- POST `/ideas/submit` (TellYourIdeaPage.jsx form submission)
- POST `/integrations/files/upload` (File uploads)

**Location in Code:** [src/pages/TellYourIdeaPage.jsx](src/pages/TellYourIdeaPage.jsx)

---

### 8. **EMAIL_LOGS Table** (Optional but Recommended)
**Purpose:** Track all email communications sent through the platform

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID/INT | PRIMARY KEY | |
| recipient_email | VARCHAR(255) | NOT NULL | Email recipient |
| subject | VARCHAR(255) | NOT NULL | Email subject |
| body | LONGTEXT | | Email body |
| email_type | ENUM | NOT NULL | ('contact_form', 'contact_response', 'inquiry', 'notification') |
| status | ENUM | DEFAULT 'pending' | ('pending', 'sent', 'failed', 'bounced') |
| sent_at | TIMESTAMP | | When email was sent |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Creation date |

**API Endpoints Using This:**
- POST `/integrations/email/send` (Core.js)

**Location in Code:** [src/integrations/Core.js](src/integrations/Core.js)

---

### 9. **BOOKINGS/ENGAGEMENTS Table** ⭐ **CRITICAL**
**Purpose:** Store consultant hiring/booking transactions and engagements

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID/INT | PRIMARY KEY | Unique booking identifier |
| client_id | UUID/INT | NOT NULL, FOREIGN KEY | References USERS.id (client) |
| consultant_id | UUID/INT | NOT NULL, FOREIGN KEY | References CONSULTANTS.id |
| service_id | UUID/INT | | References SERVICES.id (optional) |
| budget | DECIMAL(10,2) | NOT NULL | Project budget/total cost |
| hourly_rate | DECIMAL(10,2) | NOT NULL | Rate charged for this engagement |
| status | ENUM | DEFAULT 'pending' | ('pending', 'accepted', 'in_progress', 'completed', 'cancelled') |
| start_date | TIMESTAMP | | When engagement starts |
| expected_end_date | TIMESTAMP | | Expected completion date |
| actual_end_date | TIMESTAMP | | Actual completion date |
| description | TEXT | | Project description |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Booking date |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Last update |

**Usage Context:** When user clicks "Hire Now" or "Contact" buttons on consultant profiles and service pages

**Location in Code:** [src/pages/HireConsultant.jsx](src/pages/HireConsultant.jsx#L230), [src/pages/ConsultantDetail.jsx](src/pages/ConsultantDetail.jsx#L124)

---

### 10. **CHATBOT_CONVERSATIONS Table** (Optional but Recommended)
**Purpose:** Store chatbot conversation history and context for analytics

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID/INT | PRIMARY KEY | Unique conversation identifier |
| user_id | UUID/INT | | References USERS.id (optional if anonymous) |
| session_id | VARCHAR(255) | UNIQUE | Browser session identifier |
| messages_json | LONGTEXT | | JSON array of chat messages |
| context_data | LONGTEXT | | JSON data passed from forms |
| current_page | VARCHAR(255) | | Page where chat occurred |
| user_feedback | INT | | Rating 1-5 for conversation quality |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Conversation start |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Last message timestamp |

**Usage Context:** Floating chatbot with context from idea submissions and general queries

**Location in Code:** [src/components/shared/FloatingChatbot.jsx](src/components/shared/FloatingChatbot.jsx)

---

## Relational Diagram

```
USERS
├── CONSULTANTS (one-to-one: user_id FK)
│   ├── CONSULTANT_LANGUAGES (many-to-many via junction)
│   │   └── LANGUAGES
│   ├── CONSULTANT_SERVICES (many-to-many via junction)
│   │   └── SERVICES
│   ├── REVIEWS (one-to-many: consultant_id FK)
│   │   └── CLIENT references USERS
│   └── BOOKINGS (one-to-many: consultant_id FK)
│       └── CLIENT references USERS
│
├── BOOKINGS (many-to-many: client_id FK)
│   └── CONSULTANTS
│
├── CHATBOT_CONVERSATIONS (one-to-many: user_id FK)

CONTACT_INQUIRIES (standalone)

IDEAS_SUBMISSIONS (one-to-many)
└── IDEA_SUBMISSION_ITEMS

EMAIL_LOGS (audit/logging)
```

---

## Implementation Locations - Where to Add Database Layer

### 1. **Backend API Server**
**Recommended Location:** New `backend/` or `server/` directory

Create these files:
- `backend/models/User.js` - Database model & queries
- `backend/models/Consultant.js`
- `backend/models/Service.js`
- `backend/models/Review.js`
- `backend/models/ContactInquiry.js`
- `backend/models/IdeaSubmission.js`
- `backend/routes/auth.js` - Authentication endpoints
- `backend/routes/consultants.js` - Consultant CRUD
- `backend/routes/services.js` - Services CRUD
- `backend/routes/reviews.js` - Reviews CRUD
- `backend/routes/contact.js` - Contact form handling
- `backend/routes/ideas.js` - Ideas submission handling
- `backend/db/connection.js` - Database connection setup
- `backend/db/migrations/` - Schema creation scripts

**Tech Stack Recommendation:**
- Node.js + Express.js
- PostgreSQL or MySQL
- Sequelize or Prisma ORM

### 2. **API Client Integration**
**File to Update:** [src/api/base44Client.js](src/api/base44Client.js)

Change baseURL from mock to your backend:
```javascript
baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
```

### 3. **Environment Configuration**
**File to Create:** `.env` (backend) and update `.env.local` (frontend)

```
# Frontend (.env.local)
VITE_API_URL=http://localhost:3000/api

# Backend (.env)
DATABASE_URL=postgresql://user:password@localhost:5432/masterprodev
JWT_SECRET=your_secret_key
NODE_ENV=development
```

---

## Database Schema SQL Templates

### PostgreSQL Example:

```sql
-- Create USERS table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  user_type ENUM NOT NULL DEFAULT 'client',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create CONSULTANTS table
CREATE TABLE consultants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  title VARCHAR(255) NOT NULL,
  tagline TEXT,
  bio TEXT,
  photo_url VARCHAR(500),
  location VARCHAR(255),
  hourly_rate DECIMAL(10,2) NOT NULL,
  min_budget DECIMAL(10,2),
  average_rating DECIMAL(3,2) DEFAULT 0,
  years_experience INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create SERVICES table
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  category VARCHAR(100),
  icon VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create junction table CONSULTANT_SERVICES
CREATE TABLE consultant_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consultant_id UUID NOT NULL,
  service_id UUID NOT NULL,
  UNIQUE (consultant_id, service_id),
  FOREIGN KEY (consultant_id) REFERENCES consultants(id) ON DELETE CASCADE,
  FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
);

-- Create REVIEWS table
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consultant_id UUID NOT NULL,
  client_id UUID,
  reviewer_name VARCHAR(255) NOT NULL,
  comment TEXT NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (consultant_id) REFERENCES consultants(id) ON DELETE CASCADE,
  FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Create LANGUAGES table
CREATE TABLE languages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  language_name VARCHAR(100) NOT NULL UNIQUE
);

-- Create junction table CONSULTANT_LANGUAGES
CREATE TABLE consultant_languages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consultant_id UUID NOT NULL,
  language_id UUID NOT NULL,
  UNIQUE (consultant_id, language_id),
  FOREIGN KEY (consultant_id) REFERENCES consultants(id) ON DELETE CASCADE,
  FOREIGN KEY (language_id) REFERENCES languages(id) ON DELETE CASCADE
);

-- Create CONTACT_INQUIRIES table
CREATE TABLE contact_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  subject VARCHAR(255),
  message TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create IDEAS_SUBMISSIONS table
CREATE TABLE ideas_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  status VARCHAR(50) DEFAULT 'submitted',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create IDEA_SUBMISSION_ITEMS table
CREATE TABLE idea_submission_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID NOT NULL,
  item_type VARCHAR(50) NOT NULL,
  item_name VARCHAR(255),
  item_content LONGTEXT,
  file_url VARCHAR(500),
  file_size BIGINT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (submission_id) REFERENCES ideas_submissions(id) ON DELETE CASCADE
);

-- Create EMAIL_LOGS table
CREATE TABLE email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_email VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  body LONGTEXT,
  email_type VARCHAR(50) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  sent_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create BOOKINGS/ENGAGEMENTS table
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL,
  consultant_id UUID NOT NULL,
  service_id UUID,
  budget DECIMAL(10,2) NOT NULL,
  hourly_rate DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  start_date TIMESTAMP,
  expected_end_date TIMESTAMP,
  actual_end_date TIMESTAMP,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (consultant_id) REFERENCES consultants(id) ON DELETE CASCADE,
  FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE SET NULL
);

-- Create CHATBOT_CONVERSATIONS table
CREATE TABLE chatbot_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  session_id VARCHAR(255) NOT NULL UNIQUE,
  messages_json LONGTEXT,
  context_data LONGTEXT,
  current_page VARCHAR(255),
  user_feedback INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_consultants_user_id ON consultants(user_id);
CREATE INDEX idx_reviews_consultant_id ON reviews(consultant_id);
CREATE INDEX idx_contact_inquiries_email ON contact_inquiries(email);
CREATE INDEX idx_ideas_submissions_email ON ideas_submissions(email);
CREATE INDEX idx_email_logs_recipient ON email_logs(recipient_email);
CREATE INDEX idx_bookings_client_id ON bookings(client_id);
CREATE INDEX idx_bookings_consultant_id ON bookings(consultant_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_chatbot_session_id ON chatbot_conversations(session_id);
CREATE INDEX idx_chatbot_user_id ON chatbot_conversations(user_id);
```

---

## Summary

### Total Tables: 12
1. USERS
2. CONSULTANTS
3. SERVICES
4. CONSULTANT_SERVICES (junction)
5. REVIEWS
6. LANGUAGES
7. CONSULTANT_LANGUAGES (junction)
8. CONTACT_INQUIRIES
9. IDEAS_SUBMISSIONS
10. IDEA_SUBMISSION_ITEMS
11. BOOKINGS/ENGAGEMENTS ⭐ **CRITICAL - MISSING**
12. CHATBOT_CONVERSATIONS (optional)
13. EMAIL_LOGS (optional)

### Estimated Data Volume (Initial):
- Users: 100-1,000
- Consultants: 10-100
- Services: 20-50
- Reviews: 50-500
- Contact Inquiries: 10-100/month
- Idea Submissions: 5-50/month

### Next Steps:
1. Choose database system (PostgreSQL recommended)
2. Set up backend server (Node.js/Express)
3. Create database schema using provided SQL
4. Implement ORM (Sequelize/Prisma)
5. Build API endpoints
6. Connect frontend to real API
7. Deploy to production
