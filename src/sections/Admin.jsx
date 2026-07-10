import { useState, useEffect } from 'react';
import { 
  account, 
  databases, 
  storage, 
  DATABASE_ID, 
  AGENCY_PROFILE_COLLECTION_ID, 
  CASE_STUDIES_COLLECTION_ID, 
  CLIENT_LEADS_COLLECTION_ID, 
  STORAGE_BUCKET_ID,
  getFilePreviewUrl
} from '../lib/appwrite.js';
import { ID } from 'appwrite';
import { 
  Shield, 
  ArrowRight, 
  Terminal, 
  User, 
  Layers, 
  Inbox, 
  LogOut, 
  Check, 
  Trash2, 
  Edit3, 
  Save, 
  Camera, 
  Plus, 
  Upload, 
  X, 
  CheckCircle, 
  AlertCircle, 
  RefreshCw, 
  MessageSquare, 
  Archive,
  Tag
} from 'lucide-react';

function Admin() {
  // Auth & Session States
  const [sessionUser, setSessionUser] = useState(null);
  const [loadingSession, setLoadingSession] = useState(true);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // UI States
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'projects' | 'leads'
  const [globalAlert, setGlobalAlert] = useState({ show: false, text: '', color: 'green' });

  // Profile Form States
  const [profileDoc, setProfileDoc] = useState(null);
  const [profileHeadline, setProfileHeadline] = useState(''); // database: headline (Brand Name)
  const [profileSubHeadline, setProfileSubHeadline] = useState(''); // database: sub_headline (Subtitle / Badge)
  const [profileBio, setProfileBio] = useState(''); // database: bio (Short Bio Pitch)
  const [profileWhatsapp, setProfileWhatsapp] = useState(''); // database: whatsapp_number
  const [profileEmail, setProfileEmail] = useState(''); // database: email
  const [profileGithub, setProfileGithub] = useState(''); // database: github_url
  const [profileLinkedin, setProfileLinkedin] = useState(''); // database: linkedin_url
  const [avatarUploadLoading, setAvatarUploadLoading] = useState(false);

  // Projects Showcase States
  const [projectsList, setProjectsList] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  // Modal Form States
  const [modalProjectId, setModalProjectId] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [modalCategory, setModalCategory] = useState('');
  const [modalDescription, setModalDescription] = useState('');
  const [modalLiveUrl, setModalLiveUrl] = useState('');
  const [modalRoi, setModalRoi] = useState('');
  const [modalRoiMetric, setModalRoiMetric] = useState('');
  const [modalSortOrder, setModalSortOrder] = useState(0);
  const [modalIsPublished, setModalIsPublished] = useState(true);
  const [modalThumbnailId, setModalThumbnailId] = useState('');
  const [thumbnailUploadLoading, setThumbnailUploadLoading] = useState(false);

  // Leads Inbox States
  const [leadsList, setLeadsList] = useState([]);
  const [leadsLoading, setLeadsLoading] = useState(false);

  // Category Options States
  const [categoryPresets, setCategoryPresets] = useState([]);

  // Alert Trigger Helper
  const triggerGlobalAlert = (text, color = 'green') => {
    setGlobalAlert({ show: true, text, color });
    setTimeout(() => {
      setGlobalAlert(prev => ({ ...prev, show: false }));
    }, 5000);
  };

  // Check authentication status on mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Fetch data when activeTab changes or user changes
  useEffect(() => {
    if (sessionUser) {
      if (activeTab === 'profile') loadProfile();
      if (activeTab === 'projects' || activeTab === 'categories') loadProjects();
      if (activeTab === 'leads') loadLeads();
    }
  }, [activeTab, sessionUser]);

  const checkAuth = async () => {
    setLoadingSession(true);
    try {
      // Auto-clear session when the browser tab is closed
      if (!sessionStorage.getItem('admin_session_active')) {
        try {
          await account.deleteSession('current');
        } catch {
          // Ignore if no session existed
        }
        setSessionUser(null);
        return;
      }
      const user = await account.get();
      setSessionUser(user);
    } catch {
      setSessionUser(null);
      sessionStorage.removeItem('admin_session_active');
    } finally {
      setLoadingSession(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');
    try {
      await account.createEmailPasswordSession(loginEmail, loginPassword);
      sessionStorage.setItem('admin_session_active', 'true');
      setLoginEmail('');
      setLoginPassword('');
      await checkAuth();
    } catch (err) {
      setLoginError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    if (!confirm('Are you sure you want to log out of your session?')) return;
    try {
      await account.deleteSession('current');
      sessionStorage.removeItem('admin_session_active');
      setSessionUser(null);
      setActiveTab('profile');
    } catch (err) {
      triggerGlobalAlert(`Logout failed: ${err.message}`, 'red');
    }
  };

  // ================= PROFILE ACTIONS =================

  const loadProfile = async () => {
    try {
      const res = await databases.listDocuments(DATABASE_ID, AGENCY_PROFILE_COLLECTION_ID);
      if (res.documents.length > 0) {
        const doc = res.documents[0];
        setProfileDoc(doc);
        setProfileHeadline(doc.headline || '');
        setProfileSubHeadline(doc.sub_headline || '');
        setProfileBio(doc.bio || '');
        setProfileWhatsapp(doc.whatsapp_number || '');
        setProfileEmail(doc.email || '');
        setProfileGithub(doc.github_url || '');
        setProfileLinkedin(doc.linkedin_url || '');
      }
    } catch (err) {
      triggerGlobalAlert(`Failed to load profile: ${err.message}`, 'red');
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!profileDoc) return;
    try {
      await databases.updateDocument(DATABASE_ID, AGENCY_PROFILE_COLLECTION_ID, profileDoc.$id, {
        headline: profileHeadline,
        sub_headline: profileSubHeadline,
        bio: profileBio,
        whatsapp_number: profileWhatsapp,
        email: profileEmail,
        github_url: profileGithub,
        linkedin_url: profileLinkedin,
      });
      triggerGlobalAlert('Profile details updated successfully!', 'green');
      loadProfile();
    } catch (err) {
      triggerGlobalAlert(`Failed to save profile: ${err.message}`, 'red');
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !profileDoc) return;
    setAvatarUploadLoading(true);
    try {
      // 1. Upload to storage bucket
      const uploaded = await storage.createFile(STORAGE_BUCKET_ID, ID.unique(), file);
      
      const oldAvatarId = profileDoc.avatar_file_id;

      // 2. Link file ID to profile document in databases
      await databases.updateDocument(DATABASE_ID, AGENCY_PROFILE_COLLECTION_ID, profileDoc.$id, {
        avatar_file_id: uploaded.$id
      });
      
      triggerGlobalAlert('Avatar updated successfully!', 'green');

      // 3. Clean up old avatar from storage
      if (oldAvatarId) {
        try {
          await storage.deleteFile(STORAGE_BUCKET_ID, oldAvatarId);
        } catch (delErr) {
          console.warn('Could not delete old avatar from storage:', delErr);
        }
      }
      loadProfile();
    } catch (err) {
      triggerGlobalAlert(`Avatar upload failed: ${err.message}`, 'red');
    } finally {
      setAvatarUploadLoading(false);
    }
  };

  // ================= CATEGORY PRESETS DATABASE HELPERS =================
  const loadCategoryPresets = async (allDocs) => {
    let presetDoc = allDocs.find(p => p.title === '__SYSTEM_CATEGORIES__');
    
    // Find all unique categories that ALREADY exist in the projects!
    const activeCategories = Array.from(new Set(
      allDocs
        .filter(p => p.title !== '__SYSTEM_CATEGORIES__' && p.category)
        .map(p => p.category)
    ));

    const fallbackList = ['Hospitality', 'Real Estate', 'SaaS', 'E-commerce'];
    const combinedDefaults = Array.from(new Set([...fallbackList, ...activeCategories]));
    
    if (!presetDoc) {
      // Create it if it doesn't exist, seeding it with all existing categories in the database
      try {
        presetDoc = await databases.createDocument(
          DATABASE_ID, 
          CASE_STUDIES_COLLECTION_ID, 
          ID.unique(), 
          {
            title: '__SYSTEM_CATEGORIES__',
            description: JSON.stringify(combinedDefaults),
            category: 'system',
            is_published: false,
            sort_order: -999,
            thumbnail_file_id: 'system_categories_placeholder',
            roi_metric: null,
            roi_value: null
          }
        );
        setCategoryPresets(combinedDefaults);
      } catch (err) {
        console.error('Failed to initialize category presets document:', err);
        setCategoryPresets(combinedDefaults);
      }
    } else {
      try {
        const list = JSON.parse(presetDoc.description);
        // Make sure any existing categories from actual projects are merged in
        const mergedList = Array.from(new Set([...list, ...activeCategories]));
        
        // If there are new categories found that weren't in the saved list, update it in Appwrite
        if (mergedList.length > list.length) {
          await databases.updateDocument(DATABASE_ID, CASE_STUDIES_COLLECTION_ID, presetDoc.$id, {
            description: JSON.stringify(mergedList),
            roi_metric: 0
          });
        }
        
        setCategoryPresets(mergedList);
      } catch {
        setCategoryPresets(combinedDefaults);
      }
    }
  };

  // ================= PROJECTS ACTIONS =================

  const loadProjects = async () => {
    setProjectsLoading(true);
    try {
      const res = await databases.listDocuments(DATABASE_ID, CASE_STUDIES_COLLECTION_ID);
      
      // Load Category presets from the system document
      await loadCategoryPresets(res.documents);
      
      // Filter out the system presets document from the visible case studies list
      const visibleProjects = res.documents.filter(p => p.title !== '__SYSTEM_CATEGORIES__');
      const sorted = visibleProjects.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
      setProjectsList(sorted);
    } catch (err) {
      triggerGlobalAlert(`Failed to load case studies: ${err.message}`, 'red');
    } finally {
      setProjectsLoading(false);
    }
  };

  const handleThumbnailUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setThumbnailUploadLoading(true);
    try {
      const uploaded = await storage.createFile(STORAGE_BUCKET_ID, ID.unique(), file);
      setModalThumbnailId(uploaded.$id);
      triggerGlobalAlert('Thumbnail uploaded successfully!', 'green');
    } catch (err) {
      triggerGlobalAlert(`Thumbnail upload failed: ${err.message}`, 'red');
    } finally {
      setThumbnailUploadLoading(false);
    }
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    
    if (!modalThumbnailId && (!modalLiveUrl || modalLiveUrl.trim() === '')) {
      triggerGlobalAlert('Please upload a project thumbnail image or provide a Live URL to auto-generate one!', 'red');
      return;
    }

    const data = {
      title: modalTitle,
      category: modalCategory,
      description: modalDescription,
      sort_order: parseInt(modalSortOrder) || 0,
      is_published: modalIsPublished,
      thumbnail_file_id: modalThumbnailId || 'auto_screenshot',
      roi_metric: modalRoiMetric && modalRoiMetric.trim() !== '' ? modalRoiMetric.trim() : null,
      roi_value: modalRoi !== '' && modalRoi !== null ? parseInt(modalRoi) : null
    };

    // Only include optional attributes if they contain actual data to prevent schema conflicts
    if (modalLiveUrl && modalLiveUrl.trim() !== '') {
      data.live_url = modalLiveUrl.trim();
    } else {
      data.live_url = null;
    }

    try {
      if (modalProjectId) {
        // Edit existing
        await databases.updateDocument(DATABASE_ID, CASE_STUDIES_COLLECTION_ID, modalProjectId, data);
        triggerGlobalAlert('Case study updated successfully!', 'green');
      } else {
        // Add new
        await databases.createDocument(DATABASE_ID, CASE_STUDIES_COLLECTION_ID, ID.unique(), data);
        triggerGlobalAlert('New case study added successfully!', 'green');
      }
      setProjectModalOpen(false);
      loadProjects();
    } catch (err) {
      triggerGlobalAlert(`Failed to save project: ${err.message}`, 'red');
    }
  };

  const handleProjectEditTrigger = (proj) => {
    setModalProjectId(proj.$id);
    setModalTitle(proj.title || '');
    setModalCategory(proj.category || '');
    setModalDescription(proj.description || '');
    setModalLiveUrl(proj.live_url || '');
    setModalRoiMetric(proj.roi_metric || '');
    setModalRoi(proj.roi_value !== null && proj.roi_value !== undefined ? proj.roi_value : '');
    setModalSortOrder(proj.sort_order || 0);
    setModalIsPublished(proj.is_published !== false);
    setModalThumbnailId(proj.thumbnail_file_id === 'auto_screenshot' ? '' : (proj.thumbnail_file_id || ''));
    setProjectModalOpen(true);
  };

  const handleProjectDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this case study? This cannot be undone.')) return;
    try {
      const proj = projectsList.find(p => p.$id === id);
      await databases.deleteDocument(DATABASE_ID, CASE_STUDIES_COLLECTION_ID, id);
      triggerGlobalAlert('Case study deleted successfully!', 'green');

      if (proj && proj.thumbnail_file_id && proj.thumbnail_file_id !== 'auto_screenshot') {
        try {
          await storage.deleteFile(STORAGE_BUCKET_ID, proj.thumbnail_file_id);
        } catch (delErr) {
          console.warn('Could not delete thumbnail from storage:', delErr);
        }
      }
      loadProjects();
    } catch (err) {
      triggerGlobalAlert(`Failed to delete case study: ${err.message}`, 'red');
    }
  };

  // ================= CATEGORY ACTIONS =================

  const getCategoriesList = () => {
    const counts = {};
    projectsList.forEach(proj => {
      if (proj.category) {
        counts[proj.category] = (counts[proj.category] || 0) + 1;
      }
    });
    return Object.keys(counts).map(name => ({ name, count: counts[name] }));
  };

  const handleRenameCategoryTrigger = async (oldName) => {
    const newName = prompt(`Enter a new name for the category "${oldName}":`, oldName);
    if (!newName || newName.trim() === '' || newName === oldName) return;
    
    setProjectsLoading(true);
    let updatedCount = 0;
    try {
      const targets = projectsList.filter(p => p.category === oldName);
      
      for (const proj of targets) {
        await databases.updateDocument(DATABASE_ID, CASE_STUDIES_COLLECTION_ID, proj.$id, {
          category: newName.trim()
        });
      }
      updatedCount = targets.length;
      
      triggerGlobalAlert(`Successfully renamed category to "${newName}" across ${updatedCount} projects!`, 'green');
      loadProjects();
    } catch (err) {
      triggerGlobalAlert(`Failed to rename category: ${err.message}`, 'red');
    } finally {
      setProjectsLoading(false);
    }
  };

  const handleDeleteCategoryTrigger = async (catName) => {
    if (!confirm(`Are you sure you want to remove the category tag "${catName}"? This will clear the category field for all projects currently tagged as "${catName}" (it will NOT delete the projects themselves).`)) return;
    
    setProjectsLoading(true);
    let clearedCount = 0;
    try {
      const targets = projectsList.filter(p => p.category === catName);
      
      for (const proj of targets) {
        await databases.updateDocument(DATABASE_ID, CASE_STUDIES_COLLECTION_ID, proj.$id, {
          category: null
        });
      }
      clearedCount = targets.length;
      
      triggerGlobalAlert(`Successfully cleared category tag across ${clearedCount} projects!`, 'green');
      loadProjects();
    } catch (err) {
      triggerGlobalAlert(`Failed to clear category: ${err.message}`, 'red');
    } finally {
      setProjectsLoading(false);
    }
  };

  const handleAddCategoryOption = async (newCatName) => {
    if (!newCatName || newCatName.trim() === '') return;
    const formatted = newCatName.trim();
    if (categoryPresets.includes(formatted)) {
      triggerGlobalAlert('Category already exists in options!', 'red');
      return;
    }

    const updatedList = [...categoryPresets, formatted];
    setCategoryPresets(updatedList);

    try {
      const res = await databases.listDocuments(DATABASE_ID, CASE_STUDIES_COLLECTION_ID);
      const presetDoc = res.documents.find(p => p.title === '__SYSTEM_CATEGORIES__');
      if (presetDoc) {
        await databases.updateDocument(DATABASE_ID, CASE_STUDIES_COLLECTION_ID, presetDoc.$id, {
          description: JSON.stringify(updatedList)
        });
        triggerGlobalAlert(`Added category option "${formatted}" successfully!`, 'green');
      }
    } catch (err) {
      triggerGlobalAlert(`Failed to save category option to Appwrite: ${err.message}`, 'red');
    }
  };

  const handleDeleteCategoryOption = async (catName) => {
    if (!confirm(`Are you sure you want to delete the category option "${catName}"? This will remove it from the list of selectable options (it will not affect existing projects).`)) return;

    const updatedList = categoryPresets.filter(c => c !== catName);
    setCategoryPresets(updatedList);

    try {
      const res = await databases.listDocuments(DATABASE_ID, CASE_STUDIES_COLLECTION_ID);
      const presetDoc = res.documents.find(p => p.title === '__SYSTEM_CATEGORIES__');
      if (presetDoc) {
        await databases.updateDocument(DATABASE_ID, CASE_STUDIES_COLLECTION_ID, presetDoc.$id, {
          description: JSON.stringify(updatedList)
        });
        triggerGlobalAlert(`Removed category option "${catName}"!`, 'green');
      }
    } catch (err) {
      triggerGlobalAlert(`Failed to save category options: ${err.message}`, 'red');
    }
  };

  // ================= LEADS ACTIONS =================

  const loadLeads = async () => {
    setLeadsLoading(true);
    try {
      const res = await databases.listDocuments(DATABASE_ID, CLIENT_LEADS_COLLECTION_ID);
      const sorted = res.documents.sort((a, b) => new Date(b.$createdAt) - new Date(a.$createdAt));
      setLeadsList(sorted);
    } catch (err) {
      triggerGlobalAlert(`Failed to load leads: ${err.message}`, 'red');
    } finally {
      setLeadsLoading(false);
    }
  };

  const handleLeadMarkRead = async (id) => {
    try {
      await databases.updateDocument(DATABASE_ID, CLIENT_LEADS_COLLECTION_ID, id, { status: 'read' });
      loadLeads();
    } catch (err) {
      triggerGlobalAlert(`Failed to update status: ${err.message}`, 'red');
    }
  };

  const handleLeadDelete = async (id) => {
    if (!confirm('Are you sure you want to archive and remove this lead inquiry?')) return;
    try {
      await databases.deleteDocument(DATABASE_ID, CLIENT_LEADS_COLLECTION_ID, id);
      triggerGlobalAlert('Lead removed successfully!', 'green');
      loadLeads();
    } catch (err) {
      triggerGlobalAlert(`Failed to archive lead: ${err.message}`, 'red');
    }
  };

  // Sidebar badge count
  const unreadLeadsCount = leadsList.filter(l => l.status === 'new' || !l.status).length;

  // Loader shell during session check
  if (loadingSession) {
    return (
      <div className="min-h-screen bg-surface-0 flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="animate-spin text-accent w-8 h-8" />
          <p className="text-sm font-semibold text-gray-400">Verifying session...</p>
        </div>
      </div>
    );
  }

  // ================= AUTH/LOGIN RENDER =================
  if (!sessionUser) {
    return (
      <div className="min-h-screen bg-surface-0 flex items-center justify-center px-4 relative overflow-hidden">
        {/* Glow decorative orbs */}
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-accent/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-accent/5 blur-[100px] pointer-events-none" />
        
        <div className="bg-surface-1/40 backdrop-blur-xl border border-white/5 w-full max-w-md rounded-2xl p-8 shadow-2xl relative z-10">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 text-accent flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 animate-pulse" />
            </div>
            <h1 className="font-display text-2xl font-bold text-white">Code Captain CMS</h1>
            <p class="text-xs text-gray-400 mt-2">Enter credentials to manage your digital assets</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-[10px] font-bold text-gray-300 uppercase tracking-wider mb-2">Email Address</label>
              <input 
                type="email" 
                required 
                value={loginEmail} 
                onChange={(e) => setLoginEmail(e.target.value)} 
                className="w-full bg-surface-3/50 border border-white/5 focus:border-accent text-sm text-white px-4 py-3 rounded-xl outline-none transition-all placeholder-gray-600" 
                placeholder="admin@codecaptain.com"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-300 uppercase tracking-wider mb-2">Password</label>
              <input 
                type="password" 
                required 
                value={loginPassword} 
                onChange={(e) => setLoginPassword(e.target.value)} 
                className="w-full bg-surface-3/50 border border-white/5 focus:border-accent text-sm text-white px-4 py-3 rounded-xl outline-none transition-all placeholder-gray-600" 
                placeholder="••••••••"
              />
            </div>
            {loginError && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl flex items-start gap-2 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}
            <button 
              type="submit" 
              disabled={loginLoading}
              className="w-full py-3.5 bg-accent hover:bg-accent-dark text-white text-xs font-bold rounded-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 disabled:opacity-50"
            >
              {loginLoading ? 'Authenticating...' : 'Authenticate Session'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ================= MAIN CMS DASHBOARD RENDER =================
  return (
    <div className="min-h-screen flex flex-col md:flex-row h-screen overflow-hidden bg-surface-0 text-white font-body">
      
      {/* Sidebar navigation */}
      <aside className="w-full md:w-64 bg-surface-1 border-b md:border-b-0 md:border-r border-white/5 flex flex-col justify-between shrink-0">
        <div>
          {/* Header Brand */}
          <div className="p-6 border-b border-white/5">
            <h2 className="font-display text-lg font-bold text-white flex items-center gap-2">
              <Terminal className="text-accent w-5 h-5 animate-pulse" /> Code Captain
            </h2>
            <span className="text-[10px] text-gray-400 bg-white/5 border border-white/5 px-2 py-0.5 rounded mt-1.5 inline-block font-semibold">CMS React Panel</span>
          </div>

          {/* Navigation links */}
          <nav className="p-4 space-y-1">
            <button 
              onClick={() => setActiveTab('profile')} 
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'profile' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <User className="w-4 h-4" /> Profile Details
            </button>
            <button 
              onClick={() => setActiveTab('projects')} 
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'projects' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Layers className="w-4 h-4" /> Showcase Projects
            </button>
            <button 
              onClick={() => setActiveTab('categories')} 
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'categories' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Tag className="w-4 h-4" /> Manage Categories
            </button>
            <button 
              onClick={() => setActiveTab('leads')} 
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'leads' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Inbox className="w-4 h-4" /> Client Leads
              {unreadLeadsCount > 0 && (
                <span className="ml-auto text-[9px] bg-accent text-white px-2 py-0.5 rounded-full font-bold">{unreadLeadsCount}</span>
              )}
            </button>
          </nav>
        </div>

        {/* User profile footer */}
        <div className="p-4 border-t border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-accent/20 text-accent font-bold flex items-center justify-center text-sm border border-accent/15">
              {(sessionUser.name || sessionUser.email || 'A').charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-xs font-bold text-white truncate max-w-[120px]">{sessionUser.name || sessionUser.email}</p>
              <p className="text-[9px] text-gray-400">Owner Session</p>
            </div>
          </div>
          <button 
            onClick={handleLogout} 
            className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer" 
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main Workspace content */}
      <main className="flex-grow flex flex-col h-full overflow-y-auto bg-surface-0">
        
        {/* Workspace Top Header */}
        <header className="h-16 border-b border-white/5 px-6 flex items-center justify-between shrink-0">
          <h2 className="font-display text-lg font-bold text-white">
            {activeTab === 'profile' && 'Profile Configuration'}
            {activeTab === 'projects' && 'Showcase Case Studies'}
            {activeTab === 'categories' && 'Manage Categories'}
            {activeTab === 'leads' && 'Client Leads Inbox'}
          </h2>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-semibold bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Connected Appwrite
            </span>
          </div>
        </header>

        {/* Global Notification Banner (Floating Toast) */}
        {globalAlert.show && (
          <div className={`fixed top-6 right-6 z-[100] w-full max-w-sm p-4 rounded-xl text-xs font-semibold flex items-start gap-3 border justify-between shadow-2xl ${
            globalAlert.color === 'green' ? 'bg-surface-1 border-emerald-500/30 text-emerald-400' : 'bg-surface-1 border-red-500/30 text-red-400'
          }`}>
            <div className="flex items-start gap-2 text-left">
              {globalAlert.color === 'green' ? <CheckCircle className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" /> : <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />}
              <span className="leading-relaxed">{globalAlert.text}</span>
            </div>
            <button onClick={() => setGlobalAlert(prev => ({ ...prev, show: false }))} className="text-gray-400 hover:text-white p-0.5 rounded cursor-pointer shrink-0">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        <div className="p-6 md:p-8 flex-grow">

          {/* ================= TAB: PROFILE VIEW ================= */}
          {activeTab === 'profile' && (
            <div className="max-w-4xl space-y-6">
              <div className="bg-surface-1 border border-white/5 rounded-2xl p-6 sm:p-8 shadow-xl">
                <h3 className="font-display text-base font-bold text-white mb-6 flex items-center gap-2">
                  <User className="text-accent w-4 h-4" /> Profile Info & Picture
                </h3>
                
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  {/* Avatar upload panel */}
                  <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-white/5">
                    <div className="relative">
                      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border border-white/10 bg-surface-3 flex items-center justify-center text-gray-500 text-3xl font-display font-bold">
                        {profileDoc?.avatar_file_id ? (
                          (() => {
                            const url = getFilePreviewUrl(profileDoc.avatar_file_id, 300, 300);
                            console.log("Admin Avatar Preview URL:", url);
                            return (
                              <img 
                                src={url} 
                                alt="Avatar" 
                                className="w-full h-full object-cover" 
                              />
                            );
                          })()
                        ) : (
                          (profileHeadline || 'S').charAt(0).toUpperCase()
                        )}
                      </div>
                      <label htmlFor="avatar-file-input" className="absolute bottom-0 right-0 p-2.5 bg-accent hover:bg-accent-dark text-white rounded-full cursor-pointer shadow-lg active:scale-95 transition-all">
                        <Camera className="w-4 h-4" />
                      </label>
                      <input 
                        type="file" 
                        id="avatar-file-input" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleAvatarUpload} 
                        disabled={avatarUploadLoading}
                      />
                    </div>
                    <div className="text-center sm:text-left space-y-1.5">
                      <h4 class="text-sm font-semibold text-white">Avatar Profile Picture</h4>
                      <p className="text-xs text-gray-400 leading-relaxed max-w-sm">Upload a square photo (JPEG/PNG/WebP). Recommended size: 300x300. It will automatically update the photo on your homepage.</p>
                      {avatarUploadLoading && (
                        <div className="flex items-center gap-2 mt-2">
                          <RefreshCw className="animate-spin text-accent w-3.5 h-3.5" />
                          <span className="text-[10px] text-accent font-bold">Uploading file to storage...</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Settings fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-300 uppercase tracking-wider mb-2">Agency / Brand Name</label>
                      <input 
                        type="text" 
                        required 
                        value={profileHeadline} 
                        onChange={(e) => setProfileHeadline(e.target.value)} 
                        className="w-full bg-surface-3/50 border border-white/5 focus:border-accent text-sm text-white px-4 py-3 rounded-xl outline-none transition-colors"
                        placeholder="e.g. Code Captain"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-300 uppercase tracking-wider mb-2">WhatsApp Contact (with country code)</label>
                      <input 
                        type="text" 
                        required 
                        value={profileWhatsapp} 
                        onChange={(e) => setProfileWhatsapp(e.target.value)} 
                        className="w-full bg-surface-3/50 border border-white/5 focus:border-accent text-sm text-white px-4 py-3 rounded-xl outline-none transition-colors"
                        placeholder="e.g. 919999999999"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-300 uppercase tracking-wider mb-2">Sub-Headline / Role Badge</label>
                      <input 
                        type="text" 
                        required 
                        value={profileSubHeadline} 
                        onChange={(e) => setProfileSubHeadline(e.target.value)} 
                        className="w-full bg-surface-3/50 border border-white/5 focus:border-accent text-sm text-white px-4 py-3 rounded-xl outline-none transition-colors"
                        placeholder="e.g. Brand Growth & Premium Web Engineering"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-300 uppercase tracking-wider mb-2">Email Address</label>
                      <input 
                        type="email" 
                        value={profileEmail} 
                        onChange={(e) => setProfileEmail(e.target.value)} 
                        className="w-full bg-surface-3/50 border border-white/5 focus:border-accent text-sm text-white px-4 py-3 rounded-xl outline-none transition-colors"
                        placeholder="e.g. contact@codecaptain.com"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-bold text-gray-300 uppercase tracking-wider mb-2">Biography / Core Pitch</label>
                      <textarea 
                        rows="3" 
                        value={profileBio} 
                        onChange={(e) => setProfileBio(e.target.value)} 
                        className="w-full bg-surface-3/50 border border-white/5 focus:border-accent text-sm text-white px-4 py-3 rounded-xl outline-none transition-colors resize-none"
                        placeholder="Detail your experience, value proposition, and customer focus."
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-300 uppercase tracking-wider mb-2">GitHub Profile URL</label>
                      <input 
                        type="url" 
                        value={profileGithub} 
                        onChange={(e) => setProfileGithub(e.target.value)} 
                        className="w-full bg-surface-3/50 border border-white/5 focus:border-accent text-sm text-white px-4 py-3 rounded-xl outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-300 uppercase tracking-wider mb-2">LinkedIn Profile URL</label>
                      <input 
                        type="url" 
                        value={profileLinkedin} 
                        onChange={(e) => setProfileLinkedin(e.target.value)} 
                        className="w-full bg-surface-3/50 border border-white/5 focus:border-accent text-sm text-white px-4 py-3 rounded-xl outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/5 flex justify-end">
                    <button type="submit" className="px-6 py-3.5 bg-accent hover:bg-accent-dark text-white text-xs font-bold rounded-xl active:scale-[0.98] transition-all flex items-center gap-2 shadow-lg shadow-accent/25 cursor-pointer">
                      <Save className="w-4 h-4" /> Save Profile Details
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* ================= TAB: PROJECTS LIST VIEW ================= */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-gray-400">Manage case studies and client projects shown in the portfolio showcase grid.</p>
                <button 
                  onClick={() => {
                    setModalProjectId('');
                    setModalTitle('');
                    setModalCategory('');
                    setModalDescription('');
                    setModalLiveUrl('');
                    setModalRoiMetric('');
                    setModalRoi('');
                    setModalSortOrder(0);
                    setModalIsPublished(true);
                    setModalThumbnailId('');
                    setProjectModalOpen(true);
                  }}
                  className="w-full sm:w-auto px-5 py-3.5 bg-accent hover:bg-accent-dark text-white text-xs font-bold rounded-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-accent/25 cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add New Case Study
                </button>
              </div>

              {/* Showcase list table */}
              <div className="bg-surface-1 border border-white/5 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-surface-2/60 border-b border-white/5 text-gray-400 text-xs font-bold uppercase tracking-wider">
                      <tr>
                        <th className="p-5">Order</th>
                        <th className="p-5">Project details</th>
                        <th class="p-5">Category</th>
                        <th className="p-5 text-center">ROI Metric</th>
                        <th className="p-5 text-center">Status</th>
                        <th className="p-5 text-right font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {projectsLoading ? (
                        <tr>
                          <td colspan="6" className="p-12 text-center text-gray-500">
                            <div className="flex flex-col items-center justify-center gap-2">
                              <RefreshCw className="animate-spin text-accent w-6 h-6" />
                              <span>Loading showcase projects...</span>
                            </div>
                          </td>
                        </tr>
                      ) : projectsList.length === 0 ? (
                        <tr>
                          <td colspan="6" className="p-8 text-center text-gray-500">
                            No showcase projects found. Click "Add New Case Study" to populate.
                          </td>
                        </tr>
                      ) : (
                        projectsList.map((proj) => (
                          <tr key={proj.$id} className="hover:bg-white/[0.01] transition-colors border-b border-white/5">
                            <td className="p-5 font-semibold text-gray-400 font-display">{proj.sort_order || 0}</td>
                            <td className="p-5">
                              <div className="flex items-center gap-3">
                                {(proj.thumbnail_file_id && proj.thumbnail_file_id !== 'auto_screenshot') || proj.live_url ? (
                                  <img 
                                    src={
                                      (proj.thumbnail_file_id && proj.thumbnail_file_id !== 'auto_screenshot')
                                        ? getFilePreviewUrl(proj.thumbnail_file_id, 100, 70)
                                        : `https://api.microlink.io/?url=${encodeURIComponent(proj.live_url)}&screenshot=true&embed=screenshot.url`
                                    } 
                                    alt="Thumbnail" 
                                    className="w-10 h-7 object-cover rounded border border-white/10" 
                                  />
                                ) : (
                                  <div className="w-10 h-7 bg-surface-3 border border-white/5 rounded flex items-center justify-center text-[8px] text-gray-500 select-none">No Img</div>
                                )}
                                <div>
                                  <h4 className="font-bold text-white text-sm leading-snug">{proj.title}</h4>
                                  <p className="text-[10px] text-gray-400 max-w-xs truncate">{proj.description}</p>
                                </div>
                              </div>
                            </td>
                            <td className="p-5">
                              <span className="text-xs px-2.5 py-1 bg-white/5 rounded-full font-medium text-gray-300 border border-white/5">
                                {proj.category || 'General'}
                              </span>
                            </td>
                            <td className="p-5 text-center font-bold text-emerald-400 font-display">
                              {proj.roi_value ? `+${proj.roi_value}%` : '—'}
                            </td>
                            <td className="p-5 text-center">
                              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border ${
                                proj.is_published !== false 
                                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                                  : 'bg-gray-500/10 text-gray-400 border-gray-500/20'
                              }`}>
                                {proj.is_published !== false ? 'Published' : 'Draft'}
                              </span>
                            </td>
                            <td className="p-5 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button 
                                  onClick={() => handleProjectEditTrigger(proj)}
                                  className="p-2 bg-surface-3 hover:bg-accent/15 border border-white/5 text-gray-300 hover:text-accent rounded-lg transition-all cursor-pointer"
                                  title="Edit"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => handleProjectDelete(proj.$id)}
                                  className="p-2 bg-surface-3 hover:bg-red-500/15 border border-white/5 text-gray-400 hover:text-red-400 rounded-lg transition-all cursor-pointer"
                                  title="Delete"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB: LEADS VIEW ================= */}
          {activeTab === 'leads' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-400">View and triage client submissions sent from your website's contact forms.</p>
                <button 
                  onClick={loadLeads}
                  disabled={leadsLoading}
                  className="p-2 rounded-lg bg-surface-3 hover:bg-accent/10 border border-white/5 text-gray-300 hover:text-accent transition-all cursor-pointer disabled:opacity-50" 
                  title="Refresh leads list"
                >
                  <RefreshCw className={`w-4.5 h-4.5 ${leadsLoading ? 'animate-spin' : ''}`} />
                </button>
              </div>

              {/* Leads cards grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {leadsLoading ? (
                  <div className="col-span-full py-16 text-center text-gray-500 flex flex-col items-center justify-center gap-2">
                    <RefreshCw className="animate-spin text-accent w-8 h-8" />
                    <span>Fetching leads...</span>
                  </div>
                ) : leadsList.length === 0 ? (
                  <div className="col-span-full py-16 text-center text-gray-500">
                    No inquiries received in your inbox.
                  </div>
                ) : (
                  leadsList.map((lead) => {
                    const isNew = lead.status === 'new' || !lead.status;
                    const dateString = new Date(lead.$createdAt).toLocaleDateString('en-IN', {
                      day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                    });
                    
                    return (
                      <div 
                        key={lead.$id} 
                        className={`bg-surface-1 border border-white/5 rounded-2xl p-5 flex flex-col justify-between text-left relative overflow-hidden transition-all hover:bg-white/[0.02] ${
                          isNew ? 'border border-accent/20 bg-accent/[0.01]' : ''
                        }`}
                      >
                        {isNew && <span className="absolute top-5 right-5 w-2.5 h-2.5 rounded-full bg-accent animate-pulse" title="Unread Lead"></span>}

                        <div>
                          <div className="mb-4">
                            <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider block mb-1">{dateString}</span>
                            <h4 className="font-bold text-white text-base leading-tight">{lead.client_name}</h4>
                            <p className="text-xs text-accent mt-0.5 font-semibold">{lead.business_name || 'Individual Client'}</p>
                          </div>
                          
                          <hr className="border-white/5 mb-4" />
                          
                          <p className="text-xs text-gray-300 leading-relaxed mb-4 min-h-[50px] italic">
                            "{lead.message || 'No description message provided.'}"
                          </p>
                          
                          <div className="flex flex-wrap gap-2 mb-4">
                            <span className="text-[10px] bg-white/5 px-2.5 py-0.5 rounded text-gray-400 border border-white/5 font-semibold">Category: {lead.business_type || 'General'}</span>
                            <span className="text-[10px] bg-white/5 px-2.5 py-0.5 rounded text-gray-400 border border-white/5 font-semibold">Status: {lead.status || 'new'}</span>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-white/5 flex gap-2">
                          <a 
                            href={`https://wa.me/${lead.whatsapp_number}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex-grow py-2.5 bg-accent hover:bg-accent-dark text-white text-[11px] font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 active:scale-95 shadow shadow-accent/10"
                          >
                            <MessageSquare className="w-3.5 h-3.5" /> Chat on WhatsApp
                          </a>
                          {isNew ? (
                            <button 
                              onClick={() => handleLeadMarkRead(lead.$id)}
                              className="px-3.5 py-2.5 bg-surface-3 hover:bg-white/10 text-gray-300 hover:text-white border border-white/5 text-[11.5px] font-semibold rounded-lg transition-all active:scale-95 cursor-pointer animate-bounce"
                              title="Mark as Read"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <button 
                              onClick={() => handleLeadDelete(lead.$id)}
                              className="px-3.5 py-2.5 bg-surface-3 hover:bg-red-500/10 text-gray-400 hover:text-red-400 border border-white/5 text-[11.5px] font-semibold rounded-lg transition-all active:scale-95 cursor-pointer"
                              title="Archive Lead"
                            >
                              <Archive className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* ================= TAB: CATEGORIES VIEW ================= */}
          {activeTab === 'categories' && (
            <div className="max-w-4xl space-y-6">
              {/* SECTION 1: Manage Selectable Options */}
              <div className="bg-surface-1 border border-white/5 rounded-2xl p-6 sm:p-8 shadow-xl">
                <h3 className="font-display text-base font-bold text-white mb-4 flex items-center gap-2">
                  <Plus className="text-accent w-4 h-4" /> Category Preset Options
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed mb-6 text-left">
                  Create and manage the predefined options list. These options will appear as suggestions in your project editing dropdown.
                </p>

                {/* Add Category Form */}
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    const input = e.target.elements.newCatName;
                    handleAddCategoryOption(input.value);
                    input.value = '';
                  }}
                  className="flex gap-3 mb-6"
                >
                  <input 
                    type="text" 
                    name="newCatName"
                    required
                    placeholder="Enter new category option (e.g. Fintech)" 
                    className="flex-grow bg-surface-2 border border-white/5 focus:border-accent text-sm text-white px-4 py-3 rounded-xl outline-none transition-colors"
                  />
                  <button 
                    type="submit"
                    className="px-5 py-3 bg-accent hover:bg-accent-dark text-white text-xs font-bold rounded-xl active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer shadow"
                  >
                    <Plus className="w-4 h-4" /> Add Option
                  </button>
                </form>

                {/* Options list */}
                <div className="flex flex-wrap gap-2.5">
                  {categoryPresets.length === 0 ? (
                    <span className="text-xs text-gray-500 py-2">No custom options added yet.</span>
                  ) : (
                    categoryPresets.map(cat => (
                      <span 
                        key={cat} 
                        className="inline-flex items-center gap-1.5 bg-surface-2 border border-white/5 px-3 py-1.5 rounded-xl text-xs text-white"
                      >
                        {cat}
                        <button 
                          onClick={() => handleDeleteCategoryOption(cat)}
                          className="text-gray-400 hover:text-red-400 p-0.5 rounded transition-colors"
                          title={`Remove ${cat} option`}
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))
                  )}
                </div>
              </div>

              {/* SECTION 2: Active Categories in Database */}
              <div className="bg-surface-1 border border-white/5 rounded-2xl p-6 sm:p-8 shadow-xl">
                <h3 className="font-display text-base font-bold text-white mb-4 flex items-center gap-2">
                  <Tag className="text-accent w-4 h-4" /> Active Database Categories
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed mb-6 text-left">
                  Below are categories currently assigned to your published case studies. You can rename them globally across all projects, or clear them from all projects.
                </p>

                {/* Categories Table/List */}
                <div className="border border-white/5 rounded-xl overflow-hidden bg-surface-2/40">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                      <thead className="bg-surface-2 border-b border-white/5 text-gray-400 text-xs font-bold uppercase tracking-wider">
                        <tr>
                          <th className="p-4">Category Name</th>
                          <th className="p-4 text-center">Associated Projects</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {getCategoriesList().length === 0 ? (
                          <tr>
                            <td colSpan="3" className="p-8 text-center text-gray-500">
                              No active database categories found. Tags will appear here as they are assigned to projects.
                            </td>
                          </tr>
                        ) : (
                          getCategoriesList().map(cat => (
                            <tr key={cat.name} className="hover:bg-white/[0.01] transition-colors">
                              <td className="p-4 font-semibold text-white font-display text-left">{cat.name}</td>
                              <td className="p-4 text-center text-gray-300 font-display">{cat.count}</td>
                              <td className="p-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <button 
                                    onClick={() => handleRenameCategoryTrigger(cat.name)}
                                    className="px-3 py-1.5 bg-surface-3 hover:bg-accent/15 border border-white/5 text-xs text-gray-300 hover:text-accent font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1 active:scale-95"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" /> Rename Globally
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteCategoryTrigger(cat.name)}
                                    className="px-3 py-1.5 bg-surface-3 hover:bg-red-500/15 border border-white/5 text-xs text-red-400 rounded-lg transition-all cursor-pointer flex items-center gap-1 active:scale-95"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" /> Remove Tag
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* ================= MODAL: ADD/EDIT PROJECT ================= */}
      {projectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4">
          <div className="bg-surface-1 border border-white/5 w-full max-w-2xl rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-y-auto max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center pb-4 border-b border-white/5 mb-6">
              <h3 className="font-display text-lg font-bold text-white">
                {modalProjectId ? 'Edit Case Study Details' : 'Add New Case Study'}
              </h3>
              <button 
                onClick={() => setProjectModalOpen(false)}
                className="p-1 rounded hover:bg-white/5 text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleProjectSubmit} className="space-y-6 text-left">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-bold text-gray-300 uppercase tracking-wider mb-2">Project Title</label>
                  <input 
                    type="text" 
                    required 
                    value={modalTitle} 
                    onChange={(e) => setModalTitle(e.target.value)} 
                    className="w-full bg-surface-2 border border-white/5 focus:border-accent text-sm text-white px-4 py-3 rounded-xl outline-none transition-colors"
                    placeholder="e.g. Luxury Resort App"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-300 uppercase tracking-wider mb-2">Category</label>
                  <select 
                    required 
                    value={modalCategory} 
                    onChange={(e) => setModalCategory(e.target.value)} 
                    className="w-full bg-surface-2 border border-white/5 focus:border-accent text-sm text-white px-4 py-3 rounded-xl outline-none transition-colors cursor-pointer"
                  >
                    <option value="" disabled>-- Select Category --</option>
                    {categoryPresets.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-bold text-gray-300 uppercase tracking-wider mb-2">Description</label>
                  <textarea 
                    required 
                    rows="3" 
                    value={modalDescription} 
                    onChange={(e) => setModalDescription(e.target.value)} 
                    className="w-full bg-surface-2 border border-white/5 focus:border-accent text-sm text-white px-4 py-3 rounded-xl outline-none transition-colors resize-none"
                    placeholder="Detail the metrics achieved and custom solutions engineered."
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-300 uppercase tracking-wider mb-2">Live Website URL</label>
                  <input 
                    type="url" 
                    value={modalLiveUrl} 
                    onChange={(e) => setModalLiveUrl(e.target.value)} 
                    className="w-full bg-surface-2 border border-white/5 focus:border-accent text-sm text-white px-4 py-3 rounded-xl outline-none transition-colors"
                    placeholder="https://clientname.com"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-300 uppercase tracking-wider mb-2">ROI Metric Label (Optional)</label>
                  <input 
                    type="text" 
                    value={modalRoiMetric} 
                    onChange={(e) => setModalRoiMetric(e.target.value)} 
                    className="w-full bg-surface-2 border border-white/5 focus:border-accent text-sm text-white px-4 py-3 rounded-xl outline-none transition-colors"
                    placeholder="e.g. Increase in qualified leads"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-300 uppercase tracking-wider mb-2">ROI Value (%) (Optional)</label>
                  <input 
                    type="number" 
                    value={modalRoi} 
                    onChange={(e) => setModalRoi(e.target.value)} 
                    className="w-full bg-surface-2 border border-white/5 focus:border-accent text-sm text-white px-4 py-3 rounded-xl outline-none transition-colors"
                    placeholder="e.g. 42 (rendered as +42%)"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-300 uppercase tracking-wider mb-2">Sort Order</label>
                  <input 
                    type="number" 
                    required 
                    value={modalSortOrder} 
                    onChange={(e) => setModalSortOrder(e.target.value)} 
                    className="w-full bg-surface-2 border border-white/5 focus:border-accent text-sm text-white px-4 py-3 rounded-xl outline-none transition-colors"
                  />
                </div>
                <div className="flex items-center mt-6">
                  <input 
                    type="checkbox" 
                    id="published-checkbox"
                    checked={modalIsPublished} 
                    onChange={(e) => setModalIsPublished(e.target.checked)} 
                    className="w-4 h-4 accent-accent border-white/10 bg-surface-2 text-white rounded cursor-pointer"
                  />
                  <label htmlFor="published-checkbox" className="ml-2 text-xs font-bold text-gray-300 uppercase tracking-wider cursor-pointer">Publish to Showcase</label>
                </div>

                {/* Project thumbnail upload */}
                <div className="md:col-span-2 space-y-2">
                  <label className="block text-[10px] font-bold text-gray-300 uppercase tracking-wider">Project Thumbnail Image</label>
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-16 bg-surface-2 border border-white/5 rounded-lg overflow-hidden flex items-center justify-center text-[10px] text-gray-500 select-none">
                      {(modalThumbnailId && modalThumbnailId !== 'auto_screenshot') || (modalLiveUrl && modalLiveUrl.trim() !== '') ? (
                        (() => {
                          const url = (modalThumbnailId && modalThumbnailId !== 'auto_screenshot')
                            ? getFilePreviewUrl(modalThumbnailId, 100, 70)
                            : `https://api.microlink.io/?url=${encodeURIComponent(modalLiveUrl.trim())}&screenshot=true&embed=screenshot.url`;
                          return (
                            <img 
                              src={url} 
                              alt="Thumbnail Preview" 
                              className="w-full h-full object-cover" 
                            />
                          );
                        })()
                      ) : (
                        'No Image'
                      )}
                    </div>
                    <div className="flex-grow">
                      <input 
                        type="file" 
                        id="thumbnail-file-input" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleThumbnailUpload} 
                        disabled={thumbnailUploadLoading}
                      />
                      <label htmlFor="thumbnail-file-input" className="inline-flex items-center gap-2 px-4 py-2.5 bg-surface-3 hover:bg-surface-2 text-gray-300 hover:text-white text-xs font-semibold rounded-lg border border-white/5 cursor-pointer transition-all">
                        <Upload className="w-3.5 h-3.5" /> Select Image
                      </label>
                      <p className="text-[10px] text-gray-400 mt-1">Accepts JPEG/PNG/WebP formats. Recommended: 640x400.</p>
                      {thumbnailUploadLoading && (
                        <div className="flex items-center gap-2 mt-2">
                          <RefreshCw className="animate-spin text-accent w-3.5 h-3.5" />
                          <span className="text-[10px] text-accent font-bold">Uploading file to storage...</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal footer controls */}
              <div className="pt-4 border-t border-white/5 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setProjectModalOpen(false)}
                  className="px-5 py-3 rounded-xl border border-white/5 hover:bg-white/5 text-xs font-bold text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-3.5 bg-accent hover:bg-accent-dark text-white text-xs font-bold rounded-xl active:scale-[0.98] transition-all flex items-center gap-2 shadow-lg shadow-accent/20 cursor-pointer"
                >
                  <span>{modalProjectId ? 'Update Case Study' : 'Save Case Study'}</span>
                  <CheckCircle className="w-4 h-4" />
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;
