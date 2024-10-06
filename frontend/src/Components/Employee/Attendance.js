import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Attendance = () => {
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    const fetchAttendance = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/attendances/');
            setAttendanceRecords(response.data);
            setErrorMessage('');
        } catch (error) {
            console.error('Error fetching attendance records:', error);
            setErrorMessage('Error fetching attendance records');
        }
    };

    const markAttendance = async (employeeName, nic) => {
        try {
            await axios.post('http://localhost:8000/api/attendances/increment', { employeeName, nic });
            alert('Attendance marked successfully!');
            fetchAttendance();
        } catch (error) {
            console.error('Error marking attendance:', error);
            setErrorMessage(error.response?.data?.message || 'Error marking attendance');
        }
    };

    useEffect(() => {
        fetchAttendance();
    }, []);

    const styles = {
        container: {
            maxWidth: '600px',
            margin: '20px auto',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
            backgroundColor: '#fff',
        },
        header: {
            textAlign: 'center',
            color: '#333',
        },
        list: {
            listStyleType: 'none',
            padding: '0',
        },
        listItem: {
            borderBottom: '1px solid #ddd',
            padding: '10px 0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        button: {
            padding: '5px 10px',
            border: 'none',
            borderRadius: '4px',
            backgroundColor: '#007bff',
            color: '#fff',
            cursor: 'pointer',
            transition: 'background-color 0.3s',
        },
        errorMessage: {
            color: 'red',
            textAlign: 'center',
        },
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.header}>Attendance List</h1>
            {errorMessage && <p style={styles.errorMessage}>{errorMessage}</p>}
            <ul style={styles.list}>
                {attendanceRecords.map(record => (
                    <li key={record._id} style={styles.listItem}>
                        <span>{record.employeeName} (NIC: {record.nic})</span>
                        <button 
                            style={styles.button}
                            onClick={() => markAttendance(record.employeeName, record.nic)}
                        >
                            Mark Attendance
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Attendance;
