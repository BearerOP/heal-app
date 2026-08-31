const admin = require("firebase-admin");
const userModel = require("../../src/models/user_model");

// Initialize Firebase Admin SDK
if (!admin.apps.length && process.env.GC_PROJECT_ID && process.env.GC_PRIVATE_KEY) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({ 
        type: process.env.GC_TYPE,
        project_id: process.env.GC_PROJECT_ID,
        private_key_id: process.env.GC_PRIVATE_KEY_ID,
        private_key: process.env.GC_PRIVATE_KEY ? process.env.GC_PRIVATE_KEY.replace(/\\n/g, "\n") : undefined,
        client_email: process.env.GC_CLIENT_EMAIL,
        client_id: process.env.GC_CLIENT_ID,
        auth_uri: process.env.GC_AUTH_URI,
        token_uri: process.env.GC_TOKEN_URI,
        auth_provider_x509_cert_url: process.env.GC_AUTH_PROVIDER_X509_CERT_URL,
        client_x509_cert_url: process.env.GC_CLIENT_X509_CERT_URL,
        universe_domain: process.env.UNIVERSE_DOMAIN,
      }),
    });
  } catch (err) {
    console.error("Firebase admin initialization error:", err.message);
  }
}

/**
 * Function to get the notification token of a user
 * @param {String} userId - The ID of the user
 * @returns {Promise<String>} - The notification token of the user
 */
const getUserToken = async (userId) => {
  const user = await userModel.findById(userId);
  if (user && user.notificationToken) {
    return user.notificationToken;
    // return user.notificationToken || 'ecwoGw__ROWau-klkXfyg3:APA91bEHviRi8Dem0iilY2ZBLhGLHaEoMiVonK_DvQRsgEA3uMw9MJgo5-l3xSzBeqRuTIniTpBtn7tZKIsM3epRdLJgO7Xhag7oPjplgc1Wwx-6Hq-kHq-SfZKZAEo7TlWD7hLHu9w5';
  } else {
    throw new Error("User not found or notification token is missing");
  }
};

/**
 * Function to send a notification to a user
 * @param {String} token - The notification token of the user
 * @param {String} message - The message to be sent
 * @param {String} [title="Notification"] - The title of the notification
 * @param {Object} [data={}] - Custom data payload
 */
const sendNotification = async (token, message, title = "Notification", data = {}) => {
  if (!token) {
    console.log("[NotificationService] No notification token provided");
    return;
  }

  if (!admin.apps || admin.apps.length === 0) {
    console.warn("[NotificationService] Firebase Admin SDK is not initialized. Check your Firebase service account credentials in .env (GC_PROJECT_ID, GC_CLIENT_EMAIL, GC_PRIVATE_KEY).");
    return;
  }

  console.log("[NotificationService] Sending notification for token:", token);
  try {
    const stringifiedData = {};
    for (const [k, v] of Object.entries(data)) {
      stringifiedData[k] = String(v);
    }

    const response = await admin.messaging().send({
      token: token,
      notification: {
        title: title || "Notification",
        body: message,
      },
      data: stringifiedData,
    });

    console.log("[NotificationService] Notification sent successfully:", response);
    return response;
  } catch (error) {
    console.error("[NotificationService] Error sending notification:", error?.message || error);
    if (error?.message?.includes("invalid_grant") || error?.message?.includes("account not found")) {
      console.warn("[NotificationService] Tip: The Firebase service account key in .env has expired or the service account was deleted. Please generate a new private key from Firebase Console > Project Settings > Service Accounts.");
    }
  }
};

module.exports = {
  getUserToken,
  sendNotification,
};
