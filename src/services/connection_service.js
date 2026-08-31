const user_model = require("../models/user_model");
const mongoose = require("mongoose");
const { sendNotification } = require("../../public/utils/notification.js");

exports.send_request = async (req) => {
  try {
    const senderID = req.user._id;
    const receiverId = req.body.receiverId;
    console.log("Sender ID:", senderID);
    console.log("Receiver ID:", receiverId);

    let receiverData = await user_model.findOne({ userId: receiverId });
    let senderData = await user_model.findOne({ _id: senderID });

    if (!receiverData) {
      return {
        message: "Receiver not found",
        success: false,
      };
    }

    // Ensure arrays exist
    receiverData.requests = Array.isArray(receiverData.requests) ? receiverData.requests : [];
    senderData.requests = Array.isArray(senderData.requests) ? senderData.requests : [];
    senderData.connections = Array.isArray(senderData.connections) ? senderData.connections : [];

    const alreadyConnected = senderData.connections.some(
      (conn) => conn && conn.toString() === receiverData._id.toString()
    );
    if (alreadyConnected) {
      return {
        message: "You are already connected with this user",
        success: false,
      };
    }

    const existingRequest = receiverData.requests.find(
      (request) =>
        request.sender_id &&
        request.sender_id.toString() === senderID.toString() &&
        request.status === "pending"
    );

    if (existingRequest) {
      return {
        message: "Request already sent",
        success: false,
      };
    }

    receiverData.requests.push({
      sender_id: senderID,
      status: "pending",
    });

    senderData.requests = Array.isArray(senderData.requests) ? senderData.requests : [];
    senderData.requests.push({
      send_to: receiverData._id,
      status: "pending",
    });
    await senderData.save();
    const updatedReceiverData = await receiverData.save();

    if (updatedReceiverData) {
      // Send Mobile Push Notification to receiver
      if (receiverData.notificationToken) {
        try {
          const senderName = senderData?.name || senderData?.username || "Someone";
          await sendNotification(
            receiverData.notificationToken,
            `${senderName} invited you to join their Care Circle on Swasthya`,
            "New Care Circle Invite",
            {
              type: "care_circle_invite",
              senderId: senderID.toString(),
              senderName: senderName,
            }
          );
        } catch (notifErr) {
          console.error("Error sending invite notification:", notifErr?.message || notifErr);
        }
      }

      return {
        message: "Request sent successfully",
        success: true,
        data: updatedReceiverData.requests,
      };
    } else {
      return {
        message: "Request not sent",
        success: false,
      };
    }
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: error.message,
    };
  }
};

exports.alluser = async (req, res) => {
  try {
    const user = await user_model.find();
    return {
      success: true,
      data: user,
    };
  } catch (error) {
    return {
      success: false,
      massege: error.massege,
    };
  }
};

exports.allConnections = async (req, res) => {
  try {
    const user_id = req.user._id;
    if (user_id) {
      const user_data = await user_model.findOne({ _id: user_id });

      // Populate sender's name for each request
      let allConnections = [];
      for (const connection of user_data.connections) {
        let connectionData = await user_model
          .findOne({ _id: connection })
          .select("-password -auth_key -notificationToken")
          .exec();
        allConnections.push(connectionData);
      }
      return {
        success: true,
        message:"All connections fetched successfully",
        connections: allConnections,
      };
    }
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};

// Update: Accept or Reject request from user's requests array
exports.update_Request = async (req, res) => {
  try {
    const user = req.user;
    const { senderId, status } = req.body;

    // Validate input
    if (!senderId || !mongoose.Types.ObjectId.isValid(senderId)) {
      return {
        status: 400,
        success: false,
        message: "Invalid sender ID",
      };
    }

    if (!["accepted", "rejected"].includes(status)) {
      return {
        status: 400,  
        success: false,
        message: "Status must be either 'accepted' or 'rejected'",
      };
    }

    user.requests = Array.isArray(user.requests) ? user.requests : [];

    const requestIndex = user.requests.findIndex(
      (request) =>
        request.sender_id &&
        request.sender_id.toString() === senderId.toString() &&
        request.status === "pending"
    );

    if (requestIndex === -1) {
      return {
        status: 404,  
        success: false,
        message: "Pending request not found",
      };
    }

    // Get sender data
    const sender = await user_model.findById(senderId);
    if (!sender) {
      return {
        status: 404,    
        success: false,
        message: "Sender not found",
      };
    }

    sender.requests = Array.isArray(sender.requests) ? sender.requests : [];
    user.connections = Array.isArray(user.connections) ? user.connections : [];
    sender.connections = Array.isArray(sender.connections) ? sender.connections : [];

    if (status === "accepted") {
      // ACCEPT REQUEST LOGIC
      const alreadyConnected =
        user.connections.some((conn) => conn && conn.toString() === senderId.toString()) ||
        sender.connections.some((conn) => conn && conn.toString() === user._id.toString());

      if (alreadyConnected) {
        // Remove pending request if already connected
        user.requests.splice(requestIndex, 1);
        const senderReqIndex = sender.requests.findIndex(
          (reqItem) => reqItem.send_to && reqItem.send_to.toString() === user._id.toString()
        );
        if (senderReqIndex !== -1) {
          sender.requests.splice(senderReqIndex, 1);
        }
        await Promise.all([user.save(), sender.save()]);

        return {
          status: 200,
          success: true,
          message: "Already connected with this user",
        };
      }

      // Add to each other's connections
      user.connections.push(senderId);
      sender.connections.push(user._id);

      // Remove the request from user's requests array
      user.requests.splice(requestIndex, 1);

      // Remove the sent request from sender's requests array
      const senderReqIndex = sender.requests.findIndex(
        (reqItem) => reqItem.send_to && reqItem.send_to.toString() === user._id.toString()
      );
      if (senderReqIndex !== -1) {
        sender.requests.splice(senderReqIndex, 1);
      }

      // Save both users
      await Promise.all([user.save(), sender.save()]);

      return {
        status: 200,
        success: true,
        message: "Request accepted and connection established",
        data: {
          user,
          sender,
        },
      };
    } else {
      // REJECT REQUEST LOGIC
      user.requests.splice(requestIndex, 1);
      const senderReqIndex = sender.requests.findIndex(
        (reqItem) => reqItem.send_to && reqItem.send_to.toString() === user._id.toString()
      );
      if (senderReqIndex !== -1) {
        sender.requests.splice(senderReqIndex, 1);
      }
      await Promise.all([user.save(), sender.save()]);

      return {
        status: 200,
        success: true,
        message: "Request declined",
        data: {
          user,
        },
      };
    }
  } catch (error) {
    console.error("Error updating request:", error);
    return {
      status: 500,
      success: false,
      message: error.message || "Internal Server Error",
    };
  }
};

// exports.update_Request = async (req, res) => {
//   console.log("Update Request Data:", req.body);
//   try {
//     const user = req.user;
//     const { senderId, status } = req.body;

//     // Validate input
//     if (!senderId || !mongoose.Types.ObjectId.isValid(senderId)) {
//       return{
//         status: 400,
//         success: false,
//         message: "Invalid sender ID",
//       };
//     }

//     if (!["accepted", "rejected"].includes(status)) {
//       return{
//         status: 400,  
//         success: false,
//         message: "Status must be either 'accepted' or 'rejected'",
//       };
//     }

//     // Find the request in user's requests array
//     const requestIndex = user.requests.findIndex(request => 
//       request.sender_id.equals(senderId) && request.status === "pending"
//     );

//     if (requestIndex === -1) {
//       return{
//         status: 404,  
//         success: false,
//         message: "Pending request not found",
//       };
//     }

//     // Get sender data
//     const sender = await user_model.findById(senderId);
//     if (!sender) {
//       return{
//         status: 404,    
//         success: false,
//         message: "Sender not found",
//       };
//     }

//     if (status === "accepted") {
//       // ACCEPT REQUEST LOGIC
//       // Check if already connected
//       const alreadyConnected = user.connections.some(conn => 
//         conn.equals(senderId)
//       ) || sender.connections.some(conn => 
//         conn.equals(user._id)
//       );

//       if (alreadyConnected) {
//         return{
//           status: 400,
//           success: false,
//           message: "Already connected with this user",
//         };
//       }

//       // Add to each other's connections
//       user.connections.push(senderId);
//       sender.connections.push(user._id);

//       // remove the request from user's and sender's requests array
//       user.requests.splice(requestIndex, 1);
//       sender.requests.splice(sender.requests.findIndex(req => req.sender_id.equals(user._id)), 1);

//       // Save both users
//       await Promise.all([user.save(), sender.save()]);

//       return {
//         status: 200,
//         success: true,
//         message: "Request accepted and connection established",
//         user: user,
//         sender: sender,
//       };
//     } else {
//       // REJECT REQUEST LOGIC
      
//       // Update request status to rejected
//       user.requests[requestIndex].status = "rejected";
//       await user.save();

//       return {
//         status: 200,
//         success: true,
//         message: "Request rejected",
//         data: {
//           user,
//         },
//       };
//     }
//   } catch (error) {
//     console.error("Error updating request:", error);
//     return {
//       status: 500,
//       success: false,
//       message: error.message || "Internal Server Error",
//     };
//   }
// };
exports.allRequest = async (req, res) => {
  try {
    const user_id = req.user._id;
    if (user_id) {
      const user_data = await user_model.findOne({ _id: user_id });

      let receivedRequests = [];
      let sentRequests = [];

      if (user_data && Array.isArray(user_data.requests)) {
        for (const reqItem of user_data.requests) {
          if (reqItem.sender_id && reqItem.status === "pending") {
            let senderData = await user_model
              .findOne({ _id: reqItem.sender_id })
              .select("-password -auth_key -notificationToken -connections -requests")
              .lean()
              .exec();

            if (senderData) {
              receivedRequests.push({
                ...senderData,
                id: reqItem.sender_id.toString(),
                senderId: reqItem.sender_id.toString(),
                requestId: reqItem._id.toString(),
                status: reqItem.status,
                createdAt: reqItem._id?.getTimestamp ? reqItem._id.getTimestamp() : new Date(),
              });
            }
          } else if (reqItem.send_to && reqItem.status === "pending") {
            let receiverData = await user_model
              .findOne({ _id: reqItem.send_to })
              .select("-password -auth_key -notificationToken -connections -requests")
              .lean()
              .exec();

            if (receiverData) {
              sentRequests.push({
                ...receiverData,
                id: reqItem.send_to.toString(),
                receiverId: reqItem.send_to.toString(),
                requestId: reqItem._id.toString(),
                status: reqItem.status,
                createdAt: reqItem._id?.getTimestamp ? reqItem._id.getTimestamp() : new Date(),
              });
            }
          }
        }
      }

      return {
        success: true,
        message: "All requests fetched successfully",
        connections: receivedRequests,
        requests: receivedRequests,
        receivedRequests,
        sentRequests,
      };
    }
  } catch (error) {
    console.log("Error fetching all requests:", error);
    
    return {
      success: false,
      message: error.message,
    };
  }
};

exports.cancel_Request = async (req, res) => {
  try {
    const user = req.user;
    const { receiverId } = req.body;

    if (!receiverId || !mongoose.Types.ObjectId.isValid(receiverId)) {
      return {
        status: 400,
        success: false,
        message: "Invalid receiver ID",
      };
    }

    const receiver = await user_model.findById(receiverId);

    // Remove sent request from user
    if (user.requests && Array.isArray(user.requests)) {
      user.requests = user.requests.filter(
        (r) => !(r.send_to && r.send_to.toString() === receiverId.toString())
      );
      await user.save();
    }

    // Remove received request from receiver
    if (receiver && receiver.requests && Array.isArray(receiver.requests)) {
      receiver.requests = receiver.requests.filter(
        (r) => !(r.sender_id && r.sender_id.toString() === user._id.toString())
      );
      await receiver.save();
    }

    return {
      status: 200,
      success: true,
      message: "Request cancelled successfully",
    };
  } catch (error) {
    console.error("Error cancelling request:", error);
    return {
      status: 500,
      success: false,
      message: error.message || "Internal Server Error",
    };
  }
};

exports.findUserById = async (req, res) => {
  try {
    const userId = req.query.id; // Assuming userId is passed as a query parameter
    if (!userId) {
      return {
        status: 400,
        success: false,
        message: "Invalid user ID",
      };
    }

    const user = await user_model.findOne({userId }).select("-password -auth_key -notificationToken -connections -requests");
    if (!user) {
      return {
        status: 404,
        success: false,
        message: "User not found",
      };
    }

    return {
      status: 200,
      success: true,
       user,
    };
  } catch (error) {
    console.error("Error finding user by ID:", error);
    return {
      status: 500,
      success: false,
      message: error.message || "Internal Server Error",
    };
  }
};