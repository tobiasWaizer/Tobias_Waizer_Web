import React, { useState, useEffect } from "react";
import "./home.css";
import { MdEmail } from "react-icons/md";
import { FaWhatsapp, FaInstagram, FaLinkedin } from "react-icons/fa";
import MiFoto from "../../assets/miFoto.jpeg";
import Typewriter from "../../components/typewriter";
import CarrouselProyectos from "../../components/carrouselProyectos.jsx";

const SobreMi = () => (
    <section id="sobre-mi" className="sobre-mi-section">
        <div className="sobre-mi-contenido">
            <div className="sobre-mi-texto">
                <h2 className="sobre-mi-titulo">Sobre mí</h2>
                <p>
                    Soy estudiante de 4to año de la UTN y quiero especializarme en desarrollo web Full Stack.
                    Busco adquirir experiencia trabajando en el desarrollo de software y seguir creciendo profesionalmente en el área.
                </p>
                <p className= "sobre-mi-subtitulo">
                    Voluntariado
                </p>
                <p>
                    Soy parte de un grupo Scout llamado Coronel Benito Meana, realizo actividades educativas con niños y jovenes para que puedan desarrollarse como personas.
                </p>
                <div className="cv-buttons">
                    <a
                        href="/Tobias_Waizer_CV.pdf"
                        download
                        className="cv-btn"
                    >
                        Descargar CV Español
                    </a>
                    <a
                        href="/Tobias_Jose_Ian_Waizer_CV.pdf"
                        download
                        className="cv-btn"
                    >
                        Download CV English
                    </a>
                </div>
            </div>
            <img src={MiFoto} alt="Mi Foto" className="sobre-mi-foto" />
        </div>
    </section>
);


const Proyectos = () => (
    <section id="proyectos" className="sobre-mi-section">
        <h2 className= "contacto-titulo">Proyectos</h2>
        <CarrouselProyectos/>
    </section>
)

const educaciones = [
    {
        institucion: "UTN - Universidad Tecnológica Nacional",
        titulo: "Ingeniería en Sistemas de Información",
        desde: "Marzo 2023",
        hasta: "Actualidad"
    },
    {
        institucion: "Escuela Tecnica Nº28 Republica Francesa",
        titulo: "Técnico en Electrónica",
        desde: "Marzo 2017",
        hasta: "Diciembre 2022"
    }
];

const Educacion = () => (
    <section id="educacion" className="contacto-section">
        <h2 className="contacto-titulo">Educación</h2>
        <ul className="educacion-lista">
            {educaciones.map((edu, idx) => (
                <li key={idx} className="educacion-item">
                    <strong>{edu.titulo}</strong> <br />
                    <span>{edu.institucion}</span> <br />
                    <span>{edu.desde} - {edu.hasta}</span>
                </li>
            ))}
        </ul>
    </section>
);

            /*todo:ver que onda con el mail*/
const Contacto = () => (
    <section id="contacto" className="contacto-section">
        <h2 className="contacto-titulo">Contacto</h2>
        <div className="contacto-redes">
            <a href="mailto:tobias.waizer.j@gmail.com" className="contacto-link" title="Email">
                <MdEmail size={32} className="contacto-icono" />
                tobias.waizer.j@gmail.com
            </a>
            <a href="https://wa.me/5491127587650" target="_blank" rel="noopener noreferrer" className="contacto-link" title="WhatsApp">
                <FaWhatsapp size={32} className="contacto-icono" />
                +54 9 11 27587650
            </a>
            <a href="https://instagram.com/tobias_jiw" target="_blank" rel="noopener noreferrer" className="contacto-link" title="Instagram">
                <FaInstagram size={32} className="contacto-icono" />
                @tobias_jiw
            </a>
            <a href="www.linkedin.com/in/tobias-waizer-9b8361180" target="_blank" rel="noopener noreferrer" className="contacto-link" title="LinkedIn">
                <FaLinkedin size={32} className="contacto-icono" />
                tobias-waizer-linkedIn
            </a>
        <Typewriter text="Ante cualquier duda o consulta, no dudes en comunicarte!!!!" />
        </div>
    </section>
);


export default function Home() {
    return (
        <div className="home-container">
            <h1 className="home-nombre">
                <span className="nombre-tobias">Tobias</span> <span className="nombre-waizer">Waizer</span>
            </h1>
            <p className="home-description">
                Hola! Soy Tobias Waizer y este es mi porfolio personal, aquí podrás encontrar información sobre mis conocimientos, proyectos y habilidades.
            </p>
            <SobreMi/>
            <Proyectos/>
            <Educacion/>
            <Contacto/>
        </div>
    );
}
/*todo: lograr que el espacio donde se escriben y se desescriben se mantenga fijo*/