import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const ProtectedRoute = ({ isLoggedIn, children }) => {
    const userRole = Cookies.get('role'); // Get role from cookies

    if (!isLoggedIn) {
        return <Navigate to="/login" />;
    }

    // Example: Redirect non-admins trying to access admin pages
    if (userRole !== 'admin' && window.location.pathname.startsWith('/admin')) {
        return <Navigate to="/home" />;
    }

    return children;
};
