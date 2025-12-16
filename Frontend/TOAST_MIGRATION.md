# Toast Migration Guide

This document shows how to replace alerts and confirms with toasts in the remaining files.

## Files to Update:

### 1. Home.jsx
**Lines 46, 48**
```javascript
// OLD:
alert("RSVP Updated!");
alert("Failed to RSVP");

// NEW:
import { useToast } from '../context/ToastContext';
const toast = useToast();
toast.success("RSVP Updated!");
toast.error("Failed to RSVP");
```

### 2. Dashboard.jsx
**Lines 102, 117**
```javascript
// OLD:
if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
alert("Failed to delete user");

// NEW:
const confirmed = await toast.confirm("Are you sure you want to delete this user? This action cannot be undone.");
if (!confirmed) return;
toast.error("Failed to delete user");
```

### 3. Events.jsx
**Lines 103, 144**
```javascript
// OLD:
if (!selectedEvent || !window.confirm("Are you sure you want to delete this event?")) return;
alert("Please log in to RSVP");

// NEW:
if (!selectedEvent) return;
const confirmed = await toast.confirm("Are you sure you want to delete this event?");
if (!confirmed) return;
toast.warning("Please log in to RSVP");
```

### 4. Ministries.jsx
**Lines 76, 81, 87, 109, 121**
```javascript
// OLD:
alert("Failed to create ministry: " + (error.response?.data?.message || error.message));
if (!window.confirm("Are you sure? This will delete all events associated with this ministry!")) return;
alert("Failed to delete ministry");
alert("Failed to create event: " + (error.response?.data?.message || error.message));
alert("Failed to load RSVPs");

// NEW:
toast.error("Failed to create ministry: " + (error.response?.data?.message || error.message));
const confirmed = await toast.confirm("Are you sure? This will delete all events associated with this ministry!");
if (!confirmed) return;
toast.error("Failed to delete ministry");
toast.error("Failed to create event: " + (error.response?.data?.message || error.message));
toast.error("Failed to load RSVPs");
```

### 5. Profile.jsx
**Line 168**
```javascript
// OLD:
if (window.confirm('Are you sure you want to logout?')) {
    logout();
    navigate('/login');
}

// NEW:
const confirmed = await toast.confirm('Are you sure you want to logout?');
if (confirmed) {
    logout();
    navigate('/login');
}
```

### 6. Members.jsx
**Line 34**
```javascript
// OLD:
if (window.confirm('Are you sure you want to remove this member?')) {

// NEW:
const confirmed = await toast.confirm('Are you sure you want to remove this member?');
if (confirmed) {
```

## Steps to Apply:

1. Import useToast at the top of each file
2. Add `const toast = useToast();` in the component
3. Replace all alert() calls with toast.success(), toast.error(), toast.warning(), or toast.info()
4. Replace all window.confirm() with `const confirmed = await toast.confirm(...); if (confirmed) { ... }`
