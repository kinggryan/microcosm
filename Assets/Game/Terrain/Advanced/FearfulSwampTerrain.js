#pragma strict

/********

	Fearful Swamp
	
	Creation: -1 happiness and +1 faith
	
	********/

class FearfulSwamp extends GameTerrain {
	// Properties
	
	// Methods
	function FearfulSwamp() {
		Initialize();
	}
	
	function Initialize() {
		name = "Swamp";
		color = Color(0.2,0.2,0.1,1);
		powerCost = 1;
		
		super.Initialize();
	}
	
	function Creation() {
		// -1 happiness, +1 faith
		tile.village.AdjustHappiness(-1);
		tile.village.AdjustFaith(1);
	}
}