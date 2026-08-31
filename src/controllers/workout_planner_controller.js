const {
    exercises_all,
    exercises_bodyPart,
    exercises_equipment,
    exercises_target_muscle,
    all_body_parts,
    all_equipments,
    all_target_muscles,
    exercises_name,
    exercises_bodyPart_target,
    all_workout_plans,
    workout_plans_muscles,
    add_workout
 } = require('../services/workout_planner_service.js');

exports.exercises_all = async (req, res) => {
    try {
      const data = await exercises_all(req,res);
      console.log("data from controller",data);
      
      if (data.success) {
        res.status(data.status).json(data.data);
      }
      else{
        res.status(data.status).json(data.data);
      }
    } catch (error) {
      console.log("error from controller",error);
      
        res.status(500).json({success: false, message:'Internal Server Error'});
    }
  };

exports.exercises_bodyPart = async (req, res) => {
    try {
      const data = await exercises_bodyPart(req,res);
      if (data.success) {
        res.status(data.status).json(data.data);
      }
      else{
        res.status(data.status).json(data.data);
      }
    } catch (error) {
        res.status(500).json({success: false, message:'Internal Server Error'});
    }
  };

exports.exercises_equipment = async (req, res) => {
    try {
      const data = await exercises_equipment(req,res);
      if (data.success) {
        res.status(data.status).json(data.data);
      }
      else{
        res.status(data.status).json(data.data);
      }
    } catch (error) {
        res.status(500).json({success: false, message:'Internal Server Error'});
    }
  };

exports.exercises_target_muscle = async (req, res) => {
    try {
      const data = await exercises_target_muscle(req,res);
      if (data.success) {
        res.status(data.status).json(data.data);
      }
      else{
        res.status(data.status).json(data.data);
      }
    } catch (error) {
        res.status(500).json({success: false, message:'Internal Server Error'});
    }
  };

exports.all_body_parts = async (req, res) => {
    try {
      const data = await all_body_parts(req,res);
      if (data.success) {
        res.status(200).json(data.data);
      }
    } catch (error) {
        res.status(500).json(data);
    }
  };

exports.all_equipments = async (req, res) => {
    try {
      const data = await all_equipments(req,res);
      if (data.success) {
        res.status(200).json(data.data);
      }
    } catch (error) {
        res.status(500).json(data);
    }
  };
  
exports.all_target_muscles = async (req, res) => {
    try {
      const data = await all_target_muscles(req,res);
      if (data.success) {
        res.status(200).json(data.data);
      }
    } catch (error) {
        res.status(500).json(data);
    }
  };

  exports.exercises_name = async (req, res) => {
    try {
      const data = await exercises_name(req,res);
      if (data.success) {
        res.status(200).json(data.data);
      }
    } catch (error) {
        res.status(500).json(data);
    }
  };

  exports.exercises_bodyPart_target = async (req, res) => {
    try {
      const data = await exercises_bodyPart_target(req,res);
      if (data.success) {
        res.status(200).json(data.data);
      }
    } catch (error) {
        res.status(500).json(data);
    }
  };

  exports.all_workout_plans = async (req, res) => {
    try {
      const data = await all_workout_plans(req,res);
      if (data.success) {
        res.status(200).json(data.data);
      }
    } catch (error) {
        res.status(500).json(data);
    }
  };

  exports.workout_plans_muscles = async (req, res) => {
    try {
      const data = await workout_plans_muscles(req,res);
      if (data.success) {
        res.status(200).json(data.data);
      }
    } catch (error) {
        res.status(500).json(data);
    }
  };

  exports.add_workout = async (req, res) => {
    try {
      const data = await add_workout(req,res);
      console.log("data from controller",data);
      
      if (data.success) {
        res.status(data.status).json(data);
      }
      else{
        res.status(data.status).json(data);
      }
    } catch (error) {
      console.log("error from controller",error);
      
        res.status(500).json(data);
    }
  };