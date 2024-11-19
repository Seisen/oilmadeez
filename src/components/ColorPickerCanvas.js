import React, { useRef, useState, useEffect } from "react";
import '../styles/ColorMixForm.scss';

const ColorPickerCanvas = ({ onColorSelect, image }) => {
    const [zoomStyle, setZoomStyle] = useState({ visibility: "hidden" }); // Style pour la loupe
    const [zoomLevel, setZoomLevel] = useState(1); // Niveau de zoom
    const [offset, setOffset] = useState({ x: 0, y: 0 }); // Décalage pour déplacer l'image
    const canvasRef = useRef(null); // Référence pour le canvas
    const zoomRef = useRef(null); // Référence pour la loupe
    const containerRef = useRef(null); // Référence pour la div contenant le canvas
    const imageRef = useRef(null); // Référence pour l'image chargée

    const minZoom = 1; // Zoom minimal (taille originale de l'image)
    const maxZoom = 10; // Zoom maximal (par exemple 3 fois la taille originale)

    // Charger l'image dans le canvas
    useEffect(() => {
        if (image) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            const img = new Image();
            img.src = image;
            imageRef.current = img;

            img.onload = () => {
                const container = containerRef.current;
                const containerWidth = container.offsetWidth;
                const containerHeight = container.offsetHeight;

                // Calcul du rapport d'aspect de l'image
                const imgAspectRatio = img.width / img.height;
                const containerAspectRatio = containerWidth / containerHeight;

                let newWidth, newHeight;

                // Comparer les rapports d'aspect pour savoir s'il faut redimensionner en fonction de la largeur ou de la hauteur
                if (containerAspectRatio > imgAspectRatio) {
                    // La div est plus large que l'image, donc on ajuste la hauteur
                    newHeight = containerHeight;
                    newWidth = newHeight * imgAspectRatio;
                } else {
                    // La div est plus haute que l'image, donc on ajuste la largeur
                    newWidth = containerWidth;
                    newHeight = newWidth / imgAspectRatio;
                }

                // Redimensionner le canvas
                canvas.width = newWidth;
                canvas.height = newHeight;

                // Dessiner l'image redimensionnée dans le canvas
                ctx.drawImage(img, 0, 0, newWidth, newHeight);
            };
        }
    }, [image]);

    // Gérer les événements de zoom
    const handleWheel = (e) => {
        const zoomFactor = 0.1; // Facteur de zoom
        const oldZoomLevel = zoomLevel;
        let newZoomLevel = e.deltaY < 0 ? zoomLevel + zoomFactor : zoomLevel - zoomFactor;

        // Limiter le zoom entre minZoom et maxZoom
        newZoomLevel = Math.max(minZoom, Math.min(newZoomLevel, maxZoom));

        // Calculer le point de la souris dans le canvas
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const newOffsetX = offset.x - ((mouseX / canvas.width) * ((canvas.width * newZoomLevel) - (canvas.width * oldZoomLevel)));
        const newOffsetY = offset.y - ((mouseY / canvas.height) * ((canvas.height * newZoomLevel) - (canvas.height * oldZoomLevel)));

        setZoomLevel(newZoomLevel);
        setOffset({ x: newOffsetX, y: newOffsetY });
    };

    // Déplacer l'image en fonction du drag
    const handleMouseDown = (e) => {
        const startX = e.clientX - offset.x;
        const startY = e.clientY - offset.y;//hauteur de l'img

        const handleMouseMove = (moveEvent) => {
            const newOffsetX = moveEvent.clientX - startX;
            const newOffsetY = moveEvent.clientY - startY;

            // Limiter le déplacement pour éviter que l'image sorte du cadre
            const canvas = canvasRef.current;

            // Calculer les limites du déplacement sur l'axe X (gauche et droite)
            const maxOffsetX = Math.max(
                Math.min(newOffsetX, 0), // Empêche l'image de se déplacer à droite (max 0)
                -1 * ((canvas.width * zoomLevel) - canvas.width)
            );

            // Calculer les limites du déplacement sur l'axe Y (haut et bas)
            const maxOffsetY = Math.max(
                Math.min(newOffsetY, 0),
                -1 * ((canvas.height * zoomLevel) - canvas.height)
            );

            // Mettre à jour la position de l'image
            setOffset({ x: maxOffsetX, y: maxOffsetY });
        };

        const handleMouseUp = () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    };


    // Récupérer la couleur d'un pixel cliqué
    const handleCanvasClick = (e) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();

        // Coordonnées de la souris dans le canvas
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Récupérer les données de pixel
        const imageData = ctx.getImageData(mouseX, mouseY, 1, 1).data;
        const [r, g, b] = imageData;

        // Convertir en HEX
        const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
        onColorSelect(hex); // Passer la couleur sélectionnée au parent

    };

    // Gérer le zoom et le déplacement au niveau du canvas
    useEffect(() => {
        if (imageRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            const img = imageRef.current;

            const scaledWidth = canvas.width * zoomLevel;
            const scaledHeight = canvas.height * zoomLevel;

            const maxOffsetX = Math.max(
                Math.min(offset.x, 0), // Empêche l'image de se déplacer à droite (max 0)
                -1 * ((canvas.width * zoomLevel) - canvas.width)
            );

            // Calculer les limites du déplacement sur l'axe Y (haut et bas)
            const maxOffsetY = Math.max(
                Math.min(offset.y, 0),
                -1 * ((canvas.height * zoomLevel) - canvas.height)
            );
            // Effacer le canvas avant de redessiner l'image
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Redessiner l'image avec le zoom et les décalages
            ctx.drawImage(img, maxOffsetX, maxOffsetY, scaledWidth, scaledHeight);

            
        }
    }, [zoomLevel, offset]);

    // Gérer le zoom de la loupe
    const handleMouseMove = (e) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const zoomCanvas = zoomRef.current;
        const zoomSize = 50;  // Taille de la loupe (50px)

        const imageWidth = canvas.width;
        const imageHeight = canvas.height;

        const zoomFactor = Math.min(imageWidth / zoomSize, imageHeight / zoomSize) * 5;

        // Positionner la loupe sur la souris (centrée)
        setZoomStyle({
            visibility: "visible",
            left: `${mouseX+20}px`,
            top: `${mouseY+40}px`,
            backgroundPosition: `-${(((mouseX - offset.x) / zoomLevel) * zoomFactor - zoomSize / 2)}px -${(((mouseY - offset.y) / zoomLevel) * zoomFactor - zoomSize / 2)}px`,  // Déplacer l'image dans la loupe
            backgroundSize: `${canvas.width * zoomFactor}px ${canvas.height * zoomFactor}px`,  // Agrandir l'image sous la loupe
        });
    };

    // Cacher la loupe quand la souris quitte l'image
    const handleMouseOut = () => {
        setZoomStyle({ visibility: "hidden" });
    };

    return (
        <div
            className="input-img "
            ref={containerRef}
            onWheel={handleWheel} // Ajouter l'écouteur pour le zoom
            onMouseDown={handleMouseDown} // Ajouter l'écouteur pour le déplacement
        >
            {image && (
                <div>
                    <canvas
                        ref={canvasRef}
                        onClick={handleCanvasClick}
                        onMouseMove={handleMouseMove}
                        onMouseOut={handleMouseOut}
                        style={{
                            border: "1px solid black",
                            cursor: "crosshair",
                            width: "100%", // Le canvas prend 100% de la largeur de la div parente
                            height: "100%" // Le canvas prend 100% de la hauteur de la div parente
                        }}
                    ></canvas>

                    {/* Loupe */}
                    <div>
                        <canvas
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
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ColorPickerCanvas;
