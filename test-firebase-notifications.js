#!/usr/bin/env node

/**
 * Script de test pour les notifications Firebase
 * 
 * Ce script permet de tester l'envoi de notifications Firebase
 * vers votre application mobile.
 * 
 * Utilisation:
 * node test-firebase-notifications.js
 */

const admin = require('firebase-admin');
const path = require('path');

// Configuration Firebase
const serviceAccount = require('./appimmofront/app-immo-notifications-firebase-adminsdk-fbsvc-5c87fe303d.json');

// Initialiser Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'app-immo-notifications'
});

// Fonction pour envoyer une notification de test
async function sendTestNotification(deviceToken, title, body, data = {}) {
  try {
    const message = {
      notification: {
        title: title,
        body: body
      },
      data: {
        ...data,
        timestamp: new Date().toISOString()
      },
      token: deviceToken,
      android: {
        priority: 'high',
        notification: {
          sound: 'default',
          channelId: 'default'
        }
      },
      apns: {
        payload: {
          aps: {
            sound: 'default',
            badge: 1
          }
        }
      }
    };

    const response = await admin.messaging().send(message);
    console.log('✅ Notification envoyée avec succès:', response);
    return response;
  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi de la notification:', error);
    throw error;
  }
}

// Fonction pour envoyer une notification à un topic
async function sendNotificationToTopic(topic, title, body, data = {}) {
  try {
    const message = {
      notification: {
        title: title,
        body: body
      },
      data: {
        ...data,
        timestamp: new Date().toISOString()
      },
      topic: topic,
      android: {
        priority: 'high',
        notification: {
          sound: 'default',
          channelId: 'default'
        }
      },
      apns: {
        payload: {
          aps: {
            sound: 'default',
            badge: 1
          }
        }
      }
    };

    const response = await admin.messaging().send(message);
    console.log('✅ Notification envoyée au topic avec succès:', response);
    return response;
  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi de la notification au topic:', error);
    throw error;
  }
}

// Fonction principale de test
async function runTests() {
  console.log('🚀 Démarrage des tests de notifications Firebase...\n');

  // Test 1: Notification simple
  console.log('📱 Test 1: Notification simple');
  console.log('Pour ce test, vous devez:');
  console.log('1. Ouvrir votre application mobile');
  console.log('2. Aller dans les paramètres de notifications');
  console.log('3. Copier le token FCM affiché');
  console.log('4. Le coller ci-dessous\n');

  // Demander le token FCM à l'utilisateur
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('Entrez le token FCM de votre appareil (ou appuyez sur Entrée pour passer): ', async (deviceToken) => {
    if (deviceToken.trim()) {
      try {
        await sendTestNotification(
          deviceToken,
          '🏠 Test Immobilier',
          'Ceci est une notification de test de votre app immobilier!',
          {
            type: 'test',
            screen: 'home'
          }
        );
      } catch (error) {
        console.log('⚠️ Test avec token individuel échoué, continuons avec les topics...');
      }
    }

    // Test 2: Notification par topic
    console.log('\n📢 Test 2: Notification par topic');
    try {
      await sendNotificationToTopic(
        'all_users',
        '🎉 Nouvelle annonce disponible!',
        'Découvrez cette magnifique propriété dans votre région',
        {
          type: 'new_listing',
          listingId: '12345',
          screen: 'property_details'
        }
      );
    } catch (error) {
      console.log('⚠️ Test par topic échoué');
    }

    // Test 3: Notification pour propriétaires
    console.log('\n👑 Test 3: Notification pour propriétaires');
    try {
      await sendNotificationToTopic(
        'owners',
        '💰 Nouveau message reçu',
        'Vous avez reçu un nouveau message concernant votre annonce',
        {
          type: 'new_message',
          conversationId: '67890',
          screen: 'messages'
        }
      );
    } catch (error) {
      console.log('⚠️ Test pour propriétaires échoué');
    }

    // Test 4: Notification de baisse de prix
    console.log('\n📉 Test 4: Notification de baisse de prix');
    try {
      await sendNotificationToTopic(
        'price_drop_alerts',
        '💰 Prix réduit!',
        'Le prix de cette propriété a été réduit de 10%',
        {
          type: 'price_drop',
          listingId: '12345',
          screen: 'property_details',
          params: { id: '12345', highlightPrice: true }
        }
      );
    } catch (error) {
      console.log('⚠️ Test de baisse de prix échoué');
    }

    // Test 5: Notification de nouvelle annonce
    console.log('\n🏠 Test 5: Notification de nouvelle annonce');
    try {
      await sendNotificationToTopic(
        'new_listing_alerts',
        '🏠 Nouvelle annonce disponible!',
        'Découvrez cette magnifique propriété dans votre région',
        {
          type: 'new_listing',
          listingId: '54321',
          screen: 'property_details',
          params: { id: '54321' }
        }
      );
    } catch (error) {
      console.log('⚠️ Test de nouvelle annonce échoué');
    }

    // Test 6: Notification de maintenance
    console.log('\n🔧 Test 6: Notification de maintenance');
    try {
      await sendNotificationToTopic(
        'owners',
        '🔧 Rappel de maintenance',
        'Il est temps de programmer la maintenance de votre propriété',
        {
          type: 'maintenance_reminder',
          screen: 'maintenance',
          params: { reminderType: 'scheduled' }
        }
      );
    } catch (error) {
      console.log('⚠️ Test de maintenance échoué');
    }

    console.log('\n✅ Tests terminés!');
    console.log('\n📋 Résumé des tests:');
    console.log('- Test 1: Notification individuelle (nécessite token FCM)');
    console.log('- Test 2: Notification par topic "all_users"');
    console.log('- Test 3: Notification par topic "owners"');
    console.log('- Test 4: Notification de baisse de prix');
    console.log('- Test 5: Notification de nouvelle annonce');
    console.log('- Test 6: Notification de maintenance');
    console.log('\n💡 Pour voir les notifications:');
    console.log('1. Vérifiez que votre app est ouverte');
    console.log('2. Vérifiez les logs de votre application');
    console.log('3. Vérifiez la console Firebase');

    rl.close();
  });
}

// Gestion des erreurs
process.on('unhandledRejection', (error) => {
  console.error('❌ Erreur non gérée:', error);
  process.exit(1);
});

// Lancer les tests
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = {
  sendTestNotification,
  sendNotificationToTopic
};