#pragma strict

/***

	ViewingPlatform
	Expansion - Lab
	Req : 			GM
	Workers : 		3
	Point Value:	2
	Each turn, +1 point for each unused adjacent tile.
	
	***/
	
class ViewingPlatform extends Expansion {
	function Start() {
		workers = 3;
		pointValue = 2;
		
		structureName = "Viewing Platform";
		
		helpText = "Workers: "+workers+"\nEach turn, +1 point for each unused adjacent tile.";
		
		super.Start();
	}
	
	function StartTurn() {
		// +1 point for each unused adjacent tile
		for(var connectedTile in tile.adjacentTiles) {
			if (connectedTile.structure == null)
				Scorekeeper.AddScoreForPlayer(1,owner);
		}
		
		super.StartTurn();
	}
}