import React, { useState, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { useChatbotKnowledge } from '../lib/useSupabaseData';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

type ChatbotKnowledgeItem = {
  id: string;
  title: string;
  content: string;
  tags?: string[];
};

const ChatBot: React.FC = () => {
  const { data: chatbotKnowledgeBase, loading } = useChatbotKnowledge();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');

  const quickReplies = [
    'Vos services',
    'Tarifs et devis',
    'Délais de réalisation',
    'Prendre contact',
    'Aide',
  ];

  useEffect(() => {
    if (isOpen && messages.length === 0 && !loading) {
      const greetingItem = chatbotKnowledgeBase.find(
        (item) => item.id === 'kb-001'
      );
      const greetingMessage = greetingItem
        ? `Bonjour ! Je suis l'assistant virtuel de Leonce Ouattara Studio. ${greetingItem.content.substring(
            0,
            150
          )}... Comment puis-je vous aider aujourd'hui ?`
        : "Bonjour ! Je suis l'assistant virtuel de Leonce Ouattara Studio. Comment puis-je vous aider aujourd'hui ?";
      addMessage(greetingMessage, 'bot');
    }
  }, [isOpen, loading, chatbotKnowledgeBase]);

  const addMessage = (text: string, sender: 'user' | 'bot') => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const findRelevantKnowledge = (
    userMessage: string
  ): ChatbotKnowledgeItem | null => {
    const message = userMessage.toLowerCase();

    for (const item of chatbotKnowledgeBase) {
      const titleLower = item.title.toLowerCase();
      const contentLower = item.content.toLowerCase();
      const tags = item.tags?.map((t) => t.toLowerCase()) || [];

      for (const tag of tags) {
        if (message.includes(tag)) {
          return item;
        }
      }

      if (
        message
          .split(' ')
          .some((word) => titleLower.includes(word) && word.length > 3)
      ) {
        return item;
      }
    }

    return null;
  };

  const getBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();

    if (
      message.includes('bonjour') ||
      message.includes('salut') ||
      message.includes('hello') ||
      message.includes('bonsoir')
    ) {
      const greetingItem = chatbotKnowledgeBase.find(
        (item) => item.id === 'kb-001'
      );
      return greetingItem
        ? `Bonjour ! ${greetingItem.content.substring(0, 200)}...`
        : "Bonjour ! Je suis l'assistant virtuel de Leonce Ouattara Studio. Comment puis-je vous aider ?";
    }

    if (
      message.includes('service') ||
      message.includes('que faites') ||
      message.includes('développement') ||
      message.includes('proposez')
    ) {
      const webItem = chatbotKnowledgeBase.find((item) => item.id === 'kb-002');
      const metierItem = chatbotKnowledgeBase.find(
        (item) => item.id === 'kb-003'
      );
      const designItem = chatbotKnowledgeBase.find(
        (item) => item.id === 'kb-004'
      );

      return `Nos services principaux :\n\n📱 ${
        webItem?.title || 'Développement Web'
      } : ${webItem?.content.substring(0, 120)}...\n\n💼 ${
        metierItem?.title || 'Applications Métiers'
      } : ${metierItem?.content.substring(0, 120)}...\n\n🎨 ${
        designItem?.title || 'UX/UI Design'
      } : ${designItem?.content.substring(
        0,
        120
      )}...\n\nQue souhaitez-vous savoir de plus précis ?`;
    }

    if (
      message.includes('contact') ||
      message.includes('joindre') ||
      message.includes('appel') ||
      message.includes('téléphone') ||
      message.includes('email')
    ) {
      const contactItem = chatbotKnowledgeBase.find(
        (item) => item.id === 'kb-009'
      );
      return (
        contactItem?.content ||
        'Contactez-nous par email à contact@leonce-ouattara.com ou planifiez un appel gratuit via notre calendrier en ligne.'
      );
    }

    if (
      message.includes('tarif') ||
      message.includes('prix') ||
      message.includes('coût') ||
      message.includes('devis') ||
      message.includes('budget')
    ) {
      const pricingItem = chatbotKnowledgeBase.find(
        (item) => item.id === 'kb-007'
      );
      return (
        pricingItem?.content ||
        'Nos tarifs sont adaptés aux PME. Demandez un devis personnalisé gratuit pour votre projet.'
      );
    }

    if (
      message.includes('délai') ||
      message.includes('durée') ||
      message.includes('temps') ||
      message.includes('combien de temps') ||
      message.includes('quand')
    ) {
      const timelineItem = chatbotKnowledgeBase.find(
        (item) => item.id === 'kb-006'
      );
      return (
        timelineItem?.content ||
        'Les délais varient selon le projet. En général : Site vitrine (2-4 semaines), E-commerce (4-8 semaines), Application métier (6-12 semaines).'
      );
    }

    if (
      message.includes('rgpd') ||
      message.includes('sécurité') ||
      message.includes('données') ||
      message.includes('conformité')
    ) {
      const rgpdItem = chatbotKnowledgeBase.find(
        (item) => item.id === 'kb-008'
      );
      return (
        rgpdItem?.content ||
        'Nous garantissons la conformité RGPD et la sécurité de vos données avec chiffrement et hébergement sécurisé.'
      );
    }

    if (
      message.includes('portfolio') ||
      message.includes('projet') ||
      message.includes('réalisation') ||
      message.includes('exemple') ||
      message.includes('cas client')
    ) {
      const portfolioItem = chatbotKnowledgeBase.find(
        (item) => item.id === 'kb-010'
      );
      return (
        portfolioItem?.content ||
        'Consultez notre portfolio pour découvrir nos réalisations : e-commerce B2B, CRM hôtelier, plateforme bancaire, etc.'
      );
    }

    if (
      message.includes('cms') ||
      message.includes('wordpress') ||
      message.includes('contenu') ||
      message.includes('gestion')
    ) {
      const cmsItem = chatbotKnowledgeBase.find((item) => item.id === 'kb-011');
      return (
        cmsItem?.content ||
        'Nous maîtrisons WordPress, Strapi et autres CMS pour que vous puissiez gérer vos contenus facilement.'
      );
    }

    if (
      message.includes('maintenance') ||
      message.includes('hébergement') ||
      message.includes('support') ||
      message.includes('sauvegarde')
    ) {
      const maintenanceItem = chatbotKnowledgeBase.find(
        (item) => item.id === 'kb-012'
      );
      return (
        maintenanceItem?.content ||
        'Nos forfaits maintenance incluent mises à jour, monitoring 24/7 et support technique à partir de 200€/mois.'
      );
    }

    if (
      message.includes('processus') ||
      message.includes('méthode') ||
      message.includes('comment') ||
      message.includes('étapes')
    ) {
      const processItem = chatbotKnowledgeBase.find(
        (item) => item.id === 'kb-005'
      );
      return (
        processItem?.content ||
        'Nous travaillons en Agile avec des sprints de 2 semaines. Vous êtes impliqué à chaque étape.'
      );
    }

    if (message.includes('aide') || message.includes('help')) {
      return 'Je peux vous renseigner sur : les services, les tarifs, les délais, le processus, la sécurité RGPD, le portfolio, les CMS, la maintenance, et comment nous contacter. Que souhaitez-vous savoir ?';
    }

    const relevantKnowledge = findRelevantKnowledge(userMessage);
    if (relevantKnowledge) {
      return relevantKnowledge.content;
    }

    return "Je ne suis pas sûr de comprendre. Pouvez-vous reformuler votre question ? Ou tapez 'aide' pour voir les sujets que je peux traiter.";
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    addMessage(inputText, 'user');
    setInputText('');

    setTimeout(() => {
      const response = getBotResponse(inputText);
      addMessage(response, 'bot');
    }, 1000);
  };

  const handleQuickReply = (reply: string) => {
    addMessage(reply, 'user');

    setTimeout(() => {
      let response = '';
      if (reply.includes('services')) {
        const webItem = chatbotKnowledgeBase.find(
          (item) => item.id === 'kb-002'
        );
        response =
          webItem?.content ||
          "Nos services incluent le développement web, les applications métiers, le design UX/UI et l'architecture cloud.";
      } else if (reply.includes('Tarifs')) {
        const pricingItem = chatbotKnowledgeBase.find(
          (item) => item.id === 'kb-007'
        );
        response =
          pricingItem?.content ||
          'Demandez un devis personnalisé gratuit pour votre projet.';
      } else if (reply.includes('Délais')) {
        const timelineItem = chatbotKnowledgeBase.find(
          (item) => item.id === 'kb-006'
        );
        response =
          timelineItem?.content ||
          'Les délais dépendent du projet. Contactez-nous pour un planning détaillé.';
      } else if (reply.includes('contact')) {
        const contactItem = chatbotKnowledgeBase.find(
          (item) => item.id === 'kb-009'
        );
        response =
          contactItem?.content ||
          'Contactez-nous à contact@leonce-ouattara.com';
      } else {
        response =
          'Je peux vous renseigner sur : les services, les tarifs, les délais, comment prendre contact, et répondre à vos questions générales. Que souhaitez-vous savoir ?';
      }

      addMessage(response, 'bot');
    }, 1000);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Ouvrir le chat avec Leonce Ouattara Studio"
        className={`w-16 h-16 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 flex items-center justify-center ${
          isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
        }`}
      >
        <MessageCircle size={28} />
      </button>

      {/* Chat Window - Style WhatsApp Web: Grande fenêtre aérée */}
      <div
        className={`absolute bottom-0 right-0 w-full sm:w-[420px] md:w-[480px] h-[85vh] sm:h-[600px] md:h-[700px] bg-black/95 backdrop-blur-xl border border-cyan-500/30 rounded-3xl shadow-2xl transition-all duration-300 ${
          isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
        } origin-bottom-right overflow-hidden flex flex-col`}
      >
        {/* Header - Plus aéré style WhatsApp */}
        <div className="flex items-center justify-between p-5 border-b border-gray-700/50 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 flex-shrink-0">
          <div className="flex items-center gap-3">
            {/* Remplacer le chemin par votre avatar */}
            <img
              src="/assets/avatar-leonce.jpg"
              alt="Leonce Ouattara"
              className="w-14 h-14 rounded-full object-cover border-2 border-cyan-500/50"
              onError={(e) => {
                // Fallback si l'image n'existe pas
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
            {/* Fallback avatar si l'image ne charge pas */}
            <div className="hidden w-14 h-14 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
              LO
            </div>
            <div>
              <h4 className="text-white font-bold text-lg">
                Leonce Ouattara Studio
              </h4>
              <p className="text-cyan-400 text-sm flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></span>
                En ligne
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            aria-label="Fermer le chat"
            className="text-gray-400 hover:text-white transition-colors duration-200 hover:rotate-90 transform"
          >
            <X size={24} />
          </button>
        </div>

        {/* Messages - Zone flexible comme WhatsApp */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0icGF0dGVybiIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDMpIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI3BhdHRlcm4pIi8+PC9zdmc+')] scrollbar-thin scrollbar-thumb-cyan-500/20 scrollbar-track-transparent">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[75%] px-5 py-3 rounded-2xl text-base leading-relaxed shadow-lg ${
                  message.sender === 'user'
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-br-sm'
                    : 'bg-white/10 text-gray-100 border border-gray-700/50 backdrop-blur-sm rounded-bl-sm'
                }`}
              >
                <p className="whitespace-pre-wrap break-words">
                  {message.text}
                </p>
              </div>
            </div>
          ))}

          {/* Quick Replies */}
          {messages.length === 1 && (
            <div className="space-y-3 pt-4">
              <p className="text-gray-400 text-sm font-medium">
                Suggestions rapides :
              </p>
              <div className="flex flex-wrap gap-2.5">
                {quickReplies.map((reply) => (
                  <button
                    key={reply}
                    onClick={() => handleQuickReply(reply)}
                    className="px-4 py-2.5 bg-white/5 border border-cyan-500/40 text-cyan-300 rounded-full text-sm hover:bg-cyan-500/20 hover:border-cyan-400 transition-all duration-200 hover:scale-105 font-medium"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Input - Style WhatsApp avec plus d'espace */}
        <div className="p-4 border-t border-gray-700/50 bg-black/50 flex-shrink-0">
          <div className="flex gap-3 items-center">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Tapez votre message..."
              aria-label="Saisir un message pour Leonce Ouattara Studio"
              className="flex-1 bg-white/5 border border-gray-700/50 rounded-full px-5 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/20 text-base transition-all duration-200"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputText.trim()}
              aria-label="Envoyer le message"
              className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:scale-110 hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-200 active:scale-95 flex-shrink-0"
            >
              <Send size={20} className="text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
