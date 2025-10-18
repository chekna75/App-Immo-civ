#!/usr/bin/env node

/**
 * Test des 4 types de notifications avec topics Firebase
 * Compatible avec Expo Go
 */

const admin = require('firebase-admin');
const serviceAccount = require('./appimmofront/app-immo-notifications-firebase-adminsdk-fbsvc-5c87fe303d.json');

// Initialiser Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'app-immo-notifications'
});

/**
 * 1. 🏠 NOUVELLES ANNONCES - Notifier les utilisateurs pour de nouvelles annonces correspondant à leurs recherches
 */
async function testNewMatchingListings() {
  console.log('🏠 Test: Nouvelles annonces correspondantes');
  
  try {
    const message = {
      notification: {
        title: '🏠 Nouvelles annonces trouvées !',
        body: '2 nouvelle(s) annonce(s) correspondent à vos critères de recherche'
      },
      data: {
        type: 'new_matching_listings',
        searchCriteria: JSON.stringify({
          location: 'Paris',
          priceRange: '200000-500000',
          propertyType: 'appartement'
        }),
        listingsCount: '2',
        listings: JSON.stringify([
          { id: 'listing_789', title: 'Appartement 3 pièces Paris 15ème', price: 350000 },
          { id: 'listing_790', title: 'Studio moderne Paris 11ème', price: 280000 }
        ]),
        screen: 'search_results',
        params: JSON.stringify({ 
          searchId: 'search_456',
          highlightNew: true 
        })
      },
      topic: 'new_listing_alerts',
      android: {
        priority: 'high',
        notification: {
          sound: 'default',
          channelId: 'new_listings',
          color: '#4CAF50'
        }
      },
      apns: {
        payload: {
          aps: {
            sound: 'default',
            badge: 1,
            category: 'NEW_LISTINGS'
          }
        }
      }
    };

    const response = await admin.messaging().send(message);
    console.log('✅ Notification nouvelles annonces envoyée:', response);
    return response;
  } catch (error) {
    console.error('❌ Erreur notification nouvelles annonces:', error.message);
    return null;
  }
}

/**
 * 2. 💬 MESSAGE REÇU - Notifier quand un utilisateur reçoit un nouveau message
 */
async function testNewMessage() {
  console.log('💬 Test: Nouveau message reçu');
  
  try {
    const message = {
      notification: {
        title: '💬 Nouveau message de Marie Dupont',
        body: 'Bonjour, votre appartement m\'intéresse beaucoup. Pourrions-nous organiser une visite ?'
      },
      data: {
        type: 'new_message',
        senderId: 'user_456',
        senderName: 'Marie Dupont',
        conversationId: 'conversation_789',
        messagePreview: 'Bonjour, votre appartement m\'intéresse beaucoup...',
        screen: 'chat',
        params: JSON.stringify({ 
          conversationId: 'conversation_789',
          highlightNew: true 
        })
      },
      topic: 'message_notifications',
      android: {
        priority: 'high',
        notification: {
          sound: 'default',
          channelId: 'messages',
          color: '#2196F3'
        }
      },
      apns: {
        payload: {
          aps: {
            sound: 'default',
            badge: 1,
            category: 'NEW_MESSAGE'
          }
        }
      }
    };

    const response = await admin.messaging().send(message);
    console.log('✅ Notification nouveau message envoyée:', response);
    return response;
  } catch (error) {
    console.error('❌ Erreur notification nouveau message:', error.message);
    return null;
  }
}

/**
 * 3. 📝 CHANGEMENT DE STATUT D'ANNONCE - Notifier les changements de statut
 */
async function testListingStatusChange() {
  console.log('📝 Test: Changement de statut d\'annonce');
  
  try {
    const message = {
      notification: {
        title: '✅ Annonce approuvée !',
        body: 'Votre annonce "Appartement 4 pièces avec balcon" a été approuvée et est maintenant visible'
      },
      data: {
        type: 'listing_status_change',
        listingId: 'listing_123',
        oldStatus: 'PENDING',
        newStatus: 'APPROVED',
        listingTitle: 'Appartement 4 pièces avec balcon',
        screen: 'my_listings',
        params: JSON.stringify({ 
          listingId: 'listing_123',
          highlightStatus: 'APPROVED' 
        })
      },
      topic: 'owners',
      android: {
        priority: 'high',
        notification: {
          sound: 'default',
          channelId: 'listing_status',
          color: '#4CAF50'
        }
      },
      apns: {
        payload: {
          aps: {
            sound: 'default',
            badge: 1,
            category: 'LISTING_STATUS'
          }
        }
      }
    };

    const response = await admin.messaging().send(message);
    console.log('✅ Notification changement statut envoyée:', response);
    return response;
  } catch (error) {
    console.error('❌ Erreur notification changement statut:', error.message);
    return null;
  }
}

/**
 * 4. 💳 RAPPEL DE PAIEMENT - Notifier les rappels de paiement à renouveler
 */
async function testPaymentReminder() {
  console.log('💳 Test: Rappel de paiement');
  
  try {
    const message = {
      notification: {
        title: '💳 Abonnement à renouveler',
        body: 'Votre abonnement premium expire le 15/02/2024. Renouvelez maintenant !'
      },
      data: {
        type: 'payment_reminder',
        paymentType: 'SUBSCRIPTION',
        dueDate: '2024-02-15',
        amount: '29.99',
        userName: 'Jean Martin',
        screen: 'payment',
        params: JSON.stringify({ 
          paymentType: 'SUBSCRIPTION',
          highlightUrgent: true 
        })
      },
      topic: 'all_users',
      android: {
        priority: 'high',
        notification: {
          sound: 'default',
          channelId: 'payments',
          color: '#FF5722'
        }
      },
      apns: {
        payload: {
          aps: {
            sound: 'default',
            badge: 1,
            category: 'PAYMENT_REMINDER'
          }
        }
      }
    };

    const response = await admin.messaging().send(message);
    console.log('✅ Notification rappel paiement envoyée:', response);
    return response;
  } catch (error) {
    console.error('❌ Erreur notification rappel paiement:', error.message);
    return null;
  }
}

/**
 * Test de tous les types de notifications
 */
async function testAllNotificationTypes() {
  console.log('🚀 Test des 4 types de notifications Firebase...\n');

  const results = [];

  // Test 1: Nouvelles annonces
  console.log('1️⃣ Test: Nouvelles annonces correspondantes');
  const result1 = await testNewMatchingListings();
  results.push({ type: 'Nouvelles annonces', success: !!result1 });
  
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Test 2: Nouveau message
  console.log('\n2️⃣ Test: Nouveau message reçu');
  const result2 = await testNewMessage();
  results.push({ type: 'Nouveau message', success: !!result2 });
  
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Test 3: Changement de statut
  console.log('\n3️⃣ Test: Changement de statut d\'annonce');
  const result3 = await testListingStatusChange();
  results.push({ type: 'Changement statut', success: !!result3 });
  
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Test 4: Rappel de paiement
  console.log('\n4️⃣ Test: Rappel de paiement');
  const result4 = await testPaymentReminder();
  results.push({ type: 'Rappel paiement', success: !!result4 });

  // Résumé des résultats
  console.log('\n📊 Résumé des tests:');
  results.forEach((result, index) => {
    console.log(`${index + 1}. ${result.type}: ${result.success ? '✅ Succès' : '❌ Échec'}`);
  });

  const successCount = results.filter(r => r.success).length;
  console.log(`\n🎯 Résultat: ${successCount}/${results.length} tests réussis`);

  console.log('\n💡 Pour voir les notifications:');
  console.log('1. Ouvrez votre application mobile');
  console.log('2. Mettez l\'app en arrière-plan');
  console.log('3. Appuyez sur chaque notification reçue');
  console.log('4. Vérifiez que l\'app navigue vers le bon écran');

  console.log('\n🔍 Vérifications à faire:');
  console.log('- 🏠 Nouvelles annonces → Navigation vers search_results');
  console.log('- 💬 Nouveau message → Navigation vers chat');
  console.log('- 📝 Changement statut → Navigation vers my_listings');
  console.log('- 💳 Rappel paiement → Navigation vers payment');

  return results;
}

// Lancer les tests
if (require.main === module) {
  testAllNotificationTypes().then(() => {
    console.log('\n🎉 Tests terminés !');
    process.exit(0);
  }).catch(error => {
    console.error('❌ Erreur fatale:', error);
    process.exit(1);
  });
}

module.exports = {
  testNewMatchingListings,
  testNewMessage,
  testListingStatusChange,
  testPaymentReminder,
  testAllNotificationTypes
};
