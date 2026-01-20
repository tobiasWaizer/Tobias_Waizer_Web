import React from "react";
import Slider from "react-slick";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./carrouselProyectos.css";

const proyectos = [
    {
        titulo: "E-comerce tienda sol",
        imagen: "../../public/tiendaSolPortada.png",
        tecnologias: ["React.js", "Node.js", "MongoDB"],
        github: "https://github.com/tobiasWaizer/TP-DesarrolloDeSW",
        web: "https://proyecto1.com"
    },
    {
        titulo: "Mi Porfolio",
        imagen: "../../public/miPorfolioPortada.png",
        tecnologias: ["React,js", "Node.js", "HTML", "CSS"],
        github: "https://github.com/tobiasWaizer/Tobias_Waizer_Web",
        web: "https://proyecto1.com"
    },
    {
        titulo: "Metamapa",
        imagen: "../../public/miPorfolioPortada.png",
        tecnologias: ["java", "PostgreSQL", "HTML", "CSS"],
        github: "https://github.com/tobiasWaizer/Tobias_Waizer_Web",
        web: "https://proyecto1.com"
    },
    // Agrega más proyectos aquí
];

export default function CarrouselProyectos() {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
    };

    return (
        <section id="proyectos" className="proyectos-section">
            <h2>Mis Proyectos</h2>
            <Slider {...settings}>
                {proyectos.map((proy, idx) => (
                    <div key={idx} className="proyecto-card">
                        <h3 className="proyecto-titulo">{proy.titulo}</h3>
                        <img src={proy.imagen} alt={proy.titulo} className="proyecto-img" />
                        <div className="proyecto-tecnologias">
                            {proy.tecnologias.join(" | ")}
                        </div>
                        <div className="proyecto-links">
                            <a href={proy.github} target="_blank" rel="noopener noreferrer" title="Ver en GitHub">
                                <FaGithub size={28} />
                            </a>
                            <a href={proy.web} target="_blank" rel="noopener noreferrer" title="Ver Web">
                                <FaExternalLinkAlt size={28} />
                            </a>
                        </div>
                    </div>
                ))}
            </Slider>
        </section>
    );
}
