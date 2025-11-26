# 🔐 Interface Admin - Phase 1 : Authentification

## ✅ Ce qui a été développé

### 1. Service d'authentification (`authService.ts`)
Fonctions complètes pour gérer l'authentification Supabase :
- `login(email, password)` : Connexion avec email/mot de passe
- `logout()` : Déconnexion
- `getSession()` : Récupérer la session active
- `getCurrentUser()` : Récupérer l'utilisateur connecté
- `checkAuth()` : Vérifier si authentifié
- `updatePassword(newPassword)` : Changer le mot de passe
- `resetPassword(email)` : Réinitialisation par email

### 2. Hook React d'authentification (`useAuth.tsx`)
Context Provider qui expose :
- `user` : Utilisateur connecté
- `session` : Session Supabase active
- `loading` : État de chargement
- `isAuthenticated` : Boolean d'authentification
- `login(credentials)` : Fonction de connexion
- `logout()` : Fonction de déconnexion
- `refreshSession()` : Rafraîchir la session

### 3. Composant ProtectedRoute (`ProtectedRoute.tsx`)
HOC qui protège les routes admin :
- Vérifie l'authentification avant d'afficher le contenu
- Redirige vers `/admin/login` si non authentifié
- Affiche un loader pendant la vérification

### 4. Page de connexion (`Login.tsx`)
Interface moderne avec :
- Formulaire email + mot de passe
- Validation côté client (Zod-like logic)
- Affichage/masquage du mot de passe
- Gestion des erreurs (email invalide, mauvais credentials, etc.)
- Design cohérent avec le site principal (Tailwind + Gradient)
- Redirection automatique après connexion

### 5. Dashboard temporaire (`Dashboard.tsx`)
Page simple pour tester l'authentification :
- Affiche l'email de l'utilisateur connecté
- Bouton de déconnexion fonctionnel
- Messages de succès de la Phase 1

### 6. Routes admin dans App.tsx
Routes ajoutées :
- `/admin/login` : Page de connexion (public)
- `/admin` : Redirige vers `/admin/dashboard` (protégé)
- `/admin/dashboard` : Dashboard admin (protégé)

---

## 🚀 Comment tester

### 1. Créer un utilisateur admin dans Supabase

Allez sur votre **Supabase Dashboard** :

1. Cliquez sur **Authentication** dans le menu latéral
2. Cliquez sur **Users**
3. Cliquez sur **Add user** (bouton vert en haut à droite)
4. Remplissez :
   - **Email** : `admin@example.com` (ou votre email)
   - **Password** : Créez un mot de passe sécurisé (min. 6 caractères)
   - Cochez **Auto Confirm User** (pour éviter l'email de confirmation)
5. Cliquez sur **Create User**

### 2. Lancer le serveur de développement

```bash
npm run dev
```

### 3. Tester l'authentification

1. Ouvrez votre navigateur et allez sur `http://localhost:5173/admin`
2. Vous serez automatiquement redirigé vers `/admin/login`
3. Connectez-vous avec les identifiants créés dans Supabase
4. Vous devriez être redirigé vers `/admin/dashboard`
5. Testez le bouton de déconnexion

### 4. Vérifier les protections

- Essayez d'accéder à `/admin/dashboard` sans être connecté
- Vous devriez être redirigé vers `/admin/login`
- Connectez-vous puis fermez l'onglet
- Rouvrez `/admin/dashboard` : vous devriez rester connecté (session persistante)

---

## 🔒 Sécurité mise en place

✅ **Routes protégées** : Toutes les routes `/admin/*` (sauf login) sont protégées  
✅ **Session persistante** : La session Supabase est sauvegardée dans localStorage  
✅ **RLS activé** : Les politiques Supabase empêchent les INSERT/UPDATE/DELETE non authentifiés  
✅ **Validation client** : Email et mot de passe validés avant envoi  
✅ **Gestion des erreurs** : Messages clairs pour l'utilisateur  

---

## 📁 Structure des fichiers créés

```
src/
├── admin/
│   ├── components/
│   │   └── ProtectedRoute.tsx          # Protection des routes
│   ├── hooks/
│   │   └── useAuth.tsx                 # Hook d'authentification
│   ├── pages/
│   │   ├── Login.tsx                   # Page de connexion
│   │   └── Dashboard.tsx               # Dashboard temporaire
│   └── services/
│       └── authService.ts              # Service d'authentification
└── App.tsx                              # Routes admin ajoutées
```

---

## 🎯 Prochaines étapes (Phase 2)

La Phase 1 est **terminée et fonctionnelle** ! 

**Phase 2 - Layout & Interface Admin** :
1. Créer le layout admin complet (AdminLayout.tsx)
2. Développer le Sidebar avec menu de navigation
3. Créer le TopBar avec user menu et logout
4. Créer les composants UI réutilisables (Button, Input, Modal, etc.)
5. Configurer React Query pour le data fetching
6. Configurer React Hot Toast pour les notifications

---

## ❓ Dépannage

### Erreur : "Invalid login credentials"
→ Vérifiez que l'utilisateur existe bien dans Supabase Dashboard > Authentication > Users

### Erreur : "Email not confirmed"
→ Dans Supabase Dashboard, assurez-vous d'avoir coché "Auto Confirm User" lors de la création

### La session ne persiste pas
→ Vérifiez que votre navigateur autorise localStorage (pas en navigation privée)

### Erreur de CORS
→ Vérifiez que l'URL Supabase dans `.env` est correcte

---

## 📞 Support

Si vous rencontrez des problèmes, vérifiez :
1. Les variables d'environnement dans `.env` (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
2. Que l'utilisateur admin existe dans Supabase
3. Les logs dans la console du navigateur (F12)
4. Les logs dans la console Supabase (Dashboard > Logs)

---

**✅ Phase 1 terminée ! Prêt pour la Phase 2 !** 🚀
