import React, { useState } from "react";
import "./galeriaProyectos.css";
import ModalProyecto from "./modalProyecto.jsx";
import tiendaSolPortada from "../assets/tiendaSolPortada.png";
import TS1 from "../assets/tiendaSol/TS1.png";
import TS2 from "../assets/tiendaSol/TS2.png";
import TS3 from "../assets/tiendaSol/TS3.png";
import TS4 from "../assets/tiendaSol/TS4.png";
import TS5 from "../assets/tiendaSol/TS4,1.png";
import TS6 from "../assets/tiendaSol/TS4,2.png";
import TS7 from "../assets/tiendaSol/TS5.png";
import TS8 from "../assets/tiendaSol/TS6.png";

import M1 from "../assets/metamapa/M1.png";
import M2 from "../assets/metamapa/M2.png";
import M3 from "../assets/metamapa/M3.png";
import M4 from "../assets/metamapa/M4.png";
import M5 from "../assets/metamapa/M5.png";
import M6 from "../assets/metamapa/M6.png";

import metamapaPortada from "../assets/metamapaPortada.png";
import miPorfolioPortada from "../assets/miPorfolioPortada.png";
import portfolioPortada from "../assets/portfolioPortada.png";
import portfolioPortada15 from "../assets/portfolioPortada15.png";
import portfolioPortada2 from "../assets/portfolioPortada2.png";
import portfolioPortada3 from "../assets/portfolioPortada3.png";
import portfolioPortada4 from "../assets/portfolioPortada4.png";



const proyectos = [
    {
        titulo: "E-comerce tienda sol",
        imagen: tiendaSolPortada,
        imagenesModal: [
            TS1,
            TS2,
            TS3,
            TS4,
            TS5,
            TS6,
            TS7,
            TS8,
        ],
        descripcion: "Este es un proyecto desarrollado en equipo para la materia Desarrollo de Software de la UTN. Es una tienda online completa que permite a los usuarios navegar por productos, agregarlos al carrito y realizar compras. Incluye autenticación de usuarios, gestión de inventario y procesamiento de pagos.",
        tecnologias: ["React.js", "Node.js", "MongoDB"],
        github: "https://github.com/tobiasWaizer/TP-DesarrolloDeSW",
        web: "https://tiendasol-waizer.netlify.app/"
    },
    {
        titulo: "Mi Porfolio",
        imagen: miPorfolioPortada,
        imagenesModal: [
            portfolioPortada,
            portfolioPortada15,
            portfolioPortada2,
            portfolioPortada3,
            portfolioPortada4,
        ],
        descripcion: "Portfolio personal con React.",
        tecnologias: ["React.js", "Node.js", "HTML", "CSS"],
        github: "https://github.com/tobiasWaizer/Tobias_Waizer_Web",
        web: "https://tobiaswaizer-porfolio.netlify.app/"
    },
    {
        titulo: "Metamapa",
        imagen: metamapaPortada,
        imagenesModal: [
            M1,
            M2,
            M3,
            M4,
            M5,
            M6,
        ],
        descripcion: "La pagina es el resultado de un proyecto de la universidad en el que se desarrollo una aplicacion web para la visualizacion de eventos geograficos.",
        tecnologias: ["HTML", "CSS", "Javascript", "Java", "PostgreSQL"],
        github: "https://github.com/tobiasWaizer/Ferretify"
    },
    // Más proyectos...
];

export default function GaleriaProyectos() {
    const [modalProyecto, setModalProyecto] = useState(null);

    return (
        <>
            <div className="galeria-proyectos">
                {proyectos.map((proy, idx) => (
                    <div
                        className="proyecto-galeria-card"
                        key={idx}
                        onClick={() => setModalProyecto(proy)}
                    >
                        <img src={proy.imagen} alt={proy.titulo} className="proyecto-galeria-img" />
                        <div className="proyecto-galeria-overlay">
                            <h3>{proy.titulo}</h3>
                            <button className="proyecto-galeria-btn">Ver más</button>
                        </div>
                    </div>
                ))}
            </div>
            <ModalProyecto
                proyecto={modalProyecto}
                onClose={() => setModalProyecto(null)}
            />
        </>
    );
}
