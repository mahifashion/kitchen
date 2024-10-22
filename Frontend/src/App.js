import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './components/Home/Home';
import ProductDetails from './components/ProductDetails/ProductDetails';
import Address from './components/Address/Address';
import OrderSummary from './components/OrderSummary/OrderSummary';
import Payment from './components/Payment/Payment';
import AdminPanel from './components/AdminPanel/AdminPanel';
import Login from './components/AdminPanel/Login';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Check local storage for authentication state
    const savedAuthState = localStorage.getItem('isAuthenticated');
    return savedAuthState === 'true';
  });

  const [showContent, setShowContent] = useState(true);

  useEffect(() => {
    // Persist authentication state to local storage
    localStorage.setItem('isAuthenticated', isAuthenticated);
  }, [isAuthenticated]);

  useEffect(() => {
    // Function to detect Instagram or Facebook in-app browser
    function isInstagramBrowser() {
      const ua = navigator.userAgent || navigator.vendor || window.opera;
      return (ua.indexOf('Instagram') > -1) || (ua.indexOf('FBAN') > -1) || (ua.indexOf('FBAV') > -1);
    }

    // Redirect logic for different platforms
    function redirectToChrome() {
      const androidUrl = "intent://flipkitchen.pages.dev/#Intent;scheme=https;package=com.android.chrome;end;";
      const fallbackUrl = "https://flipkitchen.pages.dev/";

      if (/android/i.test(navigator.userAgent)) {
        // Android device detected
        window.location.href = androidUrl;
      } else if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        // iOS device detected
        alert('To complete your payment, please open this link in Safari or Chrome.');
      } else {
        // Fallback for non-Android/non-iOS devices
        window.location.href = fallbackUrl;
      }
    }

    // Check if the user is using Instagram's in-app browser
    if (isInstagramBrowser()) {
      setShowContent(false); // Hide the main content
      redirectToChrome(); // Redirect to Chrome
    } else {
      setShowContent(true); // Show main content
    }
  }, []);

  return (
    <Router>
      {showContent && (
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product-details/:id" element={<ProductDetails />} />
          <Route path="/address" element={<Address />} />
          <Route path="/order-summary" element={<OrderSummary />} />
          <Route path="/payment" element={<Payment />} />
          <Route 
            path="/admin" 
            element={isAuthenticated ? <AdminPanel setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/login" 
            element={<Login setIsAuthenticated={setIsAuthenticated} />} 
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      )}
    </Router>
  );
};

export default App;
