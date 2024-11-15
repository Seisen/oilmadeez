import React, { useEffect, useState } from "react";
import axios from 'axios';
import '../styles/ColorMixForm.css';
import { getPalettesByUser } from "../firestore/paletteService";
import { auth } from "../firebase-config";
import ColorPickerCanvas from "./ColorPickerCanvas"; // Importer le nouveau composant

const ColorMixForm = () => {
    const [targetColor, setTargetColor] = useState('#FFA500');
    const [mixedColor, setMixedColor] = useState('');
    const [weights, setWeights] = useState({});
    const [palettes, setPalettes] = useState([]);
    const [selectedPalette, setSelectedPalette] = useState(null); // Palette sélectionnée

    // Récupération des palettes de l'utilisateur connecté
    useEffect(() => {
        const fetchPalettes = async () => {
            const user = auth.currentUser;
            if (!user) return;

            try {
                const userPalettes = await getPalettesByUser(user.uid);
                setPalettes(userPalettes);

                // Définir la première palette comme valeur par défaut
                if (userPalettes.length > 0) {
                    setSelectedPalette(userPalettes[0]);
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des palettes :", error);
            }
        };

        fetchPalettes();
    }, []);

    // Gestion de l'envoi du formulaire
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedPalette) {
            console.error("Aucune palette sélectionnée.");
            return;
        }

        try {
            const response = await axios.post(
                'https://oilpaintmadeez.onrender.com/mix_colors',
                {
                    palette: selectedPalette.colors,
                    target_color: targetColor
                }
            );
            setMixedColor(response.data.mixed_color);
            setWeights(response.data.weights);
        } catch (error) {
            if (error.response) {
                console.error("Erreur de réponse API:", error.response);
            } else if (error.request) {
                console.error("Pas de réponse du serveur:", error.request);
            } else {
                console.error("Erreur lors de la configuration de la requête:", error.message);
            }
        }
    };

    // Gestion de la sélection de la palette
    const handlePaletteChange = (e) => {
        const paletteId = e.target.value;
        const palette = palettes.find((p) => p.id === paletteId);
        setSelectedPalette(palette);
    };

    return (
        <div className="container">
            <h1>Mixeur de couleurs</h1>
            <form onSubmit={handleSubmit} className="form">
                <div className="container-left">
                    <div className="container-target-color">

                        <div className="input-container-target-color">
                            <label className= "input-container-target-color-label" htmlFor="targetColor">Couleur cible</label>
                            <input
                                type="color"
                                id="targetColor"
                                value={targetColor}
                                onChange={(e) => setTargetColor(e.target.value)}
                            />
                        </div>


                        <div className="input-container-from-img">
                            <label htmlFor="targetColor">...depuis une image</label>
                            <ColorPickerCanvas onColorSelect={(color) => setTargetColor(color)} />
                        </div>

                    </div>


                    <div className="container-result">
                        <button type="submit">Mélanger</button>

                        <div className="results">
                            {mixedColor && (
                                <div className="section">
                                    <h2>Couleur mélangée:</h2>
                                    <div className="color-box" style={{ backgroundColor: mixedColor }}>
                                        <span>{mixedColor}</span>
                                    </div>
                                    <h3>Poids des couleurs :</h3>
                                    <pre>{JSON.stringify(weights, null, 2)}</pre>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="container-palette">

                    <div className="input-container-palette">
                        <label htmlFor="palette">Palette</label>

                        <select id="palette" onChange={handlePaletteChange} value={selectedPalette?.id || ""}>
                            {palettes.map((palette) => (
                                <option key={palette.id} value={palette.id}>
                                    {palette.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="palette-preview">
                        {selectedPalette && selectedPalette.colors.map((color) => (
                            <div key={color.hex} className="color-box" style={{ backgroundColor: color.hex }}>
                                <span className="color-box-span">{color.name}</span>
                            </div>
                        ))}
                    </div>

                </div>






















            </form >


        </div >
    );
};

export default ColorMixForm;
