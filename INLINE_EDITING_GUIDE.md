# Inline Editing System - User Guide

## Overview
The inline editing system allows admins to edit content directly on each page when logged in and in edit mode.

## How to Use

### Step 1: Login as Admin
1. Navigate to `http://localhost:3000/admin/login`
2. Enter credentials:
   - **Email**: `admin@gdg.com`
   - **Password**: `admin123`
3. Click "Sign In as Admin"

### Step 2: Enable Edit Mode
1. After login, you'll see admin controls in the bottom-right
2. Click the **"Enable Editing"** button
3. The button will turn green and say **"Exit Edit Mode"**
4. A green indicator will appear at the top: **"Edit Mode Active"**

### Step 3: Edit Content
When edit mode is active, you'll see admin controls on all editable content:

#### On Event Cards (and similar content):
- **Hover over any card** to reveal edit controls
- **Edit Icon** (blue): Click to open edit modal
- **Delete Icon** (red): Click to delete the item
- **Add Button**: Top-right to add new events

## Features

### Events Page

#### Edit Event
1. Hover over an event card
2. Click the blue **Edit** icon
3. Edit modal opens with form fields:
   - Event Title
   - Description
   - Date & Time
   - Location
   - Category (Workshop, Hackathon, Meetup, Conference)
   - Status (Upcoming, Ongoing, Past)
   - Cover Image URL
   - Event Logo URL
   - Registration Link
4. Make your changes
5. Click **"Save Changes"**

#### Add New Event
1. Click **"Add New Event"** button (top-right)
2. Fill in all fields in the modal
3. Click **"Save Changes"**

#### Delete Event
1. Hover over an event card
2. Click the red **Delete** icon
3. Confirmation dialog appears
4. Click **"Delete"** to confirm

### Visual Indicators

#### Edit Mode Active
- **Green badge at top**: "Edit Mode Active" with pulsing dot
- **Edit/Delete icons**: Appear on hover over cards
- **Add buttons**: Visible in sections

#### Edit Mode Inactive
- No edit controls visible
- Clean viewing experience
- Regular user view

## UI Components

### Edit Modal
- **Large modal** with form fields
- **Sticky header** with title and close button
- **Scrollable content** area
- **Sticky footer** with Cancel and Save buttons
- **Loading state**: "Saving..." when processing

### Delete Confirmation
- **Warning dialog** with exclamation icon
- **Red gradient** styling
- **Confirmation message**
- **Cancel and Delete** buttons
- **Loading state**: "Deleting..." when processing

### Admin Controls on Cards
- **Edit button**: Blue gradient, edit icon
- **Delete button**: Red gradient, trash icon
- **Hover effects**: Scale up on hover
- **Smooth transitions**: 300ms animations

## Keyboard Shortcuts
- **Escape**: Close any open modal
- **Tab**: Navigate through form fields
- **Enter**: Submit form (when focused on input)

## Tips

### Image URLs
- Use direct image URLs (ending in .jpg, .png, .svg)
- Recommended sources:
  - Unsplash: `https://images.unsplash.com/...`
  - Company logos: Wikipedia Commons
  - Event logos: Official brand assets

### Best Practices
1. **Always preview** changes before saving
2. **Use descriptive titles** for events
3. **Include complete information** (date, location, etc.)
4. **Test registration links** before publishing
5. **Use high-quality images** for better appearance

### Status Guide
- **Upcoming**: Future events (default for new events)
- **Ongoing**: Currently happening events
- **Past**: Completed events (for archive)

### Category Guide
- **Workshop**: Hands-on learning sessions
- **Hackathon**: Coding competitions
- **Meetup**: Casual networking events
- **Conference**: Large-scale events with multiple sessions

## Coming Soon

### Additional Pages
- **News Page**: Edit articles, toggle featured status
- **Team Page**: Edit member profiles, manage social links
- **TPO Page**: Edit stats, placements, recruiters
- **Home Page**: Edit hero section, stats, features

### Advanced Features
- **Image upload**: Direct file upload instead of URLs
- **Rich text editor**: For better content formatting
- **Drag & drop**: Reorder items
- **Bulk actions**: Edit/delete multiple items
- **Preview mode**: See changes before publishing
- **Version history**: Undo/redo changes

## Troubleshooting

### Edit buttons not showing?
- Make sure you're logged in as admin
- Enable edit mode using the toggle button
- Hover over cards to reveal controls

### Can't save changes?
- Check all required fields are filled
- Ensure URLs are valid
- Wait for loading to complete

### Modal won't close?
- Click the X button in top-right
- Click outside the modal
- Press Escape key

## Security

- All edits are logged
- Only admin users can access edit mode
- Changes are validated before saving
- Deleted items can be recovered (backend)

## Support

Need help? Contact:
- Email: admin@gdg.com
- Check console for error messages
- Review backend logs for API issues


