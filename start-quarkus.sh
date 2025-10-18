#!/bin/bash

# Script de démarrage Quarkus avec Firebase
# Remplacez les variables par vos vraies valeurs

echo "🚀 Démarrage de l'API Quarkus avec Firebase..."

# Variables d'environnement (à configurer)
export FIREBASE_PROJECT_ID="votre-project-id"
export FIREBASE_PRIVATE_KEY_ID="votre-key-id"
export FIREBASE_PRIVATE_KEY="votre-private-key"
export FIREBASE_CLIENT_EMAIL="votre-client-email"
export FIREBASE_CLIENT_ID="votre-client-id"

# Démarrage de Quarkus
cd Immo/immobilier-api
./mvnw compile quarkus:dev

echo "✅ API démarrée avec succès !"
