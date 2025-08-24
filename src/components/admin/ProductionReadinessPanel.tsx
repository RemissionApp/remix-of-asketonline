import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, CheckCircle, XCircle, Clock, Shield, Database, Monitor, FileText, Server, TestTube } from "lucide-react";
import { useProductionChecker, type ChecklistItem } from "@/utils/productionChecklist";
import { useToast } from "@/hooks/use-toast";

const getStatusIcon = (status: ChecklistItem['status']) => {
  switch (status) {
    case 'completed':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'failed':
      return <XCircle className="h-4 w-4 text-red-500" />;
    case 'warning':
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    default:
      return <Clock className="h-4 w-4 text-gray-500" />;
  }
};

const getSeverityColor = (severity: ChecklistItem['severity']) => {
  switch (severity) {
    case 'critical':
      return 'destructive';
    case 'high':
      return 'secondary';
    case 'medium':
      return 'outline';
    default:
      return 'secondary';
  }
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Безопасность':
      return <Shield className="h-4 w-4" />;
    case 'Производительность':
      return <Database className="h-4 w-4" />;
    case 'Мониторинг':
      return <Monitor className="h-4 w-4" />;
    case 'Резервное копирование':
      return <Server className="h-4 w-4" />;
    case 'Окружение':
      return <Server className="h-4 w-4" />;
    case 'Тестирование':
      return <TestTube className="h-4 w-4" />;
    case 'Документация':
      return <FileText className="h-4 w-4" />;
    default:
      return <CheckCircle className="h-4 w-4" />;
  }
};

export function ProductionReadinessPanel() {
  const { runChecks, getStatus, updateStatus, isReady, getRecommendations } = useProductionChecker();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [statusData, setStatusData] = useState(getStatus());

  useEffect(() => {
    setStatusData(getStatus());
  }, []);

  const handleRunChecks = async () => {
    setIsLoading(true);
    try {
      await runChecks();
      setStatusData(getStatus());
      toast({
        title: "Проверки завершены",
        description: "Автоматические проверки готовности к продакшену выполнены",
      });
    } catch (error) {
      toast({
        title: "Ошибка при проверке",
        description: "Произошла ошибка при выполнении автоматических проверок",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = (itemId: string, status: ChecklistItem['status']) => {
    updateStatus(itemId, status);
    setStatusData(getStatus());
    toast({
      title: "Статус обновлен",
      description: "Статус элемента успешно обновлен",
    });
  };

  const progressPercentage = (statusData.summary.completed / statusData.summary.total) * 100;
  const isProductionReady = isReady();
  const recommendations = getRecommendations();

  // Группировка по категориям
  const groupedItems = statusData.items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, ChecklistItem[]>);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Готовность к продакшену</h1>
          <p className="text-muted-foreground">Проверка готовности приложения к запуску в продакшене</p>
        </div>
        <Button onClick={handleRunChecks} disabled={isLoading}>
          {isLoading ? "Проверка..." : "Запустить проверки"}
        </Button>
      </div>

      {/* Общая статистика */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Общий прогресс</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(progressPercentage)}%</div>
            <Progress value={progressPercentage} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Завершено</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusData.summary.completed}</div>
            <p className="text-xs text-muted-foreground">из {statusData.summary.total}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Критичные проблемы</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusData.summary.criticalIssues}</div>
            <p className="text-xs text-muted-foreground">требуют внимания</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Статус готовности</CardTitle>
            {isProductionReady ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <XCircle className="h-4 w-4 text-red-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isProductionReady ? "Готов" : "Не готов"}
            </div>
            <p className="text-xs text-muted-foreground">
              {isProductionReady ? "к продакшену" : "к запуску"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Рекомендации */}
      {recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Рекомендации
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {recommendations.map((recommendation, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-sm">{recommendation}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Детализированные проверки */}
      <Card>
        <CardHeader>
          <CardTitle>Детализированные проверки</CardTitle>
          <CardDescription>
            Проверьте каждую категию и обновите статус выполненных задач
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={Object.keys(groupedItems)[0]} className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              {Object.keys(groupedItems).map((category) => (
                <TabsTrigger key={category} value={category} className="flex items-center gap-1 text-xs">
                  {getCategoryIcon(category)}
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>

            {Object.entries(groupedItems).map(([category, items]: [string, ChecklistItem[]]) => (
              <TabsContent key={category} value={category} className="space-y-4">
                {items.map((item) => (
                  <Card key={item.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-base flex items-center gap-2">
                            {getStatusIcon(item.status)}
                            {item.title}
                            <Badge variant={getSeverityColor(item.severity)}>
                              {item.severity}
                            </Badge>
                          </CardTitle>
                          <CardDescription className="mt-1">
                            {item.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          {item.manualCheck && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleUpdateStatus(item.id, 'completed')}
                                disabled={item.status === 'completed'}
                              >
                                Отметить выполненным
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleUpdateStatus(item.id, 'pending')}
                                disabled={item.status === 'pending'}
                              >
                                Сбросить
                              </Button>
                            </>
                          )}
                        </div>
                        {item.documentation && (
                          <Button
                            size="sm"
                            variant="link"
                            asChild
                          >
                            <a href={item.documentation} target="_blank" rel="noopener noreferrer">
                              Документация
                            </a>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

export default ProductionReadinessPanel;