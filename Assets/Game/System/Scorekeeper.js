#pragma strict

class Scorekeeper extends MonoBehaviour {
	// Properties
	private static var score: int = 0;		// todo multiple players
	private static var scoringVillageList: ArrayList = null;	// tracks all objects that add score
	
	// Methods
	static function AddVillage(village: Object) {
		if (scoringVillageList == null)
			scoringVillageList = new ArrayList();
			
		scoringVillageList.Add(village);
	}
	
	static function IncreaseScore() {
		// iterate through villages and add faith to score
		for(villageObject in scoringVillageList) {
			var village = villageObject as Village;
			
			score += village.faith;
		}
	}
	
	function OnGUI() {
		var scorePosition = Rect(15,15,80,45);
		
		GUI.Label(scorePosition,"Score: " + score.ToString());
	}
}