import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/store/useAppStore';
import { supabase } from '@/lib/supabase';
import { Bug, Database, Zap, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

interface NumerologyDiagnosticProps {
  matrixData: any;
  birthDate: string;
  name: string;
  language: string;
}

export const NumerologyDiagnostic: React.FC<NumerologyDiagnosticProps> = ({
  matrixData,
  birthDate,
  name,
  language
}) => {
  const { userProfile } = useAppStore();
  const [showDiagnostic, setShowDiagnostic] = useState(false);
  const [diagnosticData, setDiagnosticData] = useState<any>(null);
  const [testing, setTesting] = useState(false);

  const runDiagnostic = async () => {
    setTesting(true);
    const diagnostic = {
      timestamp: new Date().toISOString(),
      userProfile: {
        id: userProfile?.id,
        name: userProfile?.name,
        isPro: userProfile?.isPro,
        hasAuth: !!userProfile
      },
      inputData: {
        birthDate,
        name,
        language,
        matrixDataPresent: !!matrixData,
        matrixKeys: matrixData ? Object.keys(matrixData) : []
      },
      supabaseConnection: null,
      databaseTables: {
        numerologyReadings: null,
        numerologyDescriptions: null
      },
      edgeFunction: null
    };

    try {
      // Test Supabase connection
      const { data: connectionTest } = await supabase
        .from('profiles')
        .select('id')
        .limit(1);
      
      diagnostic.supabaseConnection = {
        status: 'connected',
        testResult: !!connectionTest
      };

      // Check numerology_readings table
      const { data: readings, error: readingsError } = await supabase
        .from('numerology_readings')
        .select('*')
        .eq('user_id', userProfile?.id);

      diagnostic.databaseTables.numerologyReadings = {
        accessible: !readingsError,
        count: readings?.length || 0,
        error: readingsError?.message
      };

      // Check numerology_descriptions table
      const { data: descriptions, error: descriptionsError } = await supabase
        .from('numerology_descriptions')
        .select('*')
        .eq('user_id', userProfile?.id);

      diagnostic.databaseTables.numerologyDescriptions = {
        accessible: !descriptionsError,
        count: descriptions?.length || 0,
        error: descriptionsError?.message
      };

      // Test edge function (mock call)
      try {
        const { data, error } = await supabase.functions.invoke('generate-numerology-description', {
          body: {
            matrixData: { test: true },
            userId: userProfile?.id,
            readingId: 'diagnostic-test',
            language
          }
        });

        diagnostic.edgeFunction = {
          accessible: true,
          error: error?.message,
          response: data ? 'received' : 'empty'
        };
      } catch (funcError: any) {
        diagnostic.edgeFunction = {
          accessible: false,
          error: funcError.message
        };
      }

    } catch (error: any) {
      diagnostic.supabaseConnection = {
        status: 'error',
        error: error.message
      };
    }

    setDiagnosticData(diagnostic);
    setTesting(false);
    toast.success('Диагностика завершена');
  };

  const forceGenerate = async () => {
    if (!userProfile?.id) {
      toast.error('Нет ID пользователя');
      return;
    }

    try {
      setTesting(true);
      
      // Force create reading
      const { data: reading, error: readingError } = await supabase
        .from('numerology_readings')
        .upsert({
          user_id: userProfile.id,
          birth_date: birthDate,
          name: name,
          matrix_data: matrixData
        })
        .select()
        .single();

      if (readingError) throw readingError;

      // Force generate description
      const { data, error } = await supabase.functions.invoke('generate-numerology-description', {
        body: {
          matrixData,
          userId: userProfile.id,
          readingId: reading.id,
          language
        }
      });

      if (error) throw error;

      toast.success('Принудительная генерация запущена!');
      setTimeout(() => window.location.reload(), 2000);

    } catch (error: any) {
      toast.error(`Ошибка принудительной генерации: ${error.message}`);
    } finally {
      setTesting(false);
    }
  };

  return (
    <Card className="bg-cosmic-dark/50 border-cosmic-accent/20 mb-6">
      <CardHeader>
        <CardTitle className="text-cosmic-accent flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Bug className="w-5 h-5" />
            Диагностика системы
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDiagnostic(!showDiagnostic)}
          >
            {showDiagnostic ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </Button>
        </CardTitle>
      </CardHeader>
      
      {showDiagnostic && (
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button
              onClick={runDiagnostic}
              disabled={testing}
              size="sm"
              variant="outline"
            >
              <Database className="w-4 h-4 mr-2" />
              Запустить диагностику
            </Button>
            
            <Button
              onClick={forceGenerate}
              disabled={testing}
              size="sm"
              className="bg-cosmic-accent/20 hover:bg-cosmic-accent/30"
            >
              <Zap className="w-4 h-4 mr-2" />
              Принудительно создать
            </Button>
          </div>

          {diagnosticData && (
            <div className="space-y-3 text-sm">
              <div>
                <strong className="text-white">Пользователь:</strong>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <Badge variant={diagnosticData.userProfile.hasAuth ? "default" : "destructive"}>
                    Auth: {diagnosticData.userProfile.hasAuth ? "✓" : "✗"}
                  </Badge>
                  <Badge variant={diagnosticData.userProfile.isPro ? "default" : "secondary"}>
                    Pro: {diagnosticData.userProfile.isPro ? "✓" : "✗"}
                  </Badge>
                </div>
              </div>

              <div>
                <strong className="text-white">База данных:</strong>
                <div className="space-y-1 mt-1">
                  <div className="flex justify-between">
                    <span>Readings:</span>
                    <Badge variant={diagnosticData.databaseTables.numerologyReadings?.accessible ? "default" : "destructive"}>
                      {diagnosticData.databaseTables.numerologyReadings?.count || 0} записей
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Descriptions:</span>
                    <Badge variant={diagnosticData.databaseTables.numerologyDescriptions?.accessible ? "default" : "destructive"}>
                      {diagnosticData.databaseTables.numerologyDescriptions?.count || 0} записей
                    </Badge>
                  </div>
                </div>
              </div>

              <div>
                <strong className="text-white">Edge функция:</strong>
                <div className="mt-1">
                  <Badge variant={diagnosticData.edgeFunction?.accessible ? "default" : "destructive"}>
                    {diagnosticData.edgeFunction?.accessible ? "Доступна" : "Недоступна"}
                  </Badge>
                  {diagnosticData.edgeFunction?.error && (
                    <p className="text-red-400 text-xs mt-1">{diagnosticData.edgeFunction.error}</p>
                  )}
                </div>
              </div>

              <div>
                <strong className="text-white">Входные данные:</strong>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <Badge variant="outline">Дата: {diagnosticData.inputData.birthDate}</Badge>
                  <Badge variant="outline">Имя: {diagnosticData.inputData.name}</Badge>
                  <Badge variant={diagnosticData.inputData.matrixDataPresent ? "default" : "destructive"}>
                    Матрица: {diagnosticData.inputData.matrixDataPresent ? "✓" : "✗"}
                  </Badge>
                  <Badge variant="outline">Язык: {diagnosticData.inputData.language}</Badge>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
};