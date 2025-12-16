import { useState } from 'react';
import { FiMusic, FiBook, FiUsers, FiPlus, FiEdit2, FiCalendar, FiX, FiCheck } from 'react-icons/fi';
import { services, members } from '../data/mockData';
import PublicNavbar from '../components/PublicNavbar';


const Services = () => {
    const [showModal, setShowModal] = useState(false);
    const [selectedService, setSelectedService] = useState(null);
    const [servicesList, setServicesList] = useState(services);

    const handleAddService = () => {
        setSelectedService(null);
        setShowModal(true);
    };

    const handleViewService = (service) => {
        setSelectedService(service);
        setShowModal(true);
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'planned': return { class: 'badge-success', label: 'Planned' };
            case 'draft': return { class: 'badge-warning', label: 'Draft' };
            default: return { class: 'badge-primary', label: status };
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 relative overflow-hidden">
            {/* Background Image */}
            <div className="fixed inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=2673&auto=format&fit=crop"
                    alt="Background"
                    className="w-full h-full object-cover opacity-20 animate-slow-zoom"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-950/80 to-slate-950/90"></div>
            </div>

            <div className="relative z-10">
                <PublicNavbar />
                <div className="max-w-7xl mx-auto px-6 pt-24 pb-12 services-page">
                    <div className="page-header">
                        <div>
                            <h1 className="page-title">Service Planning</h1>
                            <p className="page-description">Plan and organize worship services</p>
                        </div>
                        <button className="btn btn-primary" onClick={handleAddService}>
                            <FiPlus /> Plan New Service
                        </button>
                    </div>

                    <div className="services-list">
                        {servicesList.map(service => {
                            const status = getStatusBadge(service.status);
                            return (
                                <div key={service.id} className="service-card glass-card" onClick={() => handleViewService(service)}>
                                    <div className="service-date-block">
                                        <span className="date-day">{new Date(service.date).getDate()}</span>
                                        <span className="date-month">{new Date(service.date).toLocaleString('default', { month: 'short' })}</span>
                                        <span className="date-year">{new Date(service.date).getFullYear()}</span>
                                    </div>

                                    <div className="service-main">
                                        <div className="service-header">
                                            <h3>{service.title}</h3>
                                            <span className={`badge ${status.class}`}>{status.label}</span>
                                        </div>
                                        <p className="service-theme">{service.theme}</p>

                                        <div className="service-details">
                                            <div className="detail-group">
                                                <FiCalendar />
                                                <span>{service.time}</span>
                                            </div>
                                            <div className="detail-group">
                                                <FiBook />
                                                <span>{service.scripture}</span>
                                            </div>
                                            <div className="detail-group">
                                                <FiUsers />
                                                <span>{service.preacher}</span>
                                            </div>
                                        </div>

                                        <div className="service-worship">
                                            <FiMusic className="worship-icon" />
                                            <div className="worship-songs">
                                                {service.worship.map((song, index) => (
                                                    <span key={index} className="song-tag">{song}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="service-volunteers">
                                        <h4>Volunteers</h4>
                                        <ul>
                                            {service.volunteers.map((volunteer, index) => (
                                                <li key={index}><FiCheck /> {volunteer}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Modal */}
                    {showModal && (
                        <div className="modal-overlay" onClick={() => setShowModal(false)}>
                            <div className="modal modal-lg" onClick={(e) => e.stopPropagation()}>
                                <div className="modal-header">
                                    <h3>{selectedService ? 'Service Details' : 'Plan New Service'}</h3>
                                    <button className="close-btn" onClick={() => setShowModal(false)}>
                                        <FiX />
                                    </button>
                                </div>
                                <div className="modal-body">
                                    {selectedService ? (
                                        <div className="service-detail-view">
                                            <div className="detail-section">
                                                <h4>Service Information</h4>
                                                <div className="info-grid">
                                                    <div><strong>Title:</strong> {selectedService.title}</div>
                                                    <div><strong>Theme:</strong> {selectedService.theme}</div>
                                                    <div><strong>Date:</strong> {new Date(selectedService.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                                                    <div><strong>Time:</strong> {selectedService.time}</div>
                                                    <div><strong>Preacher:</strong> {selectedService.preacher}</div>
                                                    <div><strong>Scripture:</strong> {selectedService.scripture}</div>
                                                </div>
                                            </div>

                                            <div className="detail-section">
                                                <h4>Worship Set</h4>
                                                <ol className="worship-list">
                                                    {selectedService.worship.map((song, index) => (
                                                        <li key={index}>{song}</li>
                                                    ))}
                                                </ol>
                                            </div>

                                            <div className="detail-section">
                                                <h4>Volunteers</h4>
                                                <ul className="volunteer-list">
                                                    {selectedService.volunteers.map((volunteer, index) => (
                                                        <li key={index}><FiCheck /> {volunteer}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="service-form">
                                            <div className="form-group">
                                                <label>Service Title</label>
                                                <input type="text" className="input" placeholder="e.g., Sunday Morning Worship" />
                                            </div>
                                            <div className="form-group">
                                                <label>Theme</label>
                                                <input type="text" className="input" placeholder="e.g., The Joy of Advent" />
                                            </div>
                                            <div className="form-row">
                                                <div className="form-group">
                                                    <label>Date</label>
                                                    <input type="date" className="input" />
                                                </div>
                                                <div className="form-group">
                                                    <label>Time</label>
                                                    <input type="time" className="input" />
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label>Preacher</label>
                                                <select className="input">
                                                    <option value="">Select preacher</option>
                                                    {members.filter(m => m.role === 'admin').map(member => (
                                                        <option key={member.id} value={member.name}>{member.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="form-group">
                                                <label>Scripture Reading</label>
                                                <input type="text" className="input" placeholder="e.g., John 3:16-21" />
                                            </div>
                                            <div className="form-group">
                                                <label>Worship Songs (comma separated)</label>
                                                <textarea className="input" rows="2" placeholder="Amazing Grace, How Great Thou Art"></textarea>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="modal-footer">
                                    <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                                        {selectedService ? 'Close' : 'Cancel'}
                                    </button>
                                    {selectedService ? (
                                        <button className="btn btn-primary"><FiEdit2 /> Edit Service</button>
                                    ) : (
                                        <button className="btn btn-primary">Create Service</button>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Services;
