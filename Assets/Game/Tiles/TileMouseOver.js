#pragma strict

// Highlights the tile

var savedColor = Color.white;

function OnMouseEnter() {
	var lineRenderer = GetComponent(LineRenderer);

	lineRenderer.SetColors(Color.blue, Color.blue);
	lineRenderer.SetWidth(0.3,0.3);
	
	savedColor = renderer.material.color;
	renderer.material.color = Color.white;
	
/*	var data = GetComponent(TileData) as TileData;
	
	for (var tile in data.adjacentTiles) {
		if(tile != null) 
			tile.renderer.material.color = Color.white;
	}  */
}

function OnMouseExit() {
	var lineRenderer = GetComponent(LineRenderer);
	var tileData = GetComponent(TileData);
	
	lineRenderer.SetColors(Color.gray, Color.gray);
	lineRenderer.SetWidth(0.1,0.1);
	
	renderer.material.color = tileData.terrain.color;
	
/*	var data = GetComponent(TileData) as TileData;
	
	for (var tile in data.adjacentTiles) {
		if(tile != null) 
			tile.renderer.material.color = savedColor;
	}  */
}