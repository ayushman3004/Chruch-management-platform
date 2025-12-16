# API Integration Guide

## Overview
The frontend is fully integrated with the backend API using Axios. All API calls are centralized in service files located in `src/services/`.

## Base Configuration

### API Client (`src/services/api.js`)
- **Base URL**: `http://localhost:3000/api`
- **Credentials**: Enabled (for session cookies)
- **Error Handling**: Automatic interceptor for all requests

## Available Services

### 1. Authentication Service (`authService.js`)
```javascript
import { authService } from './services';

// Login
await authService.login(email, password);

// Register
await authService.register({ name, email, password, phone, role });

// Logout
await authService.logout();

// Get current user
await authService.getCurrentUser();
```

### 2. Event Service (`eventService.js`)
```javascript
import { eventService } from './services';

// Get all events
await eventService.getEvents({ category: 'worship', upcoming: true });

// Get single event
await eventService.getEvent(eventId);

// Create event (admin/staff/pastor only)
await eventService.createEvent({
    title: 'Sunday Service',
    description: 'Weekly worship service',
    date: '2025-12-15',
    time: '10:00 AM',
    location: 'Main Sanctuary',
    category: 'worship'
});

// Update event
await eventService.updateEvent(eventId, updateData);

// Delete event
await eventService.deleteEvent(eventId);

// RSVP to event
await eventService.rsvpEvent(eventId, 'attending');

// Mark attendance (admin/staff only)
await eventService.markAttendance(eventId, { userId, present: true });
```

### 3. Donation Service (`donationService.js`)
```javascript
import { donationService } from './services';

// Create donation
await donationService.createDonation({
    amount: 100,
    type: 'tithe',
    method: 'card',
    notes: 'Monthly tithe'
});

// Get all donations (admin/pastor only)
await donationService.getAllDonations({ type: 'tithe' });

// Get my donations
await donationService.getMyDonations();

// Get single donation
await donationService.getDonation(donationId);
```

### 4. Ministry Service (`ministryService.js`)
```javascript
import { ministryService } from './services';

// Get all ministries
await ministryService.getMinistries();

// Get single ministry
await ministryService.getMinistry(ministryId);

// Create ministry (admin/pastor only)
await ministryService.createMinistry({
    name: 'Youth Ministry',
    description: 'Ministry for young people',
    leader: userId,
    meetingSchedule: 'Every Saturday 5 PM'
});

// Update ministry
await ministryService.updateMinistry(ministryId, updateData);

// Delete ministry
await ministryService.deleteMinistry(ministryId);

// Join ministry
await ministryService.joinMinistry(ministryId);

// Leave ministry
await ministryService.leaveMinistry(ministryId);
```

### 5. User Service (`userService.js`)
```javascript
import { userService } from './services';

// Get all users (admin only)
await userService.getUsers({ role: 'member' });

// Get single user
await userService.getUser(userId);

// Update profile
await userService.updateProfile({
    name: 'John Doe',
    phone: '1234567890',
    address: '123 Main St'
});

// Update user role (admin only)
await userService.updateUserRole(userId, 'staff');

// Delete user (admin only)
await userService.deleteUser(userId);
```

### 6. Service Plan Service (`servicePlanService.js`)
```javascript
import { servicePlanService } from './services';

// Get all service plans
await servicePlanService.getServicePlans();

// Get single service plan
await servicePlanService.getServicePlan(planId);

// Create service plan (admin/staff/pastor only)
await servicePlanService.createServicePlan({
    date: '2025-12-15',
    serviceType: 'Sunday Worship',
    theme: 'Hope and Faith',
    volunteers: []
});

// Update service plan
await servicePlanService.updateServicePlan(planId, updateData);

// Delete service plan
await servicePlanService.deleteServicePlan(planId);

// Assign volunteer
await servicePlanService.assignVolunteer(planId, volunteerId, 'worship leader');
```

### 7. Dashboard Service (`dashboardService.js`)
```javascript
import { dashboardService } from './services';

// Get dashboard statistics
await dashboardService.getStats();
```

## Usage in Components

### Example: Using in a React Component
```javascript
import { useState, useEffect } from 'react';
import { eventService } from '../services';

const EventsList = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const data = await eventService.getEvents();
                setEvents(data.events);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load events');
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            {events.map(event => (
                <div key={event._id}>{event.title}</div>
            ))}
        </div>
    );
};
```

## Error Handling

All API calls automatically handle errors through the Axios interceptor. Errors are logged to the console and can be caught in try-catch blocks:

```javascript
try {
    await eventService.createEvent(eventData);
} catch (error) {
    // error.response.data.message contains the error message
    console.error(error.response?.data?.message);
}
```

## Authentication Context

The `AuthContext` provides authentication state and methods throughout the app:

```javascript
import { useAuth } from '../context/AuthContext';

const MyComponent = () => {
    const { user, login, logout, register, isAuthenticated, hasPermission } = useAuth();

    // Check if user is authenticated
    if (!isAuthenticated) {
        return <div>Please log in</div>;
    }

    // Check permissions
    if (!hasPermission('admin')) {
        return <div>Access denied</div>;
    }

    return <div>Welcome, {user.name}!</div>;
};
```

## Backend Configuration

The backend CORS is configured to accept requests from:
- `http://localhost:5173` - `http://localhost:5181`

Session cookies are automatically included in all requests via `withCredentials: true`.

## Role-Based Access Control

Different endpoints require different permission levels:

- **Public**: Events (read), Ministries (read)
- **Authenticated**: Donations (create, read own), Events (RSVP), Ministries (join/leave)
- **Staff/Admin**: Events (create, update, delete), Service Plans (all), Users (manage)
- **Admin/Pastor**: Donations (view all), Ministries (create, update, delete)

## Testing the Integration

1. **Start Backend**: `cd Backend && npm run dev` (Port 3000)
2. **Start Frontend**: `cd Frontend && npm run dev` (Port 5173+)
3. **Test Authentication**: Try logging in at `/login`
4. **Test API Calls**: Check browser console for API responses

## Troubleshooting

### CORS Errors
- Ensure backend is running on port 3000
- Check that frontend port is in the CORS whitelist
- Verify `withCredentials: true` is set

### Authentication Issues
- Check that cookies are being sent (Network tab in DevTools)
- Verify session is stored in MongoDB
- Ensure `SESSION_SECRET` is set in backend `.env`

### Network Errors
- Confirm backend server is running
- Check firewall settings
- Verify API base URL in `api.js`
