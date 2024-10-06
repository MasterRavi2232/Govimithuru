import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AttendanceDashboard = () => {
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

    const deleteAttendance = async (id) => {
        try {
            await axios.delete(`http://localhost:8000/api/attendances/${id}`);
            alert('Attendance record deleted successfully!');
            fetchAttendance();
        } catch (error) {
            console.error('Error deleting attendance record:', error);
            setErrorMessage(error.response?.data?.message || 'Error deleting attendance record');
        }
    };

    useEffect(() => {
        fetchAttendance();
    }, []);

    const styles = {
        container: {
            maxWidth: '800px',
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
        table: {
            width: '100%',
            borderCollapse: 'collapse',
        },
        th: {
            backgroundColor: '#f2f2f2',
            padding: '10px',
            borderBottom: '1px solid #ddd',
        },
        td: {
            padding: '10px',
            borderBottom: '1px solid #ddd',
        },
        button: {
            padding: '5px 10px',
            border: 'none',
            borderRadius: '4px',
            backgroundColor: '#ff4d4d',
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
            <h1 style={styles.header}>Attendance Dashboard</h1>
            {errorMessage && <p style={styles.errorMessage}>{errorMessage}</p>}
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>Employee Name</th>
                        <th style={styles.th}>NIC</th>
                        <th style={styles.th}>Status</th>
                        <th style={styles.th}>Attendance Dates & Times</th>
                        <th style={styles.th}>Attendance Count</th>
                        <th style={styles.th}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {attendanceRecords.map(record => (
                        <tr key={record._id}>
                            <td style={styles.td}>{record.employeeName}</td>
                            <td style={styles.td}>{record.nic}</td>
                            <td style={styles.td}>{record.status}</td>
                            <td style={styles.td}>
                                <ul style={{ padding: 0, margin: 0 }}>
                                    {record.attendanceTimes.map((time, index) => (
                                        <li key={index} style={{ listStyleType: 'none' }}>
                                            {new Date(time).toLocaleString()}
                                        </li>
                                    ))}
                                </ul>
                            </td>
                            <td style={styles.td}>{record.attendanceCount}</td> {/* Display Attendance Count */}
                            <td style={styles.td}>
                                <button 
                                    style={styles.button}
                                    onClick={() => deleteAttendance(record._id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AttendanceDashboard;
