# Inline Admin Editing System - Implementation Plan

## Overview
Instead of a separate admin section, admins can edit content directly on each page. Admin UI elements only appear when logged in with an admin account.

## Architecture

### Authentication Context
- Create `AuthContext` to manage user authentication state
- Store user role (admin/user) and authentication status
- Provide login/logout functions
- Persist auth state in localStorage

### Admin UI Components
- **FloatingAdminButton**: Fixed button to toggle edit mode
- **InlineEditCard**: Wrapper for editable content cards
- **QuickAddButton**: Floating action button to add new items
- **EditModal**: Modal for editing/creating content
- **DeleteConfirm**: Confirmation dialog for deletions

## Page-by-Page Implementation

### 1. Events Page (`/events`)
**Admin Features:**
- Edit existing event cards (inline)
- Add new events (+ button)
- Delete events (trash icon on hover)
- Edit filters and categories

**Editable Fields:**
- Title, description, date, location
- Category, status
- Image URL, logo URL
- Registration link

### 2. News Page (`/news`)
**Admin Features:**
- Edit existing articles (inline)
- Add new articles (+ button)
- Delete articles
- Toggle featured status
- Edit categories

**Editable Fields:**
- Title, excerpt, content
- Author, published date
- Category, tags
- Image URL
- Read time, featured flag

### 3. Team Page (`/team`)
**Admin Features:**
- Edit member profiles (inline)
- Add new members (+ button)
- Remove members
- Update roles and tags

**Editable Fields:**
- Name, role, description
- Avatar URL
- Social links (LinkedIn, Twitter, GitHub, Website)
- Tags, leader status

### 4. TPO Page (`/tpo`)
**Admin Features:**
- Edit stats (Students Placed, Companies, Packages)
- Edit services
- Add/remove recruiters
- Add/edit placement records
- Update contact information

**Editable Fields:**
- **Stats**: Value, label
- **Services**: Title, description
- **Recruiters**: Company name, logo
- **Placements**: Name, company, role, CTC, avatar
- **Contact**: Email, phone, address

### 5. Home Page (`/`)
**Admin Features:**
- Edit hero section text
- Update stats
- Edit feature cards
- Manage gallery images
- Update CTA section

**Editable Fields:**
- Hero title, subtitle
- Stats values
- Feature titles, descriptions
- Gallery images with captions
- CTA text and buttons

## Technical Implementation

### 1. Auth System
```typescript
// src/contexts/AuthContext.tsx
interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}
```

### 2. Admin Wrapper Component
```typescript
// src/components/admin/AdminWrapper.tsx
// Shows children only when user is admin
<AdminWrapper>
  <EditButton onClick={handleEdit} />
</AdminWrapper>
```

### 3. Inline Edit Pattern
```typescript
// Each card becomes editable
<div className="card">
  {isAdmin && (
    <div className="admin-controls">
      <button onClick={() => handleEdit(item)}>Edit</button>
      <button onClick={() => handleDelete(item.id)}>Delete</button>
    </div>
  )}
  {/* Card content */}
</div>
```

### 4. API Integration
- Use existing service files (eventService, newsService, teamService)
- Add update/delete/create functions
- Handle optimistic updates for better UX

## UI/UX Design

### Admin Mode Indicator
- Floating badge: "Admin Mode" (top-right)
- Toggle switch to enable/disable edit mode
- Visual indicators on editable elements (hover border)

### Edit Controls
- **Edit Icon**: Pencil icon on hover
- **Delete Icon**: Trash icon on hover
- **Add Button**: Floating + button (bottom-right)
- **Save/Cancel**: In edit modal

### Visual States
- **Normal**: Regular card appearance
- **Hover (Admin)**: Blue border, edit/delete icons appear
- **Editing**: Modal opens with form
- **Saving**: Loading spinner, disabled buttons

## Implementation Steps

1. **Phase 1: Auth System**
   - Create AuthContext
   - Implement login/logout
   - Add protected routes
   - Create admin login page

2. **Phase 2: Admin Components**
   - AdminWrapper component
   - FloatingAdminButton
   - EditModal component
   - DeleteConfirm dialog

3. **Phase 3: Events Page**
   - Add admin controls to event cards
   - Implement edit/delete/create
   - Test CRUD operations

4. **Phase 4: News Page**
   - Add admin controls to news cards
   - Implement edit/delete/create
   - Add featured toggle

5. **Phase 5: Team Page**
   - Add admin controls to member cards
   - Implement edit/delete/create
   - Handle social links

6. **Phase 6: TPO Page**
   - Add admin controls to all sections
   - Implement edit for stats, services, recruiters, placements
   - Update contact info

7. **Phase 7: Home Page**
   - Add admin controls to hero, stats, features, gallery, CTA
   - Implement inline editing for all sections

## Security Considerations

- **Backend**: Verify admin role on all write operations
- **Frontend**: Hide admin UI from non-admin users
- **API**: Use JWT tokens for authentication
- **Validation**: Validate all inputs before submission
- **CSRF**: Implement CSRF protection
- **Rate Limiting**: Prevent abuse of admin endpoints

## Next Steps

1. Create AuthContext and login system
2. Build reusable admin components
3. Integrate admin controls into Events page (pilot)
4. Roll out to other pages
5. Test thoroughly
6. Deploy with proper security measures


