const { send_request ,alluser,allRequest, update_Request, findUserById, allConnections} = require("../services/connection_service.js");
exports.send_request = async (req, res) => {
  try {
    const data = await send_request(req, res);
    console.log("Send Request Data:", data);
    
    if (data.success) {
      res.status(200).json(data);
    } else {
      res.status(403).json(data);

    }
  } catch (error) {
    console.log("Error:", error);
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
exports.allConnections = async (req, res) => {
  try {
    const data = await allConnections(req, res);
    if (data.success) {
      res.status(200).json(data);
    } else {
      res.status(403).json(data);

    //   console.log("Error:", error);
    }
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
      error: error.message || "An error occurred while processing your request.",
    });
  }
};
exports.update_Request = async (req, res) => {
  try {
    const data = await update_Request(req, res);
    console.log("Update Request Data:", data);
    if (data.success) {
      res.status(200).json(data);
    } else {
      console.log("Error in update_Request:", data);
      res.status(403).json(data);
    }
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
      error: error.message || "An error occurred while processing your request.",
    });
  }
};

exports.allRequest = async (req, res) => {
  try {
    const data = await allRequest(req, res);
    if (data.success) {
      res.status(200).json(data);
    } else {
      res.status(403).json(data);
    }
  } catch (error) {
    console.log("Error:", error);
  }
};

exports.findUserById = async (req, res) => {
  // console.log("Finding user by ID:", req.params.id);
  
 try {

  const data  = await findUserById(req, res);
  if (data.success) {
    res.status(200).json(data);
  } else {
    res.status(404).json(data);
  }

 } catch (error) {
    console.log("Error:", error);
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};


