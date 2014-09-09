/***

	Housing Dome
	-Starting Pop: 0
	-Max pop: 8
	- +2 pop/food
	
	***/
	
class HousingDome extends Colony {
	// Methods
	function Start() {
		population = 0;
		maximumPopulation = 8;
		popPerFoodRate = 2;
		structureName = "Housing Dome";
		
		RefreshHelpText();
		
		super.Start();
	}
	
	function RefreshHelpText() {
		helpText = String.Format("Pop: {0}\nMax: {1}\n+2 pop/food",population,maximumPopulation);
	}
}