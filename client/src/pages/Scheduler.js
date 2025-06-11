import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PostEditor from '../components/PostEditor';
import CalendarView from '../components/CalendarView'; // ✅ NEW
import '../styles/Scheduler.css';
import 'react-calendar/dist/Calendar.css';


export default function Scheduler() {
  const [scheduledPosts, setScheduledPosts] = useState([]);
  const [editingPost, setEditingPost] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null); // ✅ NEW

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/scheduler/mine', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setScheduledPosts(res.data);
    } catch (err) {
      console.error('Error loading posts:', err);
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm('Are you sure you want to delete this post?');
    if (!confirm) return;

    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:5000/api/scheduler/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchPosts();
    } catch (err) {
      console.error('Error deleting post:', err);
      alert('Error deleting post');
    }
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleEdit = (post) => {
    setEditingPost(post);
  };

  const handleNew = () => {
    setEditingPost({
      contentType: 'Post',
      contentText: '',
      mediaUrl: '',
      scheduledTime: new Date().toISOString().slice(0, 16)
    });
  };

  return (
    <div className="scheduler-page">
      <h1>Social Media Scheduler</h1>
      <button onClick={handleNew} className="new-post-btn">+ Create New Post</button>

      {editingPost && (
        <PostEditor
          post={editingPost}
          onClose={() => {
            setEditingPost(null);
            fetchPosts();
          }}
        />
      )}

      {/* ✅ Calendar View */}
      <CalendarView posts={scheduledPosts} onSelectDate={handleDateClick} />

      {/* ✅ Posts on Selected Date */}
      {selectedDate && (
        <div>
          <h3>Posts on {selectedDate.toDateString()}</h3>
          {scheduledPosts
            .filter(post => new Date(post.scheduledTime).toDateString() === selectedDate.toDateString())
            .map(post => (
              <div key={post._id} className="scheduled-card">
                <h4>{post.contentType}</h4>
                <p>{post.contentText}</p>
                <div className="post-actions">
                  <button onClick={() => handleEdit(post)}>Edit</button>
                  <button onClick={() => handleDelete(post._id)}>Delete</button>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* 🔁 All scheduled posts list */}
      <div className="scheduled-list">
        {scheduledPosts.map((post) => (
          <div key={post._id} className="scheduled-card">
            <h4>{post.contentType}</h4>
            {post.mediaUrl && (
              post.contentType === 'Video' ? (
                <video src={post.mediaUrl} controls width="100%" />
              ) : (
                <img src={post.mediaUrl} alt="Media" width="100%" />
              )
            )}
            <p>{post.contentText}</p>
            <p><strong>Scheduled:</strong> {new Date(post.scheduledTime).toLocaleString()}</p>
            <div className="post-actions">
              <button onClick={() => handleEdit(post)}>Edit</button>
              <button onClick={() => handleDelete(post._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
