import React, { useEffect, useState, useCallback } from 'react';
import API from '../../services/api';
import useAuth from '../../context/useAuth';
import './Events.css';

export function getRegistrationState(event) {
  if (!event || !event.registrationLink) {
    return {
      status: 'none',
      isOpen: false,
      badgeText: '',
      btnText: 'Register Soon',
      isClickable: false,
      tooltip: 'Registration link will be provided soon.',
    };
  }

  const mode = event.registrationStatusMode || 'auto';
  if (mode === 'open') {
    return {
      status: 'open',
      isOpen: true,
      badgeText: '🟢 Registration Open',
      btnText: '🔗 Register for Event',
      isClickable: true,
      tooltip: 'Registration is live! Click to register.',
    };
  }

  if (mode === 'closed') {
    return {
      status: 'closed',
      isOpen: false,
      badgeText: '🔴 Registration Closed',
      btnText: '🚫 Registration Closed',
      isClickable: false,
      tooltip: 'Registrations for this event have been closed.',
    };
  }

  // AUTO SCHEDULE: based on dates
  const now = new Date();
  if (event.registrationStartDate) {
    const start = new Date(event.registrationStartDate);
    if (!isNaN(start.getTime()) && now < start) {
      const formatted = start.toLocaleDateString(undefined, {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
      return {
        status: 'upcoming',
        isOpen: false,
        badgeText: `⏳ Opens ${formatted}`,
        btnText: `⏳ Opens on ${formatted}`,
        isClickable: false,
        tooltip: `Registrations will open on ${start.toLocaleString()}.`,
      };
    }
  }

  if (event.registrationEndDate) {
    const end = new Date(event.registrationEndDate);
    if (!isNaN(end.getTime()) && now > end) {
      const formatted = end.toLocaleDateString(undefined, {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
      return {
        status: 'closed',
        isOpen: false,
        badgeText: `🔴 Closed on ${formatted}`,
        btnText: '🚫 Registration Closed',
        isClickable: false,
        tooltip: `Registrations closed on ${end.toLocaleString()}.`,
      };
    } else if (!isNaN(end.getTime())) {
      const diffMs = end.getTime() - now.getTime();
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      const formatted = end.toLocaleDateString(undefined, {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
      return {
        status: 'open',
        isOpen: true,
        badgeText: diffDays <= 3 ? `🔥 Ends in ${diffDays} day${diffDays === 1 ? '' : 's'}!` : `🟢 Open until ${formatted}`,
        btnText: '🔗 Register for Event',
        isClickable: true,
        tooltip: `Registrations close on ${end.toLocaleString()}.`,
      };
    }
  }

  return {
    status: 'open',
    isOpen: true,
    badgeText: '🟢 Registration Open',
    btnText: '🔗 Register for Event',
    isClickable: true,
    tooltip: 'Registrations are open now!',
  };
}

const defaultPageSettings = {
  flagshipEyebrow: 'Official Club Flagship',
  flagshipTitle: 'Featured Flagship Event',
  upcomingEyebrow: 'Active & Upcoming',
  upcomingTitle: 'Other Upcoming Competitions & Workshops',
  pastEyebrow: 'Archives & Reports',
  pastTitle: 'Past Events & Reports',
  bannerAnnouncement: 'Registrations are now open for official competitions! Review eligibility and deadlines before registering.',
};

const emptyFormData = {
  title: '',
  tagline: '',
  date: '',
  duration: '',
  venue: '',
  speakerInfo: '',
  isUpcoming: false,
  isFlagship: false,
  flagshipStatus: 'Upcoming',
  registrationLink: '',
  registrationStartDate: '',
  registrationEndDate: '',
  registrationStatusMode: 'auto',
  teamEligibility: '',
  registrationFee: '',
  rulebookLink: '',
  prizePool: '',
  contactInfo: '',
  customLinks: [],
  image: '',
  photos: '',
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

  // Page level settings state (Eyebrows, Titles, Announcement)
  const [pageSettings, setPageSettings] = useState(defaultPageSettings);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);

  // Form modal state (for Add / Edit)
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyFormData);

  // Switch Flagship modal state
  const [showSwitchModal, setShowSwitchModal] = useState(false);
  const [switchingFlagship, setSwitchingFlagship] = useState(false);

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

  const fetchPageSettings = useCallback(async () => {
    try {
      const res = await API.get('/events/page-settings');
      if (res.data?.data) {
        setPageSettings({ ...defaultPageSettings, ...res.data.data });
      }
    } catch {
      // Use defaults if unavailable
    }
  }, []);

  useEffect(() => {
    fetchEvents();
    fetchPageSettings();
  }, [fetchEvents, fetchPageSettings]);

  const openAddModal = (isFlagshipInitial = false) => {
    setEditingId(null);
    setFormData({
      ...emptyFormData,
      isFlagship: isFlagshipInitial,
      isUpcoming: isFlagshipInitial,
    });
    setShowFormModal(true);
  };

  const openEditModal = (event) => {
    setEditingId(event._id || event.id || event.eventId);
    setFormData({
      title: event.title || '',
      tagline: event.tagline || '',
      date: event.date || '',
      duration: event.duration || '',
      venue: event.venue || '',
      speakerInfo: event.speakerInfo || '',
      isUpcoming: Boolean(event.isUpcoming),
      isFlagship: Boolean(event.isFlagship),
      flagshipStatus: event.flagshipStatus || 'Upcoming',
      registrationLink: event.registrationLink || '',
      registrationStartDate: event.registrationStartDate || '',
      registrationEndDate: event.registrationEndDate || '',
      registrationStatusMode: event.registrationStatusMode || 'auto',
      teamEligibility: event.teamEligibility || '',
      registrationFee: event.registrationFee || '',
      rulebookLink: event.rulebookLink || '',
      prizePool: event.prizePool || '',
      contactInfo: event.contactInfo || '',
      customLinks: Array.isArray(event.customLinks)
        ? event.customLinks.map((l) => ({ label: l.label || '', url: l.url || '' }))
        : [],
      image: event.image || '',
      photos: Array.isArray(event.photos) ? event.photos.join('\n') : (event.photos || ''),
      purpose: Array.isArray(event.purpose) ? event.purpose.join('\n') : (event.purpose || ''),
      description: event.description || '',
      outcomes: Array.isArray(event.outcomes) ? event.outcomes.join('\n') : (event.outcomes || ''),
    });
    setShowFormModal(true);
  };

  const addCustomLink = () => {
    setFormData((prev) => ({
      ...prev,
      customLinks: [...(prev.customLinks || []), { label: '', url: '' }],
    }));
  };

  const updateCustomLink = (index, field, value) => {
    setFormData((prev) => {
      const list = [...(prev.customLinks || [])];
      list[index] = { ...list[index], [field]: value };
      return { ...prev, customLinks: list };
    });
  };

  const removeCustomLink = (index) => {
    setFormData((prev) => ({
      ...prev,
      customLinks: (prev.customLinks || []).filter((_, i) => i !== index),
    }));
  };

  const handleSetFlagship = async (eventId) => {
    try {
      setSwitchingFlagship(true);
      setMsg('');
      const res = await API.put(`/events/flagship/set/${eventId}`);
      setMsg(res.data?.message || '✓ Event is now set as the active Flagship Event!');
      setShowSwitchModal(false);
      await fetchEvents();
      setTimeout(() => setMsg(''), 4000);
    } catch (err) {
      setMsg(err.response?.data?.message || err.message || 'Failed to update flagship event');
    } finally {
      setSwitchingFlagship(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setMsg('');

      const parsedPhotos = typeof formData.photos === 'string'
        ? formData.photos.split('\n').map((s) => s.trim()).filter(Boolean)
        : (formData.photos || []);

      const cleanedCustomLinks = (formData.customLinks || []).filter(
        (l) => l.label && l.label.trim() && l.url && l.url.trim()
      );

      const payload = {
        title: formData.title.trim(),
        tagline: formData.tagline.trim(),
        date: formData.date.trim(),
        duration: formData.duration.trim(),
        venue: formData.venue.trim(),
        speakerInfo: formData.speakerInfo.trim(),
        isUpcoming: Boolean(formData.isUpcoming),
        isFlagship: Boolean(formData.isFlagship),
        flagshipStatus: formData.flagshipStatus || 'Upcoming',
        registrationLink: formData.registrationLink.trim(),
        registrationStartDate: formData.registrationStartDate?.trim() || '',
        registrationEndDate: formData.registrationEndDate?.trim() || '',
        registrationStatusMode: formData.registrationStatusMode || 'auto',
        teamEligibility: formData.teamEligibility.trim(),
        registrationFee: formData.registrationFee.trim(),
        rulebookLink: formData.rulebookLink.trim(),
        prizePool: formData.prizePool.trim(),
        contactInfo: formData.contactInfo.trim(),
        customLinks: cleanedCustomLinks,
        image: formData.image.trim(),
        photos: parsedPhotos,
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

  const handleSavePageSettings = async (e) => {
    e.preventDefault();
    try {
      setSavingSettings(true);
      setMsg('');
      await API.put('/events/page-settings', pageSettings);
      setMsg('✓ Event page headings & settings saved successfully!');
      setShowSettingsModal(false);
      setTimeout(() => setMsg(''), 4000);
    } catch (err) {
      setMsg(err.response?.data?.message || err.message || 'Failed to save page settings');
    } finally {
      setSavingSettings(false);
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

  // Flagship event resolution (prefers isFlagship: true, falls back to first isUpcoming: true)
  const flagshipEvent = events.find((e) => e.isFlagship) || events.find((e) => e.isUpcoming);
  const otherEvents = events.filter((e) => e.id !== flagshipEvent?.id);
  const otherUpcomingEvents = otherEvents.filter((e) => e.isUpcoming);
  const pastEvents = otherEvents.filter((e) => !e.isUpcoming);

  if (loading) {
    return <div className="events-page"><div className="container" style={{ padding: '60px 0', textAlign: 'center' }}>Loading events...</div></div>;
  }

  if (error) {
    return (
      <div className="events-page">
        <div className="container" style={{ padding: '60px 0', textAlign: 'center', color: '#f87171' }}>
          Unable to load events: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="events-page">
      <div className="container">

        {/* Head Editing Banner */}
        {isHead && (
          <div className="head-admin-banner">
            <div>
              <span className="head-admin-badge">👑 Head Edit Mode Active</span>
              <p className="head-admin-sub">
                Edit everything on the event page: event details, auto registration schedules, rule books, page headings, and photos.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => setShowSettingsModal(true)}
                className="btn-head-secondary"
                title="Edit page titles, eyebrows, and top announcement banner"
              >
                ⚙️ Page Headings &amp; Announcement
              </button>
              <button
                type="button"
                onClick={() => setShowSwitchModal(true)}
                className="btn-head-secondary"
              >
                ⭐ Change Flagship Event
              </button>
              <button
                type="button"
                onClick={() => openAddModal(false)}
                className="btn-head-primary"
              >
                ➕ Add New Event
              </button>
            </div>
          </div>
        )}

        {/* Dynamic Top Announcement Banner */}
        {pageSettings.bannerAnnouncement && (
          <div className="page-announcement-strip">
            <span className="announcement-icon">📢</span>
            <p className="announcement-text">{pageSettings.bannerAnnouncement}</p>
          </div>
        )}

        {msg && (
          <div className={`status-toast ${msg.startsWith('✓') ? 'toast-success' : 'toast-error'}`}>
            {msg}
          </div>
        )}

        {/* =====================================================
            1. TOP FLAGSHIP EVENT HERO SHOWCASE
        ===================================================== */}
        <section className="flagship-showcase-section">
          <div className="section-head reveal fade-up">
            <p className="eyebrow">{pageSettings.flagshipEyebrow || 'Official Club Flagship'}</p>
            <h2 className="section-title">
              {flagshipEvent ? flagshipEvent.title : (pageSettings.flagshipTitle || 'Featured Flagship Event')}
            </h2>
          </div>

          {flagshipEvent ? (
            <div className="flagship-hero-card">
              <div className="flagship-header-bar">
                <div className="flagship-badges">
                  <span className="flagship-main-badge">⭐ FLAGSHIP EVENT</span>
                  <span className={`flagship-status-pill status-${(flagshipEvent.flagshipStatus || 'upcoming').toLowerCase()}`}>
                    <span className="live-pulse"></span>
                    {(flagshipEvent.flagshipStatus || 'Upcoming').toUpperCase()}
                  </span>
                  
                  {/* Automatic Registration Schedule Status Badge */}
                  {(() => {
                    const regState = getRegistrationState(flagshipEvent);
                    if (regState.badgeText) {
                      return (
                        <span className={`flagship-reg-status-pill reg-pill-${regState.status}`} title={regState.tooltip}>
                          {regState.badgeText}
                        </span>
                      );
                    }
                    return null;
                  })()}

                  {flagshipEvent.prizePool && (
                    <span className="flagship-prize-badge">
                      🏆 Prize: {flagshipEvent.prizePool}
                    </span>
                  )}
                </div>

                {isHead && (
                  <div className="flagship-admin-actions">
                    <button
                      type="button"
                      className="btn-head-switch-small"
                      onClick={() => setShowSwitchModal(true)}
                      title="Switch active flagship to another event"
                    >
                      ⭐ Change Flagship
                    </button>
                    <button
                      type="button"
                      className="btn-head-edit-small"
                      onClick={() => openEditModal(flagshipEvent)}
                      title="Edit flagship details, registration schedule & photos"
                    >
                      ✏️ Edit Everything
                    </button>
                    <button
                      type="button"
                      className="btn-head-delete-small"
                      onClick={() => handleDeleteEvent(flagshipEvent)}
                      title="Delete event"
                    >
                      🗑️
                    </button>
                  </div>
                )}
              </div>

              <div className="flagship-hero-body">
                {flagshipEvent.image && (
                  <div className="flagship-hero-image-wrapper">
                    <img
                      src={flagshipEvent.image}
                      alt={flagshipEvent.title}
                      className="flagship-hero-image"
                      onError={(e) => {
                        e.currentTarget.src = '/images/7.png';
                      }}
                    />
                  </div>
                )}

                <div className="flagship-hero-details">
                  <h3 className="flagship-hero-title">{flagshipEvent.title}</h3>
                  {flagshipEvent.tagline && (
                    <p className="flagship-hero-tagline">{flagshipEvent.tagline}</p>
                  )}

                  <div className="flagship-meta-grid">
                    <div className="flagship-meta-item">
                      <span className="meta-icon">📅</span>
                      <div>
                        <span className="meta-label">Date</span>
                        <span className="meta-val">{flagshipEvent.date}</span>
                      </div>
                    </div>
                    {flagshipEvent.duration && (
                      <div className="flagship-meta-item">
                        <span className="meta-icon">🕒</span>
                        <div>
                          <span className="meta-label">Timing</span>
                          <span className="meta-val">{flagshipEvent.duration}</span>
                        </div>
                      </div>
                    )}
                    {flagshipEvent.venue && (
                      <div className="flagship-meta-item">
                        <span className="meta-icon">📍</span>
                        <div>
                          <span className="meta-label">Venue</span>
                          <span className="meta-val">{flagshipEvent.venue}</span>
                        </div>
                      </div>
                    )}
                    {flagshipEvent.speakerInfo && (
                      <div className="flagship-meta-item">
                        <span className="meta-icon">🎙️</span>
                        <div>
                          <span className="meta-label">Lead / Faculty</span>
                          <span className="meta-val">{flagshipEvent.speakerInfo}</span>
                        </div>
                      </div>
                    )}
                    {flagshipEvent.contactInfo && (
                      <div className="flagship-meta-item">
                        <span className="meta-icon">📞</span>
                        <div>
                          <span className="meta-label">Coordinator</span>
                          <span className="meta-val">{flagshipEvent.contactInfo}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Highlighted Eligibility & Fee quick info if present */}
                  {(flagshipEvent.teamEligibility || flagshipEvent.registrationFee) && (
                    <div className="flagship-quick-highlights">
                      {flagshipEvent.teamEligibility && (
                        <div className="highlight-row">
                          <strong className="hl-label">👥 Team Eligibility:</strong>
                          <span className="hl-val">{flagshipEvent.teamEligibility}</span>
                        </div>
                      )}
                      {flagshipEvent.registrationFee && (
                        <div className="highlight-row">
                          <strong className="hl-label">💳 Registration Fee:</strong>
                          <span className="hl-val">{flagshipEvent.registrationFee}</span>
                        </div>
                      )}
                    </div>
                  )}

                  <p className="flagship-hero-desc">
                    {flagshipEvent.description}
                  </p>

                  {/* Flagship CTAs with Auto Registration Schedule Logic */}
                  <div className="flagship-cta-group">
                    {(() => {
                      const regState = getRegistrationState(flagshipEvent);
                      if (regState.isClickable) {
                        return (
                          <a
                            href={flagshipEvent.registrationLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-primary flagship-btn-register"
                            title={regState.tooltip}
                          >
                            {regState.btnText}
                          </a>
                        );
                      }
                      return (
                        <button
                          type="button"
                          className="btn btn-primary flagship-btn-register btn-reg-inactive"
                          onClick={() => alert(regState.tooltip)}
                          title={regState.tooltip}
                        >
                          {regState.btnText}
                        </button>
                      );
                    })()}

                    {flagshipEvent.rulebookLink ? (
                      <a
                        href={flagshipEvent.rulebookLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline flagship-btn-rulebook"
                      >
                        📘 View Rule Book
                      </a>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-outline flagship-btn-rulebook"
                        onClick={() => alert('The official rule book is being finalized and will be linked here soon!')}
                      >
                        📘 Rule Book (Coming Soon)
                      </button>
                    )}

                    <button
                      type="button"
                      className="btn btn-outline"
                      onClick={() => setSelectedEvent(flagshipEvent)}
                    >
                      ℹ️ Full Event Details &amp; Objectives
                    </button>

                    {/* Dynamic Custom Links ("More options to create if need") */}
                    {Array.isArray(flagshipEvent.customLinks) &&
                      flagshipEvent.customLinks.map((link, idx) => (
                        <a
                          key={idx}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-secondary flagship-btn-custom"
                        >
                          🔗 {link.label}
                        </a>
                      ))}
                  </div>

                  {/* Optional Photos Section / Gallery */}
                  {Array.isArray(flagshipEvent.photos) && flagshipEvent.photos.length > 0 && (
                    <div className="flagship-photos-section">
                      <h4 className="flagship-photos-title">📸 Event Gallery &amp; Highlights</h4>
                      <div className="flagship-photos-strip">
                        {flagshipEvent.photos.map((photoUrl, pIdx) => (
                          <div
                            key={pIdx}
                            className="flagship-photo-thumb"
                            onClick={() => window.open(photoUrl, '_blank')}
                            title="Click to view full photo"
                          >
                            <img
                              src={photoUrl}
                              alt={`${flagshipEvent.title} photo ${pIdx + 1}`}
                              onError={(e) => {
                                e.currentTarget.parentElement.style.display = 'none';
                              }}
                            />
                            <span className="photo-expand-cue">🔍</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flagship-hero-card flagship-hero-empty">
              <span className="flagship-main-badge">NEXT FLAGSHIP</span>
              <h3 className="flagship-hero-title">Aviation Club Annual Tech Sprint 2026</h3>
              <p className="flagship-hero-desc">
                Get ready for our upcoming drone design and aerodynamics challenges. Flagship event announcements, rule books, and registrations will be published shortly!
              </p>
              {isHead && (
                <div style={{ marginTop: '20px' }}>
                  <button
                    type="button"
                    onClick={() => openAddModal(true)}
                    className="btn btn-primary"
                  >
                    ➕ Create &amp; Set Active Flagship Event
                  </button>
                </div>
              )}
            </div>
          )}
        </section>

        {/* =====================================================
            2. OTHER UPCOMING EVENTS / COMPETITIONS
        ===================================================== */}
        {otherUpcomingEvents.length > 0 && (
          <section className="events-section" style={{ marginTop: '50px' }}>
            <div className="section-head reveal fade-up">
              <p className="eyebrow">{pageSettings.upcomingEyebrow || 'Active & Upcoming'}</p>
              <h2 className="section-title">{pageSettings.upcomingTitle || 'Other Upcoming Events'}</h2>
            </div>
            <div className="events-grid">
              {otherUpcomingEvents.map((event) => {
                const regState = getRegistrationState(event);
                return (
                  <div key={event.id} className="event-card">
                    <img
                      src={event.image || '/images/3.png'}
                      alt={event.title}
                      className="card-img"
                      onError={(e) => {
                        e.currentTarget.src = '/images/3.png';
                      }}
                    />
                    <div className="card-body">
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
                        <span className="badge">UPCOMING</span>
                        {regState.badgeText && (
                          <span className={`flagship-reg-status-pill reg-pill-${regState.status}`} style={{ fontSize: '0.72rem' }}>
                            {regState.badgeText}
                          </span>
                        )}
                      </div>
                      
                      <h3 className="card-title">{event.title}</h3>
                      <p className="card-meta">📅 {event.date} | 🕒 {event.duration}</p>
                      <p className="card-meta">📍 {event.venue}</p>
                      <p className="card-desc">{event.description?.slice(0, 150)}...</p>

                      <div style={{ marginTop: 'auto', paddingTop: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setSelectedEvent(event)}>
                          Details
                        </button>
                        
                        {regState.isClickable ? (
                          <a
                            href={event.registrationLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-primary"
                            style={{ flex: 1 }}
                            title={regState.tooltip}
                          >
                            Register
                          </a>
                        ) : event.registrationLink ? (
                          <button
                            type="button"
                            className="btn btn-primary"
                            style={{ flex: 1, opacity: 0.65, cursor: 'not-allowed' }}
                            onClick={() => alert(regState.tooltip)}
                            title={regState.tooltip}
                          >
                            {regState.status === 'upcoming' ? 'Opens Soon' : 'Closed'}
                          </button>
                        ) : null}

                        {isHead && (
                          <div style={{ display: 'flex', gap: '6px', width: '100%', marginTop: '8px' }}>
                            <button
                              type="button"
                              onClick={() => handleSetFlagship(event._id || event.id || event.eventId)}
                              style={{
                                flex: 1,
                                background: '#ca8a04',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '6px',
                                padding: '6px 8px',
                                fontSize: '0.8rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                              }}
                            >
                              ⭐ Make Flagship
                            </button>
                            <button
                              type="button"
                              onClick={() => openEditModal(event)}
                              style={{
                                flex: 1,
                                background: '#0284c7',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '6px',
                                padding: '6px 8px',
                                fontSize: '0.8rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                              }}
                            >
                              ✏️ Edit Everything
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* =====================================================
            3. PAST EVENTS & REPORTS SECTION
        ===================================================== */}
        <section className="events-section" style={{ marginTop: '60px' }}>
          <div className="section-head reveal fade-up">
            <p className="eyebrow">{pageSettings.pastEyebrow || 'Archives & Reports'}</p>
            <h2 className="section-title">{pageSettings.pastTitle || 'Past Events & Reports'}</h2>
          </div>
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
                          type="button"
                          onClick={() => handleSetFlagship(event._id || event.id || event.eventId)}
                          style={{
                            flex: 1,
                            background: '#ca8a04',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '6px 8px',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                          title="Promote this event to flagship"
                        >
                          ⭐ Flagship
                        </button>
                        <button
                          type="button"
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
                          ✏️ Edit Everything
                        </button>
                        <button
                          type="button"
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

        {/* =====================================================
            4. EVENT DETAILS MODAL (POPUP)
        ===================================================== */}
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

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginTop: '8px' }}>
                {selectedEvent.isFlagship && (
                  <span className="flagship-main-badge" style={{ fontSize: '0.75rem' }}>
                    ⭐ ACTIVE FLAGSHIP
                  </span>
                )}
                {(() => {
                  const regState = getRegistrationState(selectedEvent);
                  if (regState.badgeText) {
                    return (
                      <span className={`flagship-reg-status-pill reg-pill-${regState.status}`} style={{ fontSize: '0.75rem' }}>
                        {regState.badgeText}
                      </span>
                    );
                  }
                  return null;
                })()}
                {selectedEvent.prizePool && (
                  <span className="flagship-prize-badge" style={{ fontSize: '0.75rem' }}>
                    🏆 {selectedEvent.prizePool}
                  </span>
                )}
              </div>

              <h2 className="modal-title">{selectedEvent.title}</h2>
              {selectedEvent.tagline && (
                <p style={{ fontStyle: 'italic', color: '#94a3b8', margin: '0 0 12px 0' }}>
                  {selectedEvent.tagline}
                </p>
              )}

              <div className="event-details-meta">
                <p><strong>Date:</strong> {selectedEvent.date}</p>
                {selectedEvent.duration && <p><strong>Duration:</strong> {selectedEvent.duration}</p>}
                {selectedEvent.venue && <p><strong>Venue:</strong> {selectedEvent.venue}</p>}
                {selectedEvent.speakerInfo && <p><strong>In-Charge / Lead:</strong> {selectedEvent.speakerInfo}</p>}
                {selectedEvent.contactInfo && <p><strong>Contact Info:</strong> {selectedEvent.contactInfo}</p>}
              </div>

              {/* Team Eligibility & Registration Fee block if available */}
              {(selectedEvent.teamEligibility || selectedEvent.registrationFee) && (
                <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '10px', padding: '14px 18px', marginBottom: '16px' }}>
                  {selectedEvent.teamEligibility && (
                    <div style={{ marginBottom: selectedEvent.registrationFee ? '10px' : '0' }}>
                      <strong style={{ color: '#38bdf8', fontSize: '0.9rem', display: 'block', marginBottom: '2px' }}>
                        👥 Team Eligibility:
                      </strong>
                      <p style={{ margin: 0, color: '#e2e8f0', fontSize: '0.9rem', lineHeight: '1.6' }}>
                        {selectedEvent.teamEligibility}
                      </p>
                    </div>
                  )}
                  {selectedEvent.registrationFee && (
                    <div>
                      <strong style={{ color: '#facc15', fontSize: '0.9rem', display: 'block', marginBottom: '2px' }}>
                        💳 Registration Fee:
                      </strong>
                      <p style={{ margin: 0, color: '#e2e8f0', fontSize: '0.9rem', lineHeight: '1.6' }}>
                        {selectedEvent.registrationFee}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons in Modal */}
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '16px' }}>
                {(() => {
                  const regState = getRegistrationState(selectedEvent);
                  if (regState.isClickable) {
                    return (
                      <a
                        href={selectedEvent.registrationLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary"
                        style={{ padding: '8px 18px', fontSize: '0.9rem' }}
                        title={regState.tooltip}
                      >
                        {regState.btnText}
                      </a>
                    );
                  }
                  if (selectedEvent.registrationLink) {
                    return (
                      <button
                        type="button"
                        className="btn btn-primary"
                        style={{ padding: '8px 18px', fontSize: '0.9rem', opacity: 0.65, cursor: 'not-allowed' }}
                        onClick={() => alert(regState.tooltip)}
                        title={regState.tooltip}
                      >
                        {regState.btnText}
                      </button>
                    );
                  }
                  return null;
                })()}

                {selectedEvent.rulebookLink && (
                  <a
                    href={selectedEvent.rulebookLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline"
                    style={{ padding: '8px 18px', fontSize: '0.9rem' }}
                  >
                    📘 View Rule Book
                  </a>
                )}
                {Array.isArray(selectedEvent.customLinks) &&
                  selectedEvent.customLinks.map((link, idx) => (
                    <a
                      key={idx}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary"
                      style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                    >
                      🔗 {link.label}
                    </a>
                  ))}
              </div>

              {isHead && (
                <div style={{ display: 'flex', gap: '10px', margin: '12px 0 16px', flexWrap: 'wrap' }}>
                  {!selectedEvent.isFlagship && (
                    <button
                      type="button"
                      onClick={() => {
                        const evId = selectedEvent._id || selectedEvent.id || selectedEvent.eventId;
                        setSelectedEvent(null);
                        handleSetFlagship(evId);
                      }}
                      style={{
                        background: '#ca8a04',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '6px 14px',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      ⭐ Set as Flagship Event
                    </button>
                  )}
                  <button
                    type="button"
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
                    ✏️ Edit Everything
                  </button>
                  <button
                    type="button"
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

              {/* Event Purpose / Objectives */}
              {selectedEvent.purpose?.length > 0 && (
                <div className="details-block">
                  <h4>EVENT OBJECTIVES &amp; PURPOSE</h4>
                  <ul>
                    {selectedEvent.purpose.map((item, idx) => (
                      <li key={idx}>
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

              {/* Optional Photographs Section */}
              <div className="details-block">
                <h4>EVENT PHOTOGRAPHS &amp; GALLERY</h4>
                <div className="report-photo-grid">
                  {Array.isArray(selectedEvent.photos) && selectedEvent.photos.length > 0 ? (
                    selectedEvent.photos.map((photoUrl, pIdx) => (
                      <div key={pIdx} className="photo-slot">
                        <img
                          src={photoUrl}
                          alt={`Event highlight ${pIdx + 1}`}
                          onClick={() => window.open(photoUrl, '_blank')}
                          style={{ cursor: 'pointer' }}
                          title="Click to view full photo"
                          onError={(e) => {
                            e.currentTarget.parentElement.style.display = 'none';
                          }}
                        />
                      </div>
                    ))
                  ) : (
                    <>
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
                    </>
                  )}
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

        {/* =====================================================
            5. SWITCH FLAGSHIP EVENT MODAL
        ===================================================== */}
        {showSwitchModal && (
          <div className="modal-backdrop" onClick={() => setShowSwitchModal(false)}>
            <div
              className="modal-card"
              style={{ maxWidth: '650px' }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="close-btn" onClick={() => setShowSwitchModal(false)}>✕</button>
              <h3 style={{ margin: '0 0 6px', color: '#f8fafc', fontSize: '1.4rem' }}>
                ⭐ Change Active Flagship Event
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.88rem', marginBottom: '20px' }}>
                Select which event from the club calendar will be featured as the official Flagship Event on both the Home Page and Events Page.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '55vh', overflowY: 'auto' }}>
                {events.map((ev) => {
                  const isCurrentFlagship = ev.id === flagshipEvent?.id || ev.isFlagship;
                  return (
                    <div
                      key={ev.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 16px',
                        borderRadius: '10px',
                        background: isCurrentFlagship ? 'rgba(234, 179, 8, 0.12)' : '#1e293b',
                        border: isCurrentFlagship ? '1px solid #facc15' : '1px solid #334155',
                        gap: '12px',
                        flexWrap: 'wrap',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: '220px' }}>
                        <img
                          src={ev.image || '/images/3.png'}
                          alt={ev.title}
                          style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }}
                          onError={(e) => {
                            e.currentTarget.src = '/images/3.png';
                          }}
                        />
                        <div>
                          <h4 style={{ margin: '0 0 4px', color: '#f8fafc', fontSize: '0.98rem' }}>
                            {ev.title}
                          </h4>
                          <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.8rem' }}>
                            📅 {ev.date} {ev.venue ? `| 📍 ${ev.venue}` : ''}
                          </p>
                        </div>
                      </div>

                      <div>
                        {isCurrentFlagship ? (
                          <span
                            style={{
                              background: 'rgba(234, 179, 8, 0.25)',
                              color: '#facc15',
                              border: '1px solid #facc15',
                              padding: '6px 14px',
                              borderRadius: '20px',
                              fontSize: '0.8rem',
                              fontWeight: 700,
                            }}
                          >
                            ⭐ Current Flagship
                          </span>
                        ) : (
                          <button
                            type="button"
                            disabled={switchingFlagship}
                            onClick={() => handleSetFlagship(ev._id || ev.id || ev.eventId)}
                            style={{
                              background: '#ca8a04',
                              color: '#ffffff',
                              border: 'none',
                              borderRadius: '8px',
                              padding: '8px 16px',
                              fontSize: '0.85rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                              transition: 'background 0.2s',
                            }}
                          >
                            {switchingFlagship ? 'Setting...' : '⭐ Set as Flagship'}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #334155', flexWrap: 'wrap', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowSwitchModal(false);
                    openAddModal(true);
                  }}
                  style={{
                    background: 'transparent',
                    border: '1px dashed #ca8a04',
                    color: '#facc15',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                  }}
                >
                  ➕ Or Create a Brand New Flagship Event
                </button>
                <button
                  type="button"
                  onClick={() => setShowSwitchModal(false)}
                  style={{
                    background: '#334155',
                    color: '#fff',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================
            6. PAGE SETTINGS MODAL (HEADINGS & BANNER)
        ===================================================== */}
        {showSettingsModal && (
          <div className="modal-backdrop" onClick={() => setShowSettingsModal(false)}>
            <div
              className="modal-card"
              style={{ maxWidth: '600px' }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="close-btn" onClick={() => setShowSettingsModal(false)}>✕</button>
              <h3 style={{ margin: '0 0 6px', color: '#f8fafc', fontSize: '1.4rem' }}>
                ⚙️ Edit Event Page Headings &amp; Announcement
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '18px' }}>
                Customize the section titles, subtitles, and announcement banner visible to all visitors.
              </p>

              <form onSubmit={handleSavePageSettings} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '4px' }}>
                    📢 Top Page Announcement Banner (leave empty to hide)
                  </label>
                  <textarea
                    rows={2}
                    value={pageSettings.bannerAnnouncement}
                    onChange={(e) => setPageSettings({ ...pageSettings, bannerAnnouncement: e.target.value })}
                    placeholder="e.g. Registrations are open! SAE AEROTHON selection announced."
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
                      Flagship Eyebrow
                    </label>
                    <input
                      type="text"
                      value={pageSettings.flagshipEyebrow}
                      onChange={(e) => setPageSettings({ ...pageSettings, flagshipEyebrow: e.target.value })}
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
                      Flagship Section Title
                    </label>
                    <input
                      type="text"
                      value={pageSettings.flagshipTitle}
                      onChange={(e) => setPageSettings({ ...pageSettings, flagshipTitle: e.target.value })}
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
                      Upcoming Events Eyebrow
                    </label>
                    <input
                      type="text"
                      value={pageSettings.upcomingEyebrow}
                      onChange={(e) => setPageSettings({ ...pageSettings, upcomingEyebrow: e.target.value })}
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
                      Upcoming Events Title
                    </label>
                    <input
                      type="text"
                      value={pageSettings.upcomingTitle}
                      onChange={(e) => setPageSettings({ ...pageSettings, upcomingTitle: e.target.value })}
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
                      Past Events Eyebrow
                    </label>
                    <input
                      type="text"
                      value={pageSettings.pastEyebrow}
                      onChange={(e) => setPageSettings({ ...pageSettings, pastEyebrow: e.target.value })}
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
                      Past Events Title
                    </label>
                    <input
                      type="text"
                      value={pageSettings.pastTitle}
                      onChange={(e) => setPageSettings({ ...pageSettings, pastTitle: e.target.value })}
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

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setShowSettingsModal(false)}
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
                    disabled={savingSettings}
                    style={{
                      padding: '10px 22px',
                      background: '#38bdf8',
                      color: '#0f172a',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    {savingSettings ? 'Saving...' : 'Save Page Settings'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* =====================================================
            7. HEAD MODAL: EDIT EVERYTHING / ADD EVENT
        ===================================================== */}
        {showFormModal && (
          <div
            className="modal-backdrop"
            onClick={() => setShowFormModal(false)}
          >
            <div
              className="modal-card modal-large"
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ margin: 0, fontSize: '1.4rem', color: '#f8fafc' }}>
                  {editingId ? '✏️ Edit Everything for Event' : '➕ Add New Event'}
                </h3>
                <button
                  type="button"
                  onClick={() => setShowFormModal(false)}
                  className="close-btn"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                
                {/* 1. FLAGSHIP HIGHLIGHT SETTINGS */}
                <div
                  style={{
                    background: 'rgba(234, 179, 8, 0.08)',
                    border: '1px solid rgba(234, 179, 8, 0.35)',
                    padding: '14px 18px',
                    borderRadius: '10px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#facc15', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={formData.isFlagship}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            isFlagship: e.target.checked,
                            isUpcoming: e.target.checked ? true : formData.isUpcoming,
                          })
                        }
                        style={{ width: '18px', height: '18px', accentColor: '#eab308' }}
                      />
                      ⭐ Feature as Official Club Flagship Event
                    </label>

                    {formData.isFlagship && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Flagship Status:</span>
                        <select
                          value={formData.flagshipStatus}
                          onChange={(e) => setFormData({ ...formData, flagshipStatus: e.target.value })}
                          style={{
                            padding: '6px 12px',
                            background: '#1e293b',
                            border: '1px solid #eab308',
                            borderRadius: '6px',
                            color: '#ffffff',
                            fontSize: '0.85rem',
                          }}
                        >
                          <option value="Upcoming">Upcoming</option>
                          <option value="Ongoing">Ongoing (Live Now)</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </div>
                    )}
                  </div>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8' }}>
                    Enabling flagship highlights this event at the very top of the Events page and on the Home page hero/showcase.
                  </p>
                </div>

                {/* 2. AUTOMATIC REGISTRATION ON/OFF SCHEDULE */}
                <div
                  style={{
                    background: '#131e36',
                    border: '1px solid #0284c7',
                    borderRadius: '10px',
                    padding: '16px 18px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                    <span style={{ color: '#38bdf8', fontWeight: 700, fontSize: '0.95rem' }}>
                      ⏰ Automatic Registration Schedule &amp; Link
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <label style={{ fontSize: '0.82rem', color: '#94a3b8' }}>Mode:</label>
                      <select
                        value={formData.registrationStatusMode}
                        onChange={(e) => setFormData({ ...formData, registrationStatusMode: e.target.value })}
                        style={{
                          padding: '6px 10px',
                          background: '#1e293b',
                          border: '1px solid #38bdf8',
                          borderRadius: '6px',
                          color: '#ffffff',
                          fontSize: '0.82rem',
                          fontWeight: 600,
                        }}
                      >
                        <option value="auto">🤖 Auto by Date Schedule</option>
                        <option value="open">🟢 Force Open (Always Open)</option>
                        <option value="closed">🔴 Force Closed (Always Closed)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', color: '#cbd5e1', marginBottom: '4px' }}>
                      🔗 Registration Link (Google Form / Unstop URL)
                    </label>
                    <input
                      type="url"
                      value={formData.registrationLink}
                      onChange={(e) => setFormData({ ...formData, registrationLink: e.target.value })}
                      placeholder="https://docs.google.com/forms/d/e/.../viewform"
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        background: '#0f172a',
                        border: '1px solid #334155',
                        borderRadius: '8px',
                        color: '#ffffff',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', color: '#cbd5e1', marginBottom: '4px' }}>
                        ⏳ Registration Start Date &amp; Time (Opens)
                      </label>
                      <input
                        type="datetime-local"
                        value={formData.registrationStartDate}
                        onChange={(e) => setFormData({ ...formData, registrationStartDate: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '9px 12px',
                          background: '#0f172a',
                          border: '1px solid #334155',
                          borderRadius: '8px',
                          color: '#ffffff',
                          boxSizing: 'border-box',
                          fontSize: '0.85rem',
                        }}
                      />
                      <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                        Leave empty to open immediately.
                      </span>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', color: '#cbd5e1', marginBottom: '4px' }}>
                        🏁 Registration End Date &amp; Time (Closes / Deadline)
                      </label>
                      <input
                        type="datetime-local"
                        value={formData.registrationEndDate}
                        onChange={(e) => setFormData({ ...formData, registrationEndDate: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '9px 12px',
                          background: '#0f172a',
                          border: '1px solid #334155',
                          borderRadius: '8px',
                          color: '#ffffff',
                          boxSizing: 'border-box',
                          fontSize: '0.85rem',
                        }}
                      />
                      <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                        When this time passes, registration automatically shuts off!
                      </span>
                    </div>
                  </div>
                </div>

                {/* 3. BASIC EVENT INFO */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '4px' }}>
                    Event Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. UAV Racing Competition"
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
                    Tagline / Catchphrase (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.tagline}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                    placeholder="e.g. Fixed-Wing UAV Design, Fabrication & High-Speed Flight Challenge"
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
                      Date Display Text *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      placeholder="e.g. 8th February 2026"
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
                      Duration / Timing
                    </label>
                    <input
                      type="text"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      placeholder="e.g. 10:00 A.M. – 05:30 P.M."
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
                      placeholder="e.g. Football Ground, NIT Raipur"
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
                      General Category
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
                      <option value="upcoming">Upcoming / Live Featured</option>
                      <option value="past">Past Event &amp; Report</option>
                    </select>
                  </div>
                </div>

                {/* 4. TEAM ELIGIBILITY & REGISTRATION FEE */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '4px' }}>
                    👥 Team Eligibility
                  </label>
                  <textarea
                    rows={2}
                    value={formData.teamEligibility}
                    onChange={(e) => setFormData({ ...formData, teamEligibility: e.target.value })}
                    placeholder="Members of a Team must be undergraduate or postgraduate student. Cross college and cross branches are allowed for the members of a team. Each team can have minimum of 3 members and maximum of 5 members. And one student from 2nd or Higher grade (year) is mandatory in one team."
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      background: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      color: '#ffffff',
                      boxSizing: 'border-box',
                      fontFamily: 'inherit',
                      fontSize: '0.88rem',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '4px' }}>
                    💳 Registration Fee Structure
                  </label>
                  <input
                    type="text"
                    value={formData.registrationFee}
                    onChange={(e) => setFormData({ ...formData, registrationFee: e.target.value })}
                    placeholder="for club volunteers = Rs. 200 per person | for non volunteers = Rs. 300 per person | for Outsiders = Rs. 500 per person"
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

                {/* 5. PRIZE POOL & CONTACT INFO */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '4px' }}>
                      🏆 Prize Pool &amp; Selection Rewards
                    </label>
                    <input
                      type="text"
                      value={formData.prizePool}
                      onChange={(e) => setFormData({ ...formData, prizePool: e.target.value })}
                      placeholder="e.g. Cash Prizes + SAE AEROTHON 2027 Team Sponsorship"
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
                      📞 Contact / Coordinator Info
                    </label>
                    <input
                      type="text"
                      value={formData.contactInfo}
                      onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })}
                      placeholder="e.g. Coordinator: +91 98765 43210 / aviation@nitrr.ac.in"
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
                      📘 Rule Book Link URL (Drive PDF / Notion)
                    </label>
                    <input
                      type="url"
                      value={formData.rulebookLink}
                      onChange={(e) => setFormData({ ...formData, rulebookLink: e.target.value })}
                      placeholder="https://drive.google.com/file/d/..."
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
                      Speaker / In-Charge / Lead Info
                    </label>
                    <input
                      type="text"
                      value={formData.speakerInfo}
                      onChange={(e) => setFormData({ ...formData, speakerInfo: e.target.value })}
                      placeholder="e.g. Lakshmi Sahithi &amp; Flight Crew"
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

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '4px' }}>
                    Main Poster / Image Path or URL
                  </label>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="e.g. /images/6.png or https://res.cloudinary.com/..."
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

                {/* 6. MORE OPTIONS: DYNAMIC CUSTOM LINKS */}
                <div
                  style={{
                    background: '#131d31',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    padding: '14px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#f8fafc' }}>
                      ➕ More Options: Custom Action Links (WhatsApp, Discord, Brochure, etc.)
                    </span>
                    <button
                      type="button"
                      onClick={addCustomLink}
                      style={{
                        background: '#0284c7',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '4px 10px',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      + Add Link
                    </button>
                  </div>

                  {formData.customLinks?.length === 0 ? (
                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>
                      No custom links added yet. Click &ldquo;+ Add Link&rdquo; to add WhatsApp group, Problem Statement, Brochure, etc.
                    </p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {formData.customLinks.map((link, idx) => (
                        <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <input
                            type="text"
                            placeholder="Label (e.g. WhatsApp Group)"
                            value={link.label}
                            onChange={(e) => updateCustomLink(idx, 'label', e.target.value)}
                            style={{
                              flex: 1,
                              padding: '8px 10px',
                              background: '#1e293b',
                              border: '1px solid #334155',
                              borderRadius: '6px',
                              color: '#fff',
                              fontSize: '0.85rem',
                            }}
                          />
                          <input
                            type="url"
                            placeholder="URL (https://...)"
                            value={link.url}
                            onChange={(e) => updateCustomLink(idx, 'url', e.target.value)}
                            style={{
                              flex: 1.5,
                              padding: '8px 10px',
                              background: '#1e293b',
                              border: '1px solid #334155',
                              borderRadius: '6px',
                              color: '#fff',
                              fontSize: '0.85rem',
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => removeCustomLink(idx)}
                            style={{
                              background: '#dc2626',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '6px',
                              padding: '8px 12px',
                              cursor: 'pointer',
                              fontSize: '0.85rem',
                            }}
                            title="Remove link"
                          >
                            🗑️
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 7. OPTIONAL PHOTOS SECTION */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '4px' }}>
                    📸 Optional Event Photo Section (Gallery URLs, one per line)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.photos}
                    onChange={(e) => setFormData({ ...formData, photos: e.target.value })}
                    placeholder="https://res.cloudinary.com/...&#10;https://images.unsplash.com/...&#10;/images/3.png"
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      background: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      color: '#ffffff',
                      boxSizing: 'border-box',
                      fontFamily: 'inherit',
                      fontSize: '0.85rem',
                    }}
                  />
                  <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                    Add as many photo URLs as needed. They will be displayed in an interactive gallery strip on the flagship card and full report modal.
                  </span>
                </div>

                {/* 8. DESCRIPTION */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '4px' }}>
                    Event Description *
                  </label>
                  <textarea
                    required
                    rows={6}
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
                      lineHeight: '1.6',
                    }}
                  />
                </div>

                {/* 9. OBJECTIVES / PURPOSE */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '4px' }}>
                    Objectives / Purpose (one per line)
                  </label>
                  <textarea
                    rows={4}
                    value={formData.purpose}
                    onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                    placeholder="To encourage students to design and fabricate efficient, high-performance fixed-wing UAVs.&#10;To develop practical skills in aerodynamics, aircraft structures, propulsion, and flight control systems."
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

                {/* 10. OUTCOMES */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '4px' }}>
                    Outcomes (one per line)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.outcomes}
                    onChange={(e) => setFormData({ ...formData, outcomes: e.target.value })}
                    placeholder="Hands-on experience across the entire UAV engineering workflow&#10;Feedback – 50% 5-star rating, 40% 4-star rating"
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
