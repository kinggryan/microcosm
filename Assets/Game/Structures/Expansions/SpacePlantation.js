#pragma strict

/***

	Space Plantation
	Expansion - Farm
	Req : 			WW
	Workers : 		3
	Point Value:	3
	Each turn, +1 food
	
	***/
	
class SpacePlantation extends Expansion {
	function Start() {
		workers = 3;
		pointValue = 3;
		
		structureName = "Space Plantation";
		
		helpText = "Workers: "+workers+"\n+2 food";
		
		super.Start();
	}

	// Methods
	function GenerateResources() {
		structureNetwork.food += 2;
		
		super.GenerateResources();
	}
}