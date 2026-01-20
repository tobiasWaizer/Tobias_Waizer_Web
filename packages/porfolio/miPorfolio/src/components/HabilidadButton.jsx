import React from "react";
import { FaJs, FaJava, FaHtml5, FaCss3Alt, FaReact, FaNodeJs, FaGitAlt, FaFigma, FaDatabase } from "react-icons/fa";
import { SiSpringboot, SiExpress, SiPostman, SiMongodb} from "react-icons/si";
import "./HabilidadButton.css";

const iconMap = {
    "JavaScript": <FaJs color="#f7df1e" />,
    "Java": <FaJava color="#007396" />,
    "HTML": <FaHtml5 color="#e34c26" />,
    "CSS": <FaCss3Alt color="#1572b6" />,
    "React.js": <FaReact color="#61dafb" />,
    "Node.js": <FaNodeJs color="#339933" />,
    "Express": <SiExpress color="#000" />,
    "Spring Boot": <SiSpringboot color="#6db33f" />,
    "Git": <FaGitAlt color="#f34f29" />,
    "Figma": <FaFigma color="#a259ff" />,
    "Postman": <SiPostman color="#ff6c37" />,
    "MongoDB": <SiMongodb color="#47a248" />,
    "SQL": <FaDatabase color="#00618a" />
};

export default function HabilidadButton({ nombre }) {
    return (
        <span className="habilidad-btn">
            {iconMap[nombre] || null}
            {nombre}
        </span>
    );
}