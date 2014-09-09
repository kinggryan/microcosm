#pragma strict

/***

	Basic Farm
	Expansion - Farm
	Req : 			W
	Workers : 		1
	Point Value:	1
	Each turn, +1 food
	
	***/
	
class BasicFarm extends Expansion {
	function Start() {
		workers = 1;
		pointValue = 1;
		
		structureName = "Basic Farm";
		
		helpText = "Workers: "+workers+"\n+1 food";
		
		super.Start();
	}

	// Methods
	function GenerateResources() {
		structureNetwork.food += 1;
		structureNetwork.workers -= workers;
		
		super.GenerateResources();
	}
}