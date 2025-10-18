# 🔥 Configuration Firebase pour les Notifications

## 📋 Prérequis

1. **Compte Firebase** : Créez un projet sur [Firebase Console](https://console.firebase.google.com/)
2. **Service Account** : Générez une clé de service pour l'API
3. **Configuration** : Suivez les étapes ci-dessous

## 🚀 Configuration

### **1. Créer un projet Firebase**

1. Allez sur [Firebase Console](https://console.firebase.google.com/)
2. Cliquez sur "Ajouter un projet"
3. Nommez votre projet (ex: `app-immo-notifications`)
4. Activez Google Analytics (optionnel)

### **2. Activer Firebase Cloud Messaging**

1. Dans votre projet Firebase, allez dans **Messaging**
2. Cliquez sur "Commencer"
3. Configurez les paramètres de notification

### **3. Générer une clé de service**

1. Allez dans **Paramètres du projet** → **Comptes de service**
2. Cliquez sur "Générer une nouvelle clé privée"
3. Téléchargez le fichier JSON
4. Renommez-le : `firebase-adminsdk.json`

### **4. Configuration des fichiers**

#### **Frontend (React Native)**
```bash
# Placez le fichier dans le dossier appimmofront/
appimmofront/firebase-adminsdk.json
```

#### **Backend (Java)**
```bash
# Placez le fichier dans src/main/resources/
src/main/resources/firebase-adminsdk.json
```

### **5. Variables d'environnement**

Créez un fichier `.env` (non versionné) :
```env
FIREBASE_PROJECT_ID=app-immo-notifications
FIREBASE_PRIVATE_KEY_ID=your_key_id
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@project.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your_client_id
```

## 🧪 Tests

### **Test des notifications**
```bash
# Test rapide
node test-notification-quick.js

# Test des 4 types de notifications
node test-notification-types.js

# Test avancé avec navigation
node test-advanced-notifications.js
```

### **Test dans l'application**
1. Ouvrez votre app dans Expo Go
2. Allez dans **Paramètres** → **Notifications Avancées**
3. Configurez vos préférences
4. Testez les notifications locales

## 📱 Types de Notifications Supportés

### **1. 🏠 Nouvelles annonces**
- **Déclencheur** : Nouvelle annonce correspondant aux critères de recherche
- **Navigation** : `search_results` avec highlight des nouvelles annonces

### **2. 💬 Messages reçus**
- **Déclencheur** : Nouveau message dans une conversation
- **Navigation** : `chat` avec highlight du nouveau message

### **3. 📝 Changements de statut**
- **Déclencheur** : Modification du statut d'une annonce
- **Navigation** : `my_listings` avec highlight du statut modifié

### **4. 💳 Rappels de paiement**
- **Déclencheur** : Paiement dû ou abonnement à renouveler
- **Navigation** : `payment` avec highlight urgent

## 🔧 Intégration Backend

### **Dépendances Java**
```xml
<dependency>
    <groupId>com.google.firebase</groupId>
    <artifactId>firebase-admin</artifactId>
    <version>9.2.0</version>
</dependency>
```

### **Configuration Java**
```java
@ApplicationScoped
public class FirebaseInitializer {
    
    @PostConstruct
    public void initializeFirebase() {
        try {
            FileInputStream serviceAccount = new FileInputStream("firebase-adminsdk.json");
            FirebaseOptions options = FirebaseOptions.builder()
                .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                .build();
                
            FirebaseApp.initializeApp(options);
        } catch (Exception e) {
            System.err.println("Erreur initialisation Firebase: " + e.getMessage());
        }
    }
}
```

## 🚨 Sécurité

### **⚠️ Important : Ne jamais commiter les secrets !**

- ✅ Utilisez `.gitignore` pour exclure les fichiers de clés
- ✅ Utilisez des variables d'environnement en production
- ✅ Régénérez les clés si elles sont exposées
- ✅ Limitez les permissions des comptes de service

### **Fichiers à exclure du Git**
```
# Dans .gitignore
**/firebase-adminsdk-*.json
**/GoogleService-Info.plist
**/google-services.json
.env
```

## 📊 Monitoring

### **Métriques à suivre**
- ✅ **Taux de livraison** des notifications
- ✅ **Taux d'ouverture** des notifications
- ✅ **Navigation** vers les écrans cibles
- ✅ **Engagement** utilisateur

### **Logs à implémenter**
```java
System.out.println("Notification envoyée: " + response);
System.out.println("Type: " + notificationType);
System.out.println("Utilisateur: " + userId);
```

## 🎯 Prochaines Étapes

1. **Configurez Firebase** avec vos propres clés
2. **Testez les notifications** avec les scripts fournis
3. **Intégrez dans votre API** Java
4. **Déployez en production** avec les vraies clés

## 📞 Support

Si vous rencontrez des problèmes :
1. **Consultez les guides** créés
2. **Testez avec les scripts** fournis
3. **Vérifiez la configuration** Firebase
4. **Vérifiez les logs** de l'application

---

**🎉 Votre système de notifications Firebase est prêt !**
