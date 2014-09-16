class WondrousJewelTerrain extends GameTerrain {
	function GiveResourcesToVillage(village: Village) {
		// exit this if it isn't this tile's controller's turn
		if(isMine != TurnController.myTurn)
			return;
			
		var faithSign = 1;
		
		if(!isMine)
			faithSign = -1;
	
		// for each resource needed by the village
		for(var currentResource in village.resourcesNeeded) {
			// check each resource and give
			if(currentResource == "wood" && wood > 0) {
				wood--;
				village.progressRemaining--;
				village.AdjustFaith(faithSign*1);
			}
			if(currentResource == "metal" && metal > 0) {
				metal--;
				village.progressRemaining--;
				village.AdjustFaith(faithSign*1);
			}
			if(currentResource == "clay" && clay > 0) {
				clay--;
				village.progressRemaining--;
				village.AdjustFaith(faithSign*1);
			}
			if(currentResource == "grain" && grain > 0) {
				grain--;
				village.progressRemaining--;
				village.AdjustFaith(faithSign*1);
			}
			if(currentResource == "jewels" && jewels > 0) {
				jewels--;
				village.progressRemaining--;
				village.AdjustFaith(faithSign*2);
			}
		}
	}
}