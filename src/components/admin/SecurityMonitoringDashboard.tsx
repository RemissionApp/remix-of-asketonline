import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Shield, 
  AlertTriangle, 
  Eye, 
  Lock, 
  Activity, 
  Database, 
  Users, 
  Clock,
  TrendingUp,
  TrendingDown,
  RefreshCw
} from "lucide-react";
import { useAuditLogger } from "@/utils/auditLogger";
import { SECURITY_CONFIG, logSecurityEvent } from "@/utils/securityConfig";
import { useToast } from "@/hooks/use-toast";

interface SecurityMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
}

interface SecurityEvent {
  id: string;
  timestamp: Date;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  userId?: string;
  details: Record<string, any>;
}

export function SecurityMonitoringDashboard() {
  const { getStats } = useAuditLogger();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Моковые данные для демонстрации
  const [securityMetrics] = useState<SecurityMetric[]>([
    {
      id: 'failed_logins',
      name: 'Неудачные попытки входа',
      value: 12,
      unit: 'за последний час',
      trend: 'up',
      severity: 'medium',
      description: 'Количество неудачных попыток аутентификации'
    },
    {
      id: 'active_sessions',
      name: 'Активные сессии',
      value: 45,
      unit: 'сейчас',
      trend: 'stable',
      severity: 'low',
      description: 'Количество активных пользовательских сессий'
    },
    {
      id: 'data_access_violations',
      name: 'Нарушения доступа к данным',
      value: 2,
      unit: 'за сутки',
      trend: 'down',
      severity: 'high',
      description: 'Попытки несанкционированного доступа к данным'
    },
    {
      id: 'suspicious_activities',
      name: 'Подозрительная активность',
      value: 8,
      unit: 'за неделю',
      trend: 'up',
      severity: 'medium',
      description: 'Обнаруженные подозрительные действия пользователей'
    }
  ]);

  const [recentEvents] = useState<SecurityEvent[]>([
    {
      id: '1',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      type: 'failed_login',
      severity: 'medium',
      description: 'Множественные неудачные попытки входа',
      userId: 'user_123',
      details: { attempts: 5, ip: '192.168.1.1' }
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      type: 'data_access_violation',
      severity: 'high',
      description: 'Попытка доступа к чужим данным',
      userId: 'user_456',
      details: { resource: 'profiles', target_user: 'user_789' }
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      type: 'unusual_location',
      severity: 'medium',
      description: 'Вход с нового местоположения',
      userId: 'user_321',
      details: { location: 'Moscow, Russia', previous_location: 'London, UK' }
    }
  ]);

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      // Здесь должна быть логика обновления данных с сервера
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLastUpdate(new Date());
      
      toast({
        title: "Данные обновлены",
        description: "Информация о безопасности успешно обновлена",
      });
    } catch (error) {
      toast({
        title: "Ошибка обновления",
        description: "Не удалось обновить данные о безопасности",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500 text-white';
      case 'high':
        return 'bg-orange-500 text-white';
      case 'medium':
        return 'bg-yellow-500 text-white';
      default:
        return 'bg-green-500 text-white';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-red-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-green-500" />;
      default:
        return <Activity className="h-4 w-4 text-blue-500" />;
    }
  };

  const criticalEvents = recentEvents.filter(event => event.severity === 'critical');
  const auditStats = getStats();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="h-8 w-8" />
            Мониторинг безопасности
          </h1>
          <p className="text-muted-foreground">
            Отслеживание событий безопасности и угроз в реальном времени
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Обновлено: {lastUpdate.toLocaleTimeString()}
          </span>
          <Button onClick={handleRefresh} disabled={isLoading} size="sm">
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Обновить
          </Button>
        </div>
      </div>

      {/* Критические предупреждения */}
      {criticalEvents.length > 0 && (
        <Alert className="border-red-500 bg-red-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Внимание!</strong> Обнаружено {criticalEvents.length} критических события безопасности. 
            Требуется немедленное вмешательство.
          </AlertDescription>
        </Alert>
      )}

      {/* Метрики безопасности */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {securityMetrics.map((metric) => (
          <Card key={metric.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
              {getTrendIcon(metric.trend)}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-muted-foreground">{metric.unit}</p>
              <Badge className={`mt-2 ${getSeverityColor(metric.severity)}`}>
                {metric.severity}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Подробная информация */}
      <Tabs defaultValue="events" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="events" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            События
          </TabsTrigger>
          <TabsTrigger value="audit" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Аудит
          </TabsTrigger>
          <TabsTrigger value="config" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Конфигурация
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Аналитика
          </TabsTrigger>
        </TabsList>

        {/* События безопасности */}
        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Последние события безопасности</CardTitle>
              <CardDescription>
                События, требующие внимания администратора
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-4">
                  {recentEvents.map((event) => (
                    <div key={event.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                      <div className="flex-shrink-0">
                        <Badge className={getSeverityColor(event.severity)}>
                          {event.severity}
                        </Badge>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{event.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          <Clock className="h-3 w-3 inline mr-1" />
                          {event.timestamp.toLocaleString()}
                          {event.userId && (
                            <>
                              <Users className="h-3 w-3 inline ml-2 mr-1" />
                              {event.userId}
                            </>
                          )}
                        </p>
                        {Object.keys(event.details).length > 0 && (
                          <details className="mt-2">
                            <summary className="text-xs cursor-pointer text-blue-600">
                              Подробности
                            </summary>
                            <pre className="text-xs mt-1 p-2 bg-gray-100 rounded overflow-auto">
                              {JSON.stringify(event.details, null, 2)}
                            </pre>
                          </details>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Аудит */}
        <TabsContent value="audit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Статистика аудита</CardTitle>
              <CardDescription>
                Информация о системе логирования действий пользователей
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Размер очереди событий</p>
                  <p className="text-2xl font-bold">{auditStats.queueSize}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Статус сброса</p>
                  <p className="text-sm">
                    {auditStats.isFlushActive ? (
                      <Badge className="bg-green-500 text-white">Активен</Badge>
                    ) : (
                      <Badge className="bg-red-500 text-white">Неактивен</Badge>
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Конфигурация безопасности */}
        <TabsContent value="config" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Настройки безопасности</CardTitle>
              <CardDescription>
                Текущая конфигурация системы безопасности
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Аутентификация</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>Макс. попыток входа: {SECURITY_CONFIG.auth.maxLoginAttempts}</div>
                    <div>Время блокировки: {SECURITY_CONFIG.auth.lockoutDuration / 60000} мин</div>
                    <div>Мин. длина пароля: {SECURITY_CONFIG.auth.passwordMinLength}</div>
                    <div>Тайм-аут сессии: {SECURITY_CONFIG.auth.sessionTimeout / 3600000} ч</div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Мониторинг</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>Логирование: {SECURITY_CONFIG.monitoring.logSecurityEvents ? '✅' : '❌'}</div>
                    <div>Оповещения: {SECURITY_CONFIG.monitoring.alertOnSuspiciousActivity ? '✅' : '❌'}</div>
                    <div>Аудит: {SECURITY_CONFIG.monitoring.enableAuditLog ? '✅' : '❌'}</div>
                    <div>Отслеживание доступа: {SECURITY_CONFIG.monitoring.trackDataAccess ? '✅' : '❌'}</div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">API</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>Лимит/мин: {SECURITY_CONFIG.api.rateLimitPerMinute}</div>
                    <div>Лимит/час: {SECURITY_CONFIG.api.rateLimitPerHour}</div>
                    <div>CORS: {SECURITY_CONFIG.api.enableCors ? '✅' : '❌'}</div>
                    <div>Логирование запросов: {SECURITY_CONFIG.api.enableRequestLogging ? '✅' : '❌'}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Аналитика */}
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Аналитика безопасности</CardTitle>
              <CardDescription>
                Тренды и паттерны в событиях безопасности
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Database className="h-12 w-12 mx-auto mb-4" />
                <p>Аналитические графики будут доступны после накопления данных</p>
                <p className="text-sm mt-2">
                  Система собирает данные для построения трендов и выявления паттернов
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default SecurityMonitoringDashboard;