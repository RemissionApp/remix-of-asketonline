import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Crown, Lightbulb, Heart, Star, Zap } from 'lucide-react';

interface RussianMatrixDescriptionProps {
  fullDescription: string;
  name: string;
}

export const RussianMatrixDescription: React.FC<RussianMatrixDescriptionProps> = ({
  fullDescription,
  name
}) => {
  // Split the description into sections for better formatting
  const formatDescription = (text: string) => {
    // Split by common section indicators
    const sections = text.split(/(?=\n\n|\n[А-Я][^а-я]*:|\n\*\*[^*]+\*\*)/);
    
    return sections.filter(section => section.trim()).map((section, index) => {
      const trimmedSection = section.trim();
      
      // Check if it's a header (starts with uppercase and contains colon or is bold)
      if (trimmedSection.match(/^[А-Я][^а-я]*:/) || trimmedSection.match(/^\*\*[^*]+\*\*/)) {
        return {
          type: 'header',
          content: trimmedSection.replace(/\*\*/g, ''),
          id: `section-${index}`
        };
      }
      
      // Check for numbered lists
      if (trimmedSection.match(/^\d+\./)) {
        return {
          type: 'list',
          content: trimmedSection,
          id: `section-${index}`
        };
      }
      
      // Regular paragraph
      return {
        type: 'paragraph',
        content: trimmedSection,
        id: `section-${index}`
      };
    });
  };

  const formattedSections = formatDescription(fullDescription);

  // Get appropriate icon based on section content
  const getSectionIcon = (content: string) => {
    const lowerContent = content.toLowerCase();
    
    if (lowerContent.includes('центральная') || lowerContent.includes('ядро')) {
      return <Crown className="w-5 h-5" />;
    }
    if (lowerContent.includes('деньги') || lowerContent.includes('финанс') || lowerContent.includes('материальн')) {
      return <Star className="w-5 h-5" />;
    }
    if (lowerContent.includes('отношени') || lowerContent.includes('любов') || lowerContent.includes('партнер')) {
      return <Heart className="w-5 h-5" />;
    }
    if (lowerContent.includes('чакр') || lowerContent.includes('энерг')) {
      return <Zap className="w-5 h-5" />;
    }
    if (lowerContent.includes('рекоменд') || lowerContent.includes('совет')) {
      return <Lightbulb className="w-5 h-5" />;
    }
    
    return <Sparkles className="w-5 h-5" />;
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="bg-gradient-to-r from-green-500/20 to-cosmic-accent/20 border-green-500/30">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <div>
              <p className="text-white font-medium">Детальное описание матрицы судьбы готово!</p>
              <p className="text-cosmic-secondary text-sm">Персональный анализ для {name}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Description */}
      <Card className="bg-cosmic-dark/80 backdrop-blur-sm border-cosmic-accent/30">
        <CardHeader>
          <CardTitle className="text-cosmic-accent flex items-center gap-2">
            <Crown className="w-6 h-6" />
            Полный анализ матрицы судьбы
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {formattedSections.map((section, index) => {
            if (section.type === 'header') {
              return (
                <div key={section.id} className="border-l-4 border-cosmic-accent/50 pl-4">
                  <h3 className="text-white font-semibold text-lg flex items-center gap-2 mb-3">
                    {getSectionIcon(section.content)}
                    {section.content.replace(':', '')}
                  </h3>
                </div>
              );
            }
            
            if (section.type === 'list') {
              return (
                <div key={section.id} className="bg-cosmic-dark/50 p-4 rounded-lg">
                  <p className="text-cosmic-text leading-relaxed whitespace-pre-line">
                    {section.content}
                  </p>
                </div>
              );
            }
            
            return (
              <div key={section.id} className="space-y-3">
                <p className="text-cosmic-text leading-relaxed whitespace-pre-line">
                  {section.content}
                </p>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Beautiful formatted text with better styling */}
      <Card className="bg-cosmic-dark/80 backdrop-blur-sm border-cosmic-accent/30">
        <CardContent className="p-6">
          <div className="prose prose-invert max-w-none">
            <div className="text-cosmic-text leading-relaxed space-y-4 whitespace-pre-line">
              {fullDescription.split('\n\n').map((paragraph, index) => (
                <div key={index} className="mb-4">
                  {paragraph.startsWith('**') || paragraph.includes(':') ? (
                    <h4 className="text-white font-semibold text-lg mb-2 flex items-center gap-2">
                      {getSectionIcon(paragraph)}
                      {paragraph.replace(/\*\*/g, '')}
                    </h4>
                  ) : (
                    <p className="text-cosmic-secondary leading-relaxed">
                      {paragraph}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};