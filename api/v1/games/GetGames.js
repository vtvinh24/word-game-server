const Game = require("#models/Game.js");

const getGames = async (req, res) => {
  try {
    const games = await Game.find();
    return res.status(200).json({ games });
  } catch (e) {
    return res.status(500).send();
  }
};

const getGame = async (req, res) => {
  try {
    const { id } = req.params;
    const game = await Game.findById(id);
    if (!game) {
      return res.status(404).send();
    }
    return res.status(200).json({ game });
  } catch (e) {
    return res.status(500).send();
  }
};

module.exports = { getGames, getGame };
