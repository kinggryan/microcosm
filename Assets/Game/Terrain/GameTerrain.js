#pragma strict

/*************

	Game Terrain Class
	
	**************/
	
class GameTerrain {
	// Properties
	
	var name: String = "";
	var isMine: boolean = false;
	var color:Color = Color.white;	//	Todo change to a texture, rather than color
	var unwalkable: boolean = false;
	var tile: TileData = null;
	var helpText: String = "Words! some complex words. How about that? Do this!";
	var powerCost: int = 0;
	
	// resources
	var wood: int = 0;
	var metal: int = 0;
	var grain: int = 0;
	var clay: int = 0;
	var jewels: int = 0;
	
	// Methods
	
	function GameTerrain() {
		if(TurnController.myTurn)
			isMine = true;
		else
			isMine = false;
	}
	
	function Initialize() { }
	
	// Creation method called when this terrain is created
	function Creation() {

	}
	
	function EndTurn() { }
	
	function FollowerStopped() { }
	
	function SetGraphics(renderer: Renderer) {
		renderer.material.color = color;
	}
	
	function GiveResourcesToAdjacentVillages() {
		// do village on this tile
		if(tile.village != null)
			GiveResourcesToVillage(tile.village);
		
		// do adjacent villages
		for(var adjacentTile in tile.adjacentTiles) {
			if(adjacentTile.village != null)
				GiveResourcesToVillage(adjacentTile.village);
		}
	}
	
	function GiveResourcesToVillage(village: Village) {
		// for each resource needed by the village
		for(var currentResource in village.resourcesNeeded) {
			// check each resource and give
			if(currentResource == "wood" && wood > 0) {
				wood--;
				village.progressRemaining--;
				village.AdjustFaith(1);
			}
			if(currentResource == "metal" && metal > 0) {
				metal--;
				village.progressRemaining--;
				village.AdjustFaith(1);
			}
			if(currentResource == "clay" && clay > 0) {
				clay--;
				village.progressRemaining--;
				village.AdjustFaith(1);
			}
			if(currentResource == "grain" && grain > 0) {
				grain--;
				village.progressRemaining--;
				village.AdjustFaith(1);
			}
			if(currentResource == "jewels" && jewels > 0) {
				jewels--;
				village.progressRemaining--;
				village.AdjustFaith(1);
			}
		}
	}
}