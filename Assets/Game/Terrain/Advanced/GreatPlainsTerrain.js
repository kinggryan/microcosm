#pragma strict

/********

	Great Plains
	
	Creation: +3 strength.
	Effect: +1 happiness.
	
	********/

class GreatPlainsTerrain extends GameTerrain {
	// Properties
	
	// Methods
	function GreatPlainsTerrain() {
		Initialize();
	}
	
	function Initialize() {
		name = "Plains";
		color = Color(0.3,0.1,0,1);
		powerCost = 1;
		
		super.Initialize();
	}
	
	function EndTurn() {
		// +1 happiness in this village
		tile.village.AdjustHappiness(1);
	}
	
	function Creation() {
		// +3 might
		tile.village.AdjustMight(3);
	}
}