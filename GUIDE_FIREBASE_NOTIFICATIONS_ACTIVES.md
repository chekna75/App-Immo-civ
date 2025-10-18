# 🔥 Guide des Notifications Firebase Actives

## ✅ État Actuel

**Firebase est maintenant configuré et actif !** Le serveur Quarkus démarre correctement avec les variables d'environnement Firebase.

### 🎯 Progrès Réalisés

1. ✅ **Configuration Firebase** - Variables d'environnement configurées
2. ✅ **Serveur Quarkus** - Démarre avec Firebase initialisé
3. ✅ **Authentification** - Connexion utilisateur fonctionne
4. ✅ **Récupération notifications** - Endpoint fonctionne

### ⚠️ Problèmes Restants

1. **Enregistrement des tokens** - Erreur 400 "Error invoking subclass method"
2. **Envoi de notifications** - Erreur 400 "Not able to deserialize data provided"

## 🔧 Prochaines Étapes

### 1. Résoudre l'Enregistrement des Tokens

**Problème :** `Error invoking subclass method` lors de l'enregistrement d'un token Expo Push

**Solutions à tester :**
- Vérifier la structure de la requête `RegisterDeviceTokenRequest`
- Vérifier les contraintes de validation
- Vérifier la relation entre `UserEntity` et `DeviceTokenEntity`

### 2. Résoudre la Sérialisation des Données

**Problème :** `Not able to deserialize data provided` lors de l'envoi de notifications

**Solutions à tester :**
- Vérifier le format des données dans `SendNotificationRequest`
- Vérifier la sérialisation JSON dans `NotificationService`
- Vérifier le type de colonne `data` dans la base de données

### 3. Tester les Vraies Notifications

Une fois les erreurs corrigées :
1. Ouvrir l'application Expo sur le téléphone
2. Scanner le QR code
3. Se connecter avec : `john.doe@example.com` / `NewPassword123!`
4. Tester l'envoi de notifications Firebase

## 🚀 Commandes Utiles

### Démarrer le Serveur avec Firebase
```bash
cd "/Users/chekna/Desktop/App Immo civ"
./start-quarkus-with-firebase.sh
```

### Tester les Notifications
```bash
cd "/Users/chekna/Desktop/App Immo civ"
node test-firebase-notifications.js
```

### Vérifier l'État du Serveur
```bash
curl -s http://192.168.1.158:8080/health
```

## 📱 Configuration Frontend

L'application frontend est configurée pour :
- Utiliser Expo Notifications (au lieu de Firebase direct)
- Se connecter au serveur sur `192.168.1.158:8080`
- Envoyer les tokens Expo Push au backend
- Recevoir les notifications via le backend Firebase

## 🔍 Debug

### Logs du Serveur
Les logs du serveur Quarkus sont affichés dans le terminal où il s'exécute.

### Test des Endpoints
- **Health Check :** `GET /health`
- **Connexion :** `POST /auth/login-email`
- **Enregistrement token :** `POST /api/notifications/device-token`
- **Envoi notification :** `POST /api/notifications/send`
- **Récupération notifications :** `GET /api/notifications`

## 🎉 Résultat Attendu

Une fois tous les problèmes résolus, vous devriez pouvoir :
1. Vous connecter à l'application mobile
2. Enregistrer automatiquement votre token Expo Push
3. Recevoir des notifications Firebase en temps réel
4. Voir les notifications dans l'historique de l'application

---

**Firebase est configuré et prêt ! Il ne reste plus qu'à corriger les deux erreurs de sérialisation pour activer complètement les notifications push.**
