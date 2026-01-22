import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./modalProyecto.css";

export default function ModalProyecto({ proyecto, onClose }) {
    if (!proyecto) return null;

    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 400,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
    };

    return (
        <div className="modal-proyecto-backdrop" onClick={onClose}>
            <div className="modal-proyecto" onClick={e => e.stopPropagation()}>
                <button className="modal-proyecto-close" onClick={onClose}>×</button>
                <h2>{proyecto.titulo}</h2>
                <div className="modal-proyecto-slider-container">
                    <Slider {...sliderSettings}>
                        {proyecto.imagenesModal.map((img, idx) => (
                            <div key={idx}>
                                <img src={img} alt={`slide-${idx}`} className="modal-proyecto-img-slider" />
                            </div>
                        ))}
                    </Slider>
                </div>
                <h3>Descripcion:</h3>
                <p>{proyecto.descripcion}</p>
                <h3>Tecnologias que utilice:</h3>
                <ul>
                    {proyecto.tecnologias.map((tec, idx) => (
                        <li key={idx}>+ {tec}</li>
                    ))}
                </ul>
                <h3>Ver proyecto</h3>
                <div className="modal-proyecto-botones">
                    <a
                        href={proyecto.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="modal-proyecto-btn"
                    >
                        Ver repositorio
                    </a>
                    {proyecto.web && (
                        <a
                            href={proyecto.web}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="modal-proyecto-btn"
                        >
                            Ver web
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}
