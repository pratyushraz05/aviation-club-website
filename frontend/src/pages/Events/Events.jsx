import React, { useEffect, useState, useCallback } from 'react';
import API from '../../services/api';
import useAuth from '../../context/useAuth';
import './Events.css';

const emptyFormData = {
  title: '',
  date: '',
  duration: '',
  venue: '',
  speakerInfo: '',
  isUpcoming: false,
  image: '',
  purpose: '',
  description: '',
  outcomes: '',
};

export default function Events() {
  const { isHead } = useAuth();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Form modal state (for Add / Edit)
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyFormData);

  const fetchEvents = useCallback(async () => {
    try {
      const response = await API.get('/events');
      const result = response.data;

      if (!result.success || !Array.isArray(result.data)) {
        throw new Error('Invalid events response.');
      }

      setEvents(
        result.data.map((event) => ({
          ...event,
          id: event._id || event.eventId,
        }))
      );
    } catch (err) {
      setError(err.message || 'Could not connect to the server.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const openAddModal = () => {
    setEditingId(null);
    setFormData(emptyFormData);
    setShowFormModal(true);
  };

  const openEditModal = (event) => {
    setEditingId(event._id || event.id || event.eventId);
    setFormData({
      title: event.title || '',
      date: event.date || '',
      duration: event.duration || '',
      venue: event.venue || '',
      speakerInfo: event.speakerInfo || '',
      isUpcoming: Boolean(event.isUpcoming),
      image: event.image || '',
      purpose: Array.isArray(event.purpose) ? event.purpose.join('\n') : (event.purpose || ''),
      description: event.description || '',
      outcomes: Array.isArray(event.outcomes) ? event.outcomes.join('\n') : (event.outcomes || ''),
    });
    setShowFormModal(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setMsg('');

      const payload = {
        title: formData.title.trim(),
        date: formData.date.trim(),
        duration: formData.duration.trim(),
        venue: formData.venue.trim(),
        speakerInfo: formData.speakerInfo.trim(),
        isUpcoming: formData.isUpcoming,
        image: formData.image.trim(),
        purpose: formData.purpose.split('\n').map((s) => s.trim()).filter(Boolean),
        description: formData.description.trim(),
        outcomes: formData.outcomes.split('\n').map((s) => s.trim()).filter(Boolean),
      };

      if (editingId) {
        await API.put(`/events/${editingId}`, payload);
        setMsg('✓ Event updated successfully!');
      } else {
        await API.post('/events', payload);
        setMsg('✓ Event created successfully!');
      }

      setShowFormModal(false);
      setEditingId(null);
      setFormData(emptyFormData);
      await fetchEvents();
      setTimeout(() => setMsg(''), 4000);
    } catch (err) {
      setMsg(err.response?.data?.message || err.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteEvent = async (event) => {
    const id = event._id || event.id || event.eventId;
    if (!window.confirm(`Are you sure you want to delete "${event.title}"?`)) {
      return;
    }

    try {
      await API.delete(`/events/${id}`);
      setMsg(`✓ Event "${event.title}" deleted.`);
      if (selectedEvent && (selectedEvent._id === id || selectedEvent.id === id)) {
        setSelectedEvent(null);
      }
      await fetchEvents();
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      setMsg(err.response?.data?.message || err.message || 'Failed to delete event');
    }
  };

  // Filter out any upcoming events versus past events
  const upcomingEvents = events.filter((e) => e.isUpcoming);
  const pastEvents = events.filter((e) => !e.isUpcoming);

  if (loading) {
    return <div className="events-page">Loading events...</div>;
  }

  if (error) {
    return (
      <div className="events-page">
        Unable to load events: {error}
      </div>
    );
  }

  return (
    <div className="events-page">
      <div className="container">
        {/* Head Editing Banner */}
        {isHead && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'rgba(234, 179, 8, 0.12)',
              border: '1px solid rgba(234, 179, 8, 0.35)',
              padding: '14px 20px',
              borderRadius: '12px',
              marginBottom: '24px',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div>
              <span style={{ color: '#facc15', fontWeight: 700, fontSize: '0.95rem' }}>
                👑 Head Edit Mode Active
              </span>
              <p style={{ margin: '4px 0 0 0', color: '#94a3b8', fontSize: '0.85rem' }}>
                You have admin privileges to add, edit, or remove club events.
              </p>
            </div>
            <button
              onClick={openAddModal}
              style={{
                background: '#ca8a04',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 18px',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer',
              }}
            >
              ➕ Add New Event
            </button>
          </div>
        )}

        {msg && (
          <div
            style={{
              marginBottom: '20px',
              padding: '12px 18px',
              borderRadius: '8px',
              background: msg.startsWith('✓') ? 'rgba(74, 222, 128, 0.15)' : 'rgba(248, 113, 113, 0.15)',
              border: `1px solid ${msg.startsWith('✓') ? '#4ade80' : '#f87171'}`,
              color: msg.startsWith('✓') ? '#4ade80' : '#f87171',
              fontWeight: 600,
              fontSize: '0.95rem',
            }}
          >
            {msg}
          </div>
        )}
        
        {/* 1. CURRENT EVENT HIGHLIGHT CARD */}
        <section className="current-event-section">
          <div className="section-head reveal fade-up">
            <p className="eyebrow">Active & Upcoming</p>
            <h2 className="section-title">Current Featured Event</h2>
          </div>

          {upcomingEvents.length > 0 ? (
            upcomingEvents.map((event) => (
              <div key={event.id} className={`current-event-card ${!event.image ? 'current-event-banner' : ''}`}>
                {event.image && (
                  <img src={event.image} alt={event.title} className="card-img" />
                )}
                <div className="card-body">
                  <span className="badge">LIVE NOW / UPCOMING</span>
                  <h3 className="card-title">{event.title}</h3>
                  <p className="card-meta">📅 {event.date} | 🕒 {event.duration}</p>
                  <p className="card-meta">📍 {event.venue}</p>
                  {event.speakerInfo && <p className="card-meta">🎙️ {event.speakerInfo}</p>}
                  <p className="card-desc">
                    {event.description?.slice(0, 160)}...
                  </p>
                  
                  <div className="card-footer" style={{ display: 'flex', gap: '12px', marginTop: '16px', flexWrap: 'wrap' }}>
                    <button className="btn btn-outline" onClick={() => setSelectedEvent(event)}>
                      About Event
                    </button>
                    <a 
                      href="https://forms.gle/YOUR_GOOGLE_FORM_LINK" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="btn btn-primary"
                    >
                      Register for Event
                    </a>

                    {isHead && (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => openEditModal(event)}
                          style={{
                            background: '#0284c7',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '8px 14px',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(event)}
                          style={{
                            background: '#dc2626',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '8px 14px',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="current-event-card current-event-banner">
              <div className="card-body" style={{ padding: '40px' }}>
                <span className="badge">NEXT FLAGSHIP</span>
                <h3 className="card-title">Aviation Club Annual Tech Sprint 2026</h3>
                <p className="card-desc">Get ready for our upcoming drone design and aerodynamics challenges. Registrations and rule books will be updated shortly!</p>
                <div className="card-footer" style={{ display: 'flex', gap: '16px', marginTop: '20px', flexWrap: 'wrap' }}>
                  <a href="https://forms.gle/YOUR_GOOGLE_FORM_LINK" target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                    Register for Event
                  </a>
                  <a href="#rulebook" onClick={(e) => { e.preventDefault(); alert("Rulebook link will be attached here!"); }} className="btn btn-outline">
                    View Rule Book
                  </a>
                  {isHead && (
                    <button
                      onClick={openAddModal}
                      style={{
                        background: '#ca8a04',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '8px 16px',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      ➕ Add Upcoming Event
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* 2. CONDUCTED EVENTS & REPORTS SECTION */}
        <section className="events-section" style={{ marginTop: '60px' }}>
          <h2 className="section-title">Past Events & Reports</h2>
          <div className="events-grid">
            {pastEvents.map((event) => (
              <div key={event.id} className="event-card past-card">
                <img
                  src={event.image || '/images/cad-workshop.jpg'}
                  alt={event.title}
                  className="card-img"
                  onError={(e) => {
                    e.currentTarget.src = '/images/cad-workshop.jpg';
                  }}
                />
                <div className="card-body">
                  <h3 className="card-title">{event.title}</h3>
                  <p className="card-meta">📅 {event.date} | 🕒 {event.duration}</p>
                  <p className="card-meta">📍 {event.venue}</p>
                  <p className="card-desc">{event.description?.slice(0, 140)}...</p>
                  
                  <div style={{ marginTop: 'auto', paddingTop: '16px' }}>
                    <button className="btn btn-outline full-width" onClick={() => setSelectedEvent(event)}>
                      View Full Report
                    </button>
                    {isHead && (
                      <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                        <button
                          onClick={() => openEditModal(event)}
                          style={{
                            flex: 1,
                            background: '#0284c7',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '6px 10px',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(event)}
                          style={{
                            flex: 1,
                            background: '#dc2626',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '6px 10px',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. EVENT DETAILS MODAL */}
        {selectedEvent && (
          <div className="modal-backdrop" onClick={() => setSelectedEvent(null)}>
            <div className="modal-card modal-large" onClick={(e) => e.stopPropagation()}>
              <button className="close-btn" onClick={() => setSelectedEvent(null)}>✕</button>
              {selectedEvent.image && (
                <img
                  src={selectedEvent.image}
                  alt={selectedEvent.title}
                  className="modal-img"
                  onError={(e) => {
                    e.currentTarget.src = '/images/cad-workshop.jpg';
                  }}
                />
              )}
              
              <h2 className="modal-title">{selectedEvent.title}</h2>
              <div className="event-details-meta">
                <p><strong>Date:</strong> {selectedEvent.date}</p>
                <p><strong>Duration:</strong> {selectedEvent.duration}</p>
                <p><strong>Venue:</strong> {selectedEvent.venue}</p>
                {selectedEvent.speakerInfo && <p><strong>In-Charge / Speaker:</strong> {selectedEvent.speakerInfo}</p>}
              </div>

              {isHead && (
                <div style={{ display: 'flex', gap: '10px', margin: '12px 0 16px' }}>
                  <button
                    onClick={() => {
                      const ev = selectedEvent;
                      setSelectedEvent(null);
                      openEditModal(ev);
                    }}
                    style={{
                      background: '#0284c7',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '6px 14px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    ✏️ Edit Event Details
                  </button>
                  <button
                    onClick={() => handleDeleteEvent(selectedEvent)}
                    style={{
                      background: '#dc2626',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '6px 14px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    🗑️ Delete Event
                  </button>
                </div>
              )}

              <hr className="divider" />

              {/* Event Purpose */}
              {selectedEvent.purpose?.length > 0 && (
                <div className="details-block">
                  <h4>EVENT PURPOSE</h4>
                  <ul>
                    {selectedEvent.purpose.map((item, idx) => (
                      <li
                        key={idx}
                        style={
                          item === "More specifically, its purpose was to:"
                            ? { listStyleType: "none", fontWeight: "600", marginTop: "6px" }
                            : {}
                        }
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Event Description */}
              <div className="details-block">
                <h4>EVENT DESCRIPTION</h4>
                <p style={{ whiteSpace: 'pre-line' }}>{selectedEvent.description}</p>
              </div>

              {/* Event Photographs */}
              <div className="details-block">
                <h4>EVENT PHOTOGRAPHS</h4>
                <div className="report-photo-grid">
                  <div className="photo-slot">
                    <img
                      src={selectedEvent.image || '/images/3.png'}
                      alt="Event highlight 1"
                      onError={(e) => {
                        e.currentTarget.src = '/images/3.png';
                      }}
                    />
                  </div>
                  <div className="photo-slot">
                    <img
                      src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=600&auto=format&fit=crop"
                      alt="Event highlight 2"
                    />
                  </div>
                </div>
              </div>

              {/* Event Outcomes */}
              {selectedEvent.outcomes?.length > 0 && (
                <div className="details-block">
                  <h4>EVENT OUTCOMES</h4>
                  <ul>
                    {selectedEvent.outcomes.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 4. HEAD MODAL: ADD / EDIT EVENT */}
        {showFormModal && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.75)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '20px',
            }}
            onClick={() => setShowFormModal(false)}
          >
            <div
              style={{
                background: '#0f172a',
                border: '1px solid #334155',
                borderRadius: '16px',
                padding: '28px',
                maxWidth: '650px',
                width: '100%',
                maxHeight: '90vh',
                overflowY: 'auto',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ margin: 0, fontSize: '1.4rem', color: '#f8fafc' }}>
                  {editingId ? '✏️ Edit Event' : '➕ Add New Event'}
                </h3>
                <button
                  type="button"
                  onClick={() => setShowFormModal(false)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#94a3b8',
                    fontSize: '1.4rem',
                    cursor: 'pointer',
                  }}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '4px' }}>
                    Event Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Aerodynamics Workshop 2026"
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      background: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      color: '#ffffff',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '4px' }}>
                      Date *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      placeholder="e.g. 15th Nov 2026"
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        background: '#1e293b',
                        border: '1px solid #334155',
                        borderRadius: '8px',
                        color: '#ffffff',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '4px' }}>
                      Duration
                    </label>
                    <input
                      type="text"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      placeholder="e.g. 10:00 AM – 05:00 PM"
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        background: '#1e293b',
                        border: '1px solid #334155',
                        borderRadius: '8px',
                        color: '#ffffff',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '4px' }}>
                      Venue
                    </label>
                    <input
                      type="text"
                      value={formData.venue}
                      onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                      placeholder="e.g. S-11, Academic Building"
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        background: '#1e293b',
                        border: '1px solid #334155',
                        borderRadius: '8px',
                        color: '#ffffff',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '4px' }}>
                      Event Category / Status
                    </label>
                    <select
                      value={formData.isUpcoming ? 'upcoming' : 'past'}
                      onChange={(e) => setFormData({ ...formData, isUpcoming: e.target.value === 'upcoming' })}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        background: '#1e293b',
                        border: '1px solid #334155',
                        borderRadius: '8px',
                        color: '#ffffff',
                        boxSizing: 'border-box',
                      }}
                    >
                      <option value="past">Past Event & Report</option>
                      <option value="upcoming">Upcoming / Live Featured</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '4px' }}>
                    Speaker / In-Charge Info
                  </label>
                  <input
                    type="text"
                    value={formData.speakerInfo}
                    onChange={(e) => setFormData({ ...formData, speakerInfo: e.target.value })}
                    placeholder="e.g. Dr. N.V. Swamy Naidu, HOD Mechanical"
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      background: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      color: '#ffffff',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '4px' }}>
                    Image Path or URL
                  </label>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="e.g. /images/cad-workshop.jpg or https://res.cloudinary.com/..."
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      background: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      color: '#ffffff',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '4px' }}>
                    Event Description *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Provide a comprehensive summary of the event..."
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      background: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      color: '#ffffff',
                      boxSizing: 'border-box',
                      fontFamily: 'inherit',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '4px' }}>
                    Purpose (one per line)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.purpose}
                    onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                    placeholder="Bridge the gap between theory and real-world engineering&#10;Enhance practical proficiency in CAD and CFD"
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      background: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      color: '#ffffff',
                      boxSizing: 'border-box',
                      fontFamily: 'inherit',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '4px' }}>
                    Outcomes (one per line)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.outcomes}
                    onChange={(e) => setFormData({ ...formData, outcomes: e.target.value })}
                    placeholder="75 participants introduced to parametric modeling&#10;Feedback – 96% 4+ star rating"
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      background: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      color: '#ffffff',
                      boxSizing: 'border-box',
                      fontFamily: 'inherit',
                    }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setShowFormModal(false)}
                    style={{
                      padding: '10px 18px',
                      background: '#334155',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    style={{
                      padding: '10px 24px',
                      background: '#38bdf8',
                      color: '#0f172a',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      opacity: submitting ? 0.7 : 1,
                    }}
                  >
                    {submitting ? 'Saving...' : editingId ? 'Update Event' : 'Create Event'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
