import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { calculateFullDestinyMatrix, getMatrixNumberMeaning, type FullDestinyMatrixData, type ChakraNumber } from '@/utils/numerologyUtils';

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
  size = 35,
  color = '#ffffff',
  textColor = '#000000',
  chakra = '',
  onClick
}) => {
  return (
    <g 
      className="cursor-pointer transition-all duration-200 hover:scale-110"
      onClick={() => onClick(number, 'basic', chakra)}
    >
      <circle
        cx={x}
        cy={y}
        r={size}
        fill={color}
        stroke="#ffffff"
        strokeWidth="2"
        className="drop-shadow-md filter"
      />
      <text
        x={x}
        y={y + 5}
        textAnchor="middle"
        fontSize="18"
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

  const matrixData = calculateFullDestinyMatrix(birthDate, name);

  const handleNumberClick = (number: number, type: string, position: string) => {
    setSelectedNumber({ number, type, position });
  };

  const getPositionName = (position: string): string => {
    const positions: Record<string, Record<string, string>> = {
      ru: {
        'top': 'Сахасрара (Корона)',
        'top-right': 'Аджна (Третий глаз)',
        'right': 'Анахата (Сердце)',
        'bottom-right': 'Манипура (Солнечное сплетение)',
        'bottom': 'Муладхара (Корень)',
        'bottom-left': 'Свадхистана (Крестец)',
        'left': 'Вишуддха (Горло)',
        'top-left': 'Дополнительная чакра',
        'center': 'Центр судьбы',
        'relationship-channel': 'Канал отношений',
        'money-channel': 'Денежный канал'
      },
      en: {
        'top': 'Sahasrara (Crown)',
        'top-right': 'Ajna (Third Eye)',
        'right': 'Anahata (Heart)',
        'bottom-right': 'Manipura (Solar Plexus)',
        'bottom': 'Muladhara (Root)',
        'bottom-left': 'Svadhisthana (Sacral)',
        'left': 'Vishuddha (Throat)',
        'top-left': 'Additional Chakra',
        'center': 'Destiny Center',
        'relationship-channel': 'Relationship Channel',
        'money-channel': 'Money Channel'
      },
      es: {
        'top': 'Sahasrara (Corona)',
        'top-right': 'Ajna (Tercer Ojo)',
        'right': 'Anahata (Corazón)',
        'bottom-right': 'Manipura (Plexo Solar)',
        'bottom': 'Muladhara (Raíz)',
        'bottom-left': 'Svadhisthana (Sacro)',
        'left': 'Vishuddha (Garganta)',
        'top-left': 'Chakra Adicional',
        'center': 'Centro del Destino',
        'relationship-channel': 'Canal de Relaciones',
        'money-channel': 'Canal del Dinero'
      }
    };

    return positions[language]?.[position] || position;
  };

  // SVG dimensions and center
  const svgSize = 800;
  const center = svgSize / 2;
  const octagonRadius = 250;
  const innerRadius = 120;

  // Calculate octagon vertices
  const getOctagonPoint = (index: number, radius: number) => {
    const angle = (index * Math.PI * 2) / 8 - Math.PI / 2; // Start from top
    return {
      x: center + Math.cos(angle) * radius,
      y: center + Math.sin(angle) * radius
    };
  };

  // Chakra positions around octagon
  const chakraPositions = matrixData.chakras.map((chakra, index) => ({
    ...chakra,
    ...getOctagonPoint(index, octagonRadius)
  }));

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="bg-card rounded-xl p-6 shadow-xl">
        <h3 className="text-2xl font-bold text-center mb-6 text-cosmic-foreground">
          {language === 'ru' ? 'Матрица Судьбы' : 
           language === 'en' ? 'Destiny Matrix' : 'Matriz del Destino'}
        </h3>
        
        <div className="flex justify-center">
          <svg width={svgSize} height={svgSize} viewBox={`0 0 ${svgSize} ${svgSize}`} className="w-full h-auto max-w-3xl">
            {/* Background octagon lines */}
            <g stroke="#e5e7eb" strokeWidth="2" fill="none">
              {/* Outer octagon */}
              <polygon 
                points={Array.from({ length: 8 }, (_, i) => {
                  const point = getOctagonPoint(i, octagonRadius);
                  return `${point.x},${point.y}`;
                }).join(' ')}
                className="opacity-30"
              />
              
              {/* Inner octagon */}
              <polygon 
                points={Array.from({ length: 8 }, (_, i) => {
                  const point = getOctagonPoint(i, innerRadius);
                  return `${point.x},${point.y}`;
                }).join(' ')}
                className="opacity-20"
              />

              {/* Connection lines from chakras to center */}
              {chakraPositions.map((chakra, index) => (
                <line
                  key={`line-${index}`}
                  x1={chakra.x}
                  y1={chakra.y}
                  x2={center}
                  y2={center}
                  className="opacity-20"
                />
              ))}
            </g>

            {/* Colored channel areas */}
            <defs>
              <radialGradient id="relationshipGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ec4899" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#ec4899" stopOpacity="0.1" />
              </radialGradient>
              <radialGradient id="moneyGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.1" />
              </radialGradient>
            </defs>

            {/* Relationship channel (bottom area) */}
            <path
              d={`M ${center - 80} ${center + 40} L ${center + 80} ${center + 40} L ${getOctagonPoint(4, octagonRadius).x} ${getOctagonPoint(4, octagonRadius).y} Z`}
              fill="url(#relationshipGradient)"
              stroke="#ec4899"
              strokeWidth="1"
              className="opacity-60"
            />

            {/* Money channel (right area) */}
            <path
              d={`M ${center + 40} ${center - 80} L ${center + 40} ${center + 80} L ${getOctagonPoint(2, octagonRadius).x} ${getOctagonPoint(2, octagonRadius).y} Z`}
              fill="url(#moneyGradient)"
              stroke="#06b6d4"
              strokeWidth="1"
              className="opacity-60"
            />

            {/* Main chakra numbers */}
            {chakraPositions.map((chakra, index) => (
              <MatrixNumber
                key={`chakra-${index}`}
                number={chakra.number}
                x={chakra.x}
                y={chakra.y}
                size={40}
                color={chakra.color}
                textColor="#ffffff"
                chakra={chakra.position}
                onClick={handleNumberClick}
              />
            ))}

            {/* Center destiny number */}
            <MatrixNumber
              number={matrixData.destinyCenter}
              x={center}
              y={center}
              size={50}
              color="#fbbf24"
              textColor="#000000"
              chakra="center"
              onClick={handleNumberClick}
            />

            {/* Center numbers around destiny */}
            {matrixData.centerNumbers.map((centerNum, index) => {
              const positions = [
                { x: center - 80, y: center - 30 }, // left-top
                { x: center - 80, y: center + 30 }, // left-bottom
                { x: center + 80, y: center - 30 }, // right-top
                { x: center + 80, y: center },      // right-middle
                { x: center + 80, y: center + 30 }  // right-bottom
              ];
              
              return (
                <MatrixNumber
                  key={`center-${index}`}
                  number={centerNum.number}
                  x={positions[index].x}
                  y={positions[index].y}
                  size={25}
                  color="#f3f4f6"
                  textColor="#000000"
                  chakra={centerNum.position}
                  onClick={handleNumberClick}
                />
              );
            })}

            {/* Corner numbers */}
            {matrixData.cornerNumbers.map((cornerNum, index) => {
              const cornerPositions = [
                { x: center - 300, y: center - 300 }, // top-left
                { x: center + 300, y: center - 300 }, // top-right
                { x: center + 300, y: center + 300 }, // bottom-right
                { x: center - 300, y: center + 300 }  // bottom-left
              ];
              
              return (
                <MatrixNumber
                  key={`corner-${index}`}
                  number={cornerNum}
                  x={cornerPositions[index].x}
                  y={cornerPositions[index].y}
                  size={30}
                  color="#e5e7eb"
                  textColor="#000000"
                  chakra={`corner-${index}`}
                  onClick={handleNumberClick}
                />
              );
            })}

            {/* Age line numbers (simplified - showing only a few) */}
            {matrixData.ageLines.slice(0, 4).map((ageLine, lineIndex) => 
              ageLine.numbers.map((num, numIndex) => {
                const startPoint = getOctagonPoint(lineIndex * 2, octagonRadius);
                const endPoint = getOctagonPoint((lineIndex * 2 + 2) % 8, octagonRadius);
                const t = (numIndex + 1) / 4;
                const x = startPoint.x + (endPoint.x - startPoint.x) * t;
                const y = startPoint.y + (endPoint.y - startPoint.y) * t;
                
                return (
                  <g key={`age-${lineIndex}-${numIndex}`}>
                    <MatrixNumber
                      number={num}
                      x={x}
                      y={y}
                      size={15}
                      color="#f9fafb"
                      textColor="#000000"
                      chakra={`age-${ageLine.ages[numIndex]}`}
                      onClick={handleNumberClick}
                    />
                    <text
                      x={x}
                      y={y + 35}
                      textAnchor="middle"
                      fontSize="10"
                      fill="#6b7280"
                      className="pointer-events-none select-none"
                    >
                      {ageLine.ages[numIndex]}
                    </text>
                  </g>
                );
              })
            )}

            {/* Channel labels */}
            <text x={center} y={center + 200} textAnchor="middle" fontSize="14" fill="#ec4899" fontWeight="600">
              {language === 'ru' ? 'Канал отношений' : 
               language === 'en' ? 'Relationship Channel' : 'Canal de Relaciones'}
            </text>
            
            <text x={center + 200} y={center} textAnchor="middle" fontSize="14" fill="#06b6d4" fontWeight="600" transform={`rotate(90 ${center + 200} ${center})`}>
              {language === 'ru' ? 'Денежный канал' : 
               language === 'en' ? 'Money Channel' : 'Canal del Dinero'}
            </text>
          </svg>
        </div>
      </div>

      {/* Detail modal */}
      <Dialog open={!!selectedNumber} onOpenChange={() => setSelectedNumber(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-cosmic-foreground">
              {selectedNumber && getPositionName(selectedNumber.position)}
            </DialogTitle>
          </DialogHeader>
          
          {selectedNumber && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-cosmic-accent flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  {selectedNumber.number}
                </div>
              </div>
              
              <div className="space-y-2">
                {(() => {
                  const meaning = getMatrixNumberMeaning(selectedNumber.number, 'basic', language);
                  return (
                    <>
                      <h4 className="font-semibold text-cosmic-foreground">
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
    </div>
  );
};

export default FullDestinyMatrix;