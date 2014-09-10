#pragma strict

// Forest Terrain Subclass

class TerrainForest extends GameTerrain {
	// Properties
	
	// Methods
	function Initialize() {
		name = "Forest";
		color = Color.green;
		unwalkable = false;
		
		super();
	}
}