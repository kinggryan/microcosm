#pragma strict

// Forest Terrain Subclass

class TerrainForest extends GameTerrain {
	// Properties
	
	// Methods
	function Initialize() {
		name = "Forest";
		color = Color(1,1,0.8);
		unwalkable = false;
		
		super();
	}
}