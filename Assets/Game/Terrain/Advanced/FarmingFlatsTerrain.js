#pragma strict

/********

	Farming Flats
	
	Creation: +2 faith.
	Effect: +1 population.
	
	********/

class FarmingFlats extends GameTerrain {
	// Properties
	
	// Methods
	function FarmingFlats() {
		Initialize();
	}
	
	function Initialize() {
		name = "Farming Flats";
		color = Color(0.3,0.3,0,1);
		powerCost = 1;
		
		super.Initialize();
	}
	
	function EndTurn() {
		// +1 pop
		tile.village.AdjustPopulation(1);
	}
	
	function Creation() {
		// +2 faith
		tile.village.AdjustFaith(2);
	}
}