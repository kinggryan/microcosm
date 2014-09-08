/***

	Basic Colony
	-Starting Pop: 2
	-Max pop: 10
	- +1 population/food
	
	***/
	
class BasicColony extends Colony {
	// Methods
	function Start() {
		population = 2;
		maximumPopulation = 10;
		popPerFoodRate = 1;
		structureName = "Colony";
		
		RefreshHelpText();
		
		super.Start();
	}
	
	function GenerateResources() {
		structureNetwork.workers += population;
		
		super.GenerateResources();
	}
	
	function RefreshHelpText() {
		helpText = String.Format("Pop: {0}\nMax: {1}\n+1 pop/food",population,maximumPopulation);
	}
}