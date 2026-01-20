import React from "react";
import "./layout.css";
import LogoWaizer from "../assets/logoWaizer.png";
import Sidebar from "./sideBar.jsx";
import Footer from "./footer.jsx";



export default function Layout({ children }) {
    return (
        <div className="layout-container">
            <Sidebar />
            <main className="main-content">
                {children}
            </main>
        </div>
    );
}
