#!/usr/bin/env node

/**
 * Templates de notifications pour l'application immobilier
 * 4 types de notifications spécifiques avec Firebase
 */

const admin = require('firebase-admin');
const serviceAccount = require('./appimmofront/app-immo-notifications-firebase-adminsdk-fbsvc-5c87fe303d.json');

// Initialiser Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'app-immo-notifications'
});

/**
 * 1. NOUVELLES ANNONCES - Notifier les utilisateurs pour de nouvelles annonces correspondant à leurs recherches
 */
async function notifyNewMatchingListings(userId, searchCriteria, newListings) {
  try {
    const message = {
      notification: {
        title: '🏠 Nouvelles annonces trouvées !',
        body: `${newListings.length} nouvelle(s) annonce(s) correspondent à vos critères de recherche`
      },
      data: {
        type: 'new_matching_listings',
        userId: userId,
        searchCriteria: JSON.stringify(searchCriteria),
        listingsCount: newListings.length.toString(),
        listings: JSON.stringify(newListings.map(l => ({ id: l.id, title: l.title, price: l.price }))),
        screen: 'search_results',
        params: JSON.stringify({ 
          searchId: searchCriteria.id,
          highlightNew: true 
        })
      },
      token: userId, // Token FCM de l'utilisateur
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
    console.error('❌ Erreur notification nouvelles annonces:', error);
    throw error;
  }
}

/**
 * 2. MESSAGE REÇU - Notifier quand un utilisateur reçoit un nouveau message
 */
async function notifyNewMessage(recipientId, senderName, messagePreview, conversationId) {
  try {
    const message = {
      notification: {
        title: `💬 Nouveau message de ${senderName}`,
        body: messagePreview.length > 50 ? messagePreview.substring(0, 50) + '...' : messagePreview
      },
      data: {
        type: 'new_message',
        senderId: senderName,
        conversationId: conversationId,
        messagePreview: messagePreview,
        screen: 'chat',
        params: JSON.stringify({ 
          conversationId: conversationId,
          highlightNew: true 
        })
      },
      token: recipientId, // Token FCM du destinataire
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
    console.error('❌ Erreur notification nouveau message:', error);
    throw error;
  }
}

/**
 * 3. CHANGEMENT DE STATUT D'ANNONCE - Notifier les changements de statut
 */
async function notifyListingStatusChange(ownerId, listingTitle, oldStatus, newStatus, listingId) {
  try {
    let title, body, color;
    
    switch (newStatus) {
      case 'APPROVED':
        title = '✅ Annonce approuvée !';
        body = `Votre annonce "${listingTitle}" a été approuvée et est maintenant visible`;
        color = '#4CAF50';
        break;
      case 'REJECTED':
        title = '❌ Annonce rejetée';
        body = `Votre annonce "${listingTitle}" a été rejetée. Consultez les raisons`;
        color = '#F44336';
        break;
      case 'SOLD':
        title = '🏠 Annonce vendue !';
        body = `Félicitations ! Votre annonce "${listingTitle}" a été vendue`;
        color = '#FF9800';
        break;
      case 'EXPIRED':
        title = '⏰ Annonce expirée';
        body = `Votre annonce "${listingTitle}" a expiré. Renouvelez-la si nécessaire`;
        color = '#FF5722';
        break;
      default:
        title = '📝 Statut modifié';
        body = `Le statut de votre annonce "${listingTitle}" a changé`;
        color = '#607D8B';
    }

    const message = {
      notification: {
        title: title,
        body: body
      },
      data: {
        type: 'listing_status_change',
        listingId: listingId,
        oldStatus: oldStatus,
        newStatus: newStatus,
        listingTitle: listingTitle,
        screen: 'my_listings',
        params: JSON.stringify({ 
          listingId: listingId,
          highlightStatus: newStatus 
        })
      },
      token: ownerId, // Token FCM du propriétaire
      android: {
        priority: 'high',
        notification: {
          sound: 'default',
          channelId: 'listing_status',
          color: color
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
    console.error('❌ Erreur notification changement statut:', error);
    throw error;
  }
}

/**
 * 4. RAPPEL DE PAIEMENT - Notifier les rappels de paiement à renouveler
 */
async function notifyPaymentReminder(userId, userName, paymentType, dueDate, amount) {
  try {
    let title, body;
    
    switch (paymentType) {
      case 'SUBSCRIPTION':
        title = '💳 Abonnement à renouveler';
        body = `Votre abonnement premium expire le ${dueDate}. Renouvelez maintenant !`;
        break;
      case 'LISTING_FEE':
        title = '💰 Frais d\'annonce à payer';
        body = `Des frais de ${amount}€ sont dus pour vos annonces. Payez maintenant !`;
        break;
      case 'PREMIUM_FEATURES':
        title = '⭐ Fonctionnalités premium';
        body = `Débloquez des fonctionnalités premium pour ${amount}€/mois !`;
        break;
      default:
        title = '💳 Paiement requis';
        body = `Un paiement de ${amount}€ est requis. Effectuez le paiement maintenant !`;
    }

    const message = {
      notification: {
        title: title,
        body: body
      },
      data: {
        type: 'payment_reminder',
        paymentType: paymentType,
        dueDate: dueDate,
        amount: amount.toString(),
        userName: userName,
        screen: 'payment',
        params: JSON.stringify({ 
          paymentType: paymentType,
          highlightUrgent: true 
        })
      },
      token: userId, // Token FCM de l'utilisateur
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
    console.error('❌ Erreur notification rappel paiement:', error);
    throw error;
  }
}

/**
 * Fonction de test pour tous les types de notifications
 */
async function testAllNotificationTypes() {
  console.log('🧪 Test de tous les types de notifications...\n');

  try {
    // Test 1: Nouvelles annonces
    console.log('1️⃣ Test: Nouvelles annonces correspondantes');
    await notifyNewMatchingListings(
      'user_123',
      { 
        id: 'search_456',
        location: 'Paris',
        priceRange: '200000-500000',
        propertyType: 'appartement'
      },
      [
        { id: 'listing_789', title: 'Appartement 3 pièces Paris 15ème', price: 350000 },
        { id: 'listing_790', title: 'Studio moderne Paris 11ème', price: 280000 }
      ]
    );

    // Test 2: Nouveau message
    console.log('\n2️⃣ Test: Nouveau message reçu');
    await notifyNewMessage(
      'user_456',
      'Marie Dupont',
      'Bonjour, votre appartement m\'intéresse beaucoup. Pourrions-nous organiser une visite ?',
      'conversation_789'
    );

    // Test 3: Changement de statut
    console.log('\n3️⃣ Test: Changement de statut d\'annonce');
    await notifyListingStatusChange(
      'user_789',
      'Appartement 4 pièces avec balcon',
      'PENDING',
      'APPROVED',
      'listing_123'
    );

    // Test 4: Rappel de paiement
    console.log('\n4️⃣ Test: Rappel de paiement');
    await notifyPaymentReminder(
      'user_101',
      'Jean Martin',
      'SUBSCRIPTION',
      '2024-02-15',
      29.99
    );

    console.log('\n🎉 Tous les tests terminés avec succès !');

  } catch (error) {
    console.error('❌ Erreur lors des tests:', error);
  }
}

// Exporter les fonctions
module.exports = {
  notifyNewMatchingListings,
  notifyNewMessage,
  notifyListingStatusChange,
  notifyPaymentReminder,
  testAllNotificationTypes
};

// Lancer les tests si le script est exécuté directement
if (require.main === module) {
  testAllNotificationTypes().then(() => {
    console.log('\n✅ Tests terminés !');
    process.exit(0);
  }).catch(error => {
    console.error('❌ Erreur fatale:', error);
    process.exit(1);
  });
}
