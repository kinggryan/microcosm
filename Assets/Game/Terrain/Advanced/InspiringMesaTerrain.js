#pragma strict

/********

	Inspiring Mesa
	
	Creation: +1 happiness and faith
	
	********/

class InspiringMesaTerrain extends GameTerrain {
	// Properties
	
	// Methods
	function InspiringMesaTerrain() {
		Initialize();
	}
	
	function Initialize() {
		name = "Mesa";
		color = Color(0.6,0.15,0.1,1);
		powerCost = 1;
		
		super.Initialize();
	}
	
	function Creation() {
		// +3 might
		tile.village.AdjustHappiness(1);
		tile.village.AdjustFaith(1);
	}
}