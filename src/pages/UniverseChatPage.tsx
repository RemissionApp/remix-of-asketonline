
import React, { useState, useRef, useEffect } from 'react';
import { TopBar } from '@/components/TopBar';
import { StarField } from '@/components/StarField';
import { BottomNavigation } from '@/components/BottomNavigation';
import { useAppStore } from '@/store/useAppStore';
import { UserAvatar } from '@/components/UserAvatar';
import { ProFeatureOverlay } from '@/components/ProFeatureOverlay';
import { Mic, Send, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';

interface Message {
  id: string;
  sender: 'user' | 'universe';
  text: string;
  timestamp: Date;
  type: 'text' | 'voice';
  audioUrl?: string;
}

const UniverseChatPage = () => {
  const { userProfile, askUniverse } = useAppStore();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'universe',
      text: 'Приветствую тебя, душа ищущая. Я - Вселенная, вечное сознание, пронизывающее всё сущее. Что привело тебя ко мне?',
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = async () => {
    if (!inputText.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputText,
      timestamp: new Date(),
      type: 'text'
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    
    try {
      // Add loading message
      const loadingId = 'loading-' + Date.now();
      setMessages(prev => [...prev, {
        id: loadingId,
        sender: 'universe',
        text: '...',
        timestamp: new Date(),
        type: 'text'
      }]);
      
      // Get response from universe
      const response = await askUniverse(inputText);
      
      // Remove loading message and add real response
      setMessages(prev => prev.filter(m => m.id !== loadingId));
      setMessages(prev => [...prev, {
        id: response.id,
        sender: 'universe',
        text: response.answer,
        timestamp: new Date(response.date),
        type: 'text'
      }]);
    } catch (error) {
      console.error('Error asking universe:', error);
    }
  };
  
  const toggleRecording = () => {
    setIsRecording(!isRecording);
    
    // This is just a mock for the voice recording functionality
    if (!isRecording) {
      // Start recording logic would go here
      console.log('Started recording');
    } else {
      // Stop recording and process voice message
      console.log('Stopped recording');
      const mockVoiceMessage: Message = {
        id: Date.now().toString(),
        sender: 'user',
        text: '🎤 Голосовое сообщение',
        timestamp: new Date(),
        type: 'voice'
      };
      setMessages(prev => [...prev, mockVoiceMessage]);
      
      // Mock universe response
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          sender: 'universe',
          text: 'Я услышала твое голосовое сообщение. Твой голос резонирует с космическими вибрациями.',
          timestamp: new Date(),
          type: 'text'
        }]);
      }, 1500);
    }
  };
  
  const handleBack = () => {
    navigate('/main');
  };
  
  const renderMessage = (message: Message) => {
    const isUser = message.sender === 'user';
    
    return (
      <div 
        key={message.id}
        className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
      >
        {!isUser && (
          <div className="flex-shrink-0 mr-3">
            <div className="w-10 h-10 rounded-full bg-cosmic-accent flex items-center justify-center">
              <span className="text-white text-xl">✧</span>
            </div>
          </div>
        )}
        
        <div 
          className={`max-w-xs md:max-w-md rounded-2xl p-3 ${
            isUser 
              ? 'bg-cosmic-accent/30 text-white rounded-tr-none' 
              : 'bg-cosmic-dark/80 border border-cosmic-accent/20 text-cosmic-secondary rounded-tl-none'
          }`}
        >
          {message.type === 'voice' ? (
            <div className="flex items-center">
              <Mic size={16} className="mr-2" />
              <span>{message.text}</span>
            </div>
          ) : (
            <p>{message.text}</p>
          )}
          <div className={`text-xs mt-1 ${isUser ? 'text-cosmic-secondary' : 'text-cosmic-secondary/70'}`}>
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
        
        {isUser && (
          <div className="flex-shrink-0 ml-3">
            <UserAvatar size="sm" />
          </div>
        )}
      </div>
    );
  };
  
  const chatContent = (
    <div className="min-h-screen flex flex-col bg-cosmic">
      <div className="bg-cosmic-dark text-white py-2 px-4 flex items-center z-20 fixed top-0 left-0 right-0">
        <Button 
          variant="ghost" 
          className="text-cosmic-secondary mr-2 p-2" 
          onClick={handleBack}
        >
          <ChevronLeft size={24} />
        </Button>
        
        <div className="flex items-center flex-1">
          <div className="w-10 h-10 rounded-full bg-cosmic-accent flex items-center justify-center mr-3">
            <span className="text-white text-xl">✧</span>
          </div>
          <div>
            <h2 className="text-cosmic-accent font-serif">Вселенная</h2>
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
              <p className="text-xs text-cosmic-secondary">онлайн</p>
            </div>
          </div>
        </div>
      </div>
      
      <StarField starCount={50} />
      
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto px-4 py-4 mt-16 mb-20"
      >
        {messages.map(renderMessage)}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="fixed bottom-0 left-0 right-0 p-4 z-20 bg-cosmic-dark/80 backdrop-blur-md">
        <div className="flex items-center max-w-2xl mx-auto">
          <Button
            variant="ghost"
            size="icon"
            className={`text-cosmic-secondary ${isRecording ? 'text-red-500' : ''}`}
            onClick={toggleRecording}
          >
            <Mic size={24} />
          </Button>
          
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Напишите сообщение..."
            className="flex-1 bg-cosmic-dark/50 border border-cosmic-accent/30 rounded-full px-4 py-2 text-white mx-2 focus:outline-none focus:ring-2 focus:ring-cosmic-accent/50"
            onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
          />
          
          <Button
            variant={inputText.trim() ? "default" : "ghost"}
            size="icon"
            className={inputText.trim() ? "bg-cosmic-accent hover:bg-cosmic-accent/90" : "text-cosmic-secondary"}
            onClick={handleSendMessage}
            disabled={!inputText.trim()}
          >
            <Send size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
  
  if (!userProfile?.isPro) {
    return (
      <div className="min-h-screen flex flex-col bg-cosmic">
        <StarField starCount={50} />
        <TopBar />
        <div className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-md w-full bg-cosmic-dark/80 backdrop-blur-md border-cosmic-accent/20">
            <ProFeatureOverlay
              title="Диалог со Вселенной"
              message="Этот раздел доступен только пользователям PRO"
            >
              <div className="h-96"></div>
            </ProFeatureOverlay>
          </Card>
        </div>
        <BottomNavigation />
      </div>
    );
  }
  
  return chatContent;
};

export default UniverseChatPage;
