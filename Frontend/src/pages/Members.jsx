import { useState } from 'react';
import { FiSearch, FiPlus, FiEdit2, FiTrash2, FiMail, FiPhone, FiMoreVertical, FiFilter, FiX } from 'react-icons/fi';
import { members, ministries } from '../data/mockData';
import PublicNavbar from '../components/PublicNavbar';


const Members = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterMinistry, setFilterMinistry] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);
    const [membersList, setMembersList] = useState(members);

    const filteredMembers = membersList.filter(member => {
        const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesMinistry = !filterMinistry || member.ministry === filterMinistry;
        const matchesStatus = !filterStatus || member.status === filterStatus;
        return matchesSearch && matchesMinistry && matchesStatus;
    });

    const handleAddMember = () => {
        setSelectedMember(null);
        setShowModal(true);
    };

    const handleEditMember = (member) => {
        setSelectedMember(member);
        setShowModal(true);
    };

    const handleDeleteMember = (id) => {
        if (window.confirm('Are you sure you want to remove this member?')) {
            setMembersList(membersList.filter(m => m.id !== id));
        }
    };

    const getRoleBadgeClass = (role) => {
        switch (role) {
            case 'admin': return 'badge-danger';
            case 'staff': return 'badge-warning';
            default: return 'badge-primary';
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 relative overflow-hidden">
            {/* Background Image */}
            <div className="fixed inset-0 z-0">
                <img
                    src="https://dynamic-media-cdn.tripadvisor.com/media/photo-o/13/d5/6c/a8/photo1jpg.jpg?w=900&h=500&s=1"
                    alt="Background"
                    className="w-full h-full object-cover opacity-20 animate-slow-zoom"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-950/80 to-slate-950/90"></div>
            </div>

            <div className="relative z-10">
                <PublicNavbar />
                <div className="max-w-7xl mx-auto px-6 pt-24 pb-12 members-page">
                    <div className="page-header">
                        <div>
                            <h1 className="page-title">Members</h1>
                            <p className="page-description">Manage your church community members</p>
                        </div>
                        <button className="btn btn-primary" onClick={handleAddMember}>
                            <FiPlus /> Add Member
                        </button>
                    </div>

                    {/* Filters */}
                    <div className="filters-bar">
                        <div className="search-box">
                            <FiSearch className="search-icon" />
                            <input
                                type="text"
                                placeholder="Search members..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="filter-group">
                            <FiFilter className="filter-icon" />
                            <select value={filterMinistry} onChange={(e) => setFilterMinistry(e.target.value)}>
                                <option value="">All Ministries</option>
                                {ministries.map(m => (
                                    <option key={m.id} value={m.name}>{m.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="filter-group">
                            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                                <option value="">All Status</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>

                        {(filterMinistry || filterStatus) && (
                            <button className="btn btn-ghost btn-sm" onClick={() => { setFilterMinistry(''); setFilterStatus(''); }}>
                                <FiX /> Clear Filters
                            </button>
                        )}
                    </div>

                    {/* Members Grid */}
                    <div className="members-grid">
                        {filteredMembers.map(member => (
                            <div key={member.id} className="member-card">
                                <div className="member-header">
                                    <img src={member.avatar} alt={member.name} className="member-avatar" />
                                    <div className="member-actions">
                                        <button className="action-btn" onClick={() => handleEditMember(member)}>
                                            <FiEdit2 />
                                        </button>
                                        <button className="action-btn delete" onClick={() => handleDeleteMember(member.id)}>
                                            <FiTrash2 />
                                        </button>
                                    </div>
                                </div>

                                <div className="member-info">
                                    <h3>{member.name}</h3>
                                    <span className={`badge ${getRoleBadgeClass(member.role)}`}>{member.role}</span>
                                </div>

                                <div className="member-details">
                                    <div className="detail-row">
                                        <FiMail />
                                        <span>{member.email}</span>
                                    </div>
                                    <div className="detail-row">
                                        <FiPhone />
                                        <span>{member.phone}</span>
                                    </div>
                                </div>

                                <div className="member-footer">
                                    <div className="ministry-tag" style={{ background: ministries.find(m => m.name === member.ministry)?.color + '20', color: ministries.find(m => m.name === member.ministry)?.color }}>
                                        {member.ministry}
                                    </div>
                                    <span className={`status-dot ${member.status}`}></span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredMembers.length === 0 && (
                        <div className="empty-state">
                            <p>No members found matching your criteria</p>
                        </div>
                    )}

                    {/* Add/Edit Modal */}
                    {showModal && (
                        <div className="modal-overlay" onClick={() => setShowModal(false)}>
                            <div className="modal" onClick={(e) => e.stopPropagation()}>
                                <div className="modal-header">
                                    <h3>{selectedMember ? 'Edit Member' : 'Add New Member'}</h3>
                                    <button className="close-btn" onClick={() => setShowModal(false)}>
                                        <FiX />
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <div className="form-group">
                                        <label>Full Name</label>
                                        <input type="text" className="input" placeholder="Enter full name" defaultValue={selectedMember?.name || ''} />
                                    </div>
                                    <div className="form-group">
                                        <label>Email</label>
                                        <input type="email" className="input" placeholder="Enter email" defaultValue={selectedMember?.email || ''} />
                                    </div>
                                    <div className="form-group">
                                        <label>Phone</label>
                                        <input type="tel" className="input" placeholder="Enter phone number" defaultValue={selectedMember?.phone || ''} />
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Role</label>
                                            <select className="input" defaultValue={selectedMember?.role || 'member'}>
                                                <option value="member">Member</option>
                                                <option value="staff">Staff</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label>Ministry</label>
                                            <select className="input" defaultValue={selectedMember?.ministry || ''}>
                                                <option value="">Select Ministry</option>
                                                {ministries.map(m => (
                                                    <option key={m.id} value={m.name}>{m.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Address</label>
                                        <input type="text" className="input" placeholder="Enter address" defaultValue={selectedMember?.address || ''} />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                    <button className="btn btn-primary" onClick={() => setShowModal(false)}>
                                        {selectedMember ? 'Save Changes' : 'Add Member'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Members;
