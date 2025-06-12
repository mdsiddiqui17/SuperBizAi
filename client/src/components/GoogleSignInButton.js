import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios'; // Or your preferred HTTP client
// import { useNavigate } from 'react-router-dom'; // Import if redirecting from here
// import { toast } from 'react-toastify'; // Import if using react-toastify

const GoogleSignInButton = ({ onAuthSuccess, onAuthError }) => {
  // const navigate = useNavigate(); // Initialize if redirecting from here

  const handleGoogleSuccess = async (credentialResponse) => {
    console.log('Google Sign-In Success, credentialResponse:', credentialResponse);
    const googleIdToken = credentialResponse.credential;

    if (!googleIdToken) {
      console.error('Google ID token not found in credentialResponse.');
      if (onAuthError) {
        onAuthError('Google ID token not found.');
      } else {
        // toast.error('Google ID token not found.');
        alert('Google ID token not found.');
      }
      return;
    }

    try {
      // Send the Google ID token to your backend
      const response = await axios.post('/api/auth/google', {
        credential: googleIdToken,
      });

      // Assuming your backend responds with { token, user, message }
      const { token, user, message } = response.data;

      console.log('Backend response:', response.data);

      // Store token and user info (consistent with your email/password login)
      localStorage.setItem('token', token); // Or your app's specific token key
      localStorage.setItem('user', JSON.stringify(user)); // Or your app's specific user key

      // Notify parent component of successful authentication
      if (onAuthSuccess) {
        onAuthSuccess(user); // Pass user data to parent
      } else {
        // Fallback if no onAuthSuccess is provided (though it's recommended)
        // setIsLoggedIn(true); // This would require setIsLoggedIn to be passed as a prop
        // navigate('/dashboard'); // Redirect
      }

      // toast.success(message || 'Google Sign-In successful!');

    } catch (error) {
      console.error('Error during Google Sign-In with backend:', error);
      const errorMessage = error.response?.data?.message || 'Google Sign-In failed. Please try again.';
      if (onAuthError) {
        onAuthError(errorMessage);
      } else {
        // toast.error(errorMessage);
        alert(errorMessage);
      }
    }
  };

  const handleGoogleFailure = (error) => {
    // This error is from the Google library itself (e.g., popup closed, network issue)
    console.error('Google Sign-In Library Failure:', error);
    const displayMessage = 'Google Sign-In failed or was cancelled.';
    if (onAuthError) {
      onAuthError(displayMessage);
    } else {
      // toast.error(displayMessage);
      alert(displayMessage);
    }
  };

  return (
    <GoogleLogin
      onSuccess={handleGoogleSuccess}
      onError={handleGoogleFailure}
      useOneTap // Optional: Enables One Tap sign-in experience
      // You can customize the button further with props like:
      // theme="outline"
      // size="large"
      // shape="rectangular"
      // text="continue_with"
      // width="250px"
    />
  );
};

export default GoogleSignInButton;
