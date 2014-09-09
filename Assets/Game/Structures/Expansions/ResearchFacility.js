#pragma strict

/***

	Research Facility
	Expansion - Lab
	Req : 			M
	Workers : 		2
	Point Value:	6
	
	***/
	
class ResearchFacility extends Expansion {
	function Start() {
		workers = 1;
		pointValue = 7;
		
		structureName = "Research Facility";
		
		helpText = "Workers: "+workers+"\n";
		
		super.Start();
	}
}