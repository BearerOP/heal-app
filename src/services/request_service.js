const user_model = require("../models/user_model");
const mongoose = require("mongoose");

exports.send_request = async (req, res) => {
  try {
    const senderID = req.user._id;
    const receiverId = req.body.receiverId;

    let receiverData = await user_model.findById({ _id: receiverId });

    // console.log(receiverData);
    if (!receiverData) {
      return {
        status: 404,
        message: "Receiver not found",
        success: false,
      };
    }

    const existingRequest = receiverData.requests.find((request) =>
      request.sender_id.equals(senderID)
    );

    if (existingRequest) {
      return {
        status: 400,
        message: "Request already sent",
        success: false,
      };
    }

    receiverData.requests.push({
      sender_id: senderID,
      status: false,
    });

    const updatedReceiverData = await receiverData.save();

    if (updatedReceiverData) {
      return {
        status: 200,
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
    // console.error(error);
    return {
      success: false,
      message: error.message,
    };
  }
};

exports.alluser = async (req, res) => {
  try {
    const user = await user_model.find({
      _id: { $ne: req.user._id },
    }).select("-password -auth_key -notificationToken").exec();
    // Filter out users who are already in relation
    const filteredUsers = user.filter(u => !req.user.relatives.includes(u._id));
    return {
      success: true,
      data: filteredUsers,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};

exports.allRequest = async (req, res) => {
  try {
    const user_id = req.user._id;
    if (user_id) {
      const user_data = await user_model.findOne({ _id: user_id });

      // Populate sender's name for each request received
      let allSenderData = [];
      for (const sender of user_data.requests) {
        let senderData = await user_model
          .findOne({ _id: sender.sender_id })
          .select("-password -auth_key -notificationToken")
          .exec();
        allSenderData.push({
          sender: senderData,
          status: sender.status,
        });
      }

      // Find requests sent by the user
      const sentRequests = await user_model.find({
        "requests.sender_id": user_id,
      }).select("-password -auth_key -notificationToken").exec();

      let allSentRequests = [];
      for (const receiver of sentRequests) {
        const request = receiver.requests.find((req) =>
          req.sender_id.equals(user_id)
        );
        // Check if the receiver is already a relative
        if (!user_data.relatives.includes(receiver._id)) {
          allSentRequests.push({
            receiver: receiver,
            status: request.status,
          });
        }
      }

      return {
        success: true,
        message: "All requests fetched",
        receivedRequests: allSenderData,
        sentRequests: allSentRequests,
      };
    }
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};

exports.acceptRequest = async (req, res) => {
  try {
    const user = req.user;
    let Arr = [];

    let sender_id = req.body.senderId;
    // let _id = req.body._id;
    // let __id = new mongoose.Types.ObjectId(_id);
    // console.log(__id);
    // const user_data = await user_model.findOne({_id:user_id})
    // let senderID = new mongoose.Types.ObjectId(sender_id)
    // // let id = new mongoose.Types.ObjectId(_id)
    // const sender_data = await user_model.findById({_id:senderID})

    // console.log(sender_data);
    // sender_data.relatives.push(user._id);

    // const savedata = sender_data.save()

    // user.relatives.push(sender_id)
    // const userDatasave = user.save();
    // if(userDatasave,savedata){
    //     return{
    //         sucess:true,
    //         data:userDatasave,savedata
    //     }
    // }
    // let id = null;
    // const findid = user.relatives.forEach(element => {
    //     // console.log(element);
    //     if(element.equals(sender_id)){
    //         return{
    //             existingsender
    //         }

    //     }

    // });
    const existingsender = user.relatives.find((request) =>
      request.equals(sender_id)
    );
    const sender_data = await user_model.findById({ _id: sender_id });
    const existingresiver = sender_data.relatives.find((request) =>
      request.equals(user._id)
    );
    // console.log(existingsender);
    if (!existingsender && !existingresiver) {
      user.relatives.push(sender_id);
      const userDatasave = user.save();
      sender_data.relatives.push(user._id);

      const savedata = sender_data.save();
      const existingresiver = user.requests.findIndex((request) =>
        request.sender_id.equals(sender_id)
      );
      if (existingresiver != -1) {
        for (i = 0; i < user.requests.length; i++) {
          if (user.requests[i] !== user.requests[existingresiver]) {
            Arr.push(user.requests[i]);
            await user_data.save();
          }
        }
        await user_model.findOneAndUpdate(
          { _id: user._id },
          { $set: { requests: Arr } }
        );
      }
      // console.log(existingresiver);
      return {
        success: true,
        data: "request accepted",
      };
    } else {
      return {
        success: false,
        data: "alrady existe",
      };
    }
    // console.log(userDatasave);
    // if (!existingresiver) {
    //   sender_data.relatives.push(user._id);

    //   const savedata = sender_data.save();
    //   return{
    //     data:savedata
    //   }
    // }
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Error Occurred",
      error: error,
    };
  }
};
