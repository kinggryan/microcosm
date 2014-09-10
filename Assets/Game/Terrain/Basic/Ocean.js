#pragma strict

// Ocean Terrain Subclass

class TerrainOcean extends GameTerrain {
	// Properties
	
	// Methods
	function TerrainOcean() {
		name = "Ocean";
		color = Color.blue;
		unwalkable = true;
		
		super();
	}
}