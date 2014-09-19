#pragma strict

/*****
	
	All advanced river tiles
	
	*****/

class CalmingLake extends River {
	function Initialize() {
		super.Initialize();
		
		// set color
		color = advancedRiverColor;
	}


	function GiveResourcesToVillage(village: Village) {
		// exit this if it isn't this tile's controller's turn
		if(isMine != TurnController.myTurn)
			return;
	
		// if we're barren, reduce the number of turns left we have to be barren
		if(barrenTurnsRemaining > 0) {
			barrenTurnsRemaining--;
			return;
		}
	
		if(TurnController.myTurn)
			village.AdjustFaith(3);
		else
			village.AdjustFaith(-3);
	}
}