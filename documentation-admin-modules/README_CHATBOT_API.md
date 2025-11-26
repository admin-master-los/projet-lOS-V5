# 🤖 MODULE CHATBOT - DOCUMENTATION COMPLÈTE

## 📋 RÉSUMÉ

Le module Chatbot permet de :
- Enregistrer toutes les conversations des visiteurs
- Gérer une base de connaissances pour les réponses
- Analyser les performances et la satisfaction
- Améliorer continuellement le modèle

---

## 🎯 RECOMMANDATIONS API POUR LE CHATBOT

### ✨ **RECOMMANDATION #1: OpenAI GPT-4 (⭐ Meilleur choix)**

**API**: OpenAI Chat Completions API
**URL**: https://platform.openai.com/docs/api-reference/chat

**Pourquoi ?**
- ✅ Meilleure compréhension contextuelle
- ✅ Réponses naturelles et fluides
- ✅ Support multilingue excellent
- ✅ Intégration simple
- ✅ Coût raisonnable pour un portfolio

**Pricing**:
- GPT-4o mini: $0.15/1M tokens input, $0.60/1M tokens output
- GPT-4o: $2.50/1M tokens input, $10/1M tokens output

**Code d'intégration**:
```typescript
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Pour frontend uniquement
});

export const getChatbotResponse = async (
  message: string,
  context: ChatbotKnowledge[]
) => {
  // Construire le contexte à partir de la base de connaissances
  const systemPrompt = `Tu es un assistant virtuel pour le portfolio de Leonce Ouattara.
Voici les informations que tu dois connaître:

${context.map(k => `${k.title}: ${k.content}`).join('\n\n')}

Réponds de manière concise, professionnelle et amicale.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: message }
    ],
    temperature: 0.7,
    max_tokens: 500,
  });

  return {
    response: completion.choices[0].message.content,
    confidence: 0.85, // Calculer selon finish_reason
    matched_knowledge_ids: extractMatchedKnowledge(message, context),
  };
};
```

---

### 🌟 **RECOMMANDATION #2: Anthropic Claude (Alternative premium)**

**API**: Anthropic Messages API
**URL**: https://docs.anthropic.com/claude/reference/messages_post

**Pourquoi ?**
- ✅ Excellent pour des réponses longues et structurées
- ✅ Très sûr et aligné éthiquement
- ✅ Excellent raisonnement
- ✅ Support de 200K tokens de contexte

**Pricing**:
- Claude 3.5 Haiku: $0.80/MTok input, $4/MTok output
- Claude 3.5 Sonnet: $3/MTok input, $15/MTok output

---

### 💰 **RECOMMANDATION #3: Google Gemini (Gratuit/Budget)**

**API**: Google AI Gemini API
**URL**: https://ai.google.dev/docs

**Pourquoi ?**
- ✅ Version gratuite très généreuse (60 req/min)
- ✅ Bonne qualité de réponses
- ✅ Multimodal (peut traiter images)
- ✅ Excellent pour démarrer sans coûts

**Pricing**:
- Gratuit jusqu'à 1500 requests/day
- Pro: $0.125/1M tokens

**Code d'intégration**:
```typescript
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY);

export const getChatbotResponse = async (
  message: string,
  context: ChatbotKnowledge[]
) => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `[Contexte du portfolio...]
  
Question: ${message}
  
Réponds de manière concise et professionnelle.`;

  const result = await model.generateContent(prompt);
  const response = result.response.text();

  return {
    response,
    confidence: 0.80,
    matched_knowledge_ids: [],
  };
};
```

---

## 🏗️ ARCHITECTURE DU CHATBOT

### Base de Données

**Table: chatbot_knowledge** (Base de connaissances)
```sql
- id: text (PRIMARY KEY)
- title: text
- content: text
- tags: text[]
- category: text (services, portfolio, contact, about, technical, general)
- priority: integer
- is_active: boolean
- usage_count: integer
- last_used_at: timestamptz
```

**Table: chatbot_conversations** (Historique)
```sql
- id: uuid (PRIMARY KEY)
- session_id: text
- visitor_id: text
- message: text
- response: text
- message_type: text
- sentiment: text
- confidence_score: numeric
- keywords: text[]
- matched_knowledge_ids: text[]
- is_flagged: boolean
- needs_review: boolean
- user_rating: integer
- created_at: timestamptz
```

**Table: chatbot_stats** (Statistiques quotidiennes)
```sql
- date: date (PRIMARY KEY)
- total_conversations: integer
- total_messages: integer
- unique_visitors: integer
- avg_confidence_score: numeric
- avg_rating: numeric
```

---

## 🔧 IMPLÉMENTATION RECOMMANDÉE

### 1. Service Frontend (Public)

**Fichier**: `src/components/ChatBot.tsx`

```typescript
import { useState } from 'react';
import { MessageSquare, Send, X } from 'lucide-react';
import { getChatbotResponse } from '../services/chatbotAI';
import { createConversation } from '../admin/services/chatbotService';

export const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    setIsLoading(true);

    // Ajouter le message utilisateur
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    try {
      // Appeler l'API IA
      const result = await getChatbotResponse(userMessage, knowledgeBase);

      // Ajouter la réponse
      setMessages(prev => [...prev, { role: 'assistant', content: result.response }]);

      // Enregistrer dans la base de données
      await createConversation({
        session_id: getSessionId(),
        visitor_id: getVisitorId(),
        message: userMessage,
        response: result.response,
        confidence_score: result.confidence,
        matched_knowledge_ids: result.matched_knowledge_ids,
        keywords: extractKeywords(userMessage),
        sentiment: analyzeSentiment(userMessage),
      });

    } catch (error) {
      console.error('Erreur chatbot:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Désolé, une erreur est survenue. Veuillez réessayer.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* ... UI du chatbot ... */}
    </div>
  );
};
```

### 2. Service IA

**Fichier**: `src/services/chatbotAI.ts`

```typescript
import OpenAI from 'openai';
import { ChatbotKnowledge } from '../admin/services/chatbotService';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export const getChatbotResponse = async (
  message: string,
  knowledgeBase: ChatbotKnowledge[]
) => {
  // Filtrer les connaissances actives et pertinentes
  const relevantKnowledge = knowledgeBase
    .filter(k => k.is_active)
    .sort((a, b) => b.priority - a.priority)
    .slice(0, 10); // Top 10

  const systemPrompt = buildSystemPrompt(relevantKnowledge);

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: message }
    ],
    temperature: 0.7,
    max_tokens: 500,
  });

  const response = completion.choices[0].message.content || '';
  const confidence = calculateConfidence(completion.choices[0].finish_reason);
  const matchedIds = findMatchedKnowledge(message, relevantKnowledge);

  return { response, confidence, matched_knowledge_ids: matchedIds };
};

const buildSystemPrompt = (knowledge: ChatbotKnowledge[]) => {
  return `Tu es un assistant virtuel pour le portfolio professionnel de Leonce Ouattara, développeur full-stack.

INFORMATIONS IMPORTANTES:
${knowledge.map(k => `
Catégorie: ${k.category}
Sujet: ${k.title}
Information: ${k.content}
Tags: ${k.tags.join(', ')}
`).join('\n')}

INSTRUCTIONS:
- Réponds de manière concise et professionnelle
- Utilise les informations ci-dessus pour répondre
- Si tu ne sais pas, suggère de contacter directement
- Sois amical et encourageant
- Limite tes réponses à 2-3 phrases maximum`;
};

const calculateConfidence = (finishReason?: string) => {
  if (finishReason === 'stop') return 0.9;
  if (finishReason === 'length') return 0.7;
  return 0.5;
};

const findMatchedKnowledge = (message: string, knowledge: ChatbotKnowledge[]) => {
  const messageLower = message.toLowerCase();
  return knowledge
    .filter(k => {
      const titleMatch = k.title.toLowerCase().includes(messageLower);
      const contentMatch = k.content.toLowerCase().includes(messageLower);
      const tagMatch = k.tags.some(tag => messageLower.includes(tag.toLowerCase()));
      return titleMatch || contentMatch || tagMatch;
    })
    .map(k => k.id);
};
```

### 3. Utilitaires

**Fichier**: `src/utils/chatbotUtils.ts`

```typescript
export const getSessionId = () => {
  let sessionId = sessionStorage.getItem('chatbot_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('chatbot_session_id', sessionId);
  }
  return sessionId;
};

export const getVisitorId = () => {
  let visitorId = localStorage.getItem('chatbot_visitor_id');
  if (!visitorId) {
    visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('chatbot_visitor_id', visitorId);
  }
  return visitorId;
};

export const extractKeywords = (text: string): string[] => {
  const stopWords = ['le', 'la', 'les', 'un', 'une', 'des', 'de', 'du', 'et', 'ou', 'mais', 'donc'];
  return text
    .toLowerCase()
    .split(/\W+/)
    .filter(word => word.length > 3 && !stopWords.includes(word))
    .slice(0, 10);
};

export const analyzeSentiment = (text: string): 'positive' | 'negative' | 'neutral' => {
  const positiveWords = ['merci', 'super', 'excellent', 'génial', 'parfait', 'top'];
  const negativeWords = ['problème', 'erreur', 'bug', 'mauvais', 'nul'];
  
  const textLower = text.toLowerCase();
  const hasPositive = positiveWords.some(word => textLower.includes(word));
  const hasNegative = negativeWords.some(word => textLower.includes(word));
  
  if (hasPositive && !hasNegative) return 'positive';
  if (hasNegative && !hasPositive) return 'negative';
  return 'neutral';
};
```

---

## 📊 COMPOSANTS ADMIN

### ConversationsTab
- Liste toutes les conversations
- Filtres par type, sentiment, statut
- Recherche dans les messages
- Actions: réviser, signaler, supprimer

### KnowledgeBaseTab
- CRUD de la base de connaissances
- Catégorisation des réponses
- Priorités et tags
- Statistiques d'utilisation

### ChatbotStatsTab
- Graphiques de performance
- Satisfaction utilisateur
- Mots-clés populaires
- Tendances temporelles

---

## 🚀 DÉPLOIEMENT

### Variables d'environnement

```.env
# API IA (choisir UNE option)
VITE_OPENAI_API_KEY=sk-...
VITE_GEMINI_API_KEY=...
VITE_ANTHROPIC_API_KEY=...

# Supabase (déjà configuré)
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

### Installation des dépendances

```bash
# Pour OpenAI
npm install openai

# Pour Gemini
npm install @google/generative-ai

# Pour Anthropic
npm install @anthropic-ai/sdk
```

---

## 💡 AMÉLIORATIONS FUTURES

1. **Analyse de sentiment avancée** avec Natural
2. **Traduction automatique** multilingue
3. **Suggestions de réponses** pour l'admin
4. **A/B testing** des réponses
5. **Integration avec Email** pour follow-up
6. **Export des conversations** en CSV
7. **Chatbot voice** avec Web Speech API

---

## 📚 RESSOURCES

- [OpenAI Docs](https://platform.openai.com/docs)
- [Google AI Studio](https://ai.google.dev/)
- [Anthropic Claude](https://www.anthropic.com/)
- [Best Practices Chatbot UX](https://www.nngroup.com/articles/chatbots/)

---

**✅ STATUT**: Prêt pour implémentation
**🎯 RECOMMANDATION**: Utiliser OpenAI GPT-4o-mini pour le meilleur rapport qualité/prix
