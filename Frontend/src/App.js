import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './components/Home/Home';
import ProductDetails from './components/ProductDetails/ProductDetails';
import Address from './components/Address/Address';
import OrderSummary from './components/OrderSummary/OrderSummary';
import Payment from './components/Payment/Payment';
import AdminPanel from './components/AdminPanel/AdminPanel';
import Login from './components/AdminPanel/Login';
import ChromePage from './components/ChromePage'; // Assuming you have this component for the redirect page

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const savedAuthState = localStorage.getItem('isAuthenticated');
    return savedAuthState === 'true';
  });

  const [show, setShow] = useState(true);

  useEffect(() => {
    function isInstagramBrowser() {
      const ua = navigator.userAgent || navigator.vendor || window.opera;
      return (ua.indexOf('Instagram') > -1) || (ua.indexOf('FBAN') > -1) || (ua.indexOf('FBAV') > -1);
    }

    function redirectToChrome() {
      const androidUrl = "intent://kitchen-5suo.onrender.com/#Intent;scheme=https;package=com.android.chrome;end;";
      const fallbackUrl = "https://kitchen-5suo.onrender.com/";

      if (/android/i.test(navigator.userAgent)) {
        window.location.href = androidUrl;
      } else if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        alert('To complete your payment, please open this link in Safari or Chrome.');
      } else {
        window.location.href = fallbackUrl;
      }
    }

    if (isInstagramBrowser()) {
      setShow(false);
      redirectToChrome();
    } else {
      setShow(true);
    }
  }, []);

  useEffect(() => {
    // Persist authentication state to local storage
    localStorage.setItem('isAuthenticated', isAuthenticated);
  }, [isAuthenticated]);

  return (
    <Router>
      <Routes>
        {show ? (
          <>
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
          </>
        ) : (
          <Route path="/" element={<ChromePage />} />
        )}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
