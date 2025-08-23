import React, { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { useCosmicArtifacts } from '@/hooks/useCosmicArtifacts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Star, Zap, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

export const ArtifactCollectionPage: React.FC = () => {
  const { language } = useAppStore();
  const navigate = useNavigate();
  const { artifacts, isLoading, toggleArtifact, isToggling, activeArtifacts, artifactsByRarity } = useCosmicArtifacts();
  const [selectedTab, setSelectedTab] = useState('all');

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
      case 'rare':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'epic':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'legendary':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'crystal':
        return '💎';
      case 'amulet':
        return '🔮';
      case 'mantra':
        return '📿';
      default:
        return '✨';
    }
  };

  const getRarityStars = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 1;
      case 'rare':
        return 2;
      case 'epic':
        return 3;
      case 'legendary':
        return 4;
      default:
        return 1;
    }
  };

  const filteredArtifacts = artifacts?.filter(artifact => {
    if (selectedTab === 'all') return true;
    if (selectedTab === 'active') return artifact.is_active;
    return artifact.rarity === selectedTab;
  }) || [];

  const rarityTabs = ['common', 'rare', 'epic', 'legendary'];

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-cosmic-accent/20 rounded w-1/3"></div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-cosmic-accent/10 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="text-cosmic-silver hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {language === 'ru' ? 'Назад' : language === 'es' ? 'Volver' : 'Back'}
        </Button>
        
        <div>
          <h1 className="text-3xl font-bold text-cosmic-gold">
            🏆 {language === 'ru' ? 'Коллекция артефактов' : language === 'es' ? 'Colección de artefactos' : 'Artifact Collection'}
          </h1>
          <p className="text-cosmic-silver">
            {language === 'ru' 
              ? `Всего артефактов: ${artifacts?.length || 0} | Активных: ${activeArtifacts.length}`
              : language === 'es' 
              ? `Total de artefactos: ${artifacts?.length || 0} | Activos: ${activeArtifacts.length}`
              : `Total artifacts: ${artifacts?.length || 0} | Active: ${activeArtifacts.length}`}
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {rarityTabs.map(rarity => (
          <Card key={rarity} className="bg-cosmic-dark/50 border-cosmic-accent/30">
            <CardContent className="p-4 text-center">
              <div className={cn("text-2xl font-bold", getRarityColor(rarity).split(' ')[2])}>
                {artifactsByRarity[rarity] || 0}
              </div>
              <div className="text-xs text-cosmic-silver capitalize">
                {rarity}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="bg-cosmic-dark border-cosmic-accent/30">
          <TabsTrigger value="all" className="data-[state=active]:bg-cosmic-accent">
            {language === 'ru' ? 'Все' : language === 'es' ? 'Todos' : 'All'}
          </TabsTrigger>
          <TabsTrigger value="active" className="data-[state=active]:bg-cosmic-accent">
            {language === 'ru' ? 'Активные' : language === 'es' ? 'Activos' : 'Active'}
          </TabsTrigger>
          {rarityTabs.map(rarity => (
            <TabsTrigger 
              key={rarity} 
              value={rarity} 
              className="data-[state=active]:bg-cosmic-accent capitalize"
            >
              {rarity}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedTab} className="space-y-4">
          {filteredArtifacts.length === 0 ? (
            <Card className="bg-cosmic-dark/50 border-cosmic-accent/30">
              <CardContent className="p-8 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-cosmic-gold mb-2">
                  {language === 'ru' ? 'Артефакты не найдены' : language === 'es' ? 'No se encontraron artefactos' : 'No artifacts found'}
                </h3>
                <p className="text-cosmic-silver">
                  {language === 'ru' 
                    ? 'Завершайте миссии, чтобы получить космические артефакты!'
                    : language === 'es' 
                    ? '¡Completa misiones para obtener artefactos cósmicos!'
                    : 'Complete missions to obtain cosmic artifacts!'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredArtifacts.map((artifact) => (
                <Card 
                  key={artifact.id} 
                  className={cn(
                    "bg-cosmic-dark/50 border transition-all duration-200 hover:scale-[1.02]",
                    artifact.is_active 
                      ? "border-cosmic-gold/50 shadow-cosmic-gold/20 shadow-lg" 
                      : "border-cosmic-accent/30"
                  )}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{getTypeIcon(artifact.type)}</span>
                        <div>
                          <CardTitle className="text-lg text-cosmic-gold">
                            {artifact.name}
                          </CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={getRarityColor(artifact.rarity)}>
                              {artifact.rarity}
                            </Badge>
                            <div className="flex">
                              {[...Array(getRarityStars(artifact.rarity))].map((_, i) => (
                                <Star key={i} className="w-3 h-3 fill-current text-yellow-400" />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={artifact.is_active}
                          onCheckedChange={(checked) => toggleArtifact({ artifactId: artifact.artifact_id, isActive: checked })}
                          disabled={isToggling}
                        />
                        {artifact.is_active ? (
                          <Eye className="w-4 h-4 text-cosmic-gold" />
                        ) : (
                          <EyeOff className="w-4 h-4 text-cosmic-silver" />
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-cosmic-silver text-sm">
                      {artifact.description}
                    </p>
                    
                    {artifact.effects && artifact.effects.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-medium text-cosmic-accent flex items-center gap-1">
                          <Zap className="w-4 h-4" />
                          {language === 'ru' ? 'Эффекты:' : language === 'es' ? 'Efectos:' : 'Effects:'}
                        </h4>
                        <div className="space-y-1">
                          {artifact.effects.map((effect, index) => (
                            <div key={index} className="text-xs text-cosmic-silver flex items-center gap-2">
                              <span className="text-cosmic-accent">•</span>
                              <span>{effect}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {artifact.obtained_from_mission && (
                      <div className="text-xs text-cosmic-silver/70">
                        {language === 'ru' ? 'Получено из миссии:' : language === 'es' ? 'Obtenido de la misión:' : 'Obtained from mission:'} {artifact.obtained_from_mission}
                      </div>
                    )}
                    
                    <div className="text-xs text-cosmic-silver/50">
                      {language === 'ru' ? 'Получено:' : language === 'es' ? 'Obtenido:' : 'Obtained:'} {new Date(artifact.obtained_at).toLocaleDateString()}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};