import Event from "../models/eventModel.js";
import Ministry from "../models/ministryModel.js";

// Create Event (Must be under a Ministry)
export const createEvent = async (req, res, next) => {
    try {
        const { ministry: ministryId } = req.body;

        if (!ministryId) {
            return res.status(400).json({ message: "Ministry ID is required" });
        }

        // Verify Ministry Ownership
        const ministry = await Ministry.findOne({
            _id: ministryId,
            owner: req.session.user.id
        });

        if (!ministry) {
            return res.status(403).json({ message: "You can only create events for your own ministries" });
        }

        req.body.organizer = req.session.user.id;
        // req.body.ministry is already there

        const event = await Event.create(req.body);
        res.status(201).json({ success: true, event });
    } catch (error) {
        next(error);
    }
};

// Get All Events (Public - No RSVP Details)
export const getEvents = async (req, res, next) => {
    try {
        const { ministry } = req.query;
        const query = ministry ? { ministry } : {};

        const events = await Event.find(query)
            .populate("organizer", "name")
            .populate("ministry", "name")
            .sort({ date: 1 });

        // Clean up RSVP arrays to remove deleted users (keeps only valid user IDs)
        const cleanedEvents = events.map(event => {
            const eventObj = event.toObject();
            // Filter out any RSVP entries where the user ID might be invalid
            // Since we're not populating here, we just keep the structure as-is
            // The cleanup happens on the populated queries
            return eventObj;
        });

        res.status(200).json({ success: true, events: cleanedEvents });
    } catch (error) {
        next(error);
    }
};

// Get Single Event (Conditional RSVP Visibility)
export const getEvent = async (req, res, next) => {
    try {
        let query = Event.findById(req.params.id)
            .populate("organizer", "name")
            .populate("ministry", "name");

        const event = await query;

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        // Check if the current user is the organizer
        const isOrganizer = req.session.user && event.organizer._id.toString() === req.session.user.id;

        // Valid member looking at their own event gets RSVP details
        if (isOrganizer) {
            await event.populate("rsvp.user", "name email phone");

            // Filter out deleted users from RSVP
            const eventObj = event.toObject();
            eventObj.rsvp = eventObj.rsvp.filter(r => r.user !== null);

            return res.status(200).json({ success: true, event: eventObj });
        }

        // Everyone else gets the event without populated RSVP user details
        // (The rsvp array exists, but 'user' is just an ObjectId)

        res.status(200).json({ success: true, event });
    } catch (error) {
        next(error);
    }
};

// Update Event
export const updateEvent = async (req, res, next) => {
    try {
        let event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        // Only organizer can update
        if (event.organizer.toString() !== req.session.user.id) {
            return res.status(403).json({ message: "Not authorized to update this event" });
        }

        event = await Event.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({ success: true, event });
    } catch (error) {
        next(error);
    }
};

// Delete Event
export const deleteEvent = async (req, res, next) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        // Only organizer can delete
        if (event.organizer.toString() !== req.session.user.id) {
            return res.status(403).json({ message: "Not authorized to delete this event" });
        }

        await event.deleteOne();

        res.status(200).json({ success: true, message: "Event deleted" });
    } catch (error) {
        next(error);
    }
};

// Get All Events with Full Details (Admin)
export const getAdminEvents = async (req, res, next) => {
    try {
        const events = await Event.find()
            .populate("organizer", "name email")
            .populate("ministry", "name")
            .populate("rsvp.user", "name email phone role") // Populate RSVP for admin view
            .sort({ date: 1 });

        // Filter out deleted users from RSVP lists
        const cleanedEvents = events.map(event => {
            const eventObj = event.toObject();
            eventObj.rsvp = eventObj.rsvp.filter(r => r.user !== null);
            return eventObj;
        });

        res.status(200).json({ success: true, events: cleanedEvents });
    } catch (error) {
        next(error);
    }
};

// RSVP to Event (Public/Member)
export const rsvpEvent = async (req, res, next) => {
    try {
        const { status } = req.body; // accepted, declined, maybe
        // Need user ID. If public, do they have to be logged in? 
        // "A member logs in... Public users can ... choose to RSVP."
        // Usually implies public users might need to login as 'public' role users?
        // Let's assume req.session.user exists (Authenticated as Public or Member).

        if (!req.session.user) {
            return res.status(401).json({ message: "Please log in to RSVP" });
        }

        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        // Check if already RSVPed
        const existingRSVP = event.rsvp.find(
            (r) => r.user.toString() === req.session.user.id
        );

        if (existingRSVP) {
            existingRSVP.status = status;
        } else {
            event.rsvp.push({ user: req.session.user.id, status });
        }

        await event.save();

        res.status(200).json({ success: true, message: "RSVP updated" });
    } catch (error) {
        next(error);
    }
};
