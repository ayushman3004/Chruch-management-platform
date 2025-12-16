// Quick Reference: How to Use API Services in Your Components

// ============================================
// 1. IMPORT THE SERVICE
// ============================================
import { eventService, donationService, ministryService } from '../services';
// OR import individually:
import eventService from '../services/eventService';

// ============================================
// 2. USE IN COMPONENT (with useState/useEffect)
// ============================================
const MyComponent = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await eventService.getEvents();
                setData(response.events);
            } catch (err) {
                setError(err.response?.data?.message || 'Error occurred');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // ... render logic
};

// ============================================
// 3. HANDLE FORM SUBMISSIONS
// ============================================
const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
        const result = await eventService.createEvent(formData);
        console.log('Success:', result);
        // Show success message, redirect, etc.
    } catch (error) {
        setError(error.response?.data?.message);
    } finally {
        setLoading(false);
    }
};

// ============================================
// 4. USE WITH AUTHENTICATION CONTEXT
// ============================================
import { useAuth } from '../context/AuthContext';

const ProtectedComponent = () => {
    const { user, isAuthenticated, hasPermission } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    if (!hasPermission('admin')) {
        return <div>Access Denied</div>;
    }

    // ... component logic
};

// ============================================
// 5. COMMON PATTERNS
// ============================================

// Pattern 1: Fetch data on mount
useEffect(() => {
    eventService.getEvents().then(data => setEvents(data.events));
}, []);

// Pattern 2: Create/Update with loading state
const [isSubmitting, setIsSubmitting] = useState(false);
const handleCreate = async () => {
    setIsSubmitting(true);
    try {
        await donationService.createDonation(data);
        // Success handling
    } catch (err) {
        // Error handling
    } finally {
        setIsSubmitting(false);
    }
};

// Pattern 3: Delete with confirmation
const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
        await eventService.deleteEvent(id);
        // Refresh list
    }
};

// ============================================
// 6. ERROR HANDLING BEST PRACTICES
// ============================================
try {
    const result = await api.call();
} catch (error) {
    // Backend error message
    const message = error.response?.data?.message;

    // HTTP status code
    const status = error.response?.status;

    // Network error
    if (!error.response) {
        console.error('Network error');
    }
}
