#pragma strict

/****

	Advanced Mountains
	
	*****/
	
class ImpassableCliffs extends Mountain {
	function Initialize() {
		unwalkable = true;
		
		super.Initialize();
		
		// set color
		color = advancedMountainColor;
	}
}	