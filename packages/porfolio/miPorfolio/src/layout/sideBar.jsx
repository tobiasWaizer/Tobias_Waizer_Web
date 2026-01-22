import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LogoWaizer from "../assets/logoWaizer.png";
import "./sideBar.css";

const secciones = [
    { id: "sobre-mi", label: "Sobre mí" },
    { id: "proyectos", label: "Proyectos" },
    { id: "educacion", label: "Educacion" },
    { id: "habilidades", label: "Habilidades" },
    { id: "contacto", label: "Contacto" }
];

const Sidebar = () => (
    <nav className="sidebar">
        <img src={LogoWaizer} alt="Logo Waizer" className="sidebar-logo" />
        <ul className="sidebar-list">
            <li>
                <a href="#sobre-mi" className="sidebar-link">Sobre mí</a>
            </li>
            <li>
                <a href="#proyectos" className="sidebar-link">Proyectos</a>
            </li>
            <li>
                <a href="#educacion" className="sidebar-link">Educacion</a>
            </li>
            <li>
                <a href="#habilidades" className="sidebar-link">Habilidades</a>
            </li>
            <li>
                <a href="#contacto" className="sidebar-link">Contacto</a>
            </li>
        </ul>
    </nav>
);

export default Sidebar;
