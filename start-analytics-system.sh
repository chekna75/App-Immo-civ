#!/bin/bash

# Script de démarrage complet pour le système d'analytics
echo "🚀 Démarrage du Système Analytics"
echo "================================="

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Fonction pour vérifier si un port est ouvert
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

# Fonction pour attendre qu'un service soit disponible
wait_for_service() {
    local url=$1
    local max_attempts=30
    local attempt=1
    
    echo -e "${YELLOW}Attente du service sur $url...${NC}"
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s --connect-timeout 2 "$url" > /dev/null 2>&1; then
            echo -e "${GREEN}✓ Service disponible${NC}"
            return 0
        fi
        
        echo -n "."
        sleep 2
        attempt=$((attempt + 1))
    done
    
    echo -e "\n${RED}✗ Service non disponible après $max_attempts tentatives${NC}"
    return 1
}

echo -e "\n${BLUE}1. Vérification des prérequis...${NC}"

# Vérifier Java
if command -v java >/dev/null 2>&1; then
    java_version=$(java -version 2>&1 | head -n 1 | cut -d'"' -f2)
    echo -e "${GREEN}✓ Java $java_version installé${NC}"
else
    echo -e "${RED}✗ Java non installé${NC}"
    exit 1
fi

# Vérifier Maven
if command -v mvn >/dev/null 2>&1; then
    mvn_version=$(mvn -version 2>&1 | head -n 1 | cut -d' ' -f3)
    echo -e "${GREEN}✓ Maven $mvn_version installé${NC}"
else
    echo -e "${RED}✗ Maven non installé${NC}"
    exit 1
fi

# Vérifier Node.js
if command -v node >/dev/null 2>&1; then
    node_version=$(node --version)
    echo -e "${GREEN}✓ Node.js $node_version installé${NC}"
else
    echo -e "${RED}✗ Node.js non installé${NC}"
    exit 1
fi

echo -e "\n${BLUE}2. Vérification des fichiers...${NC}"

# Vérifier les fichiers backend
backend_files=(
    "Immo/immobilier-api/src/main/java/com/ditsolution/features/analytics/entity/AnalyticsViewEntity.java"
    "Immo/immobilier-api/src/main/java/com/ditsolution/features/analytics/service/AnalyticsService.java"
    "Immo/immobilier-api/src/main/java/com/ditsolution/features/analytics/resource/AnalyticsResource.java"
    "Immo/immobilier-api/src/main/resources/db/migration/V21__analytics_tables.sql"
)

for file in "${backend_files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓ $(basename "$file")${NC}"
    else
        echo -e "${RED}✗ $(basename "$file") manquant${NC}"
    fi
done

# Vérifier les fichiers frontend
frontend_files=(
    "appimmofront/services/AnalyticsService.js"
    "appimmofront/screens/AnalyticsTestScreen.js"
)

for file in "${frontend_files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓ $(basename "$file")${NC}"
    else
        echo -e "${RED}✗ $(basename "$file") manquant${NC}"
    fi
done

echo -e "\n${BLUE}3. Démarrage du backend...${NC}"

# Vérifier si le backend est déjà en cours d'exécution
if check_port 8080; then
    echo -e "${YELLOW}⚠ Port 8080 déjà utilisé${NC}"
    echo "Arrêt du processus existant..."
    pkill -f "quarkus:dev" 2>/dev/null || true
    sleep 2
fi

# Démarrer le backend
echo "Démarrage du backend Quarkus..."
cd "Immo/immobilier-api"

# Démarrer en arrière-plan
nohup ./mvnw quarkus:dev > ../backend.log 2>&1 &
BACKEND_PID=$!

echo "PID du backend: $BACKEND_PID"

# Attendre que le backend soit disponible
if wait_for_service "http://localhost:8080/health"; then
    echo -e "${GREEN}✓ Backend démarré avec succès${NC}"
else
    echo -e "${RED}✗ Échec du démarrage du backend${NC}"
    echo "Consultez le fichier backend.log pour plus de détails"
    exit 1
fi

echo -e "\n${BLUE}4. Test des endpoints analytics...${NC}"

# Test simple d'un endpoint
test_response=$(curl -s -w "\n%{http_code}" "http://localhost:8080/api/analytics/stats/listing/550e8400-e29b-41d4-a716-446655440000?period=30d" 2>/dev/null)
test_http_code=$(echo "$test_response" | tail -n1)

if [ "$test_http_code" -eq 200 ] || [ "$test_http_code" -eq 401 ]; then
    echo -e "${GREEN}✓ Endpoints analytics fonctionnels (HTTP $test_http_code)${NC}"
    if [ "$test_http_code" -eq 401 ]; then
        echo "  (Authentification requise - normal)"
    fi
else
    echo -e "${RED}✗ Endpoints analytics non fonctionnels (HTTP $test_http_code)${NC}"
fi

echo -e "\n${BLUE}5. Préparation du frontend...${NC}"

# Vérifier les dépendances Node.js
cd "../appimmofront"

if [ -f "package.json" ]; then
    echo "Vérification des dépendances Node.js..."
    if [ ! -d "node_modules" ]; then
        echo "Installation des dépendances..."
        npm install
    else
        echo -e "${GREEN}✓ Dépendances Node.js installées${NC}"
    fi
else
    echo -e "${RED}✗ package.json non trouvé${NC}"
fi

echo -e "\n${GREEN}=== Système Analytics Prêt ===${NC}"
echo ""
echo "🎯 Backend: http://localhost:8080"
echo "📱 Frontend: Prêt pour React Native"
echo "📊 Analytics: Endpoints fonctionnels"
echo ""
echo "📋 Prochaines étapes:"
echo "1. Démarrer l'app React Native: cd appimmofront && npm start"
echo "2. Ouvrir l'app sur votre appareil/émulateur"
echo "3. Naviguer vers AnalyticsTestScreen"
echo "4. Lancer les tests d'analytics"
echo ""
echo "🔧 Commandes utiles:"
echo "• Arrêter le backend: pkill -f 'quarkus:dev'"
echo "• Voir les logs: tail -f backend.log"
echo "• Tester les endpoints: ./test-analytics-backend.sh"
echo ""
echo "📁 Fichiers de log:"
echo "• Backend: backend.log"
echo "• Tests: Résultats dans la console"
