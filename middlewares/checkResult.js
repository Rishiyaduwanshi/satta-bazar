const resultSchema = require("../models/resultSchema");
const intervalSlotGames = require("../data/games").filter(g=>g.frequency === 'interval-slot').map(g=>g.name)

async function checkResult(req, res, next) {
    try {
        const { game, date, time } = req.body;
        const dateObject = new Date(`${date}T${time}:00`); 
        
        if (intervalSlotGames.includes(game)) {
            const existingResult = await resultSchema.findOne({
                game: game,
                date: dateObject 
            },{_id : 1});
            if (existingResult) {
                req.flash("error", `Result for ${game} already exists on ${date} and ${time}.`);
                return res.redirect('/submitresult');
            }
        } else {
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0); 
            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);

            const existingResult = await resultSchema.findOne({
                game: game, 
                date: { $gte: startOfDay, $lte: endOfDay }
            });

            if (existingResult) {
                req.flash("error", `Result for ${game} already exists on ${date}`);
                return res.redirect('/submitresult');
            }
        }

        next();
        
    } catch (error) {
        console.error("Error checking result:", error);
        req.flash("error", "An error occurred while checking results.");
        return res.redirect("/submitResult");
    }
}

module.exports = checkResult;
