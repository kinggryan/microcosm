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
	
	// Networking Properties
	static var opponent: PhotonPlayer;
	static var myTurn: boolean = false;
	
	// Methods
	function Start() {
		turnCount = 1;
		playerUsedGamePieceList = new ArrayList();
		
		// set opponent
		if (PhotonNetwork.connected) {
			opponent = PhotonNetwork.otherPlayers[0];
			photonView.viewID = 1;
		}
			
		// set starting player if this is master client
		if (PhotonNetwork.isMasterClient) {
			if (Random.Range(0,2) == 0)
				GoFirst();
			else
				photonView.RPC("GoFirst",PhotonTargets.Others);
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
	
	function OnGUI() {
		var passTurnButtonPosition = Rect(105,105,80,45);
		
		if (myTurn) {
			if(GUI.Button(passTurnButtonPosition,"Pass Turn")) {
				PassTurn();
				photonView.RPC("PassTurn",PhotonTargets.Others);
			}
		}
		else
			GUI.Label(passTurnButtonPosition,"Opponent Turn");
	}
	
	/*static function PassTurn() {
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
		
		// increment turn count
		turnCount++;
	} */
	
	@RPC
	function PassTurn() {
		Debug.Log("Turn");
	
		// execute end of turn effects
		for(var tile in GameObject.FindObjectsOfType(TileData))
			tile.terrain.EndTurn();
	
		// purge used pieces
		playerUsedGamePieceList.Clear();
		
		// reset cards played
		cardsPlayed = 0;
			
		// increment score
		Scorekeeper.IncreaseScore();	
		
		// increment turn count
		turnCount++;
		
		if(myTurn)
			myTurn = false;
		else {
			myTurn = true;
		
			var deck = GameObject.FindObjectOfType(Deck) as Deck;
			deck.DrawCard();	
		}
	}
	
	static function CardPlayed() {
		cardsPlayed++;
	}
	
	@RPC
	function GoFirst() {
		myTurn = true;
	}
}