import React from 'react';
import {PieChartWithCustomizedLabel} from './colorChart';
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
        <label htmlFor="targetColor">Couleur cible</label>
        <input
            type="color"
            id="targetColor"
            value={targetColor}
            onChange={onChange}
        />
    </div>
);
//<div className="container-result-color">
//<label>Couleur mélangée :</label>
//<div className="result-color" style={{ backgroundColor: mixedColor }}>
//    <span>{mixedColor}</span>
//</div>
//</div>
//<h3>Poids des couleurs :</h3>
//<pre>{JSON.stringify(weights, null, 2)}</pre>
// Composant pour la section résultats
const ResultsSection = ({ mixedColor, weights,selectedPalette }) => (
    <div className="results">
        {mixedColor && (
            <div className="section">
                {weights && selectedPalette && Object.keys(weights).length > 0 && (
                                    <PieChartWithCustomizedLabel weights={weights} palette={selectedPalette} />
                                )}
            </div>
        )}
    </div>
);

// Composant pour afficher les palettes
const PaletteSection = ({ palettes, selectedPalette, onChange }) => (
    <div className="container-palette">
        <h2>PALETTE</h2>
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
        </div>
    </div>
);
export  { PaletteSection,ResultsSection,TargetColorInput,ButtonMix};
