import React, { useState, useEffect } from 'react';
import { Plus, Filter, Search, Grid3X3, List } from 'lucide-react';
import { StarField } from '@/components/StarField';
import { PageHeader } from '@/components/ui/PageHeader';
import { BottomNavigation } from '@/components/BottomNavigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppStore } from '@/store/useAppStore';
import { PactCard } from '@/components/pacts/PactCard';
import { PactCreationForm } from '@/components/pacts/PactCreationForm';
import { NoPactsView } from '@/components/NoPactsView';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const PactsPage: React.FC = () => {
  const { pacts, addPact, language } = useAppStore();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const getText = (key: string) => {
    const texts = {
      ru: {
        title: 'Мои аскезы',
        search: 'Поиск аскез...',
        filter: 'Фильтр',
        viewMode: 'Вид',
        all: 'Все',
        active: 'Активные',
        completed: 'Завершённые',
        failed: 'Прерванные',
        health: 'Здоровье',
        energy: 'Энергия',
        protection: 'Защита',
        spiritual: 'Духовная',
        general: 'Общая',
        createNew: 'Создать аскезу'
      },
      es: {
        title: 'Mis ascesis',
        search: 'Buscar ascesis...',
        filter: 'Filtro',
        viewMode: 'Vista',
        all: 'Todas',
        active: 'Activas',
        completed: 'Completadas',
        failed: 'Interrumpidas',
        health: 'Salud',
        energy: 'Energía',
        protection: 'Protección',
        spiritual: 'Espiritual',
        general: 'General',
        createNew: 'Crear ascesis'
      },
      en: {
        title: 'My Ascesis',
        search: 'Search ascesis...',
        filter: 'Filter',
        viewMode: 'View',
        all: 'All',
        active: 'Active',
        completed: 'Completed',
        failed: 'Failed',
        health: 'Health',
        energy: 'Energy',
        protection: 'Protection',
        spiritual: 'Spiritual',
        general: 'General',
        createNew: 'Create Ascesis'
      }
    };
    return texts[language][key] || texts.en[key];
  };

  // Filter pacts based on search and filters
  const filteredPacts = pacts.filter(pact => {
    const matchesSearch = pact.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (pact.reward && pact.reward.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesType = filterType === 'all' || pact.type === filterType;
    const matchesStatus = filterStatus === 'all' || pact.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  // Sort pacts - active first, then by creation date
  const sortedPacts = [...filteredPacts].sort((a, b) => {
    if (a.status === 'active' && b.status !== 'active') return -1;
    if (b.status === 'active' && a.status !== 'active') return 1;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const handleCreatePact = (pactData: any) => {
    addPact({
      title: pactData.title,
      duration: pactData.duration,
      reward: pactData.reward,
      type: pactData.type,
      status: 'active'
    });
    setShowCreateForm(false);
  };

  if (showCreateForm) {
    return (
      <div className="min-h-screen flex flex-col relative pb-20">
        <StarField starCount={100} />
        
        <PageHeader 
          title={getText('createNew')}
          onBack={() => setShowCreateForm(false)}
        />

        <div className="relative z-10 flex-1 container mx-auto px-4 pt-20 py-8 max-w-2xl">
          <PactCreationForm
            onSubmit={handleCreatePact}
            onCancel={() => setShowCreateForm(false)}
          />
        </div>

        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative pb-20">
      <StarField starCount={100} />
      
      <PageHeader title={getText('title')} />

      <div className="relative z-10 flex-1 container mx-auto px-4 pt-20 py-8">
        {/* Header Actions */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="text-cosmic-secondary hover:text-white"
            >
              {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid3X3 className="w-4 h-4" />}
            </Button>
          </div>

          <Button
            onClick={() => setShowCreateForm(true)}
            className="bg-cosmic-accent hover:bg-cosmic-accent/90 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            {getText('createNew')}
          </Button>
        </div>

        {pacts.length === 0 ? (
          <NoPactsView onCreatePactClick={() => setShowCreateForm(true)} />
        ) : (
          <>
            {/* Search and Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-cosmic-secondary" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={getText('search')}
                  className="pl-9 cosmic-input"
                />
              </div>

              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="cosmic-input">
                  <SelectValue placeholder={getText('filter')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{getText('all')}</SelectItem>
                  <SelectItem value="health">{getText('health')}</SelectItem>
                  <SelectItem value="energy">{getText('energy')}</SelectItem>
                  <SelectItem value="protection">{getText('protection')}</SelectItem>
                  <SelectItem value="spiritual">{getText('spiritual')}</SelectItem>
                  <SelectItem value="general">{getText('general')}</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="cosmic-input">
                  <SelectValue placeholder={getText('filter')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{getText('all')}</SelectItem>
                  <SelectItem value="active">{getText('active')}</SelectItem>
                  <SelectItem value="completed">{getText('completed')}</SelectItem>
                  <SelectItem value="failed">{getText('failed')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Pacts Display */}
            {sortedPacts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-cosmic-secondary">
                  {language === 'ru' ? 'Ничего не найдено' : 
                   language === 'es' ? 'No se encontró nada' : 
                   'Nothing found'}
                </p>
              </div>
            ) : (
              <div className={cn(
                viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                  : 'space-y-4'
              )}>
                {sortedPacts.map(pact => (
                  <PactCard
                    key={pact.id}
                    pact={pact}
                    compact={viewMode === 'list'}
                    showProgress={true}
                    onClick={() => {
                      // TODO: Navigate to pact details
                      console.log('Navigate to pact:', pact.id);
                    }}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
};

export default PactsPage;