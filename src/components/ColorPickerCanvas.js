import React, { useRef, useState, useEffect } from "react";
import '../styles/ColorMixForm.scss';

const ColorPickerCanvas = ({ onColorSelect }) => {
    const [image, setImage] = useState(null); // Stocke l'image uploadée
    const [zoomStyle, setZoomStyle] = useState({ visibility: "hidden" }); // Style pour la loupe
    const canvasRef = useRef(null); // Référence pour le canvas
    const zoomRef = useRef(null); // Référence pour la loupe

    // Gestion de l'upload d'une image
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setImage(imageUrl);
        }
    };

    // Récupérer la couleur d'un pixel cliqué
    const handleCanvasClick = (e) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();

        // Coordonnées de la souris dans le canvas
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Récupérer les données de pixel
        const imageData = ctx.getImageData(x, y, 1, 1).data;
        const [r, g, b] = imageData;

        // Convertir en HEX
        const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
        onColorSelect(hex); // Passer la couleur sélectionnée au parent
    };

    // Charger l'image dans le canvas
    useEffect(() => {
        if (image) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            const img = new Image();

            img.src = image;
            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
            };
        }
    }, [image]);

    const handleMouseMove = (e) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const zoomCanvas = zoomRef.current;
        const zoomSize = 50;  // Taille de la loupe (100px)

        const imageWidth = canvas.width;
        const imageHeight = canvas.height;

        const zoomFactor = Math.min(imageWidth / zoomSize, imageHeight / zoomSize)*5;

        // Positionner la loupe sur la souris (centrée)
        setZoomStyle({
            visibility: "visible",
            left: `${e.clientX}px`,
            top: `${e.clientY}px`,
            backgroundPosition: `-${(mouseX * zoomFactor - zoomSize / 2)}px -${(mouseY * zoomFactor - zoomSize / 2)}px`,  // Déplacer l'image dans la loupe
            backgroundSize: `${canvas.width * zoomFactor}px ${canvas.height * zoomFactor}px`,  // Agrandir l'image sous la loupe
        });


    };


    // Cacher la loupe quand la souris quitte l'image
    const handleMouseOut = () => {
        setZoomStyle({ visibility: "hidden" });
    };

    return (
        <div className="input-img">
            <input type="file" id="imageUpload" accept="image/*" onChange={handleImageUpload} />

            {image && (
                <div>
                    <canvas
                        ref={canvasRef}
                        onClick={handleCanvasClick}
                        onMouseMove={handleMouseMove}
                        onMouseOut={handleMouseOut}
                        style={{
                            border: "1px solid black" ,
                            cursor: "crosshair", border: "1px solid black"
                        }}

                    ></canvas>

                    {/* Loupe */}
                    <div>  <canvas
                        ref={zoomRef}
                        style={{
                            ...zoomStyle,
                            position: "absolute",
                            width: "50px", // Largeur de la loupe
                            height: "50px", // Hauteur de la loupe
                            borderRadius: "50%",
                            border: "2px solid black",
                            backgroundImage: `url(${image})`,
                            backgroundRepeat: "no-repeat",

                            pointerEvents: "none", // La loupe ne doit pas interférer avec la souris
                            zIndex: 10
                        }} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ColorPickerCanvas;
