/***

	Basic Colony
	-Starting Pop: 2
	-Max pop: 7
	- +1 population/food
	
	***/
	
class BasicColony extends Colony {
	// Methods
	function Start() {
		population = 2;
		maximumPopulation = 7;
		popPerFoodRate = 1;
		structureName = "Basic Colony";
		
		RefreshHelpText();
		
		super.Start();
	}
	
	function RefreshHelpText() {
		helpText = String.Format("Pop: {0}\nMax: {1}\n+1 pop/food",population,maximumPopulation);
	}
}