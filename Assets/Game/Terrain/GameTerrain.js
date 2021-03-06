﻿#pragma strict

/*************

	Game Terrain Class
	
	**************/
	
class GameTerrain {
	// Properties
	
	var name: String = "";
	// Todo add controller:NetworkPlayer propety
	var color:Color = Color.white;	//	Todo change to a texture, rather than color
	var unwalkable: boolean = false;
	var tile: TileData = null;
	
	// Methods
	
	function Initialize() { }
	
	// Creation method called when this terrain is created
	function Creation() { }
	
	function EndTurn() { }
	
	function FollowerStopped() { }
	
	function SetGraphics(renderer: Renderer) {
		renderer.material.color = color;
	}
}