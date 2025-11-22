import React from "react";
import { Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/Layout";
import Landing from "./pages/Landing";

// MAIN DASHBOARD PAGES
import Dashboard from "./pages/Dashboard";
import Stock from "./pages/Products/Stocks";
import Warehouses from "./pages/Warehouses/Warehouses";
import Locations from "./pages/Locations/Locations";
import MoveHistory from "./pages/MoveHistory/MoveHistory";

import ReceiptsList from "./pages/Receipts/ReceiptsList";
import ReceiptForm from "./pages/Receipts/ReceiptForm";

// AUTH PAGES
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";

import DeliveryList from "./pages/Delivery/DeliveryList";
import DeliveryForm from "./pages/Delivery/DeliveryForm";
import Adjustments from "./pages/Adjustments";
import CreateProduct from "./pages/Products/CreateProduct";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* PUBLIC LANDING PAGE */}
        <Route path="/" element={<Landing />} />

        {/* AUTH ROUTES */}
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/signup" element={<Signup />} />
        <Route path="/auth/forgot" element={<ForgotPassword />} />
        <Route path="/auth/reset" element={<ResetPassword />} />

        {/* PROTECTED ROUTES */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* RECEIPTS */}
        <Route
          path="/receipts"
          element={
            <Layout>
              <ReceiptsList />
            </Layout>
          }
        />

        <Route
          path="/receipts/new"
          element={
            <Layout>
              <ReceiptForm />
            </Layout>
          }
        />

        <Route
          path="/receipts/:id"
          element={
            <Layout>
              <ReceiptForm />
            </Layout>
          }
        />

        {/* PRODUCTS */}
        <Route path="/stock" element={<Stock />} />
        <Route
          path="/products/new"
          element={
            <Layout>
              <CreateProduct />
            </Layout>
          }
        />

        {/* WAREHOUSES + LOCATIONS */}
        <Route
          path="/warehouses"
          element={
            <Layout>
              <Warehouses />
            </Layout>
          }
        />

        <Route
          path="/locations"
          element={
            <Layout>
              <Locations />
            </Layout>
          }
        />

        {/* MOVE HISTORY */}
        <Route path="/move-history" element={<MoveHistory />} />

        {/* DELIVERY */}
        <Route
          path="/delivery"
          element={
            <Layout>
              <DeliveryList />
            </Layout>
          }
        />

        <Route
          path="/delivery/new"
          element={
            <Layout>
              <DeliveryForm />
            </Layout>
          }
        />

        <Route
          path="/delivery/:id"
          element={
            <Layout>
              <DeliveryForm />
            </Layout>
          }
        />

        {/* ADJUSTMENT */}
        <Route path="/adjustments" element={<Adjustments />} />
      </Routes>
    </AuthProvider>
  );
}
