const games = require("../data/games")
excludedGames = games.filter(g => g.frequency === 'interval-slot').map(g => g.name)
module.exports = [...excludedGames, 'Super Faridabad'];