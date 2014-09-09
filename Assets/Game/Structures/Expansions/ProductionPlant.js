#pragma strict

/***

	Production Plant
	Expansion - Factory
	Req : 			M
	Workers : 		1
	Point Value:	5
	Double the resources produced by this tile
	
	***/
	
class ProductionPlant extends Expansion {
	function Start() {
		workers = 1;
		pointValue = 5;
		
		structureName = "Production Plant";
		
		helpText = "Workers: "+workers+"\nDouble resources of this tile.";
		
		super.Start();
	}

	// Methods
	function GenerateResources() {
		// generate bonus natural resource
		for (var resource in tile.resources) {
			if (resource != null)
				resource.GenerateResources(structureNetwork);
		}
		
		super.GenerateResources();
	}
}