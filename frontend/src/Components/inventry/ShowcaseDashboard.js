import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './css/ShowcaseDashboard.css';

function ShowcaseDashboard() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("http://localhost:8090/showcase/")
            .then((res) => {
                setItems(res.data);
                setLoading(false);
            })
            .catch((err) => {
                setError('Failed to fetch items. Please try again.');
                setLoading(false);
            });
    }, []);

    const handleView = (id) => {
        navigate(`/showcase/view/${id}`);
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this item?")) {
            axios.delete(`http://localhost:8090/showcase/delete/${id}`)
                .then(() => {
                    setItems(items.filter(item => item._id !== id));
                    alert("Showcase Item Deleted");
                })
                .catch((err) => {
                    setError('Failed to delete item. Please try again.');
                });
        }
    };

    const handleAddNew = () => {
        navigate('/admin/showcase/ShowcaseForm');
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="showcase-dashboard-container">
            <h2 className="showcase-dashboard-title">Showcase Dashboard</h2>
            <button className="add-new-btn" onClick={handleAddNew}>Add New Showcase Item</button>
            {error && <p className="error-message">{error}</p>}
            <table className="showcase-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Description</th>
                        <th>Unit</th>
                        <th>Price</th>
                        <th>Discount</th> {/* New Discount Column */}
                        <th>Image</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {items.length > 0 ? (
                        items.map((item, index) => (
                            <tr key={item._id}>
                                <td>{index + 1}</td>
                                <td>{item.name}</td>
                                <td>{item.category}</td>
                                <td>{item.description}</td>
                                <td>{item.unit}</td>
                                <td>{item.price}</td>
                                <td>{item.discount} %</td> {/* Display Discount */}
                                <td>
                                    <img
                                        src={`data:image/jpeg;base64,${item.imageBase64}`}
                                        alt={item.name}
                                        className="showcase-image"
                                    />
                                </td>
                                <td>
                                    <button className="view-btn" onClick={() => handleView(item._id)}>View</button>
                                    <button className="delete-btn" onClick={() => handleDelete(item._id)}>Delete</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="9">No items available</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default ShowcaseDashboard;
