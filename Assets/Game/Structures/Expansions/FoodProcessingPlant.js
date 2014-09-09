#pragma strict

/***

	Food Processing Plant
	Expansion - Factory
	Req : 			MW
	Workers : 		2
	Point Value:	6
	Each farm produces double food
	
	***/
	
class FoodProcessingPlant extends Expansion {
	function Start() {
		workers = 2;
		pointValue = 2;
		
		structureName = "Food Processing Plant";
		
		helpText = "Workers: "+workers+"\nEach farm produces x2 food";
		
		super.Start();
	}
	
	function StartTurn() {
		// double the food
		structureNetwork.food *= 2;
		
		super.StartTurn();
	}
}