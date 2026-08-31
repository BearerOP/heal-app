const {
    create_reminder,
    delete_reminders,
    update_reminder,
    get_reminders,
} = require("../services/reminder_service.js")

exports.create_reminder = async(req,res)=>
  {try {
      const data = await create_reminder(req, res);
      if (data.success) {
        res.status(200).json(data);
      }else{
          res.status(403).json(data);

      console.log("Error:", error);
    }
    } catch (error) {
      console.log("Error:", error);
  }
}

exports.delete_reminders = async(req,res)=>
  {try {
      const data = await delete_reminders(req, res);
      if (data.success) {
        res.status(200).json(data);
      }else{
          res.status(403).json(data);

      console.log("Error:", error);
    }
    } catch (error) {
      console.log("Error:", error);
  }
}

exports.update_reminder = async(req,res)=>
  {try {
      const data = await update_reminder(req, res);
      if (data.success) {
        res.status(200).json(data);
      }else{
          res.status(403).json(data);

      console.log("Error:", error);
    }
    } catch (error) {
      console.log("Error:", error);
  }
}



exports.get_reminders = async(req,res)=>
  {try {
      const data = await get_reminders(req, res);
      if (data.success) {
        res.status(200).json(data);
      }else{
          res.status(403).json(data);

      console.log("Error:", error);
    }
    } catch (error) {
      console.log("Error:", error);
  }
}

