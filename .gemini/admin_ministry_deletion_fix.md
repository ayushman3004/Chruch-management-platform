# Admin Ministry Deletion & Unknown Users Fix

## Summary
Fixed two issues:
1. Enabled admins to delete ministries from the admin dashboard
2. Fixed "Unknown User" entries appearing in event RSVP lists when users have been deleted

## Changes Made

### 1. Backend - Ministry Controller
**File**: `/Backend/controllers/ministryController.js`

- **Modified `deleteMinistry` function** to allow admins to delete any ministry
  - Admins can now delete any ministry in the system
  - Regular members can still only delete their own ministries
  - Added role-based authorization check

### 2. Backend - Ministry Routes
**File**: `/Backend/routes/ministryRoutes.js`

- **Updated DELETE route** to authorize both "member" and "admin" roles
  - Changed: `.delete(isAuthenticated, authorizeRoles("member"), deleteMinistry)`
  - To: `.delete(isAuthenticated, authorizeRoles("member", "admin"), deleteMinistry)`

### 3. Backend - Event Controller
**File**: `/Backend/controllers/eventController.js`

Fixed "Unknown User" issue in three functions:

#### a. `getAdminEvents` (Admin Dashboard)
- Added filtering to remove deleted users from RSVP lists
- Converts events to plain objects and filters out null user references
- Prevents "Unknown User" from appearing in admin event attendee lists

#### b. `getEvents` (Public Events List)
- Added cleanup for RSVP arrays
- Ensures consistent data structure even with deleted users

#### c. `getEvent` (Single Event View)
- Added filtering when organizers view their events
- Removes deleted users from populated RSVP data
- Returns cleaned event object to prevent null references

## How It Works

### Admin Ministry Deletion
1. Admin clicks delete button on a ministry in the admin dashboard
2. Frontend calls `ministryService.deleteMinistry(ministryId)`
3. Backend checks if user is admin or ministry owner
4. If authorized, deletes the ministry and all associated events
5. Frontend updates the UI and shows success message

### Unknown Users Fix
When a user is deleted from the system:
- Their RSVP entries remain in events (by design, for record keeping)
- When events are fetched, the populate operation returns `null` for deleted users
- The new code filters out these null entries before sending to frontend
- This prevents "Unknown User" from appearing in attendee lists

## Testing Recommendations
1. Test admin deleting various ministries (owned by different users)
2. Test member trying to delete another member's ministry (should fail)
3. Delete a user who has RSVP'd to events, then check event attendee lists
4. Verify RSVP counts are accurate after filtering deleted users

## Notes
- Ministry deletion cascades to delete all associated events
- RSVP data for deleted users is filtered out on read, not deleted from database
- This preserves historical data while preventing UI errors
