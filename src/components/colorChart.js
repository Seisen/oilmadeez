import React from "react";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, LabelList
} from "recharts";

const PieChartWithCustomizedLabel = ({ weights, palette }) => {
    // Calculer la somme totale des poids
    const totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0);

    // Définir le seuil pour les valeurs insignifiantes (0.01%)
    const threshold = 0.01; // 0.01% du total (0.01 / 100 = 0.0001)

    // Formater les données des poids et des couleurs pour le graphique
    const data = Object.entries(weights).map(([colorName, weight]) => {
        // Trouver la couleur correspondante dans la palette en fonction du nom
        const color = palette.colors.find(c => c.name === colorName)?.hex || "#000000"; // Utiliser un noir par défaut si pas trouvé

        // Si la valeur est inférieure au seuil, on l'ignore
        if (weight / totalWeight < threshold) {
            return null; // On exclut ce segment pour le moment
        }

        return {
            name: colorName,
            value: weight,
            color: color, // Utiliser la couleur de la palette
        };
    }).filter(Boolean);  // Enlever les éléments null (c'est-à-dire les petites valeurs)




    const finalData = [...data];

    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
        const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

        return (
            <text
                x={x}
                y={y}
                fill="white"
                textAnchor={x > cx ? "start" : "end"}
                dominantBaseline="central"
            >
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    return (
        <ResponsiveContainer width="100%" height={400}>
            <PieChart>
                <Pie
                    data={finalData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={150}
                    dataKey="value"
                >
                    {finalData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
            </PieChart>
        </ResponsiveContainer>
    );
};

const TinyBarChart = ({ weights, palette }) => {
    // Filtrer les petites valeurs (moins de 0.01%) et trier par ordre croissant
    const filteredData = Object.entries(weights)
      .filter(([colorName, weight]) => weight >= 0.01) // Ignore les valeurs inférieures à 0.01
      .map(([colorName, weight]) => {
        // Trouver la couleur correspondante dans la palette en fonction du nom
        const color = palette.colors.find(c => c.name === colorName)?.hex || "#000000"; // Utiliser noir par défaut si pas trouvé
        return {
          name: colorName,
          value: weight,
          color: color, // Couleur associée
        };
      })
      .sort((b,a) => a.value - b.value); // Tri par ordre croissant des valeurs
  
    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={filteredData}>
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="value">
            {/* Affichage de la couleur dans la barre */}
            {filteredData.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
  
            {/* Affichage du nom de la couleur et du pourcentage sur chaque barre */}
            <LabelList
              dataKey="name"
              position="insideTop"
              angle={90}  // Pour afficher verticalement
              fill="#000" // Couleur du texte
              fontSize={12}
              fontWeight="bold"
              formatter={(value, entry) => {
                if (!entry) return '';  // Vérification de l'existence de 'entry'
                return `${value}: ${entry.value.toFixed(2)}%`; // Affichage du nom et du pourcentage
              }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  };
  
  // Tooltip personnalisé pour afficher le nom et le pourcentage
  const CustomTooltip = ({ payload }) => {
    if (payload && payload.length > 0) {
      const { name, value, color } = payload[0].payload; // Accès correct aux données du payload
      return (
        <div style={{ backgroundColor: "#fff", padding: '10px', borderRadius: '5px' }}>
          <p style={{ margin: 0, color: '#000' }}>{`${name}: ${value.toFixed(2)}%`}</p>
        </div>
      );
    }
    return null;
  };
  
  

export { PieChartWithCustomizedLabel,TinyBarChart };
