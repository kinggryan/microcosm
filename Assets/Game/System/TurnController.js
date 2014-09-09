#pragma strict

/******

	Turn Controller class
	
	Governs passing turns
	
	*******/
	
class TurnController extends Photon.MonoBehaviour {
	// Properties
	static var playerUsedGamePieceList: ArrayList;	//	TODO add gamepiecelist for both players
	static var turnCount: int;
	static var coloniesPlayed: int = 0;
	static var expansionsPlayed: int = 0;
	
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
	
	static function ColonyPlayed() {
		coloniesPlayed++;
	}
	
	static function ExpansionPlayed() {
		expansionsPlayed++;
	}
	
	@RPC
	function SetPlayerOne(player: PhotonPlayer) {
		playerOne = player;
	
		if (PhotonNetwork.player == player) {
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
		if (myTurn) {	// Pass turn to opponent
			Debug.Log("Pass Turn");
	
			// execute end of turn effects
			for(var tile in GameObject.FindObjectsOfType(TileData))
			tile.terrain.EndTurn();
		
			// start new turn for opponent
			if(playerOne != PhotonNetwork.player)
				StructureNetwork.StartTurnForPlayerOne();
			else 
				StructureNetwork.StartTurnForPlayerTwo();
		
			// increment turn count
			turnCount++;
			
			// it's now opponent turn
			myTurn = false;
		}
		else {	// Pass turn to this player
			Debug.Log("Pass Turn");
	
			// execute end of turn effects
			for(var tile in GameObject.FindObjectsOfType(TileData))
			tile.terrain.EndTurn();
	
			// purge used pieces
			playerUsedGamePieceList.Clear();
			
			// Draw card
			var deck = GameObject.FindObjectOfType(Deck) as Deck;
			deck.DrawCard();
			
			// your turn
			myTurn = true;
		
			// reset cards played
			coloniesPlayed = 0;
			expansionsPlayed = 0;	
		
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