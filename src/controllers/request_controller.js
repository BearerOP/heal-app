const { send_request ,alluser,allRequest,acceptRequest} = require("../services/request_service.js");
exports.send_request = async (req, res) => {
  try {
    const data = await send_request(req, res);
    if (data.success) {
      res.status(data.status).json(data);
    } else {
      res.status(data.status).json(data);
    }
  } catch (error) {
   res.status(403).json({message:"Internal server error",success:false});

  }
};
exports.alluser = async (req, res) => {
  try {
    const data = await alluser(req, res);
    if (data.success) {
      res.status(200).json(data);
    } else {
      res.status(403).json(data);

    //   console.log("Error:", error);
    }
  } catch (error) {
    console.log("Error:", error);
  }
};
exports.allRequest = async (req, res) => {
  try {
    const data = await allRequest(req, res);
    if (data.success) {
      res.status(200).json(data);
    } else {
      res.status(403).json(data);

    //   console.log("Error:", error);
    }
  } catch (error) {
    console.log("Error:", error);
  }
};
exports.acceptRequest = async (req, res) => {
  try {
    const data = await acceptRequest(req, res);
    if (data.success) {
      res.status(200).json(data);
    } else {
      res.status(403).json(data);

    //   console.log("Error:", error);
    }
  } catch (error) {
    console.log("Error:", error);
  }
};
