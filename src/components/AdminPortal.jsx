import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';

const API_URL = import.meta.env.VITE_API_URL || '';

// ========================
// LOGIN COMPONENT
// ========================
const AdminLogin = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const formRef = useRef(null);

  useEffect(() => {
    gsap.from(formRef.current, {
      opacity: 0,
      y: 30,
      duration: 0.8,
      ease: 'back.out(1.2)',
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();

      if (res.ok && data.token) {
        localStorage.setItem('sparklingAdminToken', data.token);
        onLogin(data.token);
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      setError('Network error. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.loginPage}>
      <div ref={formRef} style={styles.loginCard}>
        <div style={styles.loginGoldLine}></div>
        <h1 style={styles.loginTitle}>SPARKLING EVENTS</h1>
        <p style={styles.loginSubtitle}>Admin Portal</p>

        <form onSubmit={handleSubmit} style={styles.loginForm}>
          <div style={styles.loginField}>
            <label style={styles.loginLabel}>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={styles.loginInput}
              placeholder="Enter username"
            />
          </div>
          <div style={styles.loginField}>
            <label style={styles.loginLabel}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.loginInput}
              placeholder="Enter password"
            />
          </div>

          {error && <p style={styles.loginError}>{error}</p>}

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.loginBtn,
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

// ========================
// DASHBOARD COMPONENT
// ========================
const AdminDashboard = ({ token, onLogout }) => {
  const [activeTab, setActiveTab] = useState('leads');
  const [leads, setLeads] = useState([]);
  const [videos, setVideos] = useState([]);
  const [services, setServices] = useState([]);
  const [loadingLeads, setLoadingLeads] = useState(true);
  const [loadingVideos, setLoadingVideos] = useState(true);
  const [loadingServices, setLoadingServices] = useState(true);
  const [sectionVisible, setSectionVisible] = useState(true);

  // Video upload state (Standard Videos tab)
  const [videoFile, setVideoFile] = useState(null);
  const [videoTitle, setVideoTitle] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');

  // Service form states (Services tab)
  const [editingService, setEditingService] = useState(null); // null = Add, non-null = Edit
  const [serviceName, setServiceName] = useState('');
  const [servicePrice, setServicePrice] = useState('');
  const [serviceDesc, setServiceDesc] = useState('');
  const [serviceVideo, setServiceVideo] = useState(null);
  const [removeVideo, setRemoveVideo] = useState(false);
  const [serviceVisible, setServiceVisible] = useState(true);
  const [savingService, setSavingService] = useState(false);
  const [serviceProgress, setServiceProgress] = useState('');

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    fetchLeads();
    fetchVideos();
    fetchAdminServices();
    fetchSettings();
  }, []);

  const fetchLeads = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/leads`, { headers });
      const data = await res.json();
      if (res.ok) setLeads(data.leads);
    } catch (err) {
      console.error('Error fetching leads:', err);
    } finally {
      setLoadingLeads(false);
    }
  };

  const fetchVideos = async () => {
    try {
      const res = await fetch(`${API_URL}/api/videos`);
      const data = await res.json();
      if (res.ok) setVideos(data.videos);
    } catch (err) {
      console.error('Error fetching videos:', err);
    } finally {
      setLoadingVideos(false);
    }
  };

  const fetchAdminServices = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/services`, { headers });
      const data = await res.json();
      if (res.ok) setServices(data.services);
    } catch (err) {
      console.error('Error fetching services for admin:', err);
    } finally {
      setLoadingServices(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch(`${API_URL}/api/settings`);
      const data = await res.json();
      if (res.ok && data.settings) {
        setSectionVisible(data.settings.services_section_visible !== 'false');
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
    }
  };

  const toggleSectionVisibility = async () => {
    const newValue = !sectionVisible;
    try {
      const res = await fetch(`${API_URL}/api/admin/settings`, {
        method: 'POST',
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key: 'services_section_visible',
          value: String(newValue),
        }),
      });
      if (res.ok) {
        setSectionVisible(newValue);
      }
    } catch (err) {
      console.error('Error updating section visibility:', err);
    }
  };

  const deleteLead = async (id) => {
    if (!window.confirm('Delete this lead?')) return;
    try {
      await fetch(`${API_URL}/api/admin/leads/${id}`, {
        method: 'DELETE',
        headers,
      });
      setLeads((prev) => prev.filter((l) => l.id !== id));
    } catch (err) {
      console.error('Error deleting lead:', err);
    }
  };

  const deleteVideo = async (id) => {
    if (!window.confirm('Delete this video? It will also be removed from Cloudinary.')) return;
    try {
      await fetch(`${API_URL}/api/admin/videos/${id}`, {
        method: 'DELETE',
        headers,
      });
      setVideos((prev) => prev.filter((v) => v.id !== id));
    } catch (err) {
      console.error('Error deleting video:', err);
    }
  };

  const handleVideoUpload = async (e) => {
    e.preventDefault();
    if (!videoFile || !videoTitle) return;

    setUploading(true);
    setUploadProgress('Uploading to Cloudinary...');

    const formData = new FormData();
    formData.append('video', videoFile);
    formData.append('title', videoTitle);

    try {
      const res = await fetch(`${API_URL}/api/admin/videos`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setUploadProgress('✓ Upload successful!');
        setVideoFile(null);
        setVideoTitle('');
        fetchVideos();
        setTimeout(() => setUploadProgress(''), 3000);
      } else {
        setUploadProgress(`Error: ${data.error}`);
      }
    } catch (err) {
      setUploadProgress('Upload failed. Check your connection.');
    } finally {
      setUploading(false);
    }
  };

  // Service CRUD handlers
  const handleServiceSave = async (e) => {
    e.preventDefault();
    if (!serviceName || !servicePrice) return;

    setSavingService(true);
    setServiceProgress(editingService ? 'Updating service...' : 'Creating service...');

    const formData = new FormData();
    formData.append('name', serviceName);
    formData.append('price', servicePrice);
    formData.append('description', serviceDesc);
    formData.append('is_visible', String(serviceVisible));

    if (serviceVideo) {
      formData.append('video', serviceVideo);
    }

    if (editingService) {
      formData.append('remove_video', String(removeVideo));
    }

    const url = editingService
      ? `${API_URL}/api/admin/services/${editingService.id}`
      : `${API_URL}/api/admin/services`;

    const method = editingService ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setServiceProgress(editingService ? '✓ Service updated!' : '✓ Service created!');
        resetServiceForm();
        fetchAdminServices();
        setTimeout(() => setServiceProgress(''), 3000);
        setActiveTab('services');
      } else {
        setServiceProgress(`Error: ${data.error || 'Failed to save service'}`);
      }
    } catch (err) {
      setServiceProgress('Saving failed. Check your connection.');
    } finally {
      setSavingService(false);
    }
  };

  const deleteService = async (id) => {
    if (!window.confirm('Delete this service? This will also remove its video from Cloudinary.')) return;
    try {
      const res = await fetch(`${API_URL}/api/admin/services/${id}`, {
        method: 'DELETE',
        headers,
      });
      if (res.ok) {
        setServices((prev) => prev.filter((s) => s.id !== id));
      } else {
        alert('Failed to delete service');
      }
    } catch (err) {
      console.error('Error deleting service:', err);
    }
  };

  const startEditService = (service) => {
    setEditingService(service);
    setServiceName(service.name);
    setServicePrice(service.price);
    setServiceDesc(service.description || '');
    setServiceVisible(service.is_visible);
    setServiceVideo(null);
    setRemoveVideo(false);
    setServiceProgress('');
    setActiveTab('serviceForm');
  };

  const resetServiceForm = () => {
    setEditingService(null);
    setServiceName('');
    setServicePrice('');
    setServiceDesc('');
    setServiceVideo(null);
    setRemoveVideo(false);
    setServiceVisible(true);
    setServiceProgress('');
  };

  return (
    <div style={styles.dashboard}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <h2 style={styles.sidebarTitle}>✦ SPARKLING</h2>
          <p style={styles.sidebarSub}>Admin Panel</p>
        </div>

        <nav style={styles.sidebarNav}>
          <button
            onClick={() => setActiveTab('leads')}
            style={{
              ...styles.navBtn,
              ...(activeTab === 'leads' ? styles.navBtnActive : {}),
            }}
          >
            📋 Leads ({leads.length})
          </button>
          <button
            onClick={() => setActiveTab('services')}
            style={{
              ...styles.navBtn,
              ...(activeTab === 'services' || activeTab === 'serviceForm' ? styles.navBtnActive : {}),
            }}
          >
            ✨ Services ({services.length})
          </button>
          <button
            onClick={() => setActiveTab('videos')}
            style={{
              ...styles.navBtn,
              ...(activeTab === 'videos' ? styles.navBtnActive : {}),
            }}
          >
            🎬 Videos ({videos.length})
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            style={{
              ...styles.navBtn,
              ...(activeTab === 'upload' ? styles.navBtnActive : {}),
            }}
          >
            ⬆ Upload Video
          </button>
        </nav>

        <button onClick={onLogout} style={styles.logoutBtn}>
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main style={styles.mainContent}>
        {/* LEADS TAB */}
        {activeTab === 'leads' && (
          <div>
            <h2 style={styles.tabTitle}>Lead Intake</h2>
            <p style={styles.tabSubtitle}>
              Contact form submissions from the website
            </p>

            {loadingLeads ? (
              <p style={styles.loadingText}>Loading leads...</p>
            ) : leads.length === 0 ? (
              <div style={styles.emptyState}>
                <p>No leads yet. They'll appear here when someone submits the contact form.</p>
              </div>
            ) : (
              <div style={styles.tableWrapper}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Name</th>
                      <th style={styles.th}>Phone</th>
                      <th style={styles.th}>Email</th>
                      <th style={styles.th}>Message</th>
                      <th style={styles.th}>Date</th>
                      <th style={styles.th}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map((lead) => (
                      <tr key={lead.id} style={styles.tr}>
                        <td style={styles.td}>{lead.name}</td>
                        <td style={styles.td}>{lead.phone}</td>
                        <td style={styles.td}>{lead.email || '-'}</td>
                        <td style={{ ...styles.td, maxWidth: '200px' }}>
                          {lead.message || '-'}
                        </td>
                        <td style={styles.td}>
                          {new Date(lead.created_at).toLocaleDateString('en-IN')}
                        </td>
                        <td style={styles.td}>
                          <button
                            onClick={() => deleteLead(lead.id)}
                            style={styles.deleteBtn}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* SERVICES MANAGEMENT TAB */}
        {activeTab === 'services' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2 style={styles.tabTitle}>Services Management</h2>
                <p style={styles.tabSubtitle}>
                  Manage events/services displayed under the Signature Services section
                </p>
              </div>
              <button
                onClick={() => {
                  resetServiceForm();
                  setActiveTab('serviceForm');
                }}
                style={styles.addServiceBtn}
              >
                ＋ Add New Service
              </button>
            </div>

            {/* Visibility Settings Card */}
            <div style={styles.settingsCard}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontSize: '1.5rem' }}>👁️</span>
                <div>
                  <h4 style={{ color: '#f9e076', margin: 0, fontSize: '1.05rem' }}>Signature Services Section Visibility</h4>
                  <p style={{ margin: '0.2rem 0 0', fontSize: '0.85rem', color: '#b8a265' }}>
                    Toggle whether the signature services section is visible at all on the website
                  </p>
                </div>
              </div>
              <button
                onClick={toggleSectionVisibility}
                style={{
                  ...styles.toggleBtn,
                  background: sectionVisible ? 'rgba(46, 204, 113, 0.15)' : 'rgba(255, 68, 68, 0.15)',
                  borderColor: sectionVisible ? '#2ecc71' : '#ff4444',
                  color: sectionVisible ? '#2ecc71' : '#ff6666',
                }}
              >
                {sectionVisible ? 'Section Visible (ON)' : 'Section Hidden (OFF)'}
              </button>
            </div>

            {loadingServices ? (
              <p style={styles.loadingText}>Loading services...</p>
            ) : services.length === 0 ? (
              <div style={styles.emptyState}>
                <p>No services registered yet. Click 'Add New Service' to create one.</p>
              </div>
            ) : (
              <div style={styles.tableWrapper}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Name</th>
                      <th style={styles.th}>Price (Rs.)</th>
                      <th style={styles.th}>Description</th>
                      <th style={styles.th}>Video</th>
                      <th style={styles.th}>Visibility</th>
                      <th style={styles.th}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {services.map((service) => (
                      <tr key={service.id} style={styles.tr}>
                        <td style={{ ...styles.td, fontWeight: 'bold', color: '#f9e076' }}>{service.name}</td>
                        <td style={styles.td}>{service.price}/-</td>
                        <td style={{ ...styles.td, maxWidth: '250px', fontSize: '0.85rem' }}>
                          {service.description || '-'}
                        </td>
                        <td style={styles.td}>
                          {service.video_url ? (
                            <a href={service.video_url} target="_blank" rel="noreferrer" style={{ color: '#ffd700', fontSize: '0.85rem' }}>
                              🎬 View Video
                            </a>
                          ) : (
                            <span style={{ opacity: 0.5 }}>None</span>
                          )}
                        </td>
                        <td style={styles.td}>
                          <span
                            style={{
                              color: service.is_visible ? '#2ecc71' : '#ff4444',
                              fontSize: '0.85rem',
                              fontWeight: 600,
                            }}
                          >
                            {service.is_visible ? 'Visible' : 'Hidden'}
                          </span>
                        </td>
                        <td style={{ ...styles.td, display: 'flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => startEditService(service)}
                            style={{
                              ...styles.deleteBtn,
                              background: 'rgba(212,175,55,0.1)',
                              borderColor: 'rgba(212,175,55,0.3)',
                              color: '#ffd700',
                            }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteService(service.id)}
                            style={styles.deleteBtn}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* SERVICE FORM TAB (ADD/EDIT) */}
        {activeTab === 'serviceForm' && (
          <div>
            <h2 style={styles.tabTitle}>{editingService ? 'Edit Service' : 'Add New Service'}</h2>
            <p style={styles.tabSubtitle}>
              {editingService ? 'Update details, upload highlight video, or manage visibility settings.' : 'Create a new custom service entry.'}
            </p>

            <form onSubmit={handleServiceSave} style={styles.uploadForm}>
              <div style={styles.uploadField}>
                <label style={styles.uploadLabel}>Service Name *</label>
                <input
                  type="text"
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  required
                  placeholder="e.g., Wedding Budget Decor"
                  style={styles.uploadInput}
                />
              </div>

              <div style={styles.uploadField}>
                <label style={styles.uploadLabel}>Price (Rs.) *</label>
                <input
                  type="text"
                  value={servicePrice}
                  onChange={(e) => setServicePrice(e.target.value)}
                  required
                  placeholder="e.g., 9,999"
                  style={styles.uploadInput}
                />
              </div>

              <div style={styles.uploadField}>
                <label style={styles.uploadLabel}>Description</label>
                <textarea
                  value={serviceDesc}
                  onChange={(e) => setServiceDesc(e.target.value)}
                  rows={4}
                  placeholder="Describe this service highlight..."
                  style={{ ...styles.uploadInput, fontFamily: 'inherit', resize: 'vertical' }}
                />
              </div>

              <div style={styles.uploadField}>
                <label style={styles.uploadLabel}>Visibility Status</label>
                <select
                  value={String(serviceVisible)}
                  onChange={(e) => setServiceVisible(e.target.value === 'true')}
                  style={styles.uploadInput}
                >
                  <option value="true">Visible on Website</option>
                  <option value="false">Hidden from Website</option>
                </select>
              </div>

              {/* Video upload input */}
              <div style={styles.uploadField}>
                <label style={styles.uploadLabel}>
                  {editingService?.video_url ? 'Replace Event Video' : 'Add Event Highlight Video'}
                </label>
                
                {editingService?.video_url && (
                  <div style={{ marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '1.5rem', background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(212,175,55,0.15)' }}>
                    <video src={editingService.video_url} style={{ width: '140px', borderRadius: '8px' }} muted controls />
                    <div>
                      <span style={{ fontSize: '0.85rem', color: '#b8a265', display: 'block' }}>Current Video Loaded</span>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem', cursor: 'pointer', color: '#ff6666' }}>
                        <input
                          type="checkbox"
                          checked={removeVideo}
                          onChange={(e) => setRemoveVideo(e.target.checked)}
                        />
                        <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Remove Current Video</span>
                      </label>
                    </div>
                  </div>
                )}

                <div style={styles.fileDropZone}>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => setServiceVideo(e.target.files[0])}
                    style={styles.fileInput}
                    id="service-video-input"
                  />
                  <label htmlFor="service-video-input" style={styles.fileLabel}>
                    {serviceVideo ? (
                      <>
                        <span style={{ color: '#d4af37' }}>✓ {serviceVideo.name}</span>
                        <br />
                        <span style={{ fontSize: '0.85rem', opacity: 0.7 }}>
                          {(serviceVideo.size / (1024 * 1024)).toFixed(2)} MB
                        </span>
                      </>
                    ) : (
                      <>
                        <span style={{ fontSize: '1.5rem' }}>🎬</span>
                        <br />
                        Click to select/upload a video
                      </>
                    )}
                  </label>
                </div>
              </div>

              {serviceProgress && (
                <p
                  style={{
                    ...styles.uploadStatus,
                    color: serviceProgress.startsWith('Error') || serviceProgress.startsWith('Saving')
                      ? '#ff4444'
                      : '#d4af37',
                  }}
                >
                  {serviceProgress}
                </p>
              )}

              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button
                  type="submit"
                  disabled={savingService}
                  style={{
                    ...styles.uploadBtn,
                    flex: 2,
                    opacity: savingService ? 0.6 : 1,
                  }}
                >
                  {savingService ? '⏳ Saving...' : editingService ? 'Update Service' : 'Create Service'}
                </button>
                
                <button
                  type="button"
                  onClick={() => {
                    resetServiceForm();
                    setActiveTab('services');
                  }}
                  style={{
                    ...styles.logoutBtn,
                    flex: 1,
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(212,175,55,0.2)',
                    color: '#d4c7a2',
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* VIDEOS TAB (Standard Video Display) */}
        {activeTab === 'videos' && (
          <div>
            <h2 style={styles.tabTitle}>Video Management</h2>
            <p style={styles.tabSubtitle}>
              Videos hosted on Cloudinary, displayed on the website
            </p>

            {loadingVideos ? (
              <p style={styles.loadingText}>Loading videos...</p>
            ) : videos.length === 0 ? (
              <div style={styles.emptyState}>
                <p>No videos uploaded yet. Use the Upload tab to add event videos.</p>
              </div>
            ) : (
              <div style={styles.videoGrid}>
                {videos.map((video) => (
                  <div key={video.id} style={styles.adminVideoCard}>
                    <video
                      src={video.video_url}
                      controls
                      preload="metadata"
                      style={styles.adminVideoPlayer}
                    />
                    <div style={styles.adminVideoInfo}>
                      <h4 style={styles.adminVideoTitle}>{video.title}</h4>
                      <span style={styles.adminVideoDate}>
                        {new Date(video.created_at).toLocaleDateString('en-IN')}
                      </span>
                      <button
                        onClick={() => deleteVideo(video.id)}
                        style={styles.deleteBtn}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* UPLOAD TAB (Standard Video Upload) */}
        {activeTab === 'upload' && (
          <div>
            <h2 style={styles.tabTitle}>Upload Video</h2>
            <p style={styles.tabSubtitle}>
              Upload event videos to Cloudinary. Only the URL is stored in the
              database.
            </p>

            <form onSubmit={handleVideoUpload} style={styles.uploadForm}>
              <div style={styles.uploadField}>
                <label style={styles.uploadLabel}>Video Title *</label>
                <input
                  type="text"
                  value={videoTitle}
                  onChange={(e) => setVideoTitle(e.target.value)}
                  required
                  placeholder="e.g., KSR Institution Fest 2026"
                  style={styles.uploadInput}
                />
              </div>

              <div style={styles.uploadField}>
                <label style={styles.uploadLabel}>Video File *</label>
                <div style={styles.fileDropZone}>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => setVideoFile(e.target.files[0])}
                    required
                    style={styles.fileInput}
                    id="video-upload-input"
                  />
                  <label htmlFor="video-upload-input" style={styles.fileLabel}>
                    {videoFile ? (
                      <>
                        <span style={{ color: '#d4af37' }}>✓ {videoFile.name}</span>
                        <br />
                        <span style={{ fontSize: '0.85rem', opacity: 0.7 }}>
                          {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                        </span>
                      </>
                    ) : (
                      <>
                        <span style={{ fontSize: '2rem' }}>🎬</span>
                        <br />
                        Click to select a video file
                        <br />
                        <span style={{ fontSize: '0.85rem', opacity: 0.6 }}>
                          Max 100MB • MP4, MOV, AVI
                        </span>
                      </>
                    )}
                  </label>
                </div>
              </div>

              {uploadProgress && (
                <p
                  style={{
                    ...styles.uploadStatus,
                    color: uploadProgress.startsWith('Error')
                      ? '#ff4444'
                      : '#d4af37',
                  }}
                >
                  {uploadProgress}
                </p>
              )}

              <button
                type="submit"
                disabled={uploading}
                style={{
                  ...styles.uploadBtn,
                  opacity: uploading ? 0.6 : 1,
                  cursor: uploading ? 'not-allowed' : 'pointer',
                }}
              >
                {uploading ? '⏳ Uploading...' : '⬆ Upload Video'}
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};

// ========================
// MAIN ADMIN PORTAL
// ========================
const AdminPortal = () => {
  const [token, setToken] = useState(
    localStorage.getItem('sparklingAdminToken') || null
  );

  const handleLogin = (newToken) => {
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('sparklingAdminToken');
    setToken(null);
  };

  // Validate existing token
  useEffect(() => {
    if (!token) return;

    const validate = async () => {
      try {
        const res = await fetch(`${API_URL}/api/admin/leads`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          handleLogout();
        }
      } catch {
        handleLogout();
      }
    };

    validate();
  }, [token]);

  if (!token) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return <AdminDashboard token={token} onLogout={handleLogout} />;
};

export default AdminPortal;

// ========================
// STYLES
// ========================
const styles = {
  // LOGIN
  loginPage: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'linear-gradient(135deg, #0a0a0a 0%, #1a150d 50%, #0c0a06 100%)',
    fontFamily: "'Inter', 'Poppins', sans-serif",
    padding: '1rem',
  },
  loginCard: {
    background: 'rgba(20, 17, 10, 0.95)',
    border: '1px solid rgba(212, 175, 55, 0.3)',
    borderRadius: '16px',
    padding: '3rem 2.5rem',
    maxWidth: '420px',
    width: '100%',
    boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(212,175,55,0.08)',
    textAlign: 'center',
  },
  loginGoldLine: {
    height: '2px',
    background: 'linear-gradient(90deg, transparent, #d4af37, transparent)',
    width: '60%',
    margin: '0 auto 1.5rem',
  },
  loginTitle: {
    color: '#f9e076',
    fontSize: '1.8rem',
    fontWeight: 700,
    letterSpacing: '3px',
    margin: 0,
  },
  loginSubtitle: {
    color: '#b8a265',
    fontSize: '0.95rem',
    marginTop: '0.5rem',
    letterSpacing: '1px',
  },
  loginForm: {
    marginTop: '2rem',
  },
  loginField: {
    marginBottom: '1.2rem',
    textAlign: 'left',
  },
  loginLabel: {
    display: 'block',
    color: '#d4c7a2',
    fontSize: '0.85rem',
    marginBottom: '0.4rem',
    letterSpacing: '0.5px',
  },
  loginInput: {
    width: '100%',
    padding: '0.8rem 1rem',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(212,175,55,0.25)',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color 0.3s',
    boxSizing: 'border-box',
  },
  loginError: {
    color: '#ff4444',
    fontSize: '0.9rem',
    margin: '0.5rem 0',
  },
  loginBtn: {
    width: '100%',
    padding: '0.9rem',
    background: 'linear-gradient(135deg, #d4af37, #f9e076)',
    border: 'none',
    borderRadius: '8px',
    color: '#000',
    fontSize: '1rem',
    fontWeight: 700,
    letterSpacing: '1px',
    cursor: 'pointer',
    marginTop: '0.5rem',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },

  // DASHBOARD
  dashboard: {
    display: 'flex',
    minHeight: '100vh',
    fontFamily: "'Inter', 'Poppins', sans-serif",
    background: '#0a0a0a',
    color: '#e6d6a9',
  },
  sidebar: {
    width: '260px',
    background: 'linear-gradient(180deg, #14110a 0%, #0c0a06 100%)',
    borderRight: '1px solid rgba(212,175,55,0.15)',
    padding: '2rem 1rem',
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    top: 0,
    left: 0,
    height: '100vh',
    zIndex: 100,
  },
  sidebarHeader: {
    textAlign: 'center',
    marginBottom: '2rem',
    paddingBottom: '1.5rem',
    borderBottom: '1px solid rgba(212,175,55,0.2)',
  },
  sidebarTitle: {
    color: '#f9e076',
    fontSize: '1.3rem',
    fontWeight: 700,
    letterSpacing: '2px',
    margin: 0,
  },
  sidebarSub: {
    color: '#b8a265',
    fontSize: '0.85rem',
    marginTop: '0.3rem',
  },
  sidebarNav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    flex: 1,
  },
  navBtn: {
    padding: '0.9rem 1rem',
    background: 'transparent',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'transparent',
    borderRadius: '8px',
    color: '#d4c7a2',
    fontSize: '0.95rem',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 0.2s',
  },
  navBtnActive: {
    background: 'rgba(212,175,55,0.1)',
    borderColor: 'rgba(212,175,55,0.3)',
    color: '#f9e076',
  },
  logoutBtn: {
    padding: '0.8rem',
    background: 'rgba(255,68,68,0.1)',
    border: '1px solid rgba(255,68,68,0.3)',
    borderRadius: '8px',
    color: '#ff6666',
    cursor: 'pointer',
    fontSize: '0.9rem',
    transition: 'all 0.2s',
  },

  mainContent: {
    flex: 1,
    marginLeft: '260px',
    padding: '2rem 3rem',
    minHeight: '100vh',
  },
  tabTitle: {
    fontSize: '1.8rem',
    fontWeight: 700,
    color: '#f9e076',
    marginBottom: '0.3rem',
  },
  tabSubtitle: {
    color: '#b8a265',
    fontSize: '0.95rem',
    marginBottom: '2rem',
  },
  loadingText: {
    color: '#b8a265',
    fontStyle: 'italic',
  },
  emptyState: {
    padding: '3rem',
    textAlign: 'center',
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '12px',
    border: '1px dashed rgba(212,175,55,0.2)',
    color: '#8a7a4f',
  },

  // TABLE
  tableWrapper: {
    overflowX: 'auto',
    borderRadius: '12px',
    border: '1px solid rgba(212,175,55,0.15)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    padding: '1rem',
    textAlign: 'left',
    background: 'rgba(212,175,55,0.08)',
    color: '#f9e076',
    fontWeight: 600,
    fontSize: '0.85rem',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
    borderBottom: '1px solid rgba(212,175,55,0.15)',
  },
  tr: {
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    transition: 'background 0.2s',
  },
  td: {
    padding: '0.9rem 1rem',
    fontSize: '0.9rem',
    color: '#d4c7a2',
    verticalAlign: 'middle',
  },
  deleteBtn: {
    padding: '0.4rem 0.9rem',
    background: 'rgba(255,68,68,0.1)',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'rgba(255,68,68,0.3)',
    borderRadius: '6px',
    color: '#ff6666',
    cursor: 'pointer',
    fontSize: '0.8rem',
    transition: 'all 0.2s',
  },

  // VIDEO MANAGEMENT
  videoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1.5rem',
  },
  adminVideoCard: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(212,175,55,0.15)',
    borderRadius: '12px',
    overflow: 'hidden',
  },
  adminVideoPlayer: {
    width: '100%',
    aspectRatio: '16/9',
    objectFit: 'cover',
    display: 'block',
  },
  adminVideoInfo: {
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  adminVideoTitle: {
    color: '#f9e076',
    fontSize: '1rem',
    fontWeight: 600,
    margin: 0,
  },
  adminVideoDate: {
    color: '#8a7a4f',
    fontSize: '0.85rem',
  },

  // UPLOAD FORM
  uploadForm: {
    maxWidth: '650px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(212,175,55,0.15)',
    borderRadius: '12px',
    padding: '2rem',
  },
  uploadField: {
    marginBottom: '1.5rem',
  },
  uploadLabel: {
    display: 'block',
    color: '#d4c7a2',
    fontSize: '0.9rem',
    marginBottom: '0.5rem',
    fontWeight: 500,
  },
  uploadInput: {
    width: '100%',
    padding: '0.8rem 1rem',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(212,175,55,0.25)',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '1rem',
    outline: 'none',
    boxSizing: 'border-box',
  },
  fileDropZone: {
    position: 'relative',
  },
  fileInput: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    opacity: 0,
    cursor: 'pointer',
  },
  fileLabel: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
    background: 'rgba(255,255,255,0.03)',
    border: '2px dashed rgba(212,175,55,0.3)',
    borderRadius: '10px',
    color: '#d4c7a2',
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'border-color 0.3s',
    minHeight: '120px',
  },
  uploadStatus: {
    fontSize: '0.95rem',
    fontWeight: 500,
    marginBottom: '1rem',
  },
  uploadBtn: {
    width: '100%',
    padding: '1rem',
    background: 'linear-gradient(135deg, #d4af37, #f9e076)',
    border: 'none',
    borderRadius: '8px',
    color: '#000',
    fontSize: '1rem',
    fontWeight: 700,
    letterSpacing: '1px',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },

  // SERVICE NEW STYLES
  addServiceBtn: {
    padding: '0.7rem 1.4rem',
    background: 'linear-gradient(135deg, #d4af37, #f9e076)',
    border: 'none',
    borderRadius: '8px',
    color: '#000',
    fontSize: '0.95rem',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  settingsCard: {
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(212,175,55,0.15)',
    borderRadius: '12px',
    padding: '1.5rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    gap: '1rem',
    flexWrap: 'wrap',
  },
  toggleBtn: {
    padding: '0.7rem 1.4rem',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: '0.9rem',
    transition: 'all 0.2s',
  },
};
