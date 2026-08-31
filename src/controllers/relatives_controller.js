const {
    getAllRelatives,
    getRelativeMedication,
} = require('../services/relatives_service.js')

exports.getAllRelatives = async(req,res)=>{
    try {
        const data = await getAllRelatives(req,res);
        if(data.success){
            res.status(200).json( {
                success: data.success,
                message:data.message,
                data:data.data
            })
        }
        else{
            res.status(500).json( {
                success: data.success,
                message:data.message,
            })
        }
    } catch (error) {
        console.error("Error fetching overall leaderboard:", error);
        res.status(500).json( {
            success: false,
            message: "Error fetching overall leaderboard",
        })
    }
}
exports.getRelativeMedication = async(req,res)=>{
    try {
        const data = await getRelativeMedication(req,res);
        if(data.success){
            res.status(200).json( {
                success: data.success,
                message:data.message,
                data:data.data
            })
        }
        else{
            res.status(500).json( {
                success: data.success,
                message:data.message,
            })
        }
    } catch (error) {
        console.error("Error while fetching Relative Medication :", error);
        res.status(500).json( {
            success: false,
            message: "Error while fetching Relative Medication ",
        })
    }
}