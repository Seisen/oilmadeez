import React, { useState } from 'react';
import axios from 'axios';
import '../styles/ColorMixForm.css'; // Importer le fichier CSS pour le style
const ColorMixForm = () => {
    const [palette, setPalette] = useState({
        rouge: '#FF0000',
        vert: '#00FF00',
        bleu: '#0000FF'
    });
    const [targetColor, setTargetColor] = useState('#FFA500');
    const [mixedColor, setMixedColor] = useState('');
    const [weights, setWeights] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                'https://oilpaintmadeez.onrender.com/mix_colors',
                {
                    palette,
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

    return (
        <div className="container">
            <h1>Mixeur de couleurs</h1>
            <form onSubmit={handleSubmit} className="form">
                <div className="input-container-main">
                    <div className="input-container">
                        <label htmlFor="targetColor">Couleur cible</label>
                        <input
                            type="color"
                            id="targetColor"
                            value={targetColor}
                            onChange={(e) => setTargetColor(e.target.value)}
                        />
                    </div>



                    <div className="input-container">
                        <label htmlFor="palette">Palette de couleurs:</label>
                        <div className="section">

                            <div className="palette">
                                {Object.entries(palette).map(([name, color]) => (
                                    <div key={name} className="color-box" style={{ backgroundColor: color }}>
                                        <span>{name}</span>
                                    </div>
                                ))}

                            </div>
                        </div>
                    </div>
                </div>

                <button type="submit">Mélanger</button>
            </form>

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
    );
};

export default ColorMixForm;