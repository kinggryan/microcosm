#pragma strict

/***

	Utopia Dome
	Expansion - Luxury
	Req : 			MGW
	Workers : 		3
	Point Value:	10
	
	***/
	
class UtopiaDome extends Expansion {
	function Start() {
		workers = 3;
		pointValue = 10;
		
		structureName = "Utopia Dome";
		
		helpText = "Workers: "+workers+"\n";
		
		super.Start();
	}
}