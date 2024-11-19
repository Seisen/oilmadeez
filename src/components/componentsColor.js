import React, { useState } from "react";
import { PieChartWithCustomizedLabel, TinyBarChart } from './colorChart';
// Composant pour le bouton "Mix"
const ButtonMix = ({ onClick, imgSrc, label }) => (
    <button type="submit" id="mix" onClick={onClick}>
        <img src={imgSrc} alt="Color Button" />
        <span>{label}</span>
    </button>
);

// Composant pour la sélection de la couleur cible
const TargetColorInput = ({ targetColor, onChange }) => (
    <div className="input-container-target-color">

        <label htmlFor="targetColor">Target color</label>
        <input
            type="color"
            id="targetColor"
            value={targetColor}
            onChange={onChange}
        />
    </div>
);

const ResultsSection = ({ mixedColor, weights, selectedPalette }) => (
    <div className="results">
        {mixedColor && (
            <div className="section">
                {weights && selectedPalette && Object.keys(weights).length > 0 && (
                    <PieChartWithCustomizedLabel weights={weights} palette={selectedPalette} />
                )}
                <TinyBarChart weights={weights} palette={selectedPalette} />
            </div>
        )}
    </div>
);

const ButtonImgSelect = ({ onImageUpload}) => {
    // Gestion de l'upload d'une image
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            onImageUpload(imageUrl);
        }
    };
    return (
        <div className="container-div">
            <input
                type="file"
                id="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
            />
            <label for="file" class="btn" id="imageUpload">Select Image</label>
        </div>

    )
};

// Composant pour afficher les palettes
const PaletteSection = ({ palettes, selectedPalette, onChange }) => {
    const [activeTab, setActiveTab] = useState(1); // État pour gérer l'onglet actif

    return (
        <div className="container-palette">
            <div className="title-palette">
                <h2>PALETTE</h2>
                <div className="menu-palette">
                    <button
                        className={`button ${activeTab === 1 ? "active" : ""}`}
                        onClick={() => setActiveTab(1)}
                    >
                        Palette
                    </button>
                    <button
                        className={`button ${activeTab === 2 ? "active" : ""}`}
                        onClick={() => setActiveTab(2)}
                    >
                        Onglet 2
                    </button>
                    <button
                        className={`button ${activeTab === 3 ? "active" : ""}`}
                        onClick={() => setActiveTab(3)}
                    >
                        Onglet 3
                    </button>
                </div>
            </div>

            {activeTab === 1 && (

                <div className="inner">
                    <div className="input-container-palette">
                        <select id="palette" onChange={onChange} value={selectedPalette?.id || ""}>
                            {palettes.map((palette) => (
                                <option key={palette.id} value={palette.id}>
                                    {palette.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="palette-preview">
                        {selectedPalette && selectedPalette.colors.map((color) => (
                            <div className="container-colorbox" key={color.hex}>
                                <div className="color-box">
                                    <span className="color-box-span">{color.name}</span>
                                    <div className="color-box-view" style={{ backgroundColor: color.hex }} />
                                </div>
                                <div className="line" />
                            </div>
                        ))}
                    </div>
                </div>)}
        </div>
    );
};
export { PaletteSection, ResultsSection, TargetColorInput, ButtonMix, ButtonImgSelect };
