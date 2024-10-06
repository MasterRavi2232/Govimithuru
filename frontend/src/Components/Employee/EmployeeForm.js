import React, { useState } from 'react';
import './EmployeeForm.css';
import axios from 'axios';

function EmployeeForm() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [position, setPosition] = useState('');
    const [department, setDepartment] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [nic, setNic] = useState('');
    const [drivingNic, setDrivingNic] = useState('');
    const [birthday, setBirthday] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
  const [errors, setErrors] = useState({});

    // Handler for image upload
    function handleImageChange(e) {
        setProfileImage(e.target.files[0]);
    }

    // Reset form fields
    function resetForm() {
        setFirstName('');
        setLastName('');
        setEmail('');
        setPosition('');
        setDepartment('');
        setPhoneNumber('');
        setNic('');
        setDrivingNic('');
        setBirthday('');
        setProfileImage(null);
        setError('');
    }

    // Calculate age based on birthday
    function calculateAge(dateOfBirth) {
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }

    // Validate age
    function isValidAge(birthday) {
        const age = calculateAge(birthday);
        return age >= 18 && age <= 45;
    }

    // Validate NIC
    function isValidNic(nic) {
        const nicRegex = /^\d{1,11}[0-9V]$/; // First 11 digits followed by either a digit or 'V'
        return nicRegex.test(nic) && nic.length <= 12; // Ensure length is up to 12
    }

    // Validate Driving NIC
    function isValidDrivingNic(drivingNic) {
        const drivingNicRegex = /^\d{1,11}[0-9V]$/; // Driving NIC follows the same format
        return drivingNicRegex.test(drivingNic) && drivingNic.length <= 12;
    }

    // Validate Phone Number
    function isValidPhoneNumber(phone) {
        const phoneRegex = /^\d{10}$/; // Phone number must be exactly 10 digits
        return phoneRegex.test(phone);
    }

    // Validate unique fields (email, NIC, drivingNic if applicable)
    async function validateUniqueFields() {
        try {
            const payload = {
                email,
                nic,
            };

            // Include drivingNic only if position is Driver
            if (position === 'Driver') {
                payload.drivingNic = drivingNic;
            }

            const response = await axios.post('http://localhost:8000/employee/validate', payload);
            return response.data.isUnique;
        } catch (err) {
            setError('Failed to validate unique fields. Please try again.');
            console.error(err);
            return false;
        }
    }

    // Handle form submission
    async function sendData(e) {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Validate age
        if (!isValidAge(birthday)) {
            setError('Age must be between 18 and 45 years.');
            setLoading(false);
            return;
        }

        // Validate NIC
        if (!isValidNic(nic)) {
            setError('NIC must be up to 12 characters: first 11 digits followed by either a digit or "V".');
            setLoading(false);
            return;
        }

        // If position is Driver, validate Driving NIC
        if (position === 'Driver') {
            if (!isValidDrivingNic(drivingNic)) {
                setError('Driving NIC must be up to 12 characters: first 11 digits followed by either a digit or "V".');
                setLoading(false);
                return;
            }
        }

        // Validate Phone Number
        if (!isValidPhoneNumber(phoneNumber)) {
            setError('Phone number must be exactly 10 digits.');
            setLoading(false);
            return;
        }

        // Validate unique fields
        const isUnique = await validateUniqueFields();
        if (!isUnique) {
            setError('Email, NIC, or Driving NIC already exists.');
            setLoading(false);
            return;
        }

        // Prepare form data
        const formData = new FormData();
        formData.append('firstName', firstName);
        formData.append('lastName', lastName);
        formData.append('email', email);
        formData.append('position', position);
        formData.append('department', department);
        formData.append('phoneNumber', phoneNumber);
        formData.append('nic', nic);
        // Append drivingNic only if position is Driver
        if (position === 'Driver') {
            formData.append('drivingNic', drivingNic);
        }
        formData.append('birthday', birthday);
        if (profileImage) {
            formData.append('profileImage', profileImage);
        }

        try {
            await axios.post('http://localhost:8000/employee/add', formData);
            alert('Employee Added');
            resetForm();
        } catch (err) {
            setError('Failed to add employee. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    // Prevent form submission on Enter key in phone number field
    const handlePhoneKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Prevent form submission
        }
    };

    return (
        <div className="employee-form-container">
            <h2>Add Employee</h2>
            {error && <p className="error-message">{error}</p>}
            <form className="employee-form" onSubmit={sendData}>
            <div className="form-group">
    <label htmlFor="firstName">First Name</label>
    <input
        type="text"
        id="firstName"
        placeholder="Enter First Name"
        value={firstName}
        onChange={(e) => {
            const value = e.target.value;
            // Allow only letters and spaces
            if (/^[a-zA-Z\s]*$/.test(value) || value === '') {
                setFirstName(value);
            }
        }}
        required
    />
</div>

<div className="form-group">
    <label htmlFor="lastName">Last Name</label>
    <input
        type="text"
        id="lastName"
        placeholder="Enter Last Name"
        value={lastName}
        onChange={(e) => {
            const value = e.target.value;
            // Allow only letters and spaces
            if (/^[a-zA-Z\s]*$/.test(value) || value === '') {
                setLastName(value);
            }
        }}
        required
    />
</div>

<label htmlFor="email">Email</label>
<input
  type="email"
  id="email"
  placeholder="Enter Email"
  value={email}
  onChange={(e) => {
    const value = e.target.value;
    // Simple email regex for validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Allow all input initially
    setEmail(value);

    // Check if the value is invalid
    if (!emailPattern.test(value) && value !== "") {
      // Show error if needed (you might want to set an error state here)
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "Invalid email format",
      }));
    } else {
      // Clear the error if valid
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "",
      }));
    }
  }}
  required
/>
{errors.email && <span className="error">{errors.email}</span>}

                <div className="form-group">
                    <label htmlFor="position">Designation</label>
                    <select
                        id="position"
                        value={position}
                        onChange={(e) => setPosition(e.target.value)}
                        required
                    >
                        <option value="">Select Designation</option>
                        <option value="Driver">Driver</option>
                        <option value="Order Staff">Order Staff</option>
                        <option value="Order Manager">Order Manager</option>
                        <option value="Delivery Manager">Delivery Manager</option>
                        <option value="Delivery Staff">Delivery Staff</option>
                        <option value="Inventory Manager">Inventory Manager</option>
                        <option value="Inventory Staff">Inventory Staff</option>
                        <option value="Finance Staff">Finance Staff</option>
                        <option value="Finance Manager">Finance Manager</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="department">Department</label>
                    <input
                        type="text"
                        id="department"
                        placeholder="Enter Department"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="phoneNumber">Phone Number</label>
                    <input
                        type="text"
                        id="phoneNumber"
                        placeholder="Enter Phone Number"
                        value={phoneNumber}
                        onChange={(e) => {
                            const value = e.target.value;
                            // Allow only digits
                            if (/^\d*$/.test(value)) {
                                setPhoneNumber(value);
                            }
                        }}
                        maxLength="10" // Limit input to 10 characters
                        onKeyDown={handlePhoneKeyDown} // Prevent Enter key submission
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="nic">NIC</label>
                    <input
                        type="text"
                        id="nic"
                        placeholder="Enter NIC"
                        value={nic}
                        onChange={(e) => {
                            const value = e.target.value.toUpperCase(); // Convert to uppercase for 'V'
                            // Validate NIC format: 11 digits followed by a digit or 'V'
                            if (/^\d{0,11}[0-9V]?$/.test(value)) {
                                setNic(value);
                            }
                        }}
                        maxLength="12" // Limit input to 12 characters
                        required
                    />
                </div>
                {/* Conditionally render Driving License field if position is Driver */}
                {position === 'Driver' && (
                    <div className="form-group">
                        <label htmlFor="drivingNic">Driving License</label>
                        <input
                            type="text"
                            id="drivingNic"
                            placeholder="Enter Driving NIC"
                            value={drivingNic}
                            onChange={(e) => {
                                const value = e.target.value.toUpperCase(); // Convert to uppercase for 'V'
                                // Validate Driving NIC format: 11 digits followed by a digit or 'V'
                                if (/^\d{0,11}[0-9V]?$/.test(value)) {
                                    setDrivingNic(value);
                                }
                            }}
                            maxLength="12" // Limit input to 12 characters
                            required={position === 'Driver'} // Make it required only if Driver
                        />
                    </div>
                )}
                <div className="form-group">
    <label htmlFor="birthday">Birthday</label>
    <input
        type="date"
        id="birthday"
        value={birthday}
        onChange={(e) => setBirthday(e.target.value)}
        min="1961-01-01" // Restrict minimum date to January 1, 1961
        max="2006-12-31" // Restrict maximum date to December 31, 2006
        required
    />
</div>

                <div className="form-group">
                    <label htmlFor="profileImage">Profile Image</label>
                    <input
                        type="file"
                        id="profileImage"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                </div>
                <div className="form-buttons">
                    <button type="submit" className="add-button" disabled={loading}>
                        {loading ? 'Adding...' : 'Add Employee'}
                    </button>
                    <button type="button" className="cancel-button" onClick={resetForm}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

export default EmployeeForm;
