#pragma strict

/******

	Turn Controller class
	
	Governs passing turns
	
	*******/
	
class TurnController extends MonoBehaviour {
	// Properties
	static var playerUsedGamePieceList: ArrayList;	//	TODO add gamepiecelist for both players
	static var turnCount: int;
	static var cardsPlayed: int = 0;
	
	// Methods
	function Start() {
		turnCount = 1;
		playerUsedGamePieceList = new ArrayList();
	}
	
	// use a given piece
	static function UsePiece(piece: Object) {
		playerUsedGamePieceList.Add(piece);
	}
	
	// check if piece is used
	static function PieceUsed(piece: Object) : boolean {
		return playerUsedGamePieceList.Contains(piece);
	}
	
	static function PassTurn() {
		Debug.Log("Pass Turn");
	
		// execute end of turn effects
		for(var tile in GameObject.FindObjectsOfType(TileData))
			tile.terrain.EndTurn();
	
		// purge used pieces
		playerUsedGamePieceList.Clear();
		
		// reset cards played
		cardsPlayed = 0;
			
		// increment score
		Scorekeeper.IncreaseScore();	
		
		// start new turn
		StructureNetwork.StartTurnForPlayer();
		
		// increment turn count
		turnCount++;
	}
	
	static function CardPlayed() {
		cardsPlayed++;
	}
}