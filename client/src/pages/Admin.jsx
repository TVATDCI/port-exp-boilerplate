import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_ENDPOINTS } from '../api';
import { motion, AnimatePresence } from 'framer-motion';
import { FADE_UP, FADE_IN, STAGGER_CONTAINER } from '../utils/motionPresets';

const Admin = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Data states
  const [stats, setStats] = useState({
    projects: 0,
    users: 0,
    messages: { total: 0, unread: 0 },
  });
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);

  // Check if user is admin - wait for auth to finish loading
  useEffect(() => {
    // Don't redirect while auth is still loading
    if (authLoading) return;

    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role !== 'admin') {
      navigate('/');
      return;
    }
  }, [user, authLoading, navigate]);

  // Fetch all data
  useEffect(() => {
    if (user?.role === 'admin') {
      fetchAllData();
    }
  }, [user]);

  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem('token');

    try {
      // Fetch projects
      const projectsRes = await fetch(API_ENDPOINTS.projects);
      const projectsData = await projectsRes.json();
      if (projectsRes.ok) {
        setProjects(projectsData);
      }

      // Fetch users
      const usersRes = await fetch(`${API_ENDPOINTS.base}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const usersData = await usersRes.json();
      console.log('Users API response:', usersRes.status, usersRes.ok, usersData);
      if (usersRes.ok && usersData.success) {
        setUsers(usersData.data || []);
        console.log('Users loaded:', usersData.data?.length || 0);
      } else {
        console.error('Failed to fetch users:', usersRes.status, usersData);
        if (usersRes.status === 403) {
          setError('Access denied. Admin privileges required.');
        }
      }

      // Fetch messages
      const messagesRes = await fetch(`${API_ENDPOINTS.contact}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const messagesData = await messagesRes.json();
      if (messagesRes.ok && messagesData.success) {
        setMessages(messagesData.data || []);
        setStats((prev) => ({
          ...prev,
          messages: messagesData.summary || { total: 0, unread: 0 },
        }));
      }

      // Update stats
      setStats((prev) => ({
        ...prev,
        projects: Array.isArray(projectsData) ? projectsData.length : 0,
        users: usersData.data?.length || 0,
      }));
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Admin dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id, read) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_ENDPOINTS.contact}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ read }),
      });

      if (res.ok) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg._id === id ? { ...msg, read, readAt: read ? new Date() : null } : msg
          )
        );
        // Update stats
        const unreadCount = messages.filter((m) => m._id !== id && !m.read).length + (read ? 0 : 1);
        setStats((prev) => ({
          ...prev,
          messages: { ...prev.messages, unread: unreadCount },
        }));
      }
    } catch (err) {
      console.error('Failed to update message:', err);
    }
  };

  const handleDeleteMessage = async (id) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_ENDPOINTS.contact}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setMessages((prev) => prev.filter((msg) => msg._id !== id));
        setStats((prev) => ({
          ...prev,
          messages: { ...prev.messages, total: prev.messages.total - 1 },
        }));
      }
    } catch (err) {
      console.error('Failed to delete message:', err);
    }
  };

  const handleDeleteProject = async (id) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_ENDPOINTS.projects}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p._id !== id));
        setStats((prev) => ({ ...prev, projects: prev.projects - 1 }));
      }
    } catch (err) {
      console.error('Failed to delete project:', err);
    }
  };

  if (loading || authLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: 'var(--color-surface-base)' }}
      >
        <div className="font-mono" style={{ color: 'var(--color-brand-primary)' }}>
          Loading admin panel...
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div
      className="min-h-screen py-8 px-4"
      style={{ backgroundColor: 'var(--color-surface-base)' }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div variants={FADE_UP} initial="hidden" animate="visible" className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-sm" style={{ color: 'var(--color-brand-primary)' }}>
                  $
                </span>
                <span className="font-mono text-sm" style={{ color: 'var(--color-text-muted)' }}>
                  admin_panel.exe
                </span>
              </div>
              <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--color-heading)' }}>
                Admin Dashboard
              </h1>
              <p style={{ color: 'var(--color-text-muted)' }}>
                Manage projects, users, and contact messages
              </p>
            </div>
            <Link
              to="/"
              className="px-4 py-2 rounded font-mono text-sm border transition-colors hover:opacity-80"
              style={{
                backgroundColor: 'transparent',
                color: 'var(--color-brand-primary)',
                borderColor: 'var(--color-brand-primary)',
              }}
            >
              ← Back to Site
            </Link>
          </div>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 p-4 rounded border"
            style={{
              backgroundColor: 'var(--color-status-error)',
              opacity: 0.1,
              borderColor: 'var(--color-status-error)',
              color: 'var(--color-status-error)',
            }}
          >
            {error}
          </motion.div>
        )}

        {/* Stats Cards */}
        <motion.div
          variants={STAGGER_CONTAINER}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <StatCard
            title="Projects"
            value={stats.projects}
            icon="📁"
            color="var(--color-brand-primary)"
          />
          <StatCard title="Users" value={stats.users} icon="👥" color="var(--color-dusk)" />
          <StatCard
            title="Messages"
            value={stats.messages.total}
            subtitle={`${stats.messages.unread} unread`}
            icon="✉️"
            color="var(--color-coral)"
          />
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div variants={FADE_UP} initial="hidden" animate="visible" className="mb-6">
          <div className="flex gap-2 border-b" style={{ borderColor: 'var(--color-border-color)' }}>
            {['overview', 'messages', 'projects', 'users'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 font-mono text-sm capitalize transition-colors border-b-2 -mb-[2px] ${
                  activeTab === tab ? 'border-current' : 'border-transparent'
                }`}
                style={{
                  color:
                    activeTab === tab ? 'var(--color-brand-primary)' : 'var(--color-text-muted)',
                  borderColor: activeTab === tab ? 'var(--color-brand-primary)' : 'transparent',
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <OverviewTab key="overview" messages={messages} projects={projects} users={users} />
          )}
          {activeTab === 'messages' && (
            <MessagesTab
              key="messages"
              messages={messages}
              onMarkAsRead={handleMarkAsRead}
              onDelete={handleDeleteMessage}
            />
          )}
          {activeTab === 'projects' && (
            <ProjectsTab
              key="projects"
              projects={projects}
              onDelete={handleDeleteProject}
              onRefresh={fetchAllData}
            />
          )}
          {activeTab === 'users' && <UsersTab key="users" users={users} />}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ title, value, subtitle, icon, color }) => (
  <motion.div
    variants={FADE_UP}
    className="p-6 rounded-lg border"
    style={{
      backgroundColor: 'var(--color-surface-elevated)',
      borderColor: 'var(--color-border-color)',
    }}
    whileHover={{ y: -2 }}
  >
    <div className="flex items-start justify-between">
      <div>
        <p
          className="font-mono text-xs uppercase tracking-wider mb-1"
          style={{ color: 'var(--color-text-muted)' }}
        >
          {title}
        </p>
        <p className="text-3xl font-bold" style={{ color }}>
          {value}
        </p>
        {subtitle && (
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
            {subtitle}
          </p>
        )}
      </div>
      <span className="text-2xl">{icon}</span>
    </div>
  </motion.div>
);

// Overview Tab
const OverviewTab = ({ messages, projects }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    className="space-y-6"
  >
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Recent Messages */}
      <div
        className="rounded-lg border p-6"
        style={{
          backgroundColor: 'var(--color-surface-elevated)',
          borderColor: 'var(--color-border-color)',
        }}
      >
        <h3
          className="font-mono text-sm uppercase tracking-wider mb-4"
          style={{ color: 'var(--color-brand-primary)' }}
        >
          Recent Messages
        </h3>
        <div className="space-y-3">
          {messages.slice(0, 5).map((msg) => (
            <div
              key={msg._id}
              className="p-3 rounded border text-sm"
              style={{
                backgroundColor: 'var(--color-surface-base)',
                borderColor: 'var(--color-border-color)',
                opacity: msg.read ? 0.6 : 1,
              }}
            >
              <div className="flex items-center justify-between mb-1">
                <span style={{ color: 'var(--color-text-primary)' }}>{msg.name}</span>
                <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                  {new Date(msg.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="truncate" style={{ color: 'var(--color-text-muted)' }}>
                {msg.message}
              </p>
              {!msg.read && (
                <span
                  className="inline-block mt-2 px-2 py-0.5 text-xs rounded"
                  style={{
                    backgroundColor: 'var(--color-status-warning)',
                    color: 'var(--color-surface-base)',
                  }}
                >
                  New
                </span>
              )}
            </div>
          ))}
          {messages.length === 0 && (
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
              No messages yet
            </p>
          )}
        </div>
      </div>

      {/* Recent Projects */}
      <div
        className="rounded-lg border p-6"
        style={{
          backgroundColor: 'var(--color-surface-elevated)',
          borderColor: 'var(--color-border-color)',
        }}
      >
        <h3
          className="font-mono text-sm uppercase tracking-wider mb-4"
          style={{ color: 'var(--color-brand-primary)' }}
        >
          Recent Projects
        </h3>
        <div className="space-y-3">
          {projects.slice(0, 5).map((project) => (
            <div
              key={project._id}
              className="p-3 rounded border text-sm"
              style={{
                backgroundColor: 'var(--color-surface-base)',
                borderColor: 'var(--color-border-color)',
              }}
            >
              <div className="flex items-center justify-between mb-1">
                <span style={{ color: 'var(--color-text-primary)' }}>{project.title}</span>
                <span
                  className="text-xs px-2 py-0.5 rounded"
                  style={{
                    backgroundColor: 'var(--color-brand-primary)',
                    color: 'var(--color-surface-base)',
                  }}
                >
                  {project.category}
                </span>
              </div>
              <p className="truncate" style={{ color: 'var(--color-text-muted)' }}>
                {project.description}
              </p>
            </div>
          ))}
          {projects.length === 0 && (
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
              No projects yet
            </p>
          )}
        </div>
      </div>
    </div>
  </motion.div>
);

// Messages Tab
const MessagesTab = ({ messages, onMarkAsRead, onDelete }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
  >
    <div
      className="rounded-lg border overflow-hidden"
      style={{
        backgroundColor: 'var(--color-surface-elevated)',
        borderColor: 'var(--color-border-color)',
      }}
    >
      {/* Header */}
      <div
        className="px-6 py-4 border-b flex items-center justify-between"
        style={{ borderColor: 'var(--color-border-color)' }}
      >
        <h3
          className="font-mono text-sm uppercase tracking-wider"
          style={{ color: 'var(--color-brand-primary)' }}
        >
          Contact Messages ({messages.length})
        </h3>
      </div>

      {/* Messages List */}
      <div className="divide-y" style={{ borderColor: 'var(--color-border-color)' }}>
        {messages.map((msg) => (
          <div
            key={msg._id}
            className="p-6 hover:bg-opacity-50 transition-colors"
            style={{
              backgroundColor: msg.read ? 'transparent' : 'var(--color-surface-base)',
              opacity: msg.read ? 0.8 : 1,
            }}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-medium" style={{ color: 'var(--color-text-primary)' }}>
                  {msg.name}
                </h4>
                <p className="text-sm" style={{ color: 'var(--color-brand-primary)' }}>
                  {msg.email}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                  {new Date(msg.createdAt).toLocaleString()}
                </p>
                {msg.read && (
                  <p className="text-xs" style={{ color: 'var(--color-status-success)' }}>
                    Read {msg.readAt && new Date(msg.readAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
            <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>
              {msg.message}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => onMarkAsRead(msg._id, !msg.read)}
                className="px-3 py-1 rounded text-xs font-mono border transition-colors hover:opacity-80"
                style={{
                  backgroundColor: msg.read ? 'transparent' : 'var(--color-brand-primary)',
                  color: msg.read ? 'var(--color-text-muted)' : 'var(--color-surface-base)',
                  borderColor: 'var(--color-brand-primary)',
                }}
              >
                {msg.read ? 'Mark Unread' : 'Mark Read'}
              </button>
              <button
                onClick={() => onDelete(msg._id)}
                className="px-3 py-1 rounded text-xs font-mono border transition-colors hover:opacity-80"
                style={{
                  backgroundColor: 'transparent',
                  color: 'var(--color-status-error)',
                  borderColor: 'var(--color-status-error)',
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {messages.length === 0 && (
          <div className="p-8 text-center">
            <p style={{ color: 'var(--color-text-muted)' }}>No messages yet</p>
          </div>
        )}
      </div>
    </div>
  </motion.div>
);

// Projects Tab
const ProjectsTab = ({ projects, onDelete, onRefresh }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      <div
        className="rounded-lg border overflow-hidden"
        style={{
          backgroundColor: 'var(--color-surface-elevated)',
          borderColor: 'var(--color-border-color)',
        }}
      >
        {/* Header */}
        <div
          className="px-6 py-4 border-b flex items-center justify-between"
          style={{ borderColor: 'var(--color-border-color)' }}
        >
          <h3
            className="font-mono text-sm uppercase tracking-wider"
            style={{ color: 'var(--color-brand-primary)' }}
          >
            Projects ({projects.length})
          </h3>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 rounded font-mono text-sm border transition-colors hover:opacity-80"
            style={{
              backgroundColor: 'var(--color-brand-primary)',
              color: 'var(--color-surface-base)',
              borderColor: 'var(--color-brand-primary)',
            }}
          >
            + New Project
          </button>
        </div>

        {/* Projects Grid */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <div
              key={project._id}
              className="p-4 rounded border"
              style={{
                backgroundColor: 'var(--color-surface-base)',
                borderColor: 'var(--color-border-color)',
              }}
            >
              {project.imageUrl && (
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="w-full h-32 object-cover rounded mb-3"
                />
              )}
              <h4 className="font-medium mb-1" style={{ color: 'var(--color-text-primary)' }}>
                {project.title}
              </h4>
              <p className="text-xs mb-3" style={{ color: 'var(--color-text-muted)' }}>
                {project.category}
              </p>
              <p
                className="text-sm mb-3 line-clamp-2"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                {project.description}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingProject(project)}
                  className="flex-1 px-3 py-1.5 rounded text-xs font-mono border transition-colors hover:opacity-80"
                  style={{
                    backgroundColor: 'transparent',
                    color: 'var(--color-brand-primary)',
                    borderColor: 'var(--color-brand-primary)',
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(project._id)}
                  className="flex-1 px-3 py-1.5 rounded text-xs font-mono border transition-colors hover:opacity-80"
                  style={{
                    backgroundColor: 'transparent',
                    color: 'var(--color-status-error)',
                    borderColor: 'var(--color-status-error)',
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          {projects.length === 0 && (
            <div className="col-span-full text-center py-8">
              <p style={{ color: 'var(--color-text-muted)' }}>No projects yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Modal would go here - simplified for now */}
      {showCreateModal && (
        <ProjectModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            onRefresh();
          }}
        />
      )}
      {editingProject && (
        <ProjectModal
          project={editingProject}
          onClose={() => setEditingProject(null)}
          onSuccess={() => {
            setEditingProject(null);
            onRefresh();
          }}
        />
      )}
    </motion.div>
  );
};

// Users Tab
const UsersTab = ({ users }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
  >
    <div
      className="rounded-lg border overflow-hidden"
      style={{
        backgroundColor: 'var(--color-surface-elevated)',
        borderColor: 'var(--color-border-color)',
      }}
    >
      {/* Header */}
      <div
        className="px-6 py-4 border-b flex items-center justify-between"
        style={{ borderColor: 'var(--color-border-color)' }}
      >
        <h3
          className="font-mono text-sm uppercase tracking-wider"
          style={{ color: 'var(--color-brand-primary)' }}
        >
          Registered Users ({users.length})
        </h3>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ backgroundColor: 'var(--color-surface-base)' }}>
              <th
                className="px-6 py-3 text-left font-mono text-xs uppercase tracking-wider"
                style={{ color: 'var(--color-text-muted)' }}
              >
                Email
              </th>
              <th
                className="px-6 py-3 text-left font-mono text-xs uppercase tracking-wider"
                style={{ color: 'var(--color-text-muted)' }}
              >
                Role
              </th>
              <th
                className="px-6 py-3 text-left font-mono text-xs uppercase tracking-wider"
                style={{ color: 'var(--color-text-muted)' }}
              >
                Registered
              </th>
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: 'var(--color-border-color)' }}>
            {users.map((user) => (
              <tr
                key={user._id}
                className="hover:bg-opacity-50"
                style={{ backgroundColor: 'transparent' }}
              >
                <td className="px-6 py-4 text-sm" style={{ color: 'var(--color-text-primary)' }}>
                  {user.email}
                </td>
                <td className="px-6 py-4">
                  <span
                    className="px-2 py-1 rounded text-xs font-mono"
                    style={{
                      backgroundColor:
                        user.role === 'admin'
                          ? 'var(--color-brand-primary)'
                          : 'var(--color-surface-base)',
                      color:
                        user.role === 'admin'
                          ? 'var(--color-surface-base)'
                          : 'var(--color-text-muted)',
                    }}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm" style={{ color: 'var(--color-text-muted)' }}>
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td
                  colSpan="3"
                  className="px-6 py-8 text-center"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  No users yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  </motion.div>
);

// Project Modal Component
const ProjectModal = ({ project, onClose, onSuccess }) => {
  const [formData, setFormData] = useState(
    project
      ? {
          ...project,
          tags: Array.isArray(project.tags) ? project.tags.join(', ') : project.tags || '',
        }
      : {
          title: '',
          description: '',
          imageUrl: '',
          projectUrl: '',
          category: 'Frontend',
          tags: '',
          featured: false,
        }
  );
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('token');

    try {
      const url = project ? `${API_ENDPOINTS.projects}/${project._id}` : API_ENDPOINTS.projects;
      const method = project ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean),
        }),
      });

      const responseData = await res.json();
      console.log('Project save response:', res.status, responseData);

      if (res.ok) {
        onSuccess();
      } else {
        console.error('Failed to save project:', responseData);
        alert(
          'Failed to save project: ' +
            (responseData.error || responseData.message || 'Unknown error')
        );
      }
    } catch (err) {
      console.error('Failed to save project:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg rounded-lg border overflow-hidden"
        style={{
          backgroundColor: 'var(--color-surface-elevated)',
          borderColor: 'var(--color-border-color)',
        }}
      >
        <div
          className="px-6 py-4 border-b flex items-center justify-between"
          style={{ borderColor: 'var(--color-border-color)' }}
        >
          <h3
            className="font-mono text-sm uppercase tracking-wider"
            style={{ color: 'var(--color-brand-primary)' }}
          >
            {project ? 'Edit Project' : 'Create Project'}
          </h3>
          <button onClick={onClose} style={{ color: 'var(--color-text-muted)' }}>
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label
              className="block font-mono text-xs uppercase mb-1"
              style={{ color: 'var(--color-text-muted)' }}
            >
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 rounded border bg-transparent"
              style={{
                borderColor: 'var(--color-border-color)',
                color: 'var(--color-text-primary)',
              }}
              required
            />
          </div>
          <div>
            <label
              className="block font-mono text-xs uppercase mb-1"
              style={{ color: 'var(--color-text-muted)' }}
            >
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 rounded border bg-transparent"
              style={{
                borderColor: 'var(--color-border-color)',
                color: 'var(--color-text-primary)',
              }}
              rows={3}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                className="block font-mono text-xs uppercase mb-1"
                style={{ color: 'var(--color-text-muted)' }}
              >
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 rounded border bg-transparent"
                style={{
                  borderColor: 'var(--color-border-color)',
                  color: 'var(--color-text-primary)',
                }}
              >
                <option value="Frontend">Frontend</option>
                <option value="MERN">MERN</option>
                <option value="APIs">APIs</option>
                <option value="Experiments">Experiments</option>
              </select>
            </div>
            <div>
              <label
                className="block font-mono text-xs uppercase mb-1"
                style={{ color: 'var(--color-text-muted)' }}
              >
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="w-full px-3 py-2 rounded border bg-transparent"
                style={{
                  borderColor: 'var(--color-border-color)',
                  color: 'var(--color-text-primary)',
                }}
                placeholder="React, Node.js, MongoDB"
              />
            </div>
          </div>
          <div>
            <label
              className="block font-mono text-xs uppercase mb-1"
              style={{ color: 'var(--color-text-muted)' }}
            >
              Image URL
            </label>
            <input
              type="url"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              className="w-full px-3 py-2 rounded border bg-transparent"
              style={{
                borderColor: 'var(--color-border-color)',
                color: 'var(--color-text-primary)',
              }}
            />
          </div>
          <div>
            <label
              className="block font-mono text-xs uppercase mb-1"
              style={{ color: 'var(--color-text-muted)' }}
            >
              Project URL
            </label>
            <input
              type="url"
              value={formData.projectUrl}
              onChange={(e) => setFormData({ ...formData, projectUrl: e.target.value })}
              className="w-full px-3 py-2 rounded border bg-transparent"
              style={{
                borderColor: 'var(--color-border-color)',
                color: 'var(--color-text-primary)',
              }}
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="featured"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
            />
            <label htmlFor="featured" style={{ color: 'var(--color-text-muted)' }}>
              Featured project
            </label>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded font-mono text-sm border transition-colors"
              style={{ borderColor: 'var(--color-border-color)', color: 'var(--color-text-muted)' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 rounded font-mono text-sm border transition-colors"
              style={{
                backgroundColor: 'var(--color-brand-primary)',
                color: 'var(--color-surface-base)',
                borderColor: 'var(--color-brand-primary)',
              }}
            >
              {loading ? 'Saving...' : project ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Admin;
