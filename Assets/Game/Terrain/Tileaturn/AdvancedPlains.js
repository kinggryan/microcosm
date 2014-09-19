#pragma strict

/****

	All of the advanced Plains classes go here
	
	****/


	
class SprawlingGrasslands extends Plains {
	function Initialize() {
		super.Initialize();
		
		// set color
		color = advancedPlainsColor;
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
			village.AdjustFaith(4);
		else
			village.AdjustFaith(-4);
	}
}

class GreatPrairie extends Plains {
	function Initialize() {
		super.Initialize();
		
		// set color
		color = advancedPlainsColor;
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
	
		var numberOfAdjacentPlains = 1;	/// count self as adjacent
		
		for(var currentTile in tile.adjacentTiles) {
			if(currentTile.terrain.name == "Plains")
				numberOfAdjacentPlains++;
		}
	
		if(TurnController.myTurn)
			village.AdjustFaith(2*numberOfAdjacentPlains);
		else
			village.AdjustFaith(-2*numberOfAdjacentPlains);
	}
}

class FarmingSteppe extends Plains {
	function Initialize() {
		super.Initialize();
		
		// set color
		color = advancedPlainsColor;
	
		// make self harvestable by villages up to two tiles away
		for(var tileOneAway in tile.adjacentTiles) {
			for(var tileTwoAway in tile.adjacentTiles) {
				if(tileTwoAway.village != null)
					tileTwoAway.village.AddTileToHarvestTiles(tile);
			}
		}
	}
}

class SlowgrowthFields extends Plains {
	function Initialize() {
		super.Initialize();
		
		color = advancedPlainsColor;
		barrenTurnsRemaining = 2;
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
			village.AdjustFaith(6);
		else
			village.AdjustFaith(-6);
	}
}