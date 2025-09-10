import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { calculateFullDestinyMatrix, getMatrixNumberMeaning } from '@/utils/numerologyUtils';
import { useIsMobile } from '@/hooks/use-mobile';

interface FullDestinyMatrixProps {
  birthDate: string;
  name?: string;
  language: string;
}

interface MatrixNumberProps {
  number: number;
  x: number;
  y: number;
  size?: number;
  color?: string;
  textColor?: string;
  chakra?: string;
  onClick: (number: number, type: string, position: string) => void;
}

const MatrixNumber: React.FC<MatrixNumberProps> = ({
  number,
  x,
  y,
  size = 20,
  color = 'hsl(var(--muted))',
  textColor = 'hsl(var(--foreground))',
  chakra = '',
  onClick
}) => {
  return (
    <g 
      className="cursor-pointer hover:opacity-80 transition-opacity duration-150"
      onClick={() => onClick(number, 'basic', chakra)}
    >
      <circle
        cx={x}
        cy={y}
        r={size}
        fill={color}
        stroke="hsl(var(--border))"
        strokeWidth="2"
        className="drop-shadow-sm filter"
        style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}
      />
      <text
        x={x}
        y={y + 4}
        textAnchor="middle"
        fontSize="14"
        fontWeight="600"
        fill={textColor}
        className="pointer-events-none select-none"
      >
        {number}
      </text>
    </g>
  );
};

const FullDestinyMatrix: React.FC<FullDestinyMatrixProps> = ({ birthDate, name = '', language }) => {
  const [selectedNumber, setSelectedNumber] = useState<{
    number: number;
    type: string;
    position: string;
  } | null>(null);
  const isMobile = useIsMobile();

  const matrixData = calculateFullDestinyMatrix(birthDate, name);

  const handleNumberClick = (number: number, type: string, position: string) => {
    setSelectedNumber({ number, type, position });
  };

  // SVG dimensions and center
  const svgWidth = 600;
  const svgHeight = 700;
  const centerX = svgWidth / 2;
  const centerY = svgHeight / 2;

  // Define exact positions based on the image layout
  const positions = {
    // Main octagon chakra positions
    crown: { x: centerX, y: centerY - 180 }, // Top (purple/violet) - Sahasrara
    throat: { x: centerX - 140, y: centerY - 90 }, // Left (blue) - Vishuddha  
    heart: { x: centerX + 140, y: centerY - 90 }, // Right (green) - Anahata
    root: { x: centerX, y: centerY + 180 }, // Bottom (red) - Muladhara
    
    // Diagonal positions
    thirdEye: { x: centerX + 90, y: centerY - 140 }, // Top-right (indigo) - Ajna
    solar: { x: centerX + 90, y: centerY + 140 }, // Bottom-right (yellow) - Manipura
    sacral: { x: centerX - 90, y: centerY + 140 }, // Bottom-left (orange) - Svadhisthana
    additional: { x: centerX - 90, y: centerY - 140 }, // Top-left (light blue)

    // Center area
    center: { x: centerX, y: centerY }, // Yellow center circle
    
    // Inner numbers around center
    centerLeft: { x: centerX - 60, y: centerY },
    centerRight: { x: centerX + 60, y: centerY },
    centerTop: { x: centerX, y: centerY - 60 },
    centerBottom: { x: centerX, y: centerY + 60 },

    // Age lines positions (simplified)
    ageTop: { x: centerX, y: 80 },
    ageRight: { x: svgWidth - 80, y: centerY },
    ageBottom: { x: centerX, y: svgHeight - 80 },
    ageLeft: { x: 80, y: centerY },
  };

  // Define chakra colors exactly as in the image
  const chakraColors = {
    crown: '#9333ea', // Purple
    throat: '#3b82f6', // Blue  
    heart: '#10b981', // Green
    root: '#dc2626', // Red
    thirdEye: '#6366f1', // Indigo
    solar: '#f59e0b', // Yellow
    sacral: '#f97316', // Orange
    additional: '#06b6d4' // Light blue
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="relative bg-gradient-to-br from-cosmic-dark/95 via-cosmic/90 to-cosmic-dark/95 rounded-xl p-6 shadow-2xl border border-cosmic-accent/30 overflow-hidden">
        {/* Cosmic background with stars */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-blue-900/20 to-pink-900/30"></div>
          {/* Animated stars */}
          {Array.from({ length: 25 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
          {/* Larger stars */}
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={`large-${i}`}
              className="absolute w-2 h-2 bg-cosmic-accent rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 4}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
        
        <div className="relative z-10">
          <h3 className="text-2xl font-bold text-center mb-6 text-white drop-shadow-lg">
            {language === 'ru' ? 'Матрица Судьбы' : 
             language === 'en' ? 'Destiny Matrix' : 'Matriz del Destino'}
          </h3>
          
          <div className="flex justify-center">
            <svg width={svgWidth} height={svgHeight} viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto filter drop-shadow-lg">
            {/* Background grid and structure */}
            <defs>
              <linearGradient id="moneyChannel" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.1" />
              </linearGradient>
              <linearGradient id="relationshipChannel" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ec4899" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#ec4899" stopOpacity="0.1" />
              </linearGradient>
            </defs>

            {/* Main octagon structure lines */}
            <g stroke="hsl(var(--muted-foreground))" strokeWidth="1" fill="none" opacity="0.3">
              {/* Octagon outline */}
              <polygon points={`
                ${positions.crown.x},${positions.crown.y}
                ${positions.thirdEye.x},${positions.thirdEye.y}
                ${positions.heart.x},${positions.heart.y}
                ${positions.solar.x},${positions.solar.y}
                ${positions.root.x},${positions.root.y}
                ${positions.sacral.x},${positions.sacral.y}
                ${positions.throat.x},${positions.throat.y}
                ${positions.additional.x},${positions.additional.y}
              `} />
              
              {/* Cross lines through center */}
              <line x1={positions.crown.x} y1={positions.crown.y} x2={positions.root.x} y2={positions.root.y} />
              <line x1={positions.throat.x} y1={positions.throat.y} x2={positions.heart.x} y2={positions.heart.y} />
              <line x1={positions.thirdEye.x} y1={positions.thirdEye.y} x2={positions.sacral.x} y2={positions.sacral.y} />
              <line x1={positions.additional.x} y1={positions.additional.y} x2={positions.solar.x} y2={positions.solar.y} />
            </g>

            {/* Channel areas */}
            <rect 
              x={centerX - 30} 
              y={centerY + 100} 
              width="60" 
              height="140" 
              fill="url(#relationshipChannel)" 
              rx="10"
            />
            <rect 
              x={centerX + 80} 
              y={centerY - 70} 
              width="120" 
              height="60" 
              fill="url(#moneyChannel)" 
              rx="10"
            />

            {/* Main chakra positions */}
            <MatrixNumber
              number={matrixData.chakras[0]?.number || 7}
              x={positions.crown.x}
              y={positions.crown.y}
              size={30}
              color={chakraColors.crown}
              textColor="#ffffff"
              chakra="crown"
              onClick={handleNumberClick}
            />
            
            <MatrixNumber
              number={matrixData.chakras[1]?.number || 5}
              x={positions.throat.x}
              y={positions.throat.y}
              size={30}
              color={chakraColors.throat}
              textColor="#ffffff"
              chakra="throat"
              onClick={handleNumberClick}
            />
            
            <MatrixNumber
              number={matrixData.chakras[2]?.number || 4}
              x={positions.heart.x}
              y={positions.heart.y}
              size={30}
              color={chakraColors.heart}
              textColor="#ffffff"
              chakra="heart"
              onClick={handleNumberClick}
            />
            
            <MatrixNumber
              number={matrixData.chakras[3]?.number || 1}
              x={positions.root.x}
              y={positions.root.y}
              size={30}
              color={chakraColors.root}
              textColor="#ffffff"
              chakra="root"
              onClick={handleNumberClick}
            />
            
            <MatrixNumber
              number={matrixData.chakras[4]?.number || 6}
              x={positions.thirdEye.x}
              y={positions.thirdEye.y}
              size={25}
              color={chakraColors.thirdEye}
              textColor="#ffffff"
              chakra="thirdEye"
              onClick={handleNumberClick}
            />
            
            <MatrixNumber
              number={matrixData.chakras[5]?.number || 3}
              x={positions.solar.x}
              y={positions.solar.y}
              size={25}
              color={chakraColors.solar}
              textColor="#000000"
              chakra="solar"
              onClick={handleNumberClick}
            />
            
            <MatrixNumber
              number={matrixData.chakras[6]?.number || 2}
              x={positions.sacral.x}
              y={positions.sacral.y}
              size={25}
              color={chakraColors.sacral}
              textColor="#ffffff"
              chakra="sacral"
              onClick={handleNumberClick}
            />
            
            <MatrixNumber
              number={matrixData.chakras[7]?.number || 8}
              x={positions.additional.x}
              y={positions.additional.y}
              size={25}
              color={chakraColors.additional}
              textColor="#ffffff"
              chakra="additional"
              onClick={handleNumberClick}
            />

            {/* Center destiny number (large yellow circle) */}
            <MatrixNumber
              number={matrixData.destinyCenter}
              x={positions.center.x}
              y={positions.center.y}
              size={35}
              color="#fbbf24"
              textColor="#000000"
              chakra="center"
              onClick={handleNumberClick}
            />

            {/* Numbers around center */}
            {matrixData.centerNumbers.slice(0, 4).map((centerNum, index) => {
              const centerPositions = [
                positions.centerLeft,
                positions.centerRight,
                positions.centerTop,
                positions.centerBottom
              ];
              
              return (
                <MatrixNumber
                  key={`center-${index}`}
                  number={centerNum.number}
                  x={centerPositions[index].x}
                  y={centerPositions[index].y}
                  size={18}
                  color="hsl(var(--muted))"
                  textColor="hsl(var(--foreground))"
                  chakra={centerNum.position}
                  onClick={handleNumberClick}
                />
              );
            })}

            {/* Age lines with three numbers each */}
            {/* Top age line */}
            {matrixData.ageLines[0]?.numbers.slice(0, 3).map((num, i) => (
              <g key={`age-top-${i}`}>
                <MatrixNumber
                  number={num}
                  x={centerX - 60 + i * 60}
                  y={positions.ageTop.y}
                  size={12}
                  color="hsl(var(--background))"
                  textColor="hsl(var(--foreground))"
                  chakra={`age-top-${i}`}
                  onClick={handleNumberClick}
                />
                <text
                  x={centerX - 60 + i * 60}
                  y={positions.ageTop.y + 25}
                  textAnchor="middle"
                  fontSize="8"
                  fill="hsl(var(--muted-foreground))"
                  className="pointer-events-none select-none"
                >
                  {matrixData.ageLines[0]?.ages[i] || (20 + i * 20)}
                </text>
              </g>
            ))}

            {/* Right age line */}
            {matrixData.ageLines[1]?.numbers.slice(0, 3).map((num, i) => (
              <g key={`age-right-${i}`}>
                <MatrixNumber
                  number={num}
                  x={positions.ageRight.x}
                  y={centerY - 60 + i * 60}
                  size={12}
                  color="hsl(var(--background))"
                  textColor="hsl(var(--foreground))"
                  chakra={`age-right-${i}`}
                  onClick={handleNumberClick}
                />
                <text
                  x={positions.ageRight.x + 20}
                  y={centerY - 60 + i * 60 + 3}
                  textAnchor="start"
                  fontSize="8"
                  fill="hsl(var(--muted-foreground))"
                  className="pointer-events-none select-none"
                >
                  {matrixData.ageLines[1]?.ages[i] || (25 + i * 20)}
                </text>
              </g>
            ))}

            {/* Bottom age line */}
            {matrixData.ageLines[2]?.numbers.slice(0, 3).map((num, i) => (
              <g key={`age-bottom-${i}`}>
                <MatrixNumber
                  number={num}
                  x={centerX - 60 + i * 60}
                  y={positions.ageBottom.y}
                  size={12}
                  color="hsl(var(--background))"
                  textColor="hsl(var(--foreground))"
                  chakra={`age-bottom-${i}`}
                  onClick={handleNumberClick}
                />
                <text
                  x={centerX - 60 + i * 60}
                  y={positions.ageBottom.y - 20}
                  textAnchor="middle"
                  fontSize="8"
                  fill="hsl(var(--muted-foreground))"
                  className="pointer-events-none select-none"
                >
                  {matrixData.ageLines[2]?.ages[i] || (30 + i * 20)}
                </text>
              </g>
            ))}

            {/* Left age line */}
            {matrixData.ageLines[3]?.numbers.slice(0, 3).map((num, i) => (
              <g key={`age-left-${i}`}>
                <MatrixNumber
                  number={num}
                  x={positions.ageLeft.x}
                  y={centerY - 60 + i * 60}
                  size={12}
                  color="hsl(var(--background))"
                  textColor="hsl(var(--foreground))"
                  chakra={`age-left-${i}`}
                  onClick={handleNumberClick}
                />
                <text
                  x={positions.ageLeft.x - 20}
                  y={centerY - 60 + i * 60 + 3}
                  textAnchor="end"
                  fontSize="8"
                  fill="hsl(var(--muted-foreground))"
                  className="pointer-events-none select-none"
                >
                  {matrixData.ageLines[3]?.ages[i] || (35 + i * 20)}
                </text>
              </g>
            ))}

            {/* Channel labels */}
            <text 
              x={centerX} 
              y={centerY + 210} 
              textAnchor="middle" 
              fontSize="12" 
              fill="#ec4899" 
              fontWeight="600"
              className="select-none"
            >
              {language === 'ru' ? 'Канал отношений' : 
               language === 'en' ? 'Relationship Channel' : 'Canal de Relaciones'}
            </text>
            
            <text 
              x={centerX + 160} 
              y={centerY + 5} 
              textAnchor="middle" 
              fontSize="12" 
              fill="#06b6d4" 
              fontWeight="600"
              className="select-none"
              transform={`rotate(90 ${centerX + 160} ${centerY})`}
            >
              {language === 'ru' ? 'Денежный канал' : 
               language === 'en' ? 'Money Channel' : 'Canal del Dinero'}
            </text>
          </svg>
          </div>
        </div>
      </div>

      {/* Detail modal */}
      {!isMobile && (
        <Dialog open={!!selectedNumber} onOpenChange={() => setSelectedNumber(null)}>
          <DialogContent className="max-w-md bg-cosmic-dark/95 border-cosmic-accent/30">
          <DialogHeader>
            <DialogTitle className="text-cosmic-accent">
              {selectedNumber && getPositionName(selectedNumber.position)}
            </DialogTitle>
          </DialogHeader>
          
          {selectedNumber && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-cosmic-accent/20 border-2 border-cosmic-accent flex items-center justify-center text-cosmic-accent text-2xl font-bold mx-auto mb-4">
                  {selectedNumber.number}
                </div>
              </div>
              
              <div className="space-y-2">
                {(() => {
                  const meaning = getMatrixNumberMeaning(selectedNumber.number, 'basic', language);
                  return (
                    <>
                      <h4 className="font-semibold text-white">
                        {meaning.title[language as keyof typeof meaning.title]}
                      </h4>
                      <p className="text-cosmic-secondary text-sm">
                        {meaning.description[language as keyof typeof meaning.description]}
                      </p>
                    </>
                  );
                })()}
              </div>
            </div>
          )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );

  function getPositionName(position: string): string {
    const positions: Record<string, Record<string, string>> = {
      ru: {
        'crown': 'Сахасрара (Корона)',
        'throat': 'Вишуддха (Горло)', 
        'heart': 'Анахата (Сердце)',
        'root': 'Муладхара (Корень)',
        'thirdEye': 'Аджна (Третий глаз)',
        'solar': 'Манипура (Солнечное сплетение)',
        'sacral': 'Свадхистана (Крестец)',
        'additional': 'Дополнительная чакра',
        'center': 'Центр судьбы'
      },
      en: {
        'crown': 'Sahasrara (Crown)',
        'throat': 'Vishuddha (Throat)',
        'heart': 'Anahata (Heart)', 
        'root': 'Muladhara (Root)',
        'thirdEye': 'Ajna (Third Eye)',
        'solar': 'Manipura (Solar Plexus)',
        'sacral': 'Svadhisthana (Sacral)',
        'additional': 'Additional Chakra',
        'center': 'Destiny Center'
      },
      es: {
        'crown': 'Sahasrara (Corona)',
        'throat': 'Vishuddha (Garganta)',
        'heart': 'Anahata (Corazón)',
        'root': 'Muladhara (Raíz)', 
        'thirdEye': 'Ajna (Tercer Ojo)',
        'solar': 'Manipura (Plexo Solar)',
        'sacral': 'Svadhisthana (Sacro)',
        'additional': 'Chakra Adicional',
        'center': 'Centro del Destino'
      }
    };

    return positions[language]?.[position] || position;
  }
};

export default FullDestinyMatrix;