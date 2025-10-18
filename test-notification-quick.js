#!/usr/bin/env node

/**
 * Test rapide des notifications Firebase
 * Ce script envoie une notification de test sans interaction utilisateur
 */

const admin = require('firebase-admin');
const serviceAccount = require('./appimmofront/app-immo-notifications-firebase-adminsdk-fbsvc-5c87fe303d.json');

// Initialiser Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'app-immo-notifications'
});

async function sendQuickTest() {
  console.log('🚀 Envoi d\'une notification de test rapide...\n');

  try {
    // Test avec un topic (plus simple qu'un token individuel)
    const message = {
      notification: {
        title: '🏠 Test Immobilier - Notification Rapide',
        body: 'Ceci est un test automatique des notifications Firebase!'
      },
      data: {
        type: 'test',
        timestamp: new Date().toISOString(),
        screen: 'home'
      },
      topic: 'all_users',
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
    console.log('✅ Notification envoyée avec succès!');
    console.log('📱 ID de message:', response);
    console.log('\n📋 Pour voir la notification:');
    console.log('1. Ouvrez votre application mobile');
    console.log('2. Mettez l\'app en arrière-plan');
    console.log('3. La notification devrait apparaître dans quelques secondes');
    console.log('\n💡 Si vous ne voyez pas la notification:');
    console.log('- Vérifiez que les notifications sont activées');
    console.log('- Vérifiez les paramètres de notification de l\'app');
    console.log('- Consultez les logs de l\'application');

  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi:', error.message);
    
    if (error.code === 'messaging/invalid-registration-token') {
      console.log('\n💡 Solution: Le topic "all_users" n\'existe peut-être pas encore.');
      console.log('   Créez d\'abord le topic dans Firebase Console ou utilisez un token individuel.');
    }
  }
}

// Lancer le test
sendQuickTest().then(() => {
  console.log('\n🎉 Test terminé!');
  process.exit(0);
}).catch(error => {
  console.error('❌ Erreur fatale:', error);
  process.exit(1);
});
