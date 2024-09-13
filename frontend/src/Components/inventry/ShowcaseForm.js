import React, { useState } from 'react';
import './css/ShowcaseForm.css';
import axios from 'axios';

function ShowcaseForm() {
  const [name, setName] = useState('');
  const [image, setImage] = useState(null);
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [packetSize, setPacketSize] = useState(1); // Added packet size state
  const [unit, setUnit] = useState('kg'); // Added unit state, defaulting to kg
  const [price, setPrice] = useState('');
  const [discount, setDiscount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function handleImageChange(e) {
    setImage(e.target.files[0]);
  }

  function resetForm() {
    setName('');
    setImage(null);
    setCategory('');
    setDescription('');
    setPacketSize(1); // Reset packet size
    setUnit('kg'); // Reset unit to default kg
    setPrice('');
    setDiscount('');
  }

  async function sendData(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Format the unit and name
    const formattedUnit = `${packetSize}${unit}`;
    const formattedName = `${name} (${formattedUnit})`; // Format name with unit

    const formData = new FormData();
    formData.append('name', formattedName); // Use formatted name
    formData.append('image', image);
    formData.append('category', category);
    formData.append('description', description);
    formData.append('unit', formattedUnit); // Store the concatenated unit
    formData.append('price', price);
    formData.append('discount', discount); // Added discount field

    try {
      await axios.post('http://localhost:8000/showcase/add', formData);
      alert('Showcase Item Added');
      resetForm();
    } catch (err) {
      setError('Failed to add showcase item. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="showcase-form-container">
      <h2>Add Showcase Item</h2>
      {error && <p className="error-message">{error}</p>}
      <form className="showcase-form" onSubmit={sendData}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            placeholder="Enter Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
          <label htmlFor="category">Category</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select a category</option>
            <option>Seeds</option>
            <option>Growth Promoters</option>
            <option>Remedies</option>
            <option>Organic Farming</option>
            <option>Equipments</option>
            <option>Fertilizers</option>
            <option>Irrigation</option>
            <option>Gardening</option>
            <option>Bulk</option>
            {/* Add more categories as options here */}
          </select>
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
          <label htmlFor="packetSize">Packet Size</label>
          <input
            type="number"
            id="packetSize"
            min="1"
            max="150"
            value={packetSize}
            onChange={(e) => setPacketSize(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="unit">Unit</label>
          <select
            id="unit"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            required
          >
            <option value="kg">KG</option>
            <option value="l">L</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="price">Price</label>
          <input
            type="number"
            id="price"
            placeholder="Enter Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="discount">Discount (%)</label>
          <input
            type="number"
            id="discount"
            placeholder="Enter Discount"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            min="0"
            max="100"
          />
        </div>
        <div className="form-buttons">
          <button type="submit" className="add-button" disabled={loading}>
            {loading ? 'Adding...' : 'Add'}
          </button>
          <button type="button" className="cancel-button" onClick={resetForm}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default ShowcaseForm;
