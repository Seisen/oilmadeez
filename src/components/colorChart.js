import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
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



  // Ajouter le segment "Autres" avec la somme des petites valeurs
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
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
};


export {PieChartWithCustomizedLabel};
