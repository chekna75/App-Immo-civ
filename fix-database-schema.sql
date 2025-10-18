-- Script pour corriger le schéma de la base de données
-- Exécuter ce script pour résoudre les problèmes de type de colonne

-- Corriger le type de colonne 'data' dans la table notifications
ALTER TABLE notifications ALTER COLUMN data TYPE TEXT;

-- Vérifier la structure de la table
\d notifications;

-- Afficher les contraintes
SELECT conname, contype, confrelid::regclass 
FROM pg_constraint 
WHERE conrelid = 'notifications'::regclass;
