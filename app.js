const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const databasePath = path.join(__dirname, "cricketMatchDetails.db");
const app = express();
app.use(express.json());
let database = null;
const initializeDbServer = async () => {
  try {
    database = await open({ filename: databasePath, driver: sqlite3.database });
    app.listen(3000, () =>
      console.log("server running at http://localhost:3000/")
    );
  } catch (error) {
    console.log(`DB Error:${error.message}`);
    process.exit(1);
  }
};
initializeDbServer();
const convertPlayerObjectToResponseObject = (dbObject) => {
  return {
    playerId: dbObject.player_id,
    playerName: dbObject.player_name,
  };
};
const convertMatchObjectToResponseObject = (dbObject) => {
  return {
    matchId: dbObject.match_id,
    match: dbObject.match,
    year: dbObject.year,
  };
};
const convertPlayerMatchToResponseObject = (dbObject) => {
  return {
    playerMatchId: dbObject.player_match_id,
    playerId: dbObject.player_id,
    matchId: dbObject.match_id,
    score: dbObject.score,
    fours: dbObject.fours,
    sixes: dbObject.sixes,
  };
};
app.get("/players/", async (request, response) => {
  const getPlayers = `
    SELECT 
    * FROM player;
    `;
  const getPlayersArray = await database.run(getPlayers);
  response.send(
    getPlayersArray.map((eachPlayer) => ({
      playerId: eachPlayer.player_id,
      playerName: eachPlayer.player_name,
    }))
  );
});
app.get("/players/:playerId", async (request, response) => {
  const { playerId } = request.params;
  const getPlayer = `
    SELECT 
    * FROM player
    * WHERE player_id='${playerId}';
    `;
  const getPlayerName = await database.get(getPlayer);
  response.send(convertPlayerObjectToResponseObject(getPlayerName));
});
app.put("/players/:playerId", async (request, response) => {
  const { playerName } = request.body;
  const { playerId } = request.params;
  const updatePlayer = `
  UPDATE FROM player_details 
  SET player_name='${playerId}'
  WHERE player_id='${playerId}';`;
  await database.run(updatePlayer);
  response.send("Player Details Up");
});
module.exports = app;
