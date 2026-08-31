const user_model = require("../models/user_model");
const mongoose = require("mongoose");

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

    // Ensure requests is always an array
    receiverData.requests = Array.isArray(receiverData.requests) ? receiverData.requests : [];

    const existingRequest = receiverData.requests.find((request) =>
      request.sender_id && request.sender_id.equals && request.sender_id.equals(senderID)
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

// Update: Remove request from user's requests array if accepted
exports.update_Request = async (req, res) => {
  try {
    const user = req.user;
    const { senderId, status } = req.body;

    // Validate input
    if (!senderId || !mongoose.Types.ObjectId.isValid(senderId)) {
      return{
        status: 400,
        success: false,
        message: "Invalid sender ID",
      };
    }

    if (!["accepted", "rejected"].includes(status)) {
      return{
        status: 400,  
        success: false,
        message: "Status must be either 'accepted' or 'rejected'",
      };
    }

    // Find the request in user's requests array
    console.log("User Requests:", user.requests);
    console.log("Sender ID:", senderId);

    const requestIndex = user.requests.findIndex(request => 
      request.sender_id.equals(senderId) && request.status === "pending"
    );

    if (requestIndex === -1) {
      return{
        status: 404,  
        success: false,
        message: "Pending request not found",
      };
    }

    // Get sender data
    const sender = await user_model.findById(senderId);
    if (!sender) {
      return{
        status: 404,    
        success: false,
        message: "Sender not found",
      };
    }

    if (status === "accepted") {
      // ACCEPT REQUEST LOGIC
      // Check if already connected
      console.log("User Connections:", user.connections);
      console.log("Sender Connections:", sender.connections);

      const alreadyConnected = user.connections.some(conn => 
        conn.equals(senderId)
      ) || sender.connections.some(conn => 
        conn.equals(user._id)
      );

      if (alreadyConnected) {
        return{
          status: 400,
          success: false,
          message: "Already connected with this user",
        };
      }

      // Add to each other's connections
      user.connections.push(senderId);
      sender.connections.push(user._id);

      // Remove the request from user's requests array
      user.requests.splice(requestIndex, 1);
      sender.requests.splice(sender.requests.findIndex(req => req.send_to.equals(user._id)), 1);

      // Save both users
      await Promise.all([user.save(), sender.save()]);

      return {
        success: true,
        message: "Request accepted and connection established",
        data: {
          user,
          sender,
        },
      };
    } else {
      // REJECT REQUEST LOGIC
      
      // Update request status to rejected
      user.requests[requestIndex].status = "rejected";
      await user.save();

      return {
        status: 200,
        success: true,
        message: "Request rejected",
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

      // Populate sender's name for each request
      let allSenderData = [];
      for (const sender of user_data.requests) {
        let senderData = await user_model
          .findOne({ _id: sender.sender_id })
          .select("-password -auth_key -notificationToken -connections -requests")
          .exec();
        allSenderData.push(senderData);

      }
      return {
        success: true,
        message:"All Relatives' Requests fetched",
        connections: allSenderData,
      };
    }
  } catch (error) {
    console.log("Error fetching all requests:", error);
    
    return {
      success: false,
      message: error.message,
    };
  }
}

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