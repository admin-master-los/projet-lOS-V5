import React, { useState } from 'react';
import { MessageSquare, Database, TrendingUp } from 'lucide-react';
import ConversationsTab from '../components/chatbot/ConversationsTab';
import KnowledgeBaseTab from '../components/chatbot/KnowledgeBaseTab';
 {/* import ChatbotStatsTab from '../components/chatbot/ChatbotStatsTab';*/}

type TabType = 'conversations' | 'knowledge' | 'stats';

const Chatbot: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('conversations');

  const tabs = [
    {
      id: 'conversations' as TabType,
      label: 'Conversations',
      icon: MessageSquare,
      description: 'Historique des conversations des visiteurs',
    },
    {
      id: 'knowledge' as TabType,
      label: 'Base de connaissances',
      icon: Database,
      description: 'Gérer les réponses du chatbot',
    },
    {
      id: 'stats' as TabType,
      label: 'Statistiques',
      icon: TrendingUp,
      description: 'Analyses et performances',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Chatbot IA</h1>
        <p className="text-gray-400 mt-1">
          Gérez les conversations et la base de connaissances du chatbot
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-700/50">
        <div className="flex gap-2 -mb-px">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-cyan-500 text-cyan-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-[500px]">
        {activeTab === 'conversations' && <ConversationsTab />}
        {activeTab === 'knowledge' && <KnowledgeBaseTab />}
        {activeTab === 'stats' && <ChatbotStatsTab />}
      </div>
    </div>
  );
};

export default Chatbot;
