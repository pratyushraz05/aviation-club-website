import React, { useState } from 'react';
import './Events.css';
import { EVENTS_DATA } from './eventsData';

export default function Events() {
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Filter out any upcoming events versus past events
  const upcomingEvents = EVENTS_DATA.filter((e) => e.isUpcoming);
  const pastEvents = EVENTS_DATA.filter((e) => !e.isUpcoming);

  return (
    <div className="events-page">
      <div className="container">
        
       {/* 1. CURRENT EVENT HIGHLIGHT CARD (With dynamic image check) */}
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
                  <p className="card-meta">📅 {event.date} • 🕒 {event.duration}</p>
                  <p className="card-meta">📍 {event.venue}</p>
                  <p className="card-desc">{event.description.slice(0, 160)}...</p>
                  
                  {/* Two Clear Buttons as requested */}
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
                  </div>
                </div>
              </div>
            ))
          ) : (
            /* Fallback placeholder if no upcoming event is flagged true right now */
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

        {/* 3. EVENT DETAILS MODAL (With dedicated event photograph gallery spaces) */}
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
                <p style={{ whiteSpace: 'pre-line' }}>{selectedEvent.description}</p>
              </div>

              {/* Event Photographs Gallery Section */}
              <div className="details-block">
                <h4>EVENT PHOTOGRAPHS</h4>
                <div className="report-photo-grid">
                  <div className="photo-slot">
                    <img src={selectedEvent.image} alt="Event highlight 1" />
                  </div>
                  <div className="photo-slot">
                    <img src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=600&auto=format&fit=crop" alt="Event highlight 2" />
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

      </div>
    </div>
  );
}