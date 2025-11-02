import { useMemo } from 'react';

interface RouletteWheelProps {
  highlightedNumber?: number;
  neighbors?: number[];
  size?: number;
}

// Ordem dos números na roleta europeia
const ROULETTE_ORDER = [
  0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10,
  5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26
];

// Cores dos números
const NUMBER_COLORS: { [key: number]: string } = {
  0: 'green',
  1: 'red', 2: 'black', 3: 'red', 4: 'black', 5: 'red', 6: 'black', 7: 'red', 8: 'black', 9: 'red', 10: 'black',
  11: 'black', 12: 'red', 13: 'black', 14: 'red', 15: 'black', 16: 'red', 17: 'black', 18: 'red', 19: 'red', 20: 'black',
  21: 'red', 22: 'black', 23: 'red', 24: 'black', 25: 'red', 26: 'black', 27: 'red', 28: 'black', 29: 'black', 30: 'red',
  31: 'black', 32: 'red', 33: 'black', 34: 'red', 35: 'black', 36: 'red'
};

export default function RouletteWheel({ highlightedNumber, neighbors = [], size = 300 }: RouletteWheelProps) {
  const radius = size / 2;
  const centerX = radius;
  const centerY = radius;
  const outerRadius = radius * 0.9;
  const innerRadius = radius * 0.6;

  // Calcular posições dos números
  const numberPositions = useMemo(() => {
    return ROULETTE_ORDER.map((number, index) => {
      const angle = (index / ROULETTE_ORDER.length) * 2 * Math.PI - Math.PI / 2;
      const textRadius = (outerRadius + innerRadius) / 2;
      const x = centerX + textRadius * Math.cos(angle);
      const y = centerY + textRadius * Math.sin(angle);
      
      return {
        number,
        x,
        y,
        angle,
        color: NUMBER_COLORS[number],
        isHighlighted: number === highlightedNumber,
        isNeighbor: neighbors.includes(number),
      };
    });
  }, [highlightedNumber, neighbors, centerX, centerY, outerRadius, innerRadius]);

  // Criar segmentos da roda
  const segments = useMemo(() => {
    return ROULETTE_ORDER.map((number, index) => {
      const startAngle = (index / ROULETTE_ORDER.length) * 2 * Math.PI - Math.PI / 2;
      const endAngle = ((index + 1) / ROULETTE_ORDER.length) * 2 * Math.PI - Math.PI / 2;
      
      const x1 = centerX + outerRadius * Math.cos(startAngle);
      const y1 = centerY + outerRadius * Math.sin(startAngle);
      const x2 = centerX + outerRadius * Math.cos(endAngle);
      const y2 = centerY + outerRadius * Math.sin(endAngle);
      const x3 = centerX + innerRadius * Math.cos(endAngle);
      const y3 = centerY + innerRadius * Math.sin(endAngle);
      const x4 = centerX + innerRadius * Math.cos(startAngle);
      const y4 = centerY + innerRadius * Math.sin(startAngle);
      
      const pathData = `M ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 0 0 ${x4} ${y4} Z`;
      
      const color = NUMBER_COLORS[number];
      const isHighlighted = number === highlightedNumber;
      const isNeighbor = neighbors.includes(number);
      
      let fillColor = color === 'red' ? '#ef4444' : color === 'black' ? '#1f2937' : '#10b981';
      
      if (isHighlighted) {
        fillColor = '#fbbf24'; // Amarelo para destacado
      } else if (isNeighbor) {
        fillColor = '#8b5cf6'; // Roxo para vizinhos
      }
      
      return {
        number,
        pathData,
        fillColor,
        isHighlighted,
        isNeighbor,
      };
    });
  }, [highlightedNumber, neighbors, centerX, centerY, outerRadius, innerRadius]);

  return (
    <div className="flex flex-col items-center gap-4">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="drop-shadow-2xl"
      >
        {/* Fundo da roda */}
        <circle
          cx={centerX}
          cy={centerY}
          r={outerRadius}
          fill="#1e293b"
          stroke="#475569"
          strokeWidth="2"
        />
        
        {/* Segmentos */}
        {segments.map((segment) => (
          <g key={segment.number}>
            <path
              d={segment.pathData}
              fill={segment.fillColor}
              stroke="#1e293b"
              strokeWidth="1"
              className={`transition-all duration-300 ${
                segment.isHighlighted ? 'drop-shadow-lg' : ''
              }`}
            />
          </g>
        ))}
        
        {/* Números */}
        {numberPositions.map((pos) => (
          <text
            key={pos.number}
            x={pos.x}
            y={pos.y}
            textAnchor="middle"
            dominantBaseline="middle"
            className={`font-bold transition-all duration-300 ${
              pos.isHighlighted ? 'text-lg' : 'text-xs'
            }`}
            fill={pos.isHighlighted || pos.isNeighbor ? '#ffffff' : '#e5e7eb'}
            fontSize={pos.isHighlighted ? '16' : '12'}
          >
            {pos.number}
          </text>
        ))}
        
        {/* Centro da roda */}
        <circle
          cx={centerX}
          cy={centerY}
          r={innerRadius * 0.3}
          fill="#1e293b"
          stroke="#fbbf24"
          strokeWidth="3"
        />
        
        <text
          x={centerX}
          y={centerY}
          textAnchor="middle"
          dominantBaseline="middle"
          className="font-bold text-yellow-400"
          fontSize="20"
        >
          {highlightedNumber !== undefined ? highlightedNumber : '?'}
        </text>
      </svg>
      
      {/* Legenda */}
      <div className="flex gap-4 text-sm">
        {highlightedNumber !== undefined && (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
            <span className="text-gray-300">Recomendado</span>
          </div>
        )}
        {neighbors.length > 0 && (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
            <span className="text-gray-300">Vizinhos</span>
          </div>
        )}
      </div>
    </div>
  );
}
