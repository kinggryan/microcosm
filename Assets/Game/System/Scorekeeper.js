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
	
	static function IncreaseScore() {
		// iterate through villages and add population to score
		for(villageObject in scoringVillageList) {
			var village = villageObject as Village;
			
			if (village.faith > 0 && TurnController.myTurn)
				myScore += village.population;
			if (village.faith < 0 && !TurnController.myTurn)
				opponentScore += village.population;
		}
	}
	
	function OnGUI() {
		// draw scores
		var scorePosition = Rect(15,15,80,45);
		var opponentScorePosition = Rect(15,28,80,45);
		
		GUI.Label(scorePosition,"My Score: " + myScore.ToString());
		GUI.Label(opponentScorePosition,"Opponent Score: " + opponentScore.ToString());
	}
}