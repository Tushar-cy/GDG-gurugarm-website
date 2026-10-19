# GDG GUG Website - Project Information

**Last Updated:** October 6, 2025  
**Status:** ✅ Production (https://gdggug.com)  
**Architecture:** MVVP (Model-View-ViewModel-Presenter)

---

## 🎯 Project Overview

A modern, full-stack web application for GDG (Google Developer Groups) GUG chapter with content management, event registration, and form builder capabilities.

### Tech Stack
- **Frontend:** React 18 + TypeScript + Vite + Tailwind CSS
- **Backend:** Spring Boot 3.2 + PostgreSQL
- **Deployment:** Nginx (reverse proxy) + Systemd services
- **Domain:** https://gdggug.com (managed via Cloudflare)
- **Package Manager:** pnpm
- **Icons:** Heroicons

---

## 📁 Project Structure

```
/home/techteam/gdgwork/
├── mainSite/          # Frontend React application
│   ├── src/
│   │   ├── pages/                # Main pages
│   │   │   ├── Home.tsx
│   │   │   ├── Events.tsx
│   │   │   ├── Team.tsx
│   │   │   ├── News.tsx
│   │   │   ├── FormSubmission.tsx    # Public form submission
│   │   │   └── admin/
│   │   │       ├── FormBuilder.tsx   # Form builder UI
│   │   │       ├── FormsList.tsx     # Forms management
│   │   │       └── FormSubmissions.tsx # View submissions
│   │   ├── components/
│   │   │   ├── Navbar.tsx
│   │   │   ├── MobileDock.tsx
│   │   │   └── admin/
│   │   │       ├── EditModal.tsx
│   │   │       ├── DeleteConfirm.tsx
│   │   │       ├── AdminWrapper.tsx
│   │   │       └── ImageUpload.tsx
│   │   ├── services/
│   │   │   ├── eventService.ts
│   │   │   ├── teamService.ts
│   │   │   ├── newsService.ts
│   │   │   └── formService.ts        # Form builder API
│   │   ├── contexts/
│   │   │   └── AuthContext.tsx
│   │   └── config/
│   │       └── api.ts
│   └── dist/          # Production build
│
├── backend/           # Spring Boot backend
│   ├── src/main/java/com/gdg/backend/
│   │   ├── controller/
│   │   │   ├── EventController.java
│   │   │   ├── TeamController.java
│   │   │   ├── NewsController.java
│   │   │   ├── RegistrationFormController.java
│   │   │   └── FormSubmissionController.java
│   │   ├── model/
│   │   │   ├── Event.java
│   │   │   ├── TeamMember.java
│   │   │   ├── News.java
│   │   │   ├── RegistrationForm.java
│   │   │   └── FormSubmission.java
│   │   ├── repository/
│   │   │   ├── EventRepository.java
│   │   │   ├── RegistrationFormRepository.java
│   │   │   └── FormSubmissionRepository.java
│   │   └── service/
│   │       ├── EventService.java
│   │       ├── RegistrationFormService.java
│   │       └── FormSubmissionService.java
│   └── docker-compose.yml  # PostgreSQL + pgAdmin
│
├── start-all.sh       # Start all services
├── stop-all.sh        # Stop all services
├── backup-db.sh       # Database backup
└── restore-db.sh      # Database restore
```

---

## 🚀 Features

### 1. **Content Management System**
- Events management with status tracking (Upcoming/Ongoing/Past)
- Team members directory with social links
- News articles and announcements
- Admin authentication and edit mode
- iOS-style mobile filter bars for Events, Team, and News

### 2. **Form Builder System** ✨ NEW
- **Drag-and-drop form designer** for admins
- **10 field types:**
  - Text Input
  - Email
  - Phone
  - Number
  - Long Text (textarea)
  - Radio Buttons
  - Checkboxes
  - Dropdown (select)
  - Date Picker
  - File Upload
- **Form features:**
  - Custom header images
  - Link forms to events
  - Set maximum submissions
  - Set form close dates
  - Active/inactive toggle
  - Field validation
  - Required field marking
- **Public submission page** with real-time validation
- **Submissions dashboard** with CSV export
- **Event integration:** Events can have registration forms

### 3. **Mobile-First Design**
- Scroll-triggered filter bars on mobile
- Bottom sheet modals for filters
- Active filter pills with remove buttons
- Dock-style navigation for mobile
- Responsive grid layouts

### 4. **Admin Controls**
- Auto-enable edit mode on admin login
- Inline edit/delete buttons on hover
- "Forms" link in navbar for admins
- "Create Form" button on events without forms
- Logout button (border style) replaces Sign in when authenticated

---

## 🔐 Admin Credentials

**Email:** `admin@gdg.com`  
**Password:** `Kronos@998#`

---

## 🗄️ Database Schema

### Core Tables
- `events` - Event information with registration form links
- `team_members` - Team member profiles
- `news` / `news_articles` - News content
- `registration_forms` - Form definitions (stores JSON field structure)
- `form_submissions` - Form responses (stores JSON submission data)

### New Fields in Events Table
- `registration_form_id` (BIGINT) - Links to registration_forms table
- `has_registration` (BOOLEAN) - Quick check if registration is available

---

## 🔧 Development Workflow

### Local Development
```bash
# Start all services (PostgreSQL, Backend, Frontend)
cd /home/techteam/gdgwork
./start-all.sh

# Access:
# - Frontend: http://localhost:3000
# - Backend API: http://localhost:3001/api
# - pgAdmin: http://localhost:5050
```

### Building for Production
```bash
# Frontend build
cd /home/techteam/gdgwork/mainSite
pnpm run build

# Backend is auto-built by systemd service
```

### Deployment
```bash
# Stop services
cd /home/techteam/gdgwork
./stop-all.sh

# Copy frontend build to production
sudo cp -r mainSite/dist/* mainSite/dist-server/

# Restart backend
sudo systemctl daemon-reload
sudo systemctl restart gdg-backend

# Reload nginx
sudo systemctl reload nginx
```

---

## 🌐 Production Setup

### Nginx Configuration
- **File:** `/etc/nginx/sites-available/gdggug`
- **Static files:** `/home/techteam/gdgwork/mainSite/dist`
- **API proxy:** `/api` → `http://localhost:3001`
- **Cache headers:** HTML files set to no-cache for fresh builds

### Systemd Service
- **File:** `/etc/systemd/system/gdg-backend.service`
- **Command:** `mvn spring-boot:run`
- **Restart:** Always on failure
- **User:** root (for port binding)

### Database Backup
```bash
# Manual backup
cd /home/techteam/gdgwork
./backup-db.sh

# Backups stored in: backend/backups/
```

### CORS Configuration
- **Allow all origins:** `allowedOriginPatterns("*")`
- **Supports:** Cloudflare proxy (Orange Cloud enabled)
- **SSL/TLS:** Managed by Cloudflare

---

## 🎨 UI/UX Preferences

- **Wireframes:** No colors, blueprint style [[memory:7856060]]
- **Development:** Smaller chunks, incremental changes [[memory:7744574]]
- **Code updates:** Minimal bullet points, not verbose [[memory:6956192]]
- **Content style:** Paragraph form, human-like, not AI-sounding [[memory:6956186]]

---

## 📍 Current State

### ✅ Completed Features
1. ✅ Database schema for forms and submissions
2. ✅ Backend API (CRUD for forms & submissions)
3. ✅ Admin form builder UI (drag-and-drop)
4. ✅ Public form submission page
5. ✅ Event-form integration
6. ✅ Submissions dashboard with CSV export
7. ✅ Deployed to production

### 🎯 How to Use Form Builder

**For Admins:**
1. Login at https://gdggug.com/admin/login
2. Click "Forms" in the navbar
3. Click "Create New Form"
4. Drag and drop field types to build your form
5. Configure each field (label, placeholder, required, options)
6. Link to an event (optional)
7. Set max submissions and close date (optional)
8. Save the form
9. View submissions in the submissions dashboard
10. Export submissions as CSV

**For Users:**
1. Visit an event page
2. Click "Register Now" button (if form exists)
3. Fill out the form
4. Submit
5. See confirmation message

---

## 🔗 Important Links

- **Live Site:** https://gdggug.com
- **Admin Login:** https://gdggug.com/admin/login
- **Forms Management:** https://gdggug.com/admin/forms
- **Local Dev:** http://localhost:3000
- **API Health:** https://gdggug.com/api/health

---

## 📝 Notes

- Frontend uses runtime detection for API URL (not `import.meta.env.PROD`)
- Scrollbars hidden globally via CSS
- Body scroll locked when modals are open
- "Tech Team" added as a filter category
- FloatingAdminButton removed (mobile interference)
- Dashboard and EnhancedDashboard files are legacy (renamed to .old)

---

## 🐛 Known Issues & Fixes

### Fixed Issues:
- ✅ Mixed content error (HTTP→HTTPS) - Fixed with runtime API URL detection
- ✅ CORS blocking Cloudflare - Fixed with `allowedOriginPatterns("*")`
- ✅ Browser caching old builds - Added no-cache headers for HTML
- ✅ K3s port conflict - Completely removed K3s
- ✅ TypeScript errors in legacy admin files - Renamed to .old

---

## 🎓 Architecture Notes

The project follows **MVVP (Model-View-ViewModel-Presenter)** pattern [[memory:6956196]]:

- **Model:** Spring Boot entities (Event, RegistrationForm, FormSubmission, etc.)
- **View:** React components (pages, UI components)
- **ViewModel:** TypeScript interfaces and services (formService, eventService)
- **Presenter:** React hooks (useState, useEffect, custom hooks)

Code is modular and split across multiple files, not monolithic [[memory:6956196]].

---

## 📦 Dependencies

### Frontend
- React 18
- React Router DOM
- TypeScript
- Vite
- Tailwind CSS
- Heroicons
- React Icons
- Lenis (smooth scrolling)

### Backend
- Spring Boot 3.2
- Spring Data JPA
- PostgreSQL driver
- Hibernate
- Jakarta Validation
- Lombok
- Jackson (JSON)

---

**End of Project Information**
