import React, { useState } from 'react';
import axios from 'axios';

export default function PostEditor({ post, onClose }) {
  const [form, setForm] = useState(post);
  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    const formData = new FormData();

    Object.keys(form).forEach((key) => {
      formData.append(key, form[key]);
    });

    if (file) {
      formData.append('media', file);
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    };

    const url = post._id
      ? `http://localhost:5000/api/scheduler/edit/${post._id}`
      : 'http://localhost:5000/api/scheduler/create';

    try {
      await axios({
        method: post._id ? 'put' : 'post',
        url,
        data: formData,
        ...config
      });
      onClose();
    } catch (err) {
      console.error('Error saving post:', err);
      alert('Error saving post');
    }
  };

  return (
    <div className="post-editor">
      <h3>{post._id ? 'Edit Post' : 'Create New Post'}</h3>

      <select name="contentType" value={form.contentType} onChange={handleChange}>
        <option value="Post">Post</option>
        <option value="Image">Image</option>
        <option value="Ad">Ad</option>
        <option value="Video">Video</option>
      </select>

      <textarea
        name="contentText"
        placeholder="Enter your post text"
        value={form.contentText}
        onChange={handleChange}
      />

      <input
        type="text"
        name="mediaUrl"
        placeholder="Image/Video URL (optional)"
        value={form.mediaUrl}
        onChange={handleChange}
      />

      <input
        type="file"
        name="media"
        accept="image/*,video/*"
        onChange={handleFileChange}
      />

      <input
        type="datetime-local"
        name="scheduledTime"
        value={form.scheduledTime}
        onChange={handleChange}
      />

      <div className="editor-buttons">
        <button onClick={handleSave}>Save</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}
