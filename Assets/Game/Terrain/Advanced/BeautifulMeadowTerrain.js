#pragma strict

/********

	Beautiful Meadow
	
	Effect: +1 faith
	
	********/

class BeautifulMeadowTerrain extends GameTerrain {
	// Properties
	
	// Methods
	function BeautifulMeadowTerrain() {
		Initialize();
	}
	
	function Initialize() {
		name = "Meadow";
		color = Color(0,1,0.8,1);
		powerCost = 1;
		
		super.Initialize();
	}
	
	function EndTurn() {
		// +1 faith in this village
		tile.village.AdjustFaith(1);
	}
}