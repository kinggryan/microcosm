#pragma strict

class Scorekeeper extends Photon.MonoBehaviour {
	// Properties
	private static var playerOneScore: int = 0;
	private static var playerTwoScore: int = 0;
	private static var victoryScore: int = 45;	// todo adjust this number
	private static var victoryText: String = "";
	
	function OnGUI() {
		var scorePosition = Rect(15,15,80,45);
		var score2Position = Rect(15,28,80,45);
		
		GUI.Label(scorePosition,"P1 Score: " + playerOneScore.ToString());
		GUI.Label(score2Position,"P2 Score: " + playerTwoScore.ToString());
		
		// display victory text. Blank if game is still on
		var victoryTextPosition = Rect(15,50,80,45);
		GUI.Label(victoryTextPosition,victoryText);
	}
	
	static function AddScoreForPlayer(score : int,player : PhotonPlayer) {
		if(player == TurnController.playerOne)
			playerOneScore += score;
		else
			playerTwoScore += score;
			
		// see if a player won
		if (playerOneScore >= victoryScore) {
			Debug.Log("PLAYER ONE WINS!");
			victoryText = "PLAYER ONE WINS!";
		}
		else if (playerTwoScore >= victoryScore) {
			Debug.Log("PLAYER TWO WINS!");
			victoryText = "PLAYER TWO WINS!";
		}
	}
}