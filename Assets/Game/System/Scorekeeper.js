#pragma strict

class Scorekeeper extends MonoBehaviour {
	// Properties
	private static var myScore: int = 0;		
	private static var opponentScore: int = 0;
	private static var scoringVillageList: ArrayList = null;	// tracks all objects that add score
	
	// Methods
	static function AddVillage(village: Object) {
		// add to list based on whose turn it is
		if (scoringVillageList == null)
			scoringVillageList = new ArrayList();
			
		scoringVillageList.Add(village);
	}
	
	static function GiveScore(score: int) {
		if(score > 0)
			myScore += score;
		else
			opponentScore -= score;
	}
	
	function OnGUI() {
		// draw scores
		var scorePosition = Rect(15,15,120,45);
		var opponentScorePosition = Rect(15,28,120,70);
		
		GUI.Label(scorePosition,"My Score: " + myScore.ToString());
		GUI.Label(opponentScorePosition,"Opponent Score: " + opponentScore.ToString());
	}
}