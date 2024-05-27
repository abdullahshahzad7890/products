import { Navigate, Route, Routes } from "react-router-dom";
import Products from "./views/Products/Products";
import React from "react";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/products" />} />
      <Route path="/products" element={<Products />} />
    </Routes>
  );
};

export default App;
