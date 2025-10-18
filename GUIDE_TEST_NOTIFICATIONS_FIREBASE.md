# 🔔 Guide de Test des Notifications Firebase

Ce guide vous explique comment tester les notifications Firebase dans votre application immobilier.

## 📋 Prérequis

- ✅ Firebase configuré (déjà fait)
- ✅ Service de notifications mis à jour
- ✅ Script de test créé
- ✅ Dépendances installées

## 🚀 Méthodes de Test

### 1. Test via l'Application Mobile

#### Étape 1: Obtenir le Token FCM
1. Ouvrez votre application mobile
2. Allez dans **Paramètres** → **Notifications**
3. Appuyez sur **"Tester les notifications"**
4. Copiez le token FCM affiché

#### Étape 2: Utiliser le Script de Test
```bash
cd "/Users/chekna/Desktop/App Immo civ"
node test-firebase-notifications.js
```

### 2. Test via la Console Firebase

#### Étape 1: Accéder à la Console
1. Allez sur [Firebase Console](https://console.firebase.google.com/)
2. Sélectionnez votre projet: `app-immo-notifications`
3. Allez dans **Messaging** → **Send your first message**

#### Étape 2: Créer une Notification
1. **Titre**: "🏠 Test Immobilier"
2. **Texte**: "Ceci est une notification de test!"
3. **Cible**: 
   - Pour un appareil spécifique: collez le token FCM
   - Pour tous les utilisateurs: sélectionnez "Topic" → "all_users"

### 3. Test via l'API Backend

#### Étape 1: Utiliser l'endpoint de test
```bash
curl -X POST http://192.168.1.158:8080/api/notifications/test \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Test Notification",
    "body": "Ceci est un test depuis l API",
    "data": {
      "type": "test",
      "screen": "home"
    }
  }'
```

## 🧪 Types de Tests Disponibles

### 1. Notification Simple
- **Objectif**: Vérifier que les notifications arrivent
- **Données**: Titre + Corps
- **Cible**: Appareil spécifique

### 2. Notification avec Données
- **Objectif**: Tester la navigation vers des écrans spécifiques
- **Données**: Titre + Corps + Données personnalisées
- **Exemple**: Navigation vers une annonce spécifique

### 3. Notification par Topic
- **Objectif**: Tester les notifications de masse
- **Topics disponibles**:
  - `all_users`: Tous les utilisateurs
  - `owners`: Propriétaires uniquement
  - `buyers`: Acheteurs uniquement

### 4. Notification Conditionnelle
- **Objectif**: Tester les notifications basées sur les préférences
- **Exemple**: Alertes de prix, nouvelles annonces

## 📱 Vérification des Résultats

### Dans l'Application
1. **Logs de la console**: Vérifiez les messages de debug
2. **Notifications reçues**: Vérifiez l'affichage des notifications
3. **Navigation**: Testez la navigation vers les écrans appropriés

### Dans Firebase Console
1. **Messaging**: Vérifiez les statistiques d'envoi
2. **Analytics**: Consultez les métriques d'engagement
3. **Crashlytics**: Vérifiez s'il y a des erreurs

## 🔧 Dépannage

### Problème: Token FCM non généré
**Solution**:
```javascript
// Vérifiez les permissions
const { status } = await Notifications.getPermissionsAsync();
if (status !== 'granted') {
  await Notifications.requestPermissionsAsync();
}
```

### Problème: Notifications non reçues
**Solutions**:
1. Vérifiez que l'app est en arrière-plan
2. Vérifiez les paramètres de notification du système
3. Vérifiez la configuration Firebase

### Problème: Navigation ne fonctionne pas
**Solution**:
```javascript
// Vérifiez les données de la notification
const data = notification.request.content.data;
if (data.screen) {
  navigation.navigate(data.screen, data.params);
}
```

## 📊 Exemples de Tests

### Test 1: Nouvelle Annonce
```javascript
{
  "title": "🏠 Nouvelle annonce disponible!",
  "body": "Découvrez cette magnifique propriété à Paris",
  "data": {
    "type": "new_listing",
    "listingId": "12345",
    "screen": "property_details",
    "params": { "id": "12345" }
  }
}
```

### Test 2: Nouveau Message
```javascript
{
  "title": "💬 Nouveau message",
  "body": "Vous avez reçu un message concernant votre annonce",
  "data": {
    "type": "new_message",
    "conversationId": "67890",
    "screen": "chat",
    "params": { "conversationId": "67890" }
  }
}
```

### Test 3: Alerte de Prix
```javascript
{
  "title": "💰 Prix réduit!",
  "body": "Le prix de cette propriété a été réduit de 10%",
  "data": {
    "type": "price_drop",
    "listingId": "12345",
    "screen": "property_details",
    "params": { "id": "12345" }
  }
}
```

## 🎯 Prochaines Étapes

1. **Implémentation complète de Firebase**: Remplacer les tokens simulés par de vrais tokens FCM
2. **Topics dynamiques**: Créer des topics basés sur les préférences utilisateur
3. **Notifications programmées**: Implémenter les notifications différées
4. **Analytics avancées**: Ajouter le suivi des interactions avec les notifications

## 📞 Support

Si vous rencontrez des problèmes:
1. Vérifiez les logs de l'application
2. Consultez la console Firebase
3. Testez avec le script fourni
4. Vérifiez la configuration des permissions

---

**Note**: Ce guide utilise des tokens FCM simulés pour les tests. Pour la production, vous devrez implémenter la vraie intégration Firebase avec `@react-native-firebase/messaging`.
