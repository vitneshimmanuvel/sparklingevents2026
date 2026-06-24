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
    gsap.fromTo(formRef.current, 
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'back.out(1.2)',
      }
    );
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

  // Slider Images state
  const [sliderImages, setSliderImages] = useState([]);
  const [loadingSliderImages, setLoadingSliderImages] = useState(true);
  const [editingSliderImage, setEditingSliderImage] = useState(null);
  const [sliderTitle, setSliderTitle] = useState('');
  const [sliderOrder, setSliderOrder] = useState('');
  const [sliderActive, setSliderActive] = useState(true);
  const [sliderFile, setSliderFile] = useState(null);
  const [savingSlider, setSavingSlider] = useState(false);
  const [sliderProgress, setSliderProgress] = useState('');

  // Testimonials state
  const [testimonials, setTestimonials] = useState([]);
  const [loadingTestimonials, setLoadingTestimonials] = useState(true);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [testimonialName, setTestimonialName] = useState('');
  const [testimonialDesignation, setTestimonialDesignation] = useState('');
  const [testimonialMessage, setTestimonialMessage] = useState('');
  const [testimonialRating, setTestimonialRating] = useState('5');
  const [testimonialVisible, setTestimonialVisible] = useState(true);
  const [testimonialFile, setTestimonialFile] = useState(null);
  const [removeTestimonialImage, setRemoveTestimonialImage] = useState(false);
  const [savingTestimonial, setSavingTestimonial] = useState(false);
  const [testimonialProgress, setTestimonialProgress] = useState('');

  // Grid Images (3D animated grid columns) state
  const [gridImages, setGridImages] = useState([]);
  const [loadingGridImages, setLoadingGridImages] = useState(true);
  const [editingGridImage, setEditingGridImage] = useState(null);
  const [gridColIndex, setGridColIndex] = useState('1'); // '1', '2', or '3'
  const [gridOrder, setGridOrder] = useState('');
  const [gridFile, setGridFile] = useState(null);
  const [savingGrid, setSavingGrid] = useState(false);
  const [gridProgress, setGridProgress] = useState('');

  // Elite Institutions state
  const [adminInstitutions, setAdminInstitutions] = useState([]);
  const [loadingInstitutions, setLoadingInstitutions] = useState(true);
  const [editingInstitution, setEditingInstitution] = useState(null);
  const [institutionName, setInstitutionName] = useState('');
  const [institutionOrder, setInstitutionOrder] = useState('');
  const [savingInstitution, setSavingInstitution] = useState(false);
  const [institutionProgress, setInstitutionProgress] = useState('');

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    fetchLeads();
    fetchVideos();
    fetchAdminServices();
    fetchSettings();
    fetchSliderImages();
    fetchTestimonials();
    fetchGridImages();
    fetchAdminInstitutions();
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

  // ========================
  // SLIDER IMAGES HANDLERS
  // ========================
  const fetchSliderImages = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/slider-images`, { headers });
      const data = await res.json();
      if (res.ok) setSliderImages(data.images);
    } catch (err) {
      console.error('Error fetching slider images:', err);
    } finally {
      setLoadingSliderImages(false);
    }
  };

  const handleSliderSave = async (e) => {
    e.preventDefault();
    if (!editingSliderImage && !sliderFile) return;

    setSavingSlider(true);
    setSliderProgress(editingSliderImage ? 'Updating image...' : 'Uploading image...');

    const formData = new FormData();
    formData.append('title', sliderTitle);
    formData.append('display_order', sliderOrder || '0');
    formData.append('is_active', String(sliderActive));
    if (sliderFile) formData.append('image', sliderFile);

    const url = editingSliderImage
      ? `${API_URL}/api/admin/slider-images/${editingSliderImage.id}`
      : `${API_URL}/api/admin/slider-images`;
    const method = editingSliderImage ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setSliderProgress(editingSliderImage ? '✓ Image updated!' : '✓ Image uploaded!');
        resetSliderForm();
        fetchSliderImages();
        setTimeout(() => setSliderProgress(''), 3000);
        setActiveTab('sliderImages');
      } else {
        setSliderProgress(`Error: ${data.error || 'Failed to save'}`);
      }
    } catch (err) {
      setSliderProgress('Save failed. Check your connection.');
    } finally {
      setSavingSlider(false);
    }
  };

  const deleteSliderImage = async (id) => {
    if (!window.confirm('Delete this image?')) return;
    try {
      await fetch(`${API_URL}/api/admin/slider-images/${id}`, { method: 'DELETE', headers });
      setSliderImages((prev) => prev.filter((img) => img.id !== id));
    } catch (err) {
      console.error('Error deleting slider image:', err);
    }
  };

  const startEditSliderImage = (img) => {
    setEditingSliderImage(img);
    setSliderTitle(img.title || '');
    setSliderOrder(String(img.display_order || ''));
    setSliderActive(img.is_active);
    setSliderFile(null);
    setSliderProgress('');
    setActiveTab('sliderForm');
  };

  const resetSliderForm = () => {
    setEditingSliderImage(null);
    setSliderTitle('');
    setSliderOrder('');
    setSliderActive(true);
    setSliderFile(null);
    setSliderProgress('');
  };

  // ========================
  // TESTIMONIALS HANDLERS
  // ========================
  const fetchTestimonials = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/testimonials`, { headers });
      const data = await res.json();
      if (res.ok) setTestimonials(data.testimonials);
    } catch (err) {
      console.error('Error fetching testimonials:', err);
    } finally {
      setLoadingTestimonials(false);
    }
  };

  const handleTestimonialSave = async (e) => {
    e.preventDefault();
    if (!testimonialName || !testimonialMessage) return;

    setSavingTestimonial(true);
    setTestimonialProgress(editingTestimonial ? 'Updating testimonial...' : 'Creating testimonial...');

    const formData = new FormData();
    formData.append('client_name', testimonialName);
    formData.append('designation', testimonialDesignation);
    formData.append('message', testimonialMessage);
    formData.append('rating', testimonialRating);
    formData.append('is_visible', String(testimonialVisible));
    if (testimonialFile) formData.append('image', testimonialFile);
    if (editingTestimonial && removeTestimonialImage) formData.append('remove_image', 'true');

    const url = editingTestimonial
      ? `${API_URL}/api/admin/testimonials/${editingTestimonial.id}`
      : `${API_URL}/api/admin/testimonials`;
    const method = editingTestimonial ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setTestimonialProgress(editingTestimonial ? '✓ Testimonial updated!' : '✓ Testimonial created!');
        resetTestimonialForm();
        fetchTestimonials();
        setTimeout(() => setTestimonialProgress(''), 3000);
        setActiveTab('testimonials');
      } else {
        setTestimonialProgress(`Error: ${data.error || 'Failed to save'}`);
      }
    } catch (err) {
      setTestimonialProgress('Save failed. Check your connection.');
    } finally {
      setSavingTestimonial(false);
    }
  };

  const deleteTestimonial = async (id) => {
    if (!window.confirm('Delete this testimonial?')) return;
    try {
      await fetch(`${API_URL}/api/admin/testimonials/${id}`, { method: 'DELETE', headers });
      setTestimonials((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error('Error deleting testimonial:', err);
    }
  };

  const startEditTestimonial = (t) => {
    setEditingTestimonial(t);
    setTestimonialName(t.client_name);
    setTestimonialDesignation(t.designation || '');
    setTestimonialMessage(t.message);
    setTestimonialRating(String(t.rating || 5));
    setTestimonialVisible(t.is_visible);
    setTestimonialFile(null);
    setRemoveTestimonialImage(false);
    setTestimonialProgress('');
    setActiveTab('testimonialForm');
  };

  const resetTestimonialForm = () => {
    setEditingTestimonial(null);
    setTestimonialName('');
    setTestimonialDesignation('');
    setTestimonialMessage('');
    setTestimonialRating('5');
    setTestimonialVisible(true);
    setTestimonialFile(null);
    setRemoveTestimonialImage(false);
    setTestimonialProgress('');
  };

  // ========================
  // GRID IMAGES HANDLERS
  // ========================
  const fetchGridImages = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/grid-images`, { headers });
      const data = await res.json();
      if (res.ok) setGridImages(data.images);
    } catch (err) {
      console.error('Error fetching grid images:', err);
    } finally {
      setLoadingGridImages(false);
    }
  };

  const handleGridSave = async (e) => {
    e.preventDefault();
    if (!editingGridImage && !gridFile) return;

    setSavingGrid(true);
    setGridProgress(editingGridImage ? 'Updating image...' : 'Uploading image...');

    const formData = new FormData();
    formData.append('col_index', gridColIndex);
    formData.append('display_order', gridOrder || '0');
    if (gridFile) formData.append('image', gridFile);

    const url = editingGridImage
      ? `${API_URL}/api/admin/grid-images/${editingGridImage.id}`
      : `${API_URL}/api/admin/grid-images`;
    const method = editingGridImage ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setGridProgress(editingGridImage ? '✓ Image updated!' : '✓ Image uploaded!');
        resetGridForm();
        fetchGridImages();
        setTimeout(() => setGridProgress(''), 3000);
        setActiveTab('gridImages');
      } else {
        setGridProgress(`Error: ${data.error || 'Failed to save'}`);
      }
    } catch (err) {
      setGridProgress('Save failed. Check your connection.');
    } finally {
      setSavingGrid(false);
    }
  };

  const deleteGridImage = async (id) => {
    if (!window.confirm('Delete this grid image?')) return;
    try {
      await fetch(`${API_URL}/api/admin/grid-images/${id}`, { method: 'DELETE', headers });
      setGridImages((prev) => prev.filter((img) => img.id !== id));
    } catch (err) {
      console.error('Error deleting grid image:', err);
    }
  };

  const startEditGridImage = (img) => {
    setEditingGridImage(img);
    setGridColIndex(String(img.col_index || '1'));
    setGridOrder(String(img.display_order || ''));
    setGridFile(null);
    setGridProgress('');
    setActiveTab('gridImageForm');
  };

  const resetGridForm = () => {
    setEditingGridImage(null);
    setGridColIndex('1');
    setGridOrder('');
    setGridFile(null);
    setGridProgress('');
  };

  // ========================
  // INSTITUTIONS HANDLERS
  // ========================
  const fetchAdminInstitutions = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/institutions`, { headers });
      const data = await res.json();
      if (res.ok) setAdminInstitutions(data.institutions);
    } catch (err) {
      console.error('Error fetching institutions:', err);
    } finally {
      setLoadingInstitutions(false);
    }
  };

  const handleInstitutionSave = async (e) => {
    e.preventDefault();
    if (!institutionName) return;

    setSavingInstitution(true);
    setInstitutionProgress(editingInstitution ? 'Updating institution...' : 'Adding institution...');

    const payload = {
      name: institutionName,
      display_order: institutionOrder || '0'
    };

    const url = editingInstitution
      ? `${API_URL}/api/admin/institutions/${editingInstitution.id}`
      : `${API_URL}/api/admin/institutions`;
    const method = editingInstitution ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 
          ...headers,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        setInstitutionProgress(editingInstitution ? '✓ Updated!' : '✓ Added!');
        resetInstitutionForm();
        fetchAdminInstitutions();
        setTimeout(() => setInstitutionProgress(''), 3000);
        setActiveTab('institutions');
      } else {
        setInstitutionProgress(`Error: ${data.error || 'Failed to save'}`);
      }
    } catch (err) {
      setInstitutionProgress('Save failed. Check your connection.');
    } finally {
      setSavingInstitution(false);
    }
  };

  const deleteInstitution = async (id) => {
    if (!window.confirm('Delete this institution?')) return;
    try {
      await fetch(`${API_URL}/api/admin/institutions/${id}`, { method: 'DELETE', headers });
      setAdminInstitutions((prev) => prev.filter((inst) => inst.id !== id));
    } catch (err) {
      console.error('Error deleting institution:', err);
    }
  };

  const startEditInstitution = (inst) => {
    setEditingInstitution(inst);
    setInstitutionName(inst.name || '');
    setInstitutionOrder(String(inst.display_order || ''));
    setInstitutionProgress('');
    setActiveTab('institutionForm');
  };

  const resetInstitutionForm = () => {
    setEditingInstitution(null);
    setInstitutionName('');
    setInstitutionOrder('');
    setInstitutionProgress('');
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
          <button
            onClick={() => setActiveTab('sliderImages')}
            style={{
              ...styles.navBtn,
              ...(activeTab === 'sliderImages' || activeTab === 'sliderForm' ? styles.navBtnActive : {}),
            }}
          >
            🖼️ Gallery Images ({sliderImages.length})
          </button>
          <button
            onClick={() => setActiveTab('testimonials')}
            style={{
              ...styles.navBtn,
              ...(activeTab === 'testimonials' || activeTab === 'testimonialForm' ? styles.navBtnActive : {}),
            }}
          >
            💬 Testimonials ({testimonials.length})
          </button>
          <button
            onClick={() => setActiveTab('gridImages')}
            style={{
              ...styles.navBtn,
              ...(activeTab === 'gridImages' || activeTab === 'gridImageForm' ? styles.navBtnActive : {}),
            }}
          >
            🧩 Grid Images ({gridImages.length})
          </button>
          <button
            onClick={() => setActiveTab('institutions')}
            style={{
              ...styles.navBtn,
              ...(activeTab === 'institutions' || activeTab === 'institutionForm' ? styles.navBtnActive : {}),
            }}
          >
            🏫 Elite Institutions ({adminInstitutions.length})
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

        {/* SLIDER IMAGES TAB */}
        {activeTab === 'sliderImages' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2 style={styles.tabTitle}>Gallery Images</h2>
                <p style={styles.tabSubtitle}>
                  Manage images used in slideshow, grid section, and cursor trail across the website
                </p>
              </div>
              <button
                onClick={() => {
                  resetSliderForm();
                  setActiveTab('sliderForm');
                }}
                style={styles.addServiceBtn}
              >
                ＋ Add New Image
              </button>
            </div>

            {loadingSliderImages ? (
              <p style={styles.loadingText}>Loading images...</p>
            ) : sliderImages.length === 0 ? (
              <div style={styles.emptyState}>
                <p>No gallery images yet. Click 'Add New Image' to upload one.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem' }}>
                {sliderImages.map((img) => (
                  <div key={img.id} style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(212,175,55,0.15)',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    position: 'relative',
                  }}>
                    <img
                      src={img.image_url}
                      alt={img.title || 'Gallery image'}
                      style={{ width: '100%', height: '160px', objectFit: 'cover', display: 'block' }}
                    />
                    <div style={{ padding: '0.8rem' }}>
                      <h4 style={{ color: '#f9e076', fontSize: '0.9rem', fontWeight: 600, margin: '0 0 4px 0' }}>
                        {img.title || 'Untitled'}
                      </h4>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                        <span style={{
                          fontSize: '0.75rem',
                          color: img.is_active ? '#2ecc71' : '#ff4444',
                          fontWeight: 600,
                        }}>
                          {img.is_active ? 'Active' : 'Hidden'} • Order: {img.display_order}
                        </span>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button
                            onClick={() => startEditSliderImage(img)}
                            style={{
                              ...styles.deleteBtn,
                              background: 'rgba(212,175,55,0.1)',
                              borderColor: 'rgba(212,175,55,0.3)',
                              color: '#ffd700',
                              fontSize: '0.75rem',
                              padding: '0.3rem 0.6rem',
                            }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteSliderImage(img.id)}
                            style={{ ...styles.deleteBtn, fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SLIDER IMAGE FORM (ADD/EDIT) */}
        {activeTab === 'sliderForm' && (
          <div>
            <h2 style={styles.tabTitle}>{editingSliderImage ? 'Edit Image' : 'Add New Image'}</h2>
            <p style={styles.tabSubtitle}>
              {editingSliderImage ? 'Update this gallery image.' : 'Upload a new image to the gallery.'}
            </p>

            <form onSubmit={handleSliderSave} style={styles.uploadForm}>
              <div style={styles.uploadField}>
                <label style={styles.uploadLabel}>Image Title</label>
                <input
                  type="text"
                  value={sliderTitle}
                  onChange={(e) => setSliderTitle(e.target.value)}
                  placeholder="e.g., Wedding Event 2026"
                  style={styles.uploadInput}
                />
              </div>

              <div style={styles.uploadField}>
                <label style={styles.uploadLabel}>Display Order</label>
                <input
                  type="number"
                  value={sliderOrder}
                  onChange={(e) => setSliderOrder(e.target.value)}
                  placeholder="0"
                  style={styles.uploadInput}
                />
              </div>

              <div style={styles.uploadField}>
                <label style={styles.uploadLabel}>Status</label>
                <select
                  value={String(sliderActive)}
                  onChange={(e) => setSliderActive(e.target.value === 'true')}
                  style={styles.uploadInput}
                >
                  <option value="true">Active (Visible)</option>
                  <option value="false">Hidden</option>
                </select>
              </div>

              {editingSliderImage && (
                <div style={{ marginBottom: '1.2rem', background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(212,175,55,0.15)' }}>
                  <span style={{ fontSize: '0.85rem', color: '#b8a265', display: 'block', marginBottom: '0.5rem' }}>Current Image:</span>
                  <img src={editingSliderImage.image_url} alt="Current" style={{ width: '200px', borderRadius: '8px', objectFit: 'cover' }} />
                </div>
              )}

              <div style={styles.uploadField}>
                <label style={styles.uploadLabel}>
                  {editingSliderImage ? 'Replace Image' : 'Image File *'}
                </label>
                <div style={styles.fileDropZone}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSliderFile(e.target.files[0])}
                    style={styles.fileInput}
                    id="slider-image-input"
                    required={!editingSliderImage}
                  />
                  <label htmlFor="slider-image-input" style={styles.fileLabel}>
                    {sliderFile ? (
                      <>
                        <span style={{ color: '#d4af37' }}>✓ {sliderFile.name}</span>
                        <br />
                        <span style={{ fontSize: '0.85rem', opacity: 0.7 }}>
                          {(sliderFile.size / (1024 * 1024)).toFixed(2)} MB
                        </span>
                      </>
                    ) : (
                      <>
                        <span style={{ fontSize: '2rem' }}>🖼️</span>
                        <br />
                        Click to select an image
                        <br />
                        <span style={{ fontSize: '0.85rem', opacity: 0.6 }}>
                          Max 10MB • JPG, PNG, WebP
                        </span>
                      </>
                    )}
                  </label>
                </div>
              </div>

              {sliderProgress && (
                <p style={{
                  ...styles.uploadStatus,
                  color: sliderProgress.startsWith('Error') ? '#ff4444' : '#d4af37',
                }}>
                  {sliderProgress}
                </p>
              )}

              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button
                  type="submit"
                  disabled={savingSlider}
                  style={{
                    ...styles.uploadBtn,
                    flex: 2,
                    opacity: savingSlider ? 0.6 : 1,
                  }}
                >
                  {savingSlider ? '⏳ Saving...' : editingSliderImage ? 'Update Image' : 'Upload Image'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    resetSliderForm();
                    setActiveTab('sliderImages');
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

        {/* TESTIMONIALS TAB */}
        {activeTab === 'testimonials' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2 style={styles.tabTitle}>Testimonials</h2>
                <p style={styles.tabSubtitle}>
                  Manage client testimonials displayed on the website
                </p>
              </div>
              <button
                onClick={() => {
                  resetTestimonialForm();
                  setActiveTab('testimonialForm');
                }}
                style={styles.addServiceBtn}
              >
                ＋ Add Testimonial
              </button>
            </div>

            {loadingTestimonials ? (
              <p style={styles.loadingText}>Loading testimonials...</p>
            ) : testimonials.length === 0 ? (
              <div style={styles.emptyState}>
                <p>No testimonials yet. Click 'Add Testimonial' to create one.</p>
              </div>
            ) : (
              <div style={styles.tableWrapper}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Client</th>
                      <th style={styles.th}>Message</th>
                      <th style={styles.th}>Rating</th>
                      <th style={styles.th}>Photo</th>
                      <th style={styles.th}>Visible</th>
                      <th style={styles.th}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {testimonials.map((t) => (
                      <tr key={t.id} style={styles.tr}>
                        <td style={{ ...styles.td, fontWeight: 'bold', color: '#f9e076' }}>
                          {t.client_name}
                          {t.designation && <br />}
                          {t.designation && <span style={{ fontWeight: 400, fontSize: '0.8rem', color: '#8a7a4f' }}>{t.designation}</span>}
                        </td>
                        <td style={{ ...styles.td, maxWidth: '300px', fontSize: '0.85rem' }}>
                          {t.message.length > 100 ? t.message.slice(0, 100) + '...' : t.message}
                        </td>
                        <td style={styles.td}>
                          <span style={{ color: '#ffd700' }}>{'★'.repeat(t.rating || 5)}</span>
                        </td>
                        <td style={styles.td}>
                          {t.image_url ? (
                            <img src={t.image_url} alt={t.client_name} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                          ) : (
                            <span style={{ opacity: 0.5, fontSize: '0.85rem' }}>None</span>
                          )}
                        </td>
                        <td style={styles.td}>
                          <span style={{
                            color: t.is_visible ? '#2ecc71' : '#ff4444',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                          }}>
                            {t.is_visible ? 'Visible' : 'Hidden'}
                          </span>
                        </td>
                        <td style={{ ...styles.td, display: 'flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => startEditTestimonial(t)}
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
                            onClick={() => deleteTestimonial(t.id)}
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

        {/* TESTIMONIAL FORM (ADD/EDIT) */}
        {activeTab === 'testimonialForm' && (
          <div>
            <h2 style={styles.tabTitle}>{editingTestimonial ? 'Edit Testimonial' : 'Add Testimonial'}</h2>
            <p style={styles.tabSubtitle}>
              {editingTestimonial ? 'Update this client testimonial.' : 'Create a new client testimonial.'}
            </p>

            <form onSubmit={handleTestimonialSave} style={styles.uploadForm}>
              <div style={styles.uploadField}>
                <label style={styles.uploadLabel}>Client Name *</label>
                <input
                  type="text"
                  value={testimonialName}
                  onChange={(e) => setTestimonialName(e.target.value)}
                  required
                  placeholder="e.g., Rajesh Kumar"
                  style={styles.uploadInput}
                />
              </div>

              <div style={styles.uploadField}>
                <label style={styles.uploadLabel}>Designation / Role</label>
                <input
                  type="text"
                  value={testimonialDesignation}
                  onChange={(e) => setTestimonialDesignation(e.target.value)}
                  placeholder="e.g., Wedding Client"
                  style={styles.uploadInput}
                />
              </div>

              <div style={styles.uploadField}>
                <label style={styles.uploadLabel}>Testimonial Message *</label>
                <textarea
                  value={testimonialMessage}
                  onChange={(e) => setTestimonialMessage(e.target.value)}
                  required
                  rows={4}
                  placeholder="What did the client say about your service?"
                  style={{ ...styles.uploadInput, fontFamily: 'inherit', resize: 'vertical' }}
                />
              </div>

              <div style={styles.uploadField}>
                <label style={styles.uploadLabel}>Rating (1-5 Stars)</label>
                <select
                  value={testimonialRating}
                  onChange={(e) => setTestimonialRating(e.target.value)}
                  style={styles.uploadInput}
                >
                  <option value="5">★★★★★ (5 Stars)</option>
                  <option value="4">★★★★ (4 Stars)</option>
                  <option value="3">★★★ (3 Stars)</option>
                  <option value="2">★★ (2 Stars)</option>
                  <option value="1">★ (1 Star)</option>
                </select>
              </div>

              <div style={styles.uploadField}>
                <label style={styles.uploadLabel}>Visibility</label>
                <select
                  value={String(testimonialVisible)}
                  onChange={(e) => setTestimonialVisible(e.target.value === 'true')}
                  style={styles.uploadInput}
                >
                  <option value="true">Visible on Website</option>
                  <option value="false">Hidden from Website</option>
                </select>
              </div>

              {/* Client photo */}
              <div style={styles.uploadField}>
                <label style={styles.uploadLabel}>
                  {editingTestimonial?.image_url ? 'Replace Client Photo' : 'Client Photo (Optional)'}
                </label>

                {editingTestimonial?.image_url && (
                  <div style={{ marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '1.5rem', background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(212,175,55,0.15)' }}>
                    <img src={editingTestimonial.image_url} alt="Client" style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' }} />
                    <div>
                      <span style={{ fontSize: '0.85rem', color: '#b8a265', display: 'block' }}>Current Photo</span>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem', cursor: 'pointer', color: '#ff6666' }}>
                        <input
                          type="checkbox"
                          checked={removeTestimonialImage}
                          onChange={(e) => setRemoveTestimonialImage(e.target.checked)}
                        />
                        <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Remove Photo</span>
                      </label>
                    </div>
                  </div>
                )}

                <div style={styles.fileDropZone}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setTestimonialFile(e.target.files[0])}
                    style={styles.fileInput}
                    id="testimonial-image-input"
                  />
                  <label htmlFor="testimonial-image-input" style={styles.fileLabel}>
                    {testimonialFile ? (
                      <>
                        <span style={{ color: '#d4af37' }}>✓ {testimonialFile.name}</span>
                        <br />
                        <span style={{ fontSize: '0.85rem', opacity: 0.7 }}>
                          {(testimonialFile.size / (1024 * 1024)).toFixed(2)} MB
                        </span>
                      </>
                    ) : (
                      <>
                        <span style={{ fontSize: '1.5rem' }}>📷</span>
                        <br />
                        Click to select a photo
                      </>
                    )}
                  </label>
                </div>
              </div>

              {testimonialProgress && (
                <p style={{
                  ...styles.uploadStatus,
                  color: testimonialProgress.startsWith('Error') ? '#ff4444' : '#d4af37',
                }}>
                  {testimonialProgress}
                </p>
              )}

              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button
                  type="submit"
                  disabled={savingTestimonial}
                  style={{
                    ...styles.uploadBtn,
                    flex: 2,
                    opacity: savingTestimonial ? 0.6 : 1,
                  }}
                >
                  {savingTestimonial ? '⏳ Saving...' : editingTestimonial ? 'Update Testimonial' : 'Create Testimonial'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    resetTestimonialForm();
                    setActiveTab('testimonials');
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

        {/* GRID IMAGES TAB */}
        {activeTab === 'gridImages' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2 style={styles.tabTitle}>3D Grid Images</h2>
                <p style={styles.tabSubtitle}>
                  Manage images specifically used in the 3-column animated grid section.
                </p>
              </div>
              <button
                onClick={() => {
                  resetGridForm();
                  setActiveTab('gridImageForm');
                }}
                style={styles.addServiceBtn}
              >
                ✚ Add Grid Image
              </button>
            </div>

            {loadingGridImages ? (
              <p style={styles.loadingText}>Loading images...</p>
            ) : gridImages.length === 0 ? (
              <div style={styles.emptyState}>
                <p>No grid images uploaded yet. Get started by clicking "Add Grid Image" above.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {[1, 2, 3].map((colIndex) => {
                  const colImgs = gridImages.filter((img) => img.col_index === colIndex);
                  return (
                    <div key={colIndex} style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(212,175,55,0.1)', borderRadius: '12px', padding: '1.5rem' }}>
                      <h3 style={{ color: '#f9e076', marginBottom: '1rem', borderBottom: '1px solid rgba(212,175,55,0.15)', paddingBottom: '0.5rem' }}>
                        Column {colIndex} ({colImgs.length} images)
                      </h3>
                      {colImgs.length === 0 ? (
                        <p style={{ color: '#8a7a4f', fontSize: '0.9rem', fontStyle: 'italic' }}>No images in this column.</p>
                      ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem' }}>
                          {colImgs.map((img) => (
                            <div key={img.id} style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                              <img src={img.image_url} alt="Grid" style={{ width: '100%', height: '140px', objectFit: 'cover' }} />
                              <div style={{ padding: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1, justifyContent: 'space-between' }}>
                                <div style={{ fontSize: '0.85rem', color: '#b8a265' }}>
                                  Order: {img.display_order}
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                  <button
                                    onClick={() => startEditGridImage(img)}
                                    style={{
                                      ...styles.deleteBtn,
                                      background: 'rgba(212,175,55,0.1)',
                                      borderColor: 'rgba(212,175,55,0.3)',
                                      color: '#f9e076',
                                      flex: 1,
                                      padding: '0.3rem',
                                    }}
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => deleteGridImage(img.id)}
                                    style={{ ...styles.deleteBtn, flex: 1, padding: '0.3rem' }}
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* GRID IMAGE FORM (ADD/EDIT) */}
        {activeTab === 'gridImageForm' && (
          <div>
            <h2 style={styles.tabTitle}>{editingGridImage ? 'Edit Grid Image' : 'Add Grid Image'}</h2>
            <p style={styles.tabSubtitle}>
              {editingGridImage ? 'Update this grid image\'s configuration.' : 'Upload a new image for the 3D animated grid.'}
            </p>

            <form onSubmit={handleGridSave} style={styles.uploadForm}>
              <div style={styles.uploadField}>
                <label style={styles.uploadLabel}>Column Assignment *</label>
                <select
                  value={gridColIndex}
                  onChange={(e) => setGridColIndex(e.target.value)}
                  style={styles.uploadInput}
                >
                  <option value="1">Column 1 (Left column, moves up/down)</option>
                  <option value="2">Column 2 (Center column, moves down/up)</option>
                  <option value="3">Column 3 (Right column, moves up/down)</option>
                </select>
              </div>

              <div style={styles.uploadField}>
                <label style={styles.uploadLabel}>Display Order</label>
                <input
                  type="number"
                  value={gridOrder}
                  onChange={(e) => setGridOrder(e.target.value)}
                  placeholder="e.g., 1 (leave blank for default)"
                  style={styles.uploadInput}
                />
              </div>

              <div style={styles.uploadField}>
                <label style={styles.uploadLabel}>
                  {editingGridImage ? 'Replace Image' : 'Select Image *'}
                </label>

                {editingGridImage && (
                  <div style={{ marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '1.5rem', background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(212,175,55,0.15)' }}>
                    <img src={editingGridImage.image_url} alt="Current" style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '6px' }} />
                    <span style={{ fontSize: '0.85rem', color: '#b8a265' }}>Current Image Preview</span>
                  </div>
                )}

                <div style={styles.fileDropZone}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setGridFile(e.target.files[0])}
                    style={styles.fileInput}
                    id="grid-image-file-input"
                    required={!editingGridImage}
                  />
                  <label htmlFor="grid-image-file-input" style={styles.fileLabel}>
                    {gridFile ? (
                      <>
                        <span style={{ color: '#d4af37' }}>✓ {gridFile.name}</span>
                        <br />
                        <span style={{ fontSize: '0.85rem', opacity: 0.7 }}>
                          {(gridFile.size / (1024 * 1024)).toFixed(2)} MB
                        </span>
                      </>
                    ) : (
                      <>
                        <span style={{ fontSize: '1.5rem' }}>📷</span>
                        <br />
                        Click to select image file
                      </>
                    )}
                  </label>
                </div>
              </div>

              {gridProgress && (
                <p style={{
                  ...styles.uploadStatus,
                  color: gridProgress.startsWith('Error') ? '#ff4444' : '#d4af37',
                }}>
                  {gridProgress}
                </p>
              )}

              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button
                  type="submit"
                  disabled={savingGrid}
                  style={{
                    ...styles.uploadBtn,
                    flex: 2,
                    opacity: savingGrid ? 0.6 : 1,
                  }}
                >
                  {savingGrid ? '⏳ Saving...' : editingGridImage ? 'Update Image' : 'Upload Image'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    resetGridForm();
                    setActiveTab('gridImages');
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

        {/* ELITE INSTITUTIONS TAB */}
        {activeTab === 'institutions' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2 style={styles.tabTitle}>Elite Institutions</h2>
                <p style={styles.tabSubtitle}>
                  Manage the names of elite institutions displayed on the Specialized page section.
                </p>
              </div>
              <button
                onClick={() => {
                  resetInstitutionForm();
                  setActiveTab('institutionForm');
                }}
                style={styles.addServiceBtn}
              >
                ✚ Add Institution Name
              </button>
            </div>

            {loadingInstitutions ? (
              <p style={styles.loadingText}>Loading institutions...</p>
            ) : adminInstitutions.length === 0 ? (
              <div style={styles.emptyState}>
                <p>No institutions found. Click "Add Institution Name" to get started.</p>
              </div>
            ) : (
              <div style={styles.tableWrapper}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Name</th>
                      <th style={styles.th}>Display Order</th>
                      <th style={{ ...styles.th, textAlign: 'right', paddingRight: '2rem' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {adminInstitutions.map((inst) => (
                      <tr key={inst.id} style={styles.tr}>
                        <td style={styles.td}>{inst.name}</td>
                        <td style={styles.td}>{inst.display_order}</td>
                        <td style={{ ...styles.td, textAlign: 'right', paddingRight: '2rem' }}>
                          <button
                            onClick={() => startEditInstitution(inst)}
                            style={{
                              ...styles.deleteBtn,
                              background: 'rgba(212,175,55,0.1)',
                              borderColor: 'rgba(212,175,55,0.3)',
                              color: '#f9e076',
                              marginRight: '0.8rem',
                            }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteInstitution(inst.id)}
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

        {/* INSTITUTION FORM (ADD/EDIT) */}
        {activeTab === 'institutionForm' && (
          <div>
            <h2 style={styles.tabTitle}>{editingInstitution ? 'Edit Institution' : 'Add Institution'}</h2>
            <p style={styles.tabSubtitle}>
              {editingInstitution ? 'Update the name or sorting weight of this institution.' : 'Create a new institution entry for the specialized page section.'}
            </p>

            <form onSubmit={handleInstitutionSave} style={styles.uploadForm}>
              <div style={styles.uploadField}>
                <label style={styles.uploadLabel}>Institution Name *</label>
                <input
                  type="text"
                  value={institutionName}
                  onChange={(e) => setInstitutionName(e.target.value)}
                  required
                  placeholder="e.g., KSR INSTITUTION"
                  style={styles.uploadInput}
                />
              </div>

              <div style={styles.uploadField}>
                <label style={styles.uploadLabel}>Display Order</label>
                <input
                  type="number"
                  value={institutionOrder}
                  onChange={(e) => setInstitutionOrder(e.target.value)}
                  placeholder="e.g., 1 (determines sorting order)"
                  style={styles.uploadInput}
                />
              </div>

              {institutionProgress && (
                <p style={{
                  ...styles.uploadStatus,
                  color: institutionProgress.startsWith('Error') ? '#ff4444' : '#d4af37',
                }}>
                  {institutionProgress}
                </p>
              )}

              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button
                  type="submit"
                  disabled={savingInstitution}
                  style={{
                    ...styles.uploadBtn,
                    flex: 2,
                    opacity: savingInstitution ? 0.6 : 1,
                  }}
                >
                  {savingInstitution ? '⏳ Saving...' : editingInstitution ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    resetInstitutionForm();
                    setActiveTab('institutions');
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
    background: '#14110a', // Solid, high-opacity dark gold background
    border: '2px solid #d4af37', // More prominent gold border
    borderRadius: '16px',
    padding: '3rem 2.5rem',
    maxWidth: '420px',
    width: '100%',
    boxShadow: '0 20px 60px rgba(0,0,0,0.8), 0 0 50px rgba(212,175,55,0.2)',
    textAlign: 'center',
    opacity: 1, // Explicit opacity 1
    zIndex: 10,
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
    color: '#d4c7a2',
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
    color: '#f9e076', // Highly visible gold color
    fontSize: '0.9rem',
    marginBottom: '0.4rem',
    letterSpacing: '0.5px',
    fontWeight: '600',
  },
  loginInput: {
    width: '100%',
    padding: '0.8rem 1rem',
    background: 'rgba(255,255,255,0.12)', // Lighter background for better contrast
    border: '1.5px solid rgba(212,175,55,0.6)', // Brighter border
    borderRadius: '8px',
    color: '#fff', // Clear white text
    fontSize: '1rem',
    outline: 'none',
    transition: 'all 0.3s',
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
