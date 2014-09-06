#pragma strict

/********

	Coral Reef Terrain
	
	Each turn, gives +1 faith to adjacent villages
	
	********/

class CoralReefTerrain extends GameTerrain {
	// Properties
	
	// Methods
	function CoralReefTerrain() {
		Initialize();
	}
	
	function Initialize() {
		name = "CoralReef";
		color = Color(0,0.5,1,1);
		unwalkable = true;
		
		super.Initialize();
	}
	
	function EndTurn() {
		// +1 faith in adjacent villages
		for (adjacentTile in tile.adjacentTiles) {
			if(adjacentTile.village != null)
				adjacentTile.village.AdjustFaith(1);
		}
	}
}