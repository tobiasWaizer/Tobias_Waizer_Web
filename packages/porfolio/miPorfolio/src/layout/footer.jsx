import {Link} from "react-router-dom";
import React from "react";
import "./footer.css";


const Footer = () => (
    <footer>
        <small>© {new Date().getFullYear()} Mi Portafolio - <Link to="/contacto">Contacto</Link></small>
    </footer>
);

export default Footer;