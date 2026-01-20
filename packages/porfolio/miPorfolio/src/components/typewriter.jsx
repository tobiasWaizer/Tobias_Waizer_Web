// Typewriter.jsx
import React, { useState, useEffect } from "react";
import "./typewriter.css";

const Typewriter = ({ text, speed = 60, pause = 1200 }) => {
    const [displayed, setDisplayed] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        let i = displayed.length;
        let timeout;

        if (!isDeleting && i < text.length) {
            timeout = setTimeout(() => {
                setDisplayed(text.slice(0, i + 1));
            }, speed);
        } else if (isDeleting && i > 0) {
            timeout = setTimeout(() => {
                setDisplayed(text.slice(0, i - 1));
            }, speed);
        } else if (!isDeleting && i === text.length) {
            timeout = setTimeout(() => setIsDeleting(true), pause);
        } else if (isDeleting && i === 0) {
            timeout = setTimeout(() => setIsDeleting(false), pause);
        }

        return () => clearTimeout(timeout);
    }, [displayed, isDeleting, text, speed, pause]);

    return <p className="typewriter">{displayed}</p>;
};

export default Typewriter;
