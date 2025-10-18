# 🔥 Guide d'Intégration Firebase Complète

Ce guide explique l'implémentation complète de Firebase avec `@react-native-firebase/messaging` dans votre application immobilier.

## 🎯 Fonctionnalités Implémentées

### ✅ **1. Vraie Intégration Firebase**
- **Package**: `@react-native-firebase/messaging`
- **Configuration**: Firebase natif avec tokens FCM réels
- **Permissions**: Gestion automatique des permissions iOS/Android

### ✅ **2. Topics Personnalisés Basés sur les Préférences**
- **Rôle utilisateur**: `owners`, `buyers`, `both`
- **Localisation**: `city_paris`, `region_ile_de_france`
- **Budget**: `budget_low`, `budget_medium`, `budget_high`, `budget_luxury`
- **Types de propriétés**: `type_appartement`, `type_maison`, etc.
- **Préférences**: `property_alerts`, `price_drop_alerts`, `new_listing_alerts`

### ✅ **3. Navigation Intelligente**
- **Navigation automatique** vers des écrans spécifiques
- **Gestion des paramètres** de navigation
- **Fallback** vers l'accueil en cas d'erreur

## 📁 Nouveaux Fichiers Créés

### **Configuration Firebase**
```
config/FirebaseConfig.js          # Configuration Firebase native
firebase.json                     # Configuration React Native Firebase
```

### **Services Avancés**
```
services/TopicService.js                    # Gestion des topics personnalisés
services/NotificationNavigationService.js   # Navigation basée sur les notifications
```

### **Écrans**
```
screens/AdvancedNotificationSettingsScreen.js  # Interface de gestion avancée
```

### **Scripts de Test**
```
test-firebase-notifications.js    # Tests complets
test-notification-quick.js        # Test rapide
```

## 🚀 Installation et Configuration

### **1. Dépendances Installées**
```bash
npm install @react-native-firebase/app @react-native-firebase/messaging
npm install expo-device
```

### **2. Configuration Android**
Ajoutez dans `android/app/build.gradle`:
```gradle
apply plugin: 'com.google.gms.google-services'
```

### **3. Configuration iOS**
Le fichier `GoogleService-Info.plist` est déjà configuré.

## 🎮 Utilisation

### **1. Initialisation Automatique**
Le service s'initialise automatiquement dans `App.js`:
```javascript
// Configuration de la navigation
NotificationNavigationService.setNavigationRef(navigationRef.current);

// Initialisation des notifications
NotificationService.initialize();
```

### **2. Gestion des Préférences**
```javascript
// Charger les préférences
const preferences = await TopicService.loadUserPreferences();

// Sauvegarder les préférences (met à jour automatiquement les topics)
await TopicService.saveUserPreferences(newPreferences);
```

### **3. Navigation Automatique**
```javascript
// Les notifications avec ces données naviguent automatiquement:
{
  type: 'new_listing',
  listingId: '12345',
  screen: 'property_details',
  params: { id: '12345' }
}
```

## 🧪 Tests Disponibles

### **1. Test Rapide**
```bash
node test-notification-quick.js
```

### **2. Test Complet**
```bash
node test-firebase-notifications.js
```

### **3. Test via l'Application**
1. Ouvrez l'app
2. Allez dans **Paramètres** → **Notifications Avancées**
3. Configurez vos préférences
4. Testez les notifications

## 📊 Types de Notifications Supportés

### **Notifications Immobilières**
- `new_listing`: Nouvelle annonce
- `price_drop`: Baisse de prix
- `property_approved`: Annonce approuvée
- `property_rejected`: Annonce rejetée

### **Notifications de Communication**
- `new_message`: Nouveau message
- `admin_message`: Message admin

### **Notifications de Gestion**
- `maintenance_reminder`: Rappel maintenance
- `payment_reminder`: Rappel paiement
- `favorite_update`: Mise à jour favoris

## 🎯 Topics Dynamiques

### **Topics Basés sur le Rôle**
- `all_users`: Tous les utilisateurs
- `owners`: Propriétaires uniquement
- `buyers`: Acheteurs uniquement

### **Topics Basés sur la Localisation**
- `city_paris`: Utilisateurs de Paris
- `region_ile_de_france`: Utilisateurs d'Île-de-France

### **Topics Basés sur les Préférences**
- `property_alerts`: Alertes de propriétés
- `price_drop_alerts`: Alertes de baisse de prix
- `new_listing_alerts`: Nouvelles annonces
- `message_notifications`: Notifications de messages

### **Topics Basés sur le Budget**
- `budget_low`: Budget économique
- `budget_medium`: Budget moyen
- `budget_high`: Budget élevé
- `budget_luxury`: Budget luxe

### **Topics Basés sur le Type**
- `type_appartement`: Appartements
- `type_maison`: Maisons
- `type_studio`: Studios
- etc.

## 🔧 Configuration Backend

### **Endpoint d'Enregistrement de Token**
```javascript
POST /api/notifications/device-token
{
  "token": "fcm_token_here",
  "platform": "IOS|ANDROID",
  "appVersion": "1.0.0",
  "deviceModel": "iPhone 14",
  "tokenType": "FCM"
}
```

### **Endpoint d'Abonnement aux Topics**
```javascript
POST /api/notifications/topic-subscription
{
  "topic": "city_paris",
  "action": "subscribe|unsubscribe",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## 📱 Navigation Intelligente

### **Types de Navigation Supportés**
```javascript
// Navigation vers une propriété
{
  type: 'new_listing',
  listingId: '12345',
  screen: 'property_details',
  params: { id: '12345' }
}

// Navigation vers un chat
{
  type: 'new_message',
  conversationId: '67890',
  screen: 'chat',
  params: { conversationId: '67890' }
}

// Navigation vers les favoris
{
  type: 'favorite_update',
  screen: 'favorites'
}
```

## 🎨 Interface Utilisateur

### **Écran de Paramètres Avancés**
- **Configuration du rôle** utilisateur
- **Sélection de la localisation**
- **Choix du budget**
- **Types de propriétés** préférés
- **Préférences de notification**
- **Affichage des topics** actuels
- **Token FCM** pour les tests

## 🔍 Débogage et Monitoring

### **Logs Disponibles**
```javascript
// Initialisation
🚀 Début de l'initialisation du NotificationService...
🔥 Configuration de Firebase Messaging...
📋 Demande des permissions Firebase...
🔑 Obtention du token FCM...
📢 Initialisation du TopicService...

// Notifications
📨 Notification Firebase reçue: {...}
🔓 Notification Firebase ouverte: {...}
🧭 Navigation basée sur la notification: {...}
```

### **Vérification des Topics**
```javascript
// Obtenir les topics actuels
const topics = TopicService.getCurrentTopics();
console.log('Topics actuels:', topics);
```

## 🚨 Dépannage

### **Problème: Token FCM non généré**
```javascript
// Vérifier les permissions
const hasPermission = await firebaseMessaging.requestUserPermission();
if (!hasPermission) {
  console.log('Permissions refusées');
}
```

### **Problème: Topics non mis à jour**
```javascript
// Forcer la mise à jour des topics
await TopicService.updateTopicsBasedOnPreferences();
```

### **Problème: Navigation ne fonctionne pas**
```javascript
// Vérifier la référence de navigation
NotificationNavigationService.setNavigationRef(navigationRef.current);
```

## 🎯 Prochaines Étapes

### **1. Intégration Backend**
- Implémenter les endpoints d'enregistrement de tokens
- Créer le système d'envoi de notifications
- Gérer les abonnements aux topics

### **2. Analytics Avancées**
- Suivi des interactions avec les notifications
- Métriques d'engagement
- A/B testing des notifications

### **3. Notifications Programmées**
- Rappels de maintenance
- Notifications de suivi
- Campagnes marketing ciblées

### **4. Personnalisation Avancée**
- Machine learning pour les recommandations
- Notifications contextuelles
- Géolocalisation précise

---

## 🎉 Résumé

Votre application dispose maintenant d'un système de notifications Firebase complet avec:

✅ **Vraie intégration Firebase** avec tokens FCM réels  
✅ **Topics personnalisés** basés sur les préférences utilisateur  
✅ **Navigation intelligente** vers des écrans spécifiques  
✅ **Interface de gestion** avancée des préférences  
✅ **Scripts de test** complets  
✅ **Gestion d'erreurs** robuste  
✅ **Logs détaillés** pour le débogage  

Le système est prêt pour la production et peut être étendu facilement avec de nouvelles fonctionnalités ! 🚀
