#pragma strict

// Forest Terrain Subclass

class TerrainWasteland extends GameTerrain {
	// Properties
	
	// Methods
	function Initialize() {
		name = "Wasteland";
		color = Color(0.5,0.3,0);
		unwalkable = false;
	}
}