import React, { useEffect, useState } from "react";
import axios from "axios";

const AlertDashboard = () => {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        // Fetch inventory alerts when the component loads
        const fetchAlerts = async () => {
            try {
                const response = await axios.get("http://localhost:8000/inventoryalert/");
                setAlerts(response.data);
                setLoading(false);
            } catch (err) {
                setError("Error fetching alerts.");
                setLoading(false);
            }
        };

        fetchAlerts();
    }, []);

    const handleDeleteAlert = async (alertId) => {
        try {
            await axios.delete(`http://localhost:8000/inventoryalert/${alertId}`);
            setAlerts(alerts.filter(alert => alert._id !== alertId));
            alert("Alert deleted successfully.");
        } catch (err) {
            setError("Error deleting alert.");
        }
    };

    const formatDateTime = (dateTimeString) => {
        const date = new Date(dateTimeString);
        const formattedDate = date.toISOString().split('T')[0]; // YYYY-MM-DD
        const hours = String(date.getUTCHours()).padStart(2, '0'); // HH
        const minutes = String(date.getUTCMinutes()).padStart(2, '0'); // MM
        return `${formattedDate} at ${hours}.${minutes}`;
    };

    if (loading) return <p>Loading alerts...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h2>Inventory Alert Dashboard</h2>
            <table>
                <thead>
                    <tr>
                        
                        <th>Alert Message</th>
                        <td>Date</td>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {alerts.length > 0 ? (
                        alerts.map((alert) => (
                            <tr key={alert._id}>
                                <td>{alert.message}</td>
                                <td>{formatDateTime(alert.createdAt)}</td>
                                <td>
                                    <button onClick={() => handleDeleteAlert(alert._id)}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4">No alerts found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default AlertDashboard;
