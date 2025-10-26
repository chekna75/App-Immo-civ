# 🌍 Implémentation de la Géolocalisation et Recherche par Proximité

## 📋 Résumé des Améliorations

Ce document décrit les améliorations apportées au système de géolocalisation pour corriger l'écart entre le frontend et le backend.

## 🔧 Problèmes Identifiés

### 1. **API de Recherche par Proximité Manquante**
- Le backend avait la logique de calcul de distance mais aucun endpoint pour l'exposer
- Le `ListingResource` ne supportait que les filtres basiques (ville, type, prix)

### 2. **DTO de Filtres Incomplet**
- Le `FiltersDto` ne contenait pas les paramètres de géolocalisation
- Impossible de passer les coordonnées et le rayon de recherche

### 3. **Optimisations Manquantes**
- Pas d'index géospatiaux sur les colonnes latitude/longitude
- Pas de mise en cache des résultats de recherche
- Pagination géospatiale non optimisée

## ✅ Solutions Implémentées

### 1. **Enrichissement du FiltersDto**

```java
public record FiltersDto(
    String city, 
    String district, 
    ListingType type,
    BigDecimal minPrice, 
    BigDecimal maxPrice,
    // Ajouts pour la géolocalisation
    BigDecimal latitude,
    BigDecimal longitude,
    Double radiusKm,
    Boolean searchByProximity
) {}
```

### 2. **Nouvel Endpoint de Recherche par Proximité**

```java
@GET
@Path("/search/proximity")
public Response searchByProximity(
    @QueryParam("latitude") BigDecimal latitude,
    @QueryParam("longitude") BigDecimal longitude,
    @QueryParam("radius") @DefaultValue("10") Double radiusKm,
    @QueryParam("type") String type,
    @QueryParam("minPrice") BigDecimal minPrice,
    @QueryParam("maxPrice") BigDecimal maxPrice,
    @QueryParam("page") @DefaultValue("0") int page,
    @QueryParam("size") @DefaultValue("10") int size
)
```

**Fonctionnalités :**
- ✅ Validation des coordonnées obligatoires
- ✅ Validation des plages de coordonnées (-90/90 pour latitude, -180/180 pour longitude)
- ✅ Support des filtres additionnels (type, prix)
- ✅ Pagination géospatiale
- ✅ Gestion d'erreurs avec messages explicites

### 3. **Méthode de Service Optimisée**

```java
@CacheResult(cacheName = "proximity-search")
public PagedDto<ListingEntity> searchByProximity(
    BigDecimal latitude, 
    BigDecimal longitude, 
    Double radiusKm,
    ListingType type,
    BigDecimal minPrice,
    BigDecimal maxPrice,
    int page, 
    int size
)
```

**Optimisations :**
- ✅ Mise en cache automatique des résultats
- ✅ Utilisation de la méthode `searchEnriched` du repository
- ✅ Calcul de distance avec la formule de Haversine

### 4. **Index Géospatiaux**

Migration `V22__add_spatial_indexes.sql` :

```sql
-- Index composite sur latitude et longitude
CREATE INDEX IF NOT EXISTS idx_listings_location ON listings (latitude, longitude);

-- Index composite sur status, latitude et longitude
CREATE INDEX IF NOT EXISTS idx_listings_status_location ON listings (status, latitude, longitude);

-- Index sur les coordonnées non-null
CREATE INDEX IF NOT EXISTS idx_listings_coords_not_null ON listings (latitude, longitude) 
WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

-- Index pour les requêtes avec filtres de prix
CREATE INDEX IF NOT EXISTS idx_listings_proximity_price ON listings (status, latitude, longitude, price)
WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

-- Index pour les requêtes avec filtres de type
CREATE INDEX IF NOT EXISTS idx_listings_proximity_type ON listings (status, latitude, longitude, type)
WHERE latitude IS NOT NULL AND longitude IS NOT NULL;
```

### 5. **Configuration du Cache**

Dans `application.properties` :

```properties
# Configuration du cache pour les requêtes de proximité
quarkus.cache.enabled=true
quarkus.cache.caffeine.proximity-search.maximum-size=1000
quarkus.cache.caffeine.proximity-search.expire-after-write=PT10M
```

### 6. **Dépendance de Cache Ajoutée**

Dans `pom.xml` :

```xml
<dependency>
    <groupId>io.quarkus</groupId>
    <artifactId>quarkus-cache</artifactId>
</dependency>
```

## 🔄 Synchronisation Frontend/Backend

### Frontend (Mobile)
- ✅ Service `LocationService` avec calcul de distance Haversine
- ✅ Interface de recherche avancée avec toggle de proximité
- ✅ Gestion des permissions de géolocalisation
- ✅ Calcul de distance côté client pour l'affichage

### Backend (API)
- ✅ Endpoint `/listings/search/proximity` pour la recherche serveur
- ✅ Même formule de Haversine pour la cohérence
- ✅ Validation des coordonnées côté serveur
- ✅ Optimisation avec index et cache

## 🧪 Tests

Un script de test complet a été créé : `test-geolocation-api.sh`

**Tests inclus :**
1. ✅ Recherche par proximité complète avec tous les filtres
2. ✅ Recherche par proximité sans filtres de prix
3. ✅ Validation des coordonnées manquantes
4. ✅ Validation des coordonnées invalides
5. ✅ Recherche avec rayon étendu
6. ✅ Comparaison avec l'endpoint standard

## 📊 Performance

### Avant les Optimisations
- ❌ Requêtes géospatiales lentes (pas d'index)
- ❌ Pas de cache (requêtes répétées)
- ❌ Pagination non optimisée

### Après les Optimisations
- ✅ Index géospatiaux pour des requêtes rapides
- ✅ Cache de 10 minutes pour éviter les requêtes répétées
- ✅ Pagination optimisée avec `LIMIT` et `OFFSET`
- ✅ Validation côté serveur pour éviter les erreurs

## 🚀 Utilisation

### Endpoint de Recherche par Proximité

```bash
GET /listings/search/proximity?latitude=48.8566&longitude=2.3522&radius=10&type=RENT&minPrice=500&maxPrice=2000&page=0&size=10
```

### Paramètres
- `latitude` (obligatoire) : Latitude du point central (-90 à 90)
- `longitude` (obligatoire) : Longitude du point central (-180 à 180)
- `radius` (optionnel) : Rayon de recherche en km (défaut: 10)
- `type` (optionnel) : Type de bien (RENT/SALE)
- `minPrice` (optionnel) : Prix minimum
- `maxPrice` (optionnel) : Prix maximum
- `page` (optionnel) : Numéro de page (défaut: 0)
- `size` (optionnel) : Taille de page (défaut: 10)

### Réponse
```json
{
  "items": [
    {
      "id": "uuid",
      "title": "Appartement 3 pièces",
      "latitude": 48.8566,
      "longitude": 2.3522,
      "price": 1200,
      "type": "RENT",
      // ... autres champs
    }
  ],
  "total": 25,
  "page": 0,
  "size": 10
}
```

## 🔒 Sécurité

- ✅ Validation stricte des coordonnées
- ✅ Gestion des erreurs avec messages explicites
- ✅ Protection contre les coordonnées invalides
- ✅ Limitation de la taille des requêtes

## 📈 Monitoring

- ✅ Logs détaillés pour le debugging
- ✅ Métriques de performance avec le cache
- ✅ Gestion des erreurs avec codes HTTP appropriés

---

**🎉 L'API de géolocalisation est maintenant complètement opérationnelle et synchronisée avec le frontend mobile !**
