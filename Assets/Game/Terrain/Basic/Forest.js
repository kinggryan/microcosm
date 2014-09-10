#pragma strict

// Forest Terrain Subclass

class TerrainForest extends GameTerrain {
	// Properties
	
	// Methods
	function TerrainForest() {
		name = "Forest";
		color = Color.green;
		unwalkable = false;
		
		super();
	}
}