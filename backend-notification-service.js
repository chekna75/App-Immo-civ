#!/usr/bin/env node

/**
 * Service backend pour les notifications Firebase
 * Intégration avec l'API immobilier
 */

const admin = require('firebase-admin');
const serviceAccount = require('./appimmofront/app-immo-notifications-firebase-adminsdk-fbsvc-5c87fe303d.json');

// Initialiser Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'app-immo-notifications'
});

class BackendNotificationService {
  constructor() {
    this.messaging = admin.messaging();
  }

  /**
   * 1. NOUVELLES ANNONCES - Notifier les utilisateurs pour de nouvelles annonces correspondant à leurs recherches
   */
  async notifyNewMatchingListings(searchCriteria, newListings) {
    try {
      console.log(`🔍 Recherche de nouvelles annonces pour: ${searchCriteria.location}`);
      
      // Récupérer les utilisateurs qui ont des recherches similaires
      const usersToNotify = await this.getUsersWithSimilarSearches(searchCriteria);
      
      const notifications = [];
      
      for (const user of usersToNotify) {
        const message = {
          notification: {
            title: '🏠 Nouvelles annonces trouvées !',
            body: `${newListings.length} nouvelle(s) annonce(s) correspondent à vos critères de recherche`
          },
          data: {
            type: 'new_matching_listings',
            userId: user.id,
            searchCriteria: JSON.stringify(searchCriteria),
            listingsCount: newListings.length.toString(),
            listings: JSON.stringify(newListings.map(l => ({ 
              id: l.id, 
              title: l.title, 
              price: l.price,
              location: l.location 
            }))),
            screen: 'search_results',
            params: JSON.stringify({ 
              searchId: searchCriteria.id,
              highlightNew: true 
            })
          },
          token: user.fcmToken,
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

        const response = await this.messaging.send(message);
        notifications.push({ userId: user.id, messageId: response });
        console.log(`✅ Notification envoyée à ${user.name}: ${response}`);
      }

      return {
        success: true,
        notificationsSent: notifications.length,
        notifications: notifications
      };

    } catch (error) {
      console.error('❌ Erreur notification nouvelles annonces:', error);
      throw error;
    }
  }

  /**
   * 2. MESSAGE REÇU - Notifier quand un utilisateur reçoit un nouveau message
   */
  async notifyNewMessage(conversationId, senderId, recipientId, messageContent) {
    try {
      console.log(`💬 Nouveau message de ${senderId} vers ${recipientId}`);
      
      // Récupérer les informations du destinataire
      const recipient = await this.getUserById(recipientId);
      const sender = await this.getUserById(senderId);
      
      if (!recipient || !recipient.fcmToken) {
        console.log(`⚠️ Aucun token FCM trouvé pour l'utilisateur ${recipientId}`);
        return { success: false, error: 'No FCM token found' };
      }

      const message = {
        notification: {
          title: `💬 Nouveau message de ${sender.name}`,
          body: messageContent.length > 50 ? messageContent.substring(0, 50) + '...' : messageContent
        },
        data: {
          type: 'new_message',
          senderId: senderId,
          senderName: sender.name,
          conversationId: conversationId,
          messagePreview: messageContent,
          screen: 'chat',
          params: JSON.stringify({ 
            conversationId: conversationId,
            highlightNew: true 
          })
        },
        token: recipient.fcmToken,
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

      const response = await this.messaging.send(message);
      console.log(`✅ Notification message envoyée: ${response}`);
      
      return {
        success: true,
        messageId: response,
        recipientId: recipientId
      };

    } catch (error) {
      console.error('❌ Erreur notification nouveau message:', error);
      throw error;
    }
  }

  /**
   * 3. CHANGEMENT DE STATUT D'ANNONCE - Notifier les changements de statut
   */
  async notifyListingStatusChange(listingId, oldStatus, newStatus) {
    try {
      console.log(`📝 Changement de statut pour l'annonce ${listingId}: ${oldStatus} → ${newStatus}`);
      
      // Récupérer les informations de l'annonce et du propriétaire
      const listing = await this.getListingById(listingId);
      const owner = await this.getUserById(listing.ownerId);
      
      if (!owner || !owner.fcmToken) {
        console.log(`⚠️ Aucun token FCM trouvé pour le propriétaire ${listing.ownerId}`);
        return { success: false, error: 'No FCM token found' };
      }

      let title, body, color;
      
      switch (newStatus) {
        case 'APPROVED':
          title = '✅ Annonce approuvée !';
          body = `Votre annonce "${listing.title}" a été approuvée et est maintenant visible`;
          color = '#4CAF50';
          break;
        case 'REJECTED':
          title = '❌ Annonce rejetée';
          body = `Votre annonce "${listing.title}" a été rejetée. Consultez les raisons`;
          color = '#F44336';
          break;
        case 'SOLD':
          title = '🏠 Annonce vendue !';
          body = `Félicitations ! Votre annonce "${listing.title}" a été vendue`;
          color = '#FF9800';
          break;
        case 'EXPIRED':
          title = '⏰ Annonce expirée';
          body = `Votre annonce "${listing.title}" a expiré. Renouvelez-la si nécessaire`;
          color = '#FF5722';
          break;
        default:
          title = '📝 Statut modifié';
          body = `Le statut de votre annonce "${listing.title}" a changé`;
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
          listingTitle: listing.title,
          screen: 'my_listings',
          params: JSON.stringify({ 
            listingId: listingId,
            highlightStatus: newStatus 
          })
        },
        token: owner.fcmToken,
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

      const response = await this.messaging.send(message);
      console.log(`✅ Notification changement statut envoyée: ${response}`);
      
      return {
        success: true,
        messageId: response,
        ownerId: listing.ownerId
      };

    } catch (error) {
      console.error('❌ Erreur notification changement statut:', error);
      throw error;
    }
  }

  /**
   * 4. RAPPEL DE PAIEMENT - Notifier les rappels de paiement à renouveler
   */
  async notifyPaymentReminder(userId, paymentType, dueDate, amount) {
    try {
      console.log(`💳 Rappel de paiement pour l'utilisateur ${userId}`);
      
      // Récupérer les informations de l'utilisateur
      const user = await this.getUserById(userId);
      
      if (!user || !user.fcmToken) {
        console.log(`⚠️ Aucun token FCM trouvé pour l'utilisateur ${userId}`);
        return { success: false, error: 'No FCM token found' };
      }

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
          userName: user.name,
          screen: 'payment',
          params: JSON.stringify({ 
            paymentType: paymentType,
            highlightUrgent: true 
          })
        },
        token: user.fcmToken,
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

      const response = await this.messaging.send(message);
      console.log(`✅ Notification rappel paiement envoyée: ${response}`);
      
      return {
        success: true,
        messageId: response,
        userId: userId
      };

    } catch (error) {
      console.error('❌ Erreur notification rappel paiement:', error);
      throw error;
    }
  }

  // Méthodes utilitaires (à adapter selon votre base de données)
  async getUsersWithSimilarSearches(searchCriteria) {
    // Simulation - à remplacer par votre logique de base de données
    return [
      { id: 'user_123', name: 'Jean Dupont', fcmToken: 'fcm_token_123' },
      { id: 'user_456', name: 'Marie Martin', fcmToken: 'fcm_token_456' }
    ];
  }

  async getUserById(userId) {
    // Simulation - à remplacer par votre logique de base de données
    const users = {
      'user_123': { id: 'user_123', name: 'Jean Dupont', fcmToken: 'fcm_token_123' },
      'user_456': { id: 'user_456', name: 'Marie Martin', fcmToken: 'fcm_token_456' },
      'user_789': { id: 'user_789', name: 'Pierre Durand', fcmToken: 'fcm_token_789' }
    };
    return users[userId];
  }

  async getListingById(listingId) {
    // Simulation - à remplacer par votre logique de base de données
    return {
      id: listingId,
      title: 'Appartement 3 pièces avec balcon',
      ownerId: 'user_789',
      status: 'APPROVED'
    };
  }
}

// Exporter la classe
module.exports = BackendNotificationService;

// Test du service
if (require.main === module) {
  const service = new BackendNotificationService();
  
  console.log('🧪 Test du service backend de notifications...\n');
  
  // Test des 4 types de notifications
  Promise.all([
    service.notifyNewMatchingListings(
      { location: 'Paris', priceRange: '200000-500000' },
      [{ id: '1', title: 'Appartement Paris', price: 350000 }]
    ),
    service.notifyNewMessage('conv_123', 'user_456', 'user_123', 'Bonjour, votre appartement m\'intéresse !'),
    service.notifyListingStatusChange('listing_123', 'PENDING', 'APPROVED'),
    service.notifyPaymentReminder('user_123', 'SUBSCRIPTION', '2024-02-15', 29.99)
  ]).then(() => {
    console.log('\n🎉 Tous les tests terminés !');
  }).catch(error => {
    console.error('❌ Erreur lors des tests:', error);
  });
}
