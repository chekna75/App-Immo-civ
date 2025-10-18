#!/usr/bin/env node

/**
 * Test avancé des notifications Firebase avec navigation
 * Ce script teste tous les types de notifications avec navigation
 */

const admin = require('firebase-admin');
const serviceAccount = require('./appimmofront/app-immo-notifications-firebase-adminsdk-fbsvc-5c87fe303d.json');

// Initialiser Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'app-immo-notifications'
});

// Fonction pour envoyer une notification avec navigation
async function sendNotificationWithNavigation(topic, title, body, navigationData) {
  try {
    const message = {
      notification: {
        title: title,
        body: body
      },
      data: {
        ...navigationData,
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
    console.log(`✅ ${title} envoyée avec succès!`);
    console.log(`   📱 ID: ${response}`);
    console.log(`   🎯 Navigation: ${navigationData.screen || 'Home'}`);
    return response;
  } catch (error) {
    console.error(`❌ Erreur ${title}:`, error.message);
    return null;
  }
}

// Tests de navigation avancés
async function runAdvancedTests() {
  console.log('🚀 Tests avancés de notifications avec navigation...\n');

  const tests = [
    {
      name: 'Nouvelle annonce',
      topic: 'new_listing_alerts',
      title: '🏠 Nouvelle annonce disponible!',
      body: 'Découvrez cette magnifique propriété à Paris',
      data: {
        type: 'new_listing',
        listingId: '12345',
        screen: 'property_details',
        params: JSON.stringify({ id: '12345' })
      }
    },
    {
      name: 'Baisse de prix',
      topic: 'price_drop_alerts',
      title: '💰 Prix réduit de 15%!',
      body: 'Cette propriété a vu son prix baisser significativement',
      data: {
        type: 'price_drop',
        listingId: '12345',
        screen: 'property_details',
        params: JSON.stringify({ id: '12345', highlightPrice: true })
      }
    },
    {
      name: 'Nouveau message',
      topic: 'message_notifications',
      title: '💬 Nouveau message reçu',
      body: 'Vous avez reçu un message concernant votre annonce',
      data: {
        type: 'new_message',
        conversationId: '67890',
        screen: 'chat',
        params: JSON.stringify({ conversationId: '67890' })
      }
    },
    {
      name: 'Rappel de maintenance',
      topic: 'owners',
      title: '🔧 Rappel de maintenance',
      body: 'Il est temps de programmer la maintenance de votre propriété',
      data: {
        type: 'maintenance_reminder',
        screen: 'maintenance',
        params: JSON.stringify({ reminderType: 'scheduled' })
      }
    },
    {
      name: 'Rappel de paiement',
      topic: 'owners',
      title: '💳 Rappel de paiement',
      body: 'Votre abonnement premium expire dans 3 jours',
      data: {
        type: 'payment_reminder',
        screen: 'payment',
        params: JSON.stringify({ type: 'subscription' })
      }
    },
    {
      name: 'Annonce approuvée',
      topic: 'owners',
      title: '✅ Annonce approuvée!',
      body: 'Votre annonce est maintenant visible sur la plateforme',
      data: {
        type: 'property_approved',
        listingId: '54321',
        screen: 'my_listings',
        params: JSON.stringify({ id: '54321' })
      }
    },
    {
      name: 'Mise à jour favoris',
      topic: 'buyers',
      title: '❤️ Mise à jour de vos favoris',
      body: 'Une propriété de vos favoris a été mise à jour',
      data: {
        type: 'favorite_update',
        listingId: '98765',
        screen: 'favorites',
        params: JSON.stringify({ id: '98765' })
      }
    },
    {
      name: 'Message admin',
      topic: 'all_users',
      title: '👑 Message de l\'équipe',
      body: 'Nouvelles fonctionnalités disponibles dans l\'app!',
      data: {
        type: 'admin_message',
        screen: 'admin_messages',
        params: JSON.stringify({ type: 'announcement' })
      }
    }
  ];

  console.log(`📋 Exécution de ${tests.length} tests de navigation...\n`);

  for (let i = 0; i < tests.length; i++) {
    const test = tests[i];
    console.log(`🧪 Test ${i + 1}/${tests.length}: ${test.name}`);
    
    await sendNotificationWithNavigation(
      test.topic,
      test.title,
      test.body,
      test.data
    );
    
    // Pause entre les tests
    if (i < tests.length - 1) {
      console.log('   ⏳ Pause de 2 secondes...\n');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  console.log('\n🎉 Tous les tests terminés!');
  console.log('\n📊 Résumé des tests:');
  tests.forEach((test, index) => {
    console.log(`${index + 1}. ${test.name} → ${test.data.screen}`);
  });

  console.log('\n💡 Pour tester la navigation:');
  console.log('1. Ouvrez votre application mobile');
  console.log('2. Mettez l\'app en arrière-plan');
  console.log('3. Appuyez sur chaque notification reçue');
  console.log('4. Vérifiez que l\'app navigue vers le bon écran');
  console.log('5. Consultez les logs pour voir les détails de navigation');

  console.log('\n🔍 Vérifications à faire:');
  console.log('- Navigation vers PropertyDetails avec les bonnes données');
  console.log('- Navigation vers Chat avec conversationId');
  console.log('- Navigation vers Maintenance avec type de rappel');
  console.log('- Navigation vers Payment avec type de paiement');
  console.log('- Navigation vers MyListings pour les propriétaires');
  console.log('- Navigation vers Favorites pour les acheteurs');
  console.log('- Navigation vers AdminMessages pour les annonces');
}

// Gestion des erreurs
process.on('unhandledRejection', (error) => {
  console.error('❌ Erreur non gérée:', error);
  process.exit(1);
});

// Lancer les tests
if (require.main === module) {
  runAdvancedTests().catch(console.error);
}

module.exports = {
  sendNotificationWithNavigation,
  runAdvancedTests
};
