const {
    overall,
    relatives,
    overall_ranking
} = require("../services/leaderboard_service.js")

exports.overall = async (req, res) => {
    try {
        const data = await overall(req,res);
        if(data.success){
            res.status(data.status).json(data)
        }
        else{
            res.status(data.status).json(data)
        }
    } catch (error) {
        res.status(500).json({message: "Error fetching overall leaderboard"})
    }
}
exports.relatives = async (req, res) => {
    try {
        const data = await relatives(req,res);
        if(data.success){
            res.status(200).json( {
                success: data.success,
                message:data.message,
                data
            })
        }
        else{
            res.status(500).json( {
                success: data.success,
                message:data.message,
                data
            })
        }
    } catch (error) {
        console.error("Error fetching relatives leaderboard:", error);
        res.status(500).json( {
            success: false,
            message: "Error fetching relatives leaderboard",
        })
    }
}
exports.overall_ranking = async (req, res) => {
    try {
        const data = await overall_ranking(req,res);
        if(data.success){
            res.status(200).json( {
                success: data.success,
                message:data.message,
                ranking:data.ranking
            })
        }
        else{
            res.status(500).json( {
                success: data.success,
                message:data.message,
            })
        }
    } catch (error) {
        console.error("Error fetching Overall User Ranking:", error);
        res.status(500).json( {
            success: false,
            message: "Error fetching Overall User Ranking",
        })
    }
}