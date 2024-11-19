import React, { useEffect, useState } from "react";
import axios from 'axios';
import '../styles/ColorMixForm.scss';
import { getPalettesByUser } from "../firestore/paletteService";
import { auth } from "../firebase-config";
import ColorPickerCanvas from "./ColorPickerCanvas";
import colourImage from '../assets/colour.png';

import { PieChartWithCustomizedLabel } from './colorChart';
import { ButtonMix } from './componentsColor';
import { TargetColorInput } from './componentsColor';
import { ResultsSection } from './componentsColor';
import { PaletteSection, ButtonImgSelect } from './componentsColor';

const ColorMixForm = () => {
    const [targetColor, setTargetColor] = useState('#FFA500');
    const [mixedColor, setMixedColor] = useState('');
    const [weights, setWeights] = useState({});
    const [palettes, setPalettes] = useState([]);
    const [selectedPalette, setSelectedPalette] = useState(null);
    const [image, setImage] = useState(null); // Stocke l'image uploadée
    useEffect(() => {
        const fetchPalettes = async () => {
            const user = auth.currentUser;
            if (!user) return;

            try {
                const userPalettes = await getPalettesByUser(user.uid);
                setPalettes(userPalettes);
                if (userPalettes.length > 0) {
                    setSelectedPalette(userPalettes[0]);
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des palettes :", error);
            }
        };

        fetchPalettes();
    }, []);

    const handleImageUpload = (imageUrl) => {
        setImage(imageUrl);  // Met à jour l'état avec l'URL de l'image
        console.log("Image URL dans le parent:", imageUrl);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedPalette) return;

        const colorsArray = selectedPalette.colors;
        const acc = colorsArray.reduce((acc, color) => {
            acc[color.name] = color.hex;
            return acc;
        }, {});

        try {
            const response = await axios.post('https://oilpaintmadeez.onrender.com/mix_colors', {
                palette: acc,
                target_color: targetColor
            });
            setMixedColor(response.data.mixed_color);
            setWeights(response.data.weights);
        } catch (error) {
            console.error("Erreur API:", error);
        }
    };

    const handlePaletteChange = (e) => {
        const paletteId = e.target.value;
        const palette = palettes.find((p) => p.id === paletteId);
        setSelectedPalette(palette);
    };

    return (
        <div className="container">
            <h1>Color mixer</h1>

            <form onSubmit={handleSubmit} className="form">
                <div className="container-left">

                    <ColorPickerCanvas onColorSelect={(color) => setTargetColor(color)} image={image} />

                </div>
                <div className="container-right">
                    <div className="container-target-color">
                        <div className="container-target-color-button">
                            <TargetColorInput
                                targetColor={targetColor}
                                onChange={(e) => setTargetColor(e.target.value)}
                            />

                            <ButtonMix
                                imgSrc={colourImage}
                                label="MIX"
                            /></div>
                        <div className="line"></div>

                        <ButtonImgSelect onImageUpload={handleImageUpload} />



                    </div>
                    <PaletteSection
                        palettes={palettes}
                        selectedPalette={selectedPalette}
                        onChange={handlePaletteChange}
                    /></div>
            </form>
        </div>
    );
};

export default ColorMixForm;
