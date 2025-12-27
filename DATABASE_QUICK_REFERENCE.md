# 🗂️ Database Quick Reference Guide

## Critical Discovery: BOOKINGS Table ⭐

The most important finding from the re-analysis is that the **BOOKINGS/ENGAGEMENTS table is completely missing**. This table is essential because:

- Users hire consultants (clicks "Hire Now" / "Contact" buttons)
- Need to track which consultant was hired by which client
- Store budget, timeline, and project status
- Linked to payments and project management

**Without this table, you have no way to track consultant-client relationships or transactions.**

---

## Database Schema at a Glance

### Core Tables (Must Have)

```
┌─────────────────────────────────────────────────────────────┐
│ USERS (clients + consultants)                               │
│ ├─ id (PK)                                                  │
│ ├─ name, email, password_hash                               │
│ ├─ user_type: 'client' | 'consultant'                       │
│ └─ timestamps                                               │
└─────────────────────────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────────────────────────┐
│ CONSULTANTS (1-to-1 with USERS)                             │
│ ├─ id (PK), user_id (FK)                                    │
│ ├─ title, tagline, bio, photo_url                           │
│ ├─ location, hourly_rate, min_budget ⭐ NEW                │
│ ├─ years_experience, average_rating                         │
│ └─ timestamps                                               │
└─────────────────────────────────────────────────────────────┘
       ↓              ↓              ↓
   ┌────────┐  ┌──────────┐  ┌──────────────┐
   │REVIEWS │  │SERVICES  │  │LANGUAGES     │
   │(many)  │  │(M-to-M)  │  │(M-to-M)      │
   └────────┘  └──────────┘  └──────────────┘

⭐⭐⭐ CRITICAL - BOOKINGS TABLE ⭐⭐⭐
┌─────────────────────────────────────────────────────────────┐
│ BOOKINGS (tracks hiring)                                    │
│ ├─ id (PK)                                                  │
│ ├─ client_id (FK → USERS)                                   │
│ ├─ consultant_id (FK → CONSULTANTS)                         │
│ ├─ service_id (FK → SERVICES, optional)                     │
│ ├─ budget, hourly_rate                                      │
│ ├─ status: pending|accepted|in_progress|completed|cancelled│
│ ├─ start_date, expected_end_date, actual_end_date           │
│ └─ timestamps                                               │
└─────────────────────────────────────────────────────────────┘

OTHER TABLES:
┌─────────────────────────────────────────────────────────────┐
│ CONTACT_INQUIRIES      │ IDEAS_SUBMISSIONS                   │
│ ├─ name, email, phone  │ ├─ name, email, phone              │
│ ├─ subject, message    │ └─ items (files, audio, video)     │
│ ├─ status              │                                     │
│ └─ timestamps          │ CHATBOT_CONVERSATIONS (optional)    │
└─────────────────────────────────────────────────────────────┘
```

---

## Key Features & Database Requirements

### 1. 🔐 Authentication
**Tables:** USERS
- Signup: POST `/auth/signup` → create USERS record
- Login: POST `/auth/login` → verify USERS credentials
- Logout: POST `/auth/logout` → clear token

### 2. 🎯 Hire Consultants
**Tables:** USERS, CONSULTANTS, BOOKINGS, SERVICES
- List consultants: GET `/consultants` → query CONSULTANTS
- Filter by service/rate/language: JOIN with CONSULTANT_SERVICES, CONSULTANT_LANGUAGES
- View profile: GET `/consultants/:id` → fetch single CONSULTANTS record
- **Hire consultant:** POST `/bookings` → create BOOKINGS record ⭐
- **Contact consultant:** Creates BOOKINGS or CONTACT_INQUIRIES

### 3. ⭐ Write Reviews
**Tables:** REVIEWS, CONSULTANTS
- Submit review: POST `/reviews` → create REVIEWS record
- Auto-update consultant rating: UPDATE CONSULTANTS.average_rating

### 4. 🔍 Search
**Tables:** SERVICES, CONSULTANTS
- Global search: Full-text search across both tables
- Results: Filter and match on name, description, location, bio, services

### 5. 💡 Submit Ideas
**Tables:** IDEAS_SUBMISSIONS, IDEA_SUBMISSION_ITEMS, EMAIL_LOGS (optional)
- Submit form: POST `/ideas/submit` → create IDEAS_SUBMISSIONS + IDEA_SUBMISSION_ITEMS
- Upload files: POST `/integrations/files/upload` → store URL
- Send email: POST `/integrations/email/send` → log in EMAIL_LOGS

### 6. 💬 Chatbot
**Tables:** CHATBOT_CONVERSATIONS (optional), SERVICES, CONSULTANTS
- Store conversation: Create CHATBOT_CONVERSATIONS record
- Load context: Fetch SERVICES & CONSULTANTS data
- Track sessions: Use session_id for persistent conversations

### 7. 📧 Contact Form
**Tables:** CONTACT_INQUIRIES, EMAIL_LOGS (optional)
- Submit: POST `/contact` → create CONTACT_INQUIRIES record
- Send email response: Log in EMAIL_LOGS

---

## What Goes in Each Table

### USERS Table
```javascript
{
  id: "uuid",
  name: "John Doe",
  email: "john@example.com",
  password_hash: "hashed...",
  user_type: "consultant", // or "client"
  is_active: true,
  created_at: "2025-01-01T00:00:00Z",
  updated_at: "2025-01-01T00:00:00Z"
}
```

### CONSULTANTS Table
```javascript
{
  id: "uuid",
  user_id: "uuid (FK)",
  title: "AI Strategy Consultant",
  tagline: "Expert in AI implementation",
  bio: "15+ years of experience...",
  photo_url: "https://...",
  location: "Toronto, ON, Canada",
  hourly_rate: 150.00,
  min_budget: 5000.00,
  years_experience: 15,
  average_rating: 4.8,
  created_at: "2025-01-01T00:00:00Z",
  updated_at: "2025-01-01T00:00:00Z"
}
```

### BOOKINGS Table ⭐ (NEW)
```javascript
{
  id: "uuid",
  client_id: "uuid (FK → USERS)",
  consultant_id: "uuid (FK → CONSULTANTS)",
  service_id: "uuid (FK → SERVICES, optional)",
  budget: 15000.00,
  hourly_rate: 150.00,
  status: "pending", // pending → accepted → in_progress → completed
  start_date: "2025-02-01T00:00:00Z",
  expected_end_date: "2025-03-01T00:00:00Z",
  actual_end_date: null,
  description: "AI strategy implementation for e-commerce",
  created_at: "2025-01-01T00:00:00Z",
  updated_at: "2025-01-01T00:00:00Z"
}
```

### REVIEWS Table
```javascript
{
  id: "uuid",
  consultant_id: "uuid (FK)",
  client_id: "uuid (FK, optional)",
  reviewer_name: "Jane Smith",
  comment: "Excellent work, very professional",
  rating: 5, // 1-5
  created_at: "2025-01-01T00:00:00Z",
  updated_at: "2025-01-01T00:00:00Z"
}
```

### CHATBOT_CONVERSATIONS Table (Optional)
```javascript
{
  id: "uuid",
  user_id: "uuid (FK, optional)",
  session_id: "session_abc123",
  messages_json: [
    { role: "assistant", text: "Hi! How can I help?", timestamp: "..." },
    { role: "user", text: "Looking for AI consultant", timestamp: "..." }
  ],
  context_data: {
    submissionData: { contactInfo: {...}, textQueries: [...] },
    currentPage: "HireConsultant"
  },
  current_page: "HireConsultant",
  user_feedback: 4,
  created_at: "2025-01-01T00:00:00Z",
  updated_at: "2025-01-01T00:00:00Z"
}
```

---

## API Endpoints to Implement

### Authentication
```
POST   /auth/signup              → Create USERS
POST   /auth/login               → Verify USERS
POST   /auth/logout              → Clear auth
GET    /auth/me                  → Get current USERS
```

### Consultants
```
GET    /consultants              → Query CONSULTANTS
GET    /consultants/:id          → Get single CONSULTANTS
GET    /consultants/search?q=    → Search CONSULTANTS
POST   /consultants              → Create CONSULTANTS
PUT    /consultants/:id          → Update CONSULTANTS
```

### Services
```
GET    /services                 → List SERVICES
GET    /services/:id             → Get single SERVICES
GET    /services/search?q=       → Search SERVICES
POST   /services                 → Create SERVICES
PUT    /services/:id             → Update SERVICES
DELETE /services/:id             → Delete SERVICES
```

### Reviews
```
GET    /reviews                  → List REVIEWS
GET    /reviews?consultantId=    → Filter REVIEWS by consultant
POST   /reviews                  → Create REVIEWS (update consultant rating)
PUT    /reviews/:id              → Update REVIEWS
DELETE /reviews/:id              → Delete REVIEWS
```

### Bookings ⭐ NEW
```
GET    /bookings                 → List BOOKINGS (for current user)
GET    /bookings/:id             → Get single BOOKINGS
POST   /bookings                 → Create BOOKINGS (when hiring)
PUT    /bookings/:id             → Update BOOKINGS status
DELETE /bookings/:id             → Cancel BOOKINGS
```

### Contact & Ideas
```
POST   /contact                  → Create CONTACT_INQUIRIES
POST   /ideas/submit             → Create IDEAS_SUBMISSIONS + ITEMS
```

### Integrations
```
POST   /integrations/email/send  → Send email, log in EMAIL_LOGS
POST   /integrations/files/upload → Upload file, return URL
```

---

## Database Indexes (Performance)

**Create these for fast lookups:**
```sql
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_consultants_user_id ON consultants(user_id);
CREATE INDEX idx_reviews_consultant_id ON reviews(consultant_id);
CREATE INDEX idx_bookings_client_id ON bookings(client_id);
CREATE INDEX idx_bookings_consultant_id ON bookings(consultant_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_contact_inquiries_email ON contact_inquiries(email);
CREATE INDEX idx_ideas_submissions_email ON ideas_submissions(email);
CREATE INDEX idx_chatbot_session_id ON chatbot_conversations(session_id);
```

---

## Implementation Checklist

- [ ] **Phase 1: Core Tables** (Week 1)
  - [ ] USERS table + auth endpoints
  - [ ] CONSULTANTS table
  - [ ] BOOKINGS table ⭐
  - [ ] SERVICES table
  - [ ] REVIEWS table

- [ ] **Phase 2: Support Tables** (Week 2)
  - [ ] LANGUAGES + CONSULTANT_LANGUAGES
  - [ ] CONTACT_INQUIRIES
  - [ ] IDEAS_SUBMISSIONS + IDEA_SUBMISSION_ITEMS
  - [ ] EMAIL_LOGS

- [ ] **Phase 3: Optional/Analytics** (Week 3)
  - [ ] CHATBOT_CONVERSATIONS
  - [ ] Payment tracking (would need TRANSACTIONS table)
  - [ ] Admin dashboard queries

---

## Technology Stack Recommendations

**Database:** PostgreSQL (or MySQL)
**Backend:** Node.js + Express.js
**ORM:** Prisma or Sequelize
**File Storage:** AWS S3, Cloudinary, or Firebase Storage
**Payments:** Stripe or PayPal (future)

---

## Critical Success Factors

1. ✅ **BOOKINGS table MUST exist** - Without it, hiring functionality is broken
2. ✅ **Foreign keys with CASCADE** - Deleting consultant should delete bookings
3. ✅ **Proper status tracking** - Booking lifecycle needs clear states
4. ✅ **Indexes on frequently queried columns** - Performance for searches
5. ✅ **JWT token management** - Secure authentication
6. ✅ **Transaction support** - For booking creation + payment (future)
