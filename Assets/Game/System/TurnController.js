#pragma strict

/******

	Turn Controller class
	
	Governs passing turns
	
	*******/
	
class TurnController extends Photon.MonoBehaviour {
	// Properties
	static var playerUsedGamePieceList: ArrayList;	//	TODO add gamepiecelist for both players
	static var turnCount: int;
	static var cardsPlayed: int = 0;
	
	static var myTurn : boolean = false;
	static var playerOne: PhotonPlayer;
	
	// Methods
	function Start() {
		turnCount = 1;
		playerUsedGamePieceList = new ArrayList();
		
		photonView.viewID = 17;
				
		if (PhotonNetwork.isMasterClient) {
			var numPlayersInRoom = PhotonNetwork.countOfPlayersInRooms;
			var player = PhotonNetwork.playerList[Random.Range(0,numPlayersInRoom)];
		
			photonView.RPC("SetPlayerOne",PhotonTargets.All,player);
		}
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
	//	StructureNetwork.StartTurnForPlayer();
		
		// increment turn count
		turnCount++;
	}
	
	static function CardPlayed() {
		cardsPlayed++;
	}
	
	@RPC
	function SetPlayerOne(player: PhotonPlayer) {
		playerOne = player;
	
		if (PhotonNetwork.player == player) {
			cardsPlayed = 0;
			myTurn = true;
		}
	}
	
	function OnGUI() {
		var passTurnButtonPosition = Rect(105,105,80,45);
		
		// draw pass turn button if it's my turn
		if (myTurn) {
			if (GUI.Button(passTurnButtonPosition,"Pass Turn")) {
				// Deselect
			/*	if(selectedObject != null) {
					Debug.Log("Deselecting " + selectedObject);
					selectedObject.Deselect(true);
					selectedObject = null;
				}
			
				interactionMode = InteractionMode.None; */
		
				// pass turn
				photonView.RPC("PassTurnNetwork",PhotonTargets.Others);
				PassTurnNetwork();
			}
		}
		else 
			GUI.Label(passTurnButtonPosition,"Opponent Turn");
	}
	
	@RPC
	function PassTurnNetwork() {
		if (myTurn) {
			Debug.Log("Pass Turn");
	
			// execute end of turn effects
			for(var tile in GameObject.FindObjectsOfType(TileData))
			tile.terrain.EndTurn();
			
			// increment score
			Scorekeeper.IncreaseScore();	
		
			// increment turn count
			turnCount++;
			
			// it's now opponent turn
			myTurn = false;
		}
		else {
			Debug.Log("Pass Turn");
	
			// execute end of turn effects
			for(var tile in GameObject.FindObjectsOfType(TileData))
			tile.terrain.EndTurn();
	
			// purge used pieces
			playerUsedGamePieceList.Clear();
			
			// your turn
			myTurn = true;
		
			// reset cards played
			cardsPlayed = 0;
			
			// increment score
			Scorekeeper.IncreaseScore();	
		
			// start new turn
			if(playerOne == PhotonNetwork.player)
				StructureNetwork.StartTurnForPlayerOne();
			else 
				StructureNetwork.StartTurnForPlayerTwo();
		
			// increment turn count
			turnCount++;
		}
	}
}