# 📊 Système Analytics - Guide d'Utilisation

## 🎯 Vue d'ensemble

Le système d'analytics permet de :
- **Tracker** les interactions utilisateurs (vues, clics, favoris, contacts)
- **Analyser** les performances des annonces
- **Générer** des rapports détaillés
- **Exporter** les données en différents formats

## 🏗️ Architecture

### Backend (Java/Quarkus)
- **Entités JPA** : Stockage des données analytics
- **Services** : Logique métier et calculs
- **REST API** : Endpoints pour le frontend
- **Base de données** : Tables dédiées aux métriques

### Frontend (React Native)
- **AnalyticsService** : Service de tracking et récupération
- **Fallback local** : Fonctionnement hors ligne
- **Interface utilisateur** : Écrans de visualisation

## 🚀 Démarrage Rapide

### 1. Démarrer le système complet
```bash
./start-analytics-system.sh
```

### 2. Démarrer manuellement

#### Backend
```bash
cd Immo/immobilier-api
./mvnw quarkus:dev
```

#### Frontend
```bash
cd appimmofront
npm start
```

## 📱 Utilisation Frontend

### Tracking des événements

```javascript
import AnalyticsService from '../services/AnalyticsService';

// Tracker une vue d'annonce
await AnalyticsService.trackListingView(
  'listing-id-123',
  'user-id-456',
  {
    source: 'app',
    device: 'mobile',
    location: 'Paris'
  }
);

// Tracker un clic
await AnalyticsService.trackListingClick(
  'listing-id-123',
  'user-id-456',
  'contact',
  { source: 'app', device: 'mobile' }
);

// Tracker un favori
await AnalyticsService.trackFavorite(
  'listing-id-123',
  'user-id-456',
  'add',
  { source: 'app', device: 'mobile' }
);
```

### Récupération des statistiques

```javascript
// Statistiques d'une annonce
const listingStats = await AnalyticsService.getListingAnalytics(
  'listing-id-123',
  '30d' // période
);

// Statistiques d'un propriétaire
const ownerStats = await AnalyticsService.getOwnerAnalytics(
  'owner-id-789',
  '30d'
);
```

### Génération de rapports

```javascript
// Rapport d'annonce
const listingReport = await AnalyticsService.generateReport(
  'owner-id-789',
  'listing-id-123', // optionnel
  '30d',
  'comprehensive'
);

// Export de données
const exportedData = await AnalyticsService.exportAnalytics(
  'owner-id-789',
  'json', // format: json, csv, pdf
  '30d'
);
```

## 🔧 API Backend

### Endpoints de Tracking

#### POST /api/analytics/views
```json
{
  "listingId": "uuid",
  "userId": "uuid",
  "source": "app",
  "device": "mobile",
  "location": "Paris",
  "userAgent": "ReactNative/1.0",
  "sessionId": "session_123"
}
```

#### POST /api/analytics/clicks
```json
{
  "listingId": "uuid",
  "userId": "uuid",
  "action": "CONTACT",
  "source": "app",
  "device": "mobile",
  "location": "Paris",
  "sessionId": "session_123"
}
```

#### POST /api/analytics/favorites
```json
{
  "listingId": "uuid",
  "userId": "uuid",
  "action": "ADD",
  "source": "app",
  "device": "mobile"
}
```

### Endpoints de Statistiques

#### GET /api/analytics/stats/listing/{listingId}
- **Paramètres** : `period` (7d, 30d, 90d, 1y)
- **Retour** : Métriques détaillées de l'annonce

#### GET /api/analytics/stats/owner/{ownerId}
- **Paramètres** : `period` (7d, 30d, 90d, 1y)
- **Retour** : Statistiques globales du propriétaire

#### GET /api/analytics/stats/top-listings/{ownerId}
- **Paramètres** : `period`, `limit`
- **Retour** : Top des annonces par performance

### Endpoints de Rapports

#### GET /api/analytics/reports/listing/{listingId}
- **Paramètres** : `period`
- **Retour** : Rapport détaillé de l'annonce

#### GET /api/analytics/reports/owner/{ownerId}
- **Paramètres** : `period`
- **Retour** : Rapport global du propriétaire

### Endpoints d'Export

#### GET /api/analytics/reports/export/listing/{listingId}
- **Paramètres** : `period`, `format` (csv, json, pdf)
- **Retour** : Fichier exporté

#### GET /api/analytics/reports/export/owner/{ownerId}
- **Paramètres** : `period`, `format` (csv, json, pdf)
- **Retour** : Fichier exporté

## 🧪 Tests

### Tests Backend
```bash
./test-analytics-backend.sh
```

### Tests Frontend
```bash
./test-analytics-frontend.sh
```

### Tests d'Intégration
```bash
./test-analytics-integration.sh
```

## 📊 Métriques Disponibles

### Métriques de Base
- **Vues totales** : Nombre total de vues
- **Vues uniques** : Nombre d'utilisateurs uniques
- **Clics** : Nombre de clics
- **Favoris** : Nombre d'ajouts aux favoris
- **Contacts** : Nombre de contacts
- **Conversions** : Nombre de conversions

### Taux de Conversion
- **Taux de conversion** : Conversions / Vues × 100
- **Taux de clic** : Clics / Vues × 100
- **Taux de favori** : Favoris / Vues × 100
- **Taux de contact** : Contacts / Vues × 100

### Répartitions
- **Par source** : app, web, search, etc.
- **Par device** : mobile, desktop, tablet
- **Par période** : évolution dans le temps

## 🔍 Dépannage

### Backend non accessible
```bash
# Vérifier les processus
ps aux | grep quarkus

# Redémarrer
pkill -f "quarkus:dev"
cd Immo/immobilier-api
./mvnw quarkus:dev
```

### Erreurs de base de données
```bash
# Vérifier les migrations
cd Immo/immobilier-api
./mvnw flyway:info

# Appliquer les migrations
./mvnw flyway:migrate
```

### Erreurs frontend
```bash
# Nettoyer le cache
cd appimmofront
npm start -- --reset-cache

# Réinstaller les dépendances
rm -rf node_modules
npm install
```

## 📈 Exemples d'Utilisation

### Dashboard Propriétaire
```javascript
// Récupérer les statistiques pour un dashboard
const ownerStats = await AnalyticsService.getOwnerAnalytics(ownerId, '30d');

// Afficher les métriques clés
console.log(`Vues: ${ownerStats.metrics.totalViews}`);
console.log(`Contacts: ${ownerStats.metrics.totalContacts}`);
console.log(`Taux de conversion: ${ownerStats.metrics.conversionRate}%`);

// Afficher le top des annonces
ownerStats.topListings.forEach((listing, index) => {
  console.log(`${index + 1}. ${listing.listingId}: ${listing.views} vues`);
});
```

### Rapport Détaillé
```javascript
// Générer un rapport complet
const report = await AnalyticsService.generateReport(ownerId, null, '90d');

// Analyser les recommandations
report.recommendations.forEach(rec => {
  console.log(`${rec.priority}: ${rec.title}`);
  console.log(rec.description);
});

// Exporter en PDF
const pdfData = await AnalyticsService.exportAnalytics(ownerId, 'pdf', '90d');
```

## 🔐 Sécurité

- **Authentification** : Tous les endpoints nécessitent une authentification
- **Autorisation** : Rôles USER et ADMIN
- **Validation** : Validation des données d'entrée
- **Logs** : Traçabilité des actions

## 📝 Logs et Monitoring

### Logs Backend
```bash
# Voir les logs en temps réel
tail -f Immo/immobilier-api/quarkus.log

# Logs spécifiques analytics
grep "Analytics" Immo/immobilier-api/quarkus.log
```

### Logs Frontend
```javascript
// Activer les logs détaillés
console.log('Analytics tracking:', viewData);
console.log('Analytics response:', response);
```

## 🚀 Déploiement

### Backend
```bash
# Build de production
cd Immo/immobilier-api
./mvnw package -Pnative

# Démarrage en production
java -jar target/quarkus-app/quarkus-run.jar
```

### Frontend
```bash
# Build de production
cd appimmofront
npx react-native build-android --mode=release
npx react-native build-ios --mode=release
```

## 📞 Support

Pour toute question ou problème :
1. Consultez les logs
2. Vérifiez la connectivité
3. Testez les endpoints individuellement
4. Consultez la documentation API
