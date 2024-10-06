import React, { useState } from 'react';
import axios from 'axios';
import './css/ShowcaseForm.css';

function OfferForm() {
  const [title, setTitle] = useState('');
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function handleImageChange(e) {
    setImage(e.target.files[0]);
  }

  function resetForm() {
    setTitle('');
    setImage(null);
    setDescription('');
    setLink('');
  }

  async function sendData(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('img', image); // Adjusting to match the field name in your backend
    formData.append('description', description);
    formData.append('link', link);

    try {
      await axios.post('http://localhost:8000/offers/add', formData);
      alert('Offer Added');
      resetForm();
    } catch (err) {
      setError('Failed to add offer. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="offer-form-container">
      <h2>Add Offer</h2>
      {error && <p className="error-message">{error}</p>}
      <form className="offer-form" onSubmit={sendData}>
      <div className="form-group">
  <label htmlFor="title">Title</label>
  <input
    type="text"
    id="title"
    placeholder="Enter Title"
    value={title}
    onChange={(e) => {
      const newValue = e.target.value;
      // Check if the input contains numbers
      if (!/\d/.test(newValue)) {
        setTitle(newValue);
      }
    }}
    required
  />
</div>
        <div className="form-group">
          <label htmlFor="image">Upload Image</label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <input
            type="text"
            id="description"
            placeholder="Enter Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="link">Link</label>
          <input
            type="url"
            id="link"
            placeholder="Enter Link"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            required
          />
        </div>
        <div className="form-buttons">
          <button type="submit" className="add-button" disabled={loading}>
            {loading ? 'Adding...' : 'Add Offer'}
          </button>
          <button type="button" className="cancel-button" onClick={resetForm}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default OfferForm;
