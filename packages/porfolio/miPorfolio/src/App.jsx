import { useState } from 'react'
import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from '../src/layout/layout.jsx';
import Home from './pages/home/home.jsx';

function App() {
    return (
        <BrowserRouter>
            <Layout>
                <Routes>
                    <Route path="/" element={<Home />} />
                    {/* Agrega aquí más rutas si lo necesitas */}
                </Routes>
            </Layout>
        </BrowserRouter>
    );
}

export default App;
