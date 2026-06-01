
import React, { useState } from 'react';

import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';

import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';

import Home from './pages/Home.jsx';
import Catalogue from './pages/Catalogue.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import Cart from './pages/Cart.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Profile from './pages/Profile.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import ResetPassword from './pages/ResetPassword.jsx';

import Chatbot from './components/Chatbot.jsx';

import { CartProvider } from './context/CartContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';

import './i18n/config';

function App() {

  return (

    <AuthProvider>

      <CartProvider>

        <Router
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true
          }}
        >

          <div
className="d-flex flex-column min-vh-100"
  style={{ overflow: 'visible' }}
  >

            {/* HEADER */}
            <Header />

            {/* CONTENU */}
            <main className="flex-grow-1">

              <Routes>

                <Route
                  path="/"
                  element={<Home />}
                />

                <Route
                  path="/catalogue"
                  element={<Catalogue />}
                />

                <Route
                  path="/produit/:id"
                  element={<ProductDetail />}
                />

                <Route
                  path="/panier"
                  element={<Cart />}
                />

                <Route
                  path="/connexion"
                  element={<Login />}
                />

                <Route
                  path="/inscription"
                  element={<Register />}
                />

                <Route
                  path="/profil"
                  element={<Profile />}
                />

                <Route
                  path="/admin"
                  element={<AdminDashboard />}
                />

                <Route
                  path="/mot-de-passe-oublie"
                  element={<ForgotPassword />}
                />

                <Route
                  path="/reset-password/:token"
                  element={<ResetPassword />}
                />

              </Routes>

            </main>

            {/* FOOTER */}
            <Footer />

            {/* CHATBOT */}
            <Chatbot />

          </div>

        </Router>

      </CartProvider>

    </AuthProvider>

  );

}

export default App;

