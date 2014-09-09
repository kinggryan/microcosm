#pragma strict

/***

	Distractitorium
	Expansion - Luxury
	Req : 			G
	Workers : 		3
	Point Value:	4
	Adjacent enemy structures use 1 more worker.
	
	***/
	
class Distractitorium extends Expansion {
	function Start() {
		workers = 3;
		pointValue = 4;
		
		structureName = "Distractitorium";
		
		helpText = "Workers: "+workers+"\nWhen built, adjacent enemy structures use 1 more worker.";
		
		// Enemy structures use 1 more worker
		for(var connectedTile in tile.adjacentTiles) {
			if (connectedTile.structure.owner != owner) {
				var expansion = connectedTile.structure as Expansion;
				if(expansion != null)
					expansion.workers += 1;
			}
		}
		
		super.Start();
	}
}