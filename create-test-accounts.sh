#!/bin/bash

# Script pour créer des comptes de test pour l'application mobile
# Comptes avec différents rôles pour tester toutes les fonctionnalités

echo "👥 Création de Comptes de Test pour l'Application Mobile"
echo "======================================================="

# Configuration
API_BASE="http://localhost:8080"

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction pour afficher les résultats
print_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
    fi
}

# 1. Compte Propriétaire Principal
echo -e "\n${BLUE}1. Compte Propriétaire Principal${NC}"
echo "Email: john.doe@example.com"
echo "Mot de passe: chekna123"
echo "Rôle: OWNER"
echo "Fonctionnalités: Dashboard paiements, statistiques, gestion contrats"

# 2. Créer un compte Propriétaire supplémentaire
echo -e "\n${BLUE}2. Création d'un Propriétaire Supplémentaire${NC}"
PROPRIETAIRE_2_RESPONSE=$(curl -s -X POST "$API_BASE/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "marie.martin@example.com",
    "password": "test123",
    "role": "OWNER",
    "firstName": "Marie",
    "lastName": "Martin"
  }')

if echo "$PROPRIETAIRE_2_RESPONSE" | grep -q "accessToken"; then
    print_result 0 "Propriétaire 2 créé avec succès"
    echo "Email: marie.martin@example.com"
    echo "Mot de passe: test123"
    echo "Rôle: OWNER"
else
    print_result 1 "Échec de création du propriétaire 2"
    echo "Réponse: $PROPRIETAIRE_2_RESPONSE"
fi

# 3. Créer un compte Locataire
echo -e "\n${BLUE}3. Création d'un Compte Locataire${NC}"
LOCATAIRE_RESPONSE=$(curl -s -X POST "$API_BASE/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "pierre.dupont@example.com",
    "password": "test123",
    "role": "TENANT",
    "firstName": "Pierre",
    "lastName": "Dupont"
  }')

if echo "$LOCATAIRE_RESPONSE" | grep -q "accessToken"; then
    print_result 0 "Locataire créé avec succès"
    echo "Email: pierre.dupont@example.com"
    echo "Mot de passe: test123"
    echo "Rôle: TENANT"
else
    print_result 1 "Échec de création du locataire"
    echo "Réponse: $LOCATAIRE_RESPONSE"
fi

# 4. Créer un compte Administrateur
echo -e "\n${BLUE}4. Création d'un Compte Administrateur${NC}"
ADMIN_RESPONSE=$(curl -s -X POST "$API_BASE/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123",
    "role": "ADMIN",
    "firstName": "Admin",
    "lastName": "System"
  }')

if echo "$ADMIN_RESPONSE" | grep -q "accessToken"; then
    print_result 0 "Administrateur créé avec succès"
    echo "Email: admin@example.com"
    echo "Mot de passe: admin123"
    echo "Rôle: ADMIN"
else
    print_result 1 "Échec de création de l'administrateur"
    echo "Réponse: $ADMIN_RESPONSE"
fi

# 5. Résumé des comptes de test
echo -e "\n${YELLOW}📱 Comptes de Test pour l'Application Mobile${NC}"
echo "=============================================="
echo ""
echo "🏠 PROPRIÉTAIRES (OWNER):"
echo "   • john.doe@example.com / chekna123"
echo "     - Dashboard paiements complet"
echo "     - 11 paiements en attente"
echo "     - Statistiques détaillées"
echo ""
echo "   • marie.martin@example.com / test123"
echo "     - Nouveau propriétaire"
echo "     - Dashboard vide (pas de contrats)"
echo "     - Peut créer des contrats"
echo ""
echo "🏠 LOCATAIRE (TENANT):"
echo "   • pierre.dupont@example.com / test123"
echo "     - Interface locataire"
echo "     - Peut voir ses paiements"
echo "     - Peut effectuer des paiements"
echo ""
echo "👨‍💼 ADMINISTRATEUR (ADMIN):"
echo "   • admin@example.com / admin123"
echo "     - Accès complet"
echo "     - Gestion de tous les utilisateurs"
echo "     - Statistiques globales"
echo ""

# 6. Instructions de test
echo -e "\n${BLUE}🧪 Instructions de Test${NC}"
echo "=========================="
echo "1. Ouvrez l'application mobile"
echo "2. Connectez-vous avec un des comptes ci-dessus"
echo "3. Testez les fonctionnalités selon le rôle:"
echo ""
echo "   PROPRIÉTAIRE (john.doe@example.com):"
echo "   • Dashboard → Statistiques → Paiements"
echo "   • Voir les 11 paiements en attente"
echo "   • Filtrer par statut (PENDING, PAID, CANCELLED)"
echo "   • Actions sur les paiements (rappel, manuel)"
echo ""
echo "   LOCATAIRE (pierre.dupont@example.com):"
echo "   • Interface de paiement"
echo "   • Historique des paiements"
echo "   • Effectuer des paiements"
echo ""
echo "   ADMINISTRATEUR (admin@example.com):"
echo "   • Vue d'ensemble complète"
echo "   • Gestion des utilisateurs"
echo "   • Statistiques globales"

echo -e "\n${GREEN}✅ Comptes de test créés !${NC}"
echo "Vous pouvez maintenant tester l'application mobile avec ces comptes."
