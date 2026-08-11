import React, { useState } from 'react';
import './Events.css';
import { EVENTS_DATA } from './eventsData';

export default function Events() {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showRegistration, setShowRegistration] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const upcomingEvents = EVENTS_DATA.filter((e) => e.isUpcoming);
  const pastEvents = EVENTS_DATA.filter((e) => !e.isUpcoming);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    college: '',
    year: '1st Year',
    eventSelect: EVENTS_DATA[0]?.id || ''
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setShowRegistration(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        college: '',
        year: '1st Year',
        eventSelect: EVENTS_DATA[0]?.id || ''
      });
    }, 2500);
  };

  const openRegistrationFor = (eventId) => {
    setFormData((prev) => ({ ...prev, eventSelect: eventId }));
    setShowRegistration(true);
  };

  return (
    <div className="events-page">
      {/* 1. Vegam Hero Section */}
      <section className="vegam-hero">
        <div className="vegam-content">
          <span className="badge">FLAGSHIP EVENT</span>
          <h1 className="hero-title">VEGAM 2026</h1>
          <p className="hero-subtitle">Pushing Boundaries in Flight, Design & Innovation</p>
          <p className="hero-description">
            Vegam is our flagship annual aviation fest bringing together students, builders, and aerial robotics
            enthusiasts from across colleges.
          </p>
          <div className="hero-actions">
            <button className="btn btn-primary" onClick={() => openRegistrationFor('vegam-2026')}>
              Register for Vegam
            </button>
          </div>
        </div>
      </section>

      {/* 2. Upcoming Events Section (Only shows if there are upcoming events) */}
      {upcomingEvents.length > 0 && (
        <section className="events-section">
          <h2 className="section-title">Upcoming Events</h2>
          <div className="events-grid">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="event-card">
                <img src={event.image} alt={event.title} className="card-img" />
                <div className="card-body">
                  <h3 className="card-title">{event.title}</h3>
                  <p className="card-meta">📅 {event.date} • 🕒 {event.duration}</p>
                  <p className="card-meta">📍 {event.venue}</p>
                  <p className="card-desc">{event.description.slice(0, 120)}...</p>
                  <div className="card-footer">
                    <button className="btn btn-outline" onClick={() => setSelectedEvent(event)}>
                      View Details
                    </button>
                    <button className="btn btn-primary" onClick={() => openRegistrationFor(event.id)}>
                      Register
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3. Conducted Events Section */}
      <section className="events-section">
        <h2 className="section-title">Past Events & Reports</h2>
        <div className="events-grid">
          {pastEvents.map((event) => (
            <div key={event.id} className="event-card past-card">
              <img src={event.image} alt={event.title} className="card-img" />
              <div className="card-body">
                <h3 className="card-title">{event.title}</h3>
                <p className="card-meta">📅 {event.date} | 🕒 {event.duration}</p>
                <p className="card-meta">📍 {event.venue}</p>
                <p className="card-desc">{event.description.slice(0, 140)}...</p>
                <button className="btn btn-outline full-width" onClick={() => setSelectedEvent(event)}>
                  View Full Report
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Event Details Modal (Full Structured View) */}
      {selectedEvent && (
        <div className="modal-backdrop" onClick={() => setSelectedEvent(null)}>
          <div className="modal-card modal-large" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedEvent(null)}>✕</button>
            <img src={selectedEvent.image} alt={selectedEvent.title} className="modal-img" />
            
            <h2 className="modal-title">{selectedEvent.title}</h2>
            <div className="event-details-meta">
              <p><strong>Date:</strong> {selectedEvent.date}</p>
              <p><strong>Duration:</strong> {selectedEvent.duration}</p>
              <p><strong>Venue:</strong> {selectedEvent.venue}</p>
            </div>

            <hr className="divider" />

            {/* Event Purpose */}
            {selectedEvent.purpose?.length > 0 && (
              <div className="details-block">
                <h4>EVENT PURPOSE</h4>
                <ul>
                  {selectedEvent.purpose.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Event Description */}
            <div className="details-block">
              <h4>EVENT DESCRIPTION</h4>
              <p style={{ whitespace: 'pre-line' }}>{selectedEvent.description}</p>
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

            {selectedEvent.isUpcoming && (
              <button
                className="btn btn-primary full-width"
                style={{ marginTop: '20px' }}
                onClick={() => {
                  const id = selectedEvent.id;
                  setSelectedEvent(null);
                  openRegistrationFor(id);
                }}
              >
                Proceed to Register
              </button>
            )}
          </div>
        </div>
      )}

      {/* 5. Registration Modal */}
      {showRegistration && (
        <div className="modal-backdrop" onClick={() => setShowRegistration(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setShowRegistration(false)}>✕</button>

            {isSubmitted ? (
              <div className="success-message">
                <span style={{ fontSize: '48px' }}>🎉</span>
                <h3>Registration Successful!</h3>
                <p className="card-desc">Thank you, {formData.name}. Confirmation details have been sent to your email.</p>
              </div>
            ) : (
              <>
                <h2>Event Registration</h2>
                <p className="card-meta">Fill in your details to secure your spot.</p>
                <form onSubmit={handleRegisterSubmit} className="registration-form">
                  <div className="form-group">
                    <label>Select Event</label>
                    <select
                      name="eventSelect"
                      value={formData.eventSelect}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                    >
                      {EVENTS_DATA.map((e) => (
                        <option key={e.id} value={e.id}>{e.title}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="John Doe"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="john@example.com"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="+91 9876543210"
                      required
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>College / Branch</label>
                      <input
                        type="text"
                        name="college"
                        value={formData.college}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="Aero Dept"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Year</label>
                      <select
                        name="year"
                        value={formData.year}
                        onChange={handleInputChange}
                        className="form-input"
                      >
                        <option value="1st Year">1st Year</option>
                        <option value="2nd Year">2nd Year</option>
                        <option value="3rd Year">3rd Year</option>
                        <option value="4th Year">4th Year</option>
                      </select>
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary full-width" style={{ marginTop: '10px' }}>
                    Submit Registration
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}