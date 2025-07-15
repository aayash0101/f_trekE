import React, { useState, useEffect } from 'react';
import { getUserProfile, updateUserProfile } from '../api/Admin/userapi';
import { getUserJournals, updateJournalEntry, deleteJournalEntry } from '../api/journalApi';
import { 
  getSavedJournals, addSavedJournal, removeSavedJournal,
  getFavoriteJournals, addFavoriteJournal, removeFavoriteJournal
} from '../api/savedAndFavoriteApi';
import Modal from '../components/Modal';
import '../../styles/UserProfile.css';

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [userPosts, setUserPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [favoritePosts, setFavoritePosts] = useState([]);
  const [activeTab, setActiveTab] = useState('posts');
  const [selectedPost, setSelectedPost] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [editPostText, setEditPostText] = useState('');
  const [editPostDate, setEditPostDate] = useState('');
  const [editSaving, setEditSaving] = useState(false);
  const [savedPostIds, setSavedPostIds] = useState([]);
  const [favoritePostIds, setFavoritePostIds] = useState([]);

  const storedUser = localStorage.getItem('user');
  let userId = null;
  if (storedUser && storedUser !== 'undefined') {
    try {
      const parsedUser = JSON.parse(storedUser);
      userId = parsedUser.id || parsedUser._id;
    } catch {
      userId = null;
    }
  }

  useEffect(() => {
    if (userId) {
      fetchProfile(userId);
      fetchUserPosts(userId);
      fetchSavedPosts(userId);
      fetchFavoritePosts(userId);
    } else {
      setError('User not logged in.');
    }
  }, [userId]);

  const fetchProfile = async (userId) => {
    try {
      const data = await getUserProfile(userId);
      setUser(data);
      setFormData({
        username: data.username || '',
        bio: data.bio || '',
        location: data.location || '',
      });
    } catch (err) {
      console.error('Fetch profile error:', err);
      setError('Failed to load profile: ' + (err.message || 'Server error'));
    }
  };

  const fetchUserPosts = async (userId) => {
    try {
      const data = await getUserJournals(userId);
      setUserPosts(data);
    } catch (err) {
      console.error('Fetch user posts error:', err);
      setError('Failed to load user posts: ' + (err.message || 'Server error'));
    }
  };

  const fetchSavedPosts = async (userId) => {
    try {
      const data = await getSavedJournals(userId);
      setSavedPosts(data);
      setSavedPostIds(data.map(post => post._id));
    } catch (err) {
      console.error('Fetch saved posts error:', err);
      setError('Failed to load saved posts: ' + (err.message || 'Server error'));
    }
  };

  const fetchFavoritePosts = async (userId) => {
    try {
      const data = await getFavoriteJournals(userId);
      setFavoritePosts(data);
      setFavoritePostIds(data.map(post => post._id));
    } catch (err) {
      console.error('Fetch favorite posts error:', err);
      setError('Failed to load favorite posts: ' + (err.message || 'Server error'));
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = async () => {
    if (!user || !user._id) return;
    try {
      setSaving(true);
      const updated = await updateUserProfile(user._id, formData);
      setUser(updated);
      localStorage.setItem('user', JSON.stringify(updated));
      setEditMode(false);
    } catch (err) {
      console.error('Update error:', err);
      alert('Failed to save changes: ' + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  const toggleSave = async (postId) => {
    if (!userId) return;
    try {
      if (savedPostIds.includes(postId)) {
        await removeSavedJournal(userId, postId);
        setSavedPostIds(ids => ids.filter(id => id !== postId));
        setSavedPosts(posts => posts.filter(p => p._id !== postId));
      } else {
        await addSavedJournal(userId, postId);
        setSavedPostIds(ids => [...ids, postId]);
        const newPost = userPosts.find(p => p._id === postId)
          || favoritePosts.find(p => p._id === postId);
        if (newPost) setSavedPosts(posts => [...posts, newPost]);
      }
    } catch (err) {
      console.error('Save/Unsave failed:', err);
      alert('Failed to update saved posts');
    }
  };

  const toggleFavorite = async (postId) => {
    if (!userId) return;
    try {
      if (favoritePostIds.includes(postId)) {
        await removeFavoriteJournal(userId, postId);
        setFavoritePostIds(ids => ids.filter(id => id !== postId));
        setFavoritePosts(posts => posts.filter(p => p._id !== postId));
      } else {
        await addFavoriteJournal(userId, postId);
        setFavoritePostIds(ids => [...ids, postId]);
        const newPost = userPosts.find(p => p._id === postId)
          || savedPosts.find(p => p._id === postId);
        if (newPost) setFavoritePosts(posts => [...posts, newPost]);
      }
    } catch (err) {
      console.error('Favorite/Unfavorite failed:', err);
      alert('Failed to update favorite posts');
    }
  };

  const openEditPost = (post) => {
    setEditingPost(post);
    setEditPostText(post.text);
    const dateValue = post.date ? post.date.slice(0, 10) : '';
    setEditPostDate(dateValue);
  };

  const handleEditPostChange = (e) => setEditPostText(e.target.value);
  const handleEditPostDateChange = (e) => setEditPostDate(e.target.value);

  const handleEditPostSave = async (e) => {
    e.preventDefault();
    if (!editingPost) return;
    try {
      setEditSaving(true);
      const updatedData = { text: editPostText, date: editPostDate };
      const updatedPost = await updateJournalEntry(editingPost._id, updatedData);
      setUserPosts(posts => posts.map(p => (p._id === updatedPost._id ? updatedPost : p)));
      setSavedPosts(posts => posts.map(p => (p._id === updatedPost._id ? updatedPost : p)));
      setFavoritePosts(posts => posts.map(p => (p._id === updatedPost._id ? updatedPost : p)));
      setEditingPost(null);
      setSelectedPost(updatedPost);
    } catch (err) {
      console.error('Failed to save edited post:', err);
      alert('Failed to save post: ' + (err.response?.data?.message || err.message));
    } finally {
      setEditSaving(false);
    }
  };

  const handleEditPostCancel = () => setEditingPost(null);

  const handleDeletePost = async () => {
    if (!selectedPost) return;
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await deleteJournalEntry(selectedPost._id);
      setUserPosts(posts => posts.filter(p => p._id !== selectedPost._id));
      setSavedPosts(posts => posts.filter(p => p._id !== selectedPost._id));
      setFavoritePosts(posts => posts.filter(p => p._id !== selectedPost._id));
      setSelectedPost(null);
      setEditingPost(null);
    } catch (err) {
      console.error('Failed to delete post:', err);
      alert('Failed to delete post: ' + (err.response?.data?.message || err.message));
    }
  };

  if (error) return <div className="error-message">{error}</div>;
  if (!user) return <div>Loading profile...</div>;

  let postsToShow = activeTab === 'posts' ? userPosts
    : activeTab === 'saved' ? savedPosts
    : favoritePosts;

  return (
    <div className="profile-container">
      <h2 className="profile-title">{user.name}</h2>

      <div className="profile-card">
        <div className="profile-avatar"></div>

        <div className="profile-fields">
          <label>
            <strong>Username:</strong>
            {editMode ? (
              <input
                name="username"
                value={formData.username}
                onChange={handleChange}
              />
            ) : (
              <span> {user.username}</span>
            )}
          </label>

          <label>
            <strong>Bio:</strong>
            {editMode ? (
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
              />
            ) : (
              <span> {user.bio || 'N/A'}</span>
            )}
          </label>

          <label>
            <strong>Location:</strong>
            {editMode ? (
              <input
                name="location"
                value={formData.location}
                onChange={handleChange}
              />
            ) : (
              <span> {user.location || 'N/A'}</span>
            )}
          </label>

          {editMode ? (
            <button onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </button>
          ) : (
            <button onClick={() => setEditMode(true)}>Edit</button>
          )}
        </div>
      </div>

      <div className="profile-tabs">
        <button
          className={activeTab === 'posts' ? 'active' : ''}
          onClick={() => setActiveTab('posts')}
        >
          Posts
        </button>
        <button
          className={activeTab === 'saved' ? 'active' : ''}
          onClick={() => setActiveTab('saved')}
        >
          Saved
        </button>
        <button
          className={activeTab === 'favorites' ? 'active' : ''}
          onClick={() => setActiveTab('favorites')}
        >
          Favorites
        </button>
      </div>

      <div className="profile-posts">
        {postsToShow.length > 0 ? (
          postsToShow.map((post) => (
            <div
              key={post._id}
              className="profile-post-card"
              onClick={() => setSelectedPost(post)}
            >
              <h4>{post.trekId?.name || 'Unknown Trek'}</h4>
              <p>{post.text.slice(0, 100)}...</p>
              <span className="post-date">{post.date}</span>

              {/* Save / Favorite buttons */}
              <div className="post-buttons">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSave(post._id);
                  }}
                >
                  {savedPostIds.includes(post._id) ? 'Unsave' : 'Save'}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(post._id);
                  }}
                >
                  {favoritePostIds.includes(post._id) ? 'Unfavorite' : 'Favorite'}
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No posts yet.</p>
        )}
      </div>

      {/* Post detail modal */}
      <Modal isOpen={!!selectedPost} onClose={() => setSelectedPost(null)}>
        {selectedPost && !editingPost && (
          <>
            <h2>{selectedPost.trekId?.name || 'Unknown Trek'}</h2>
            <p><strong>Date:</strong> {selectedPost.date}</p>
            <p>{selectedPost.text}</p>
            <div className="modal-photos">
              {selectedPost.photos?.map((photo, idx) => (
                <img
                  key={idx}
                  src={`http://localhost:5000${photo}`}
                  alt={`post-${idx}`}
                  className="modal-photo-thumb"
                  onClick={() => setSelectedPhoto(`http://localhost:5000${photo}`)}
                />
              ))}
            </div>

            <div className="modal-buttons">
              <button onClick={() => openEditPost(selectedPost)} className="btn-edit">Edit</button>
              <button onClick={handleDeletePost} className="btn-delete">Delete</button>
            </div>
          </>
        )}

        {/* Edit post modal content */}
        {editingPost && (
          <form className="edit-post-form" onSubmit={handleEditPostSave}>
            <h3>Edit Post</h3>

            <label htmlFor="editPostText">Post Text</label>
            <textarea
              id="editPostText"
              value={editPostText}
              onChange={handleEditPostChange}
              required
            />

            <label htmlFor="editPostDate">Date</label>
            <input
              id="editPostDate"
              type="date"
              value={editPostDate}
              onChange={handleEditPostDateChange}
              required
            />

            <div className="edit-post-buttons">
              <button type="button" className="btn-cancel" onClick={handleEditPostCancel}>Cancel</button>
              <button type="submit" className="btn-save" disabled={editSaving}>
                {editSaving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* Photo preview modal */}
      <Modal isOpen={!!selectedPhoto} onClose={() => setSelectedPhoto(null)}>
        {selectedPhoto && (
          <div className="photo-modal-content">
            <img src={selectedPhoto} alt="full view" className="photo-modal-image" />
          </div>
        )}
      </Modal>
    </div>
  );
}
