#pragma strict

// Highlights the tile

var savedColor = Color.white;

function OnMouseEnter() {
	var lineRenderer = GetComponent(LineRenderer);

	lineRenderer.SetColors(Color.yellow, Color.yellow);
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
	
	lineRenderer.SetColors(tileData.lineColor, tileData.lineColor);
	lineRenderer.SetWidth(tileData.lineWidth,tileData.lineWidth);
	
	renderer.material.color = tileData.terrain.color;
	
/*	var data = GetComponent(TileData) as TileData;
	
	for (var tile in data.adjacentTiles) {
		if(tile != null) 
			tile.renderer.material.color = savedColor;
	}  */
}