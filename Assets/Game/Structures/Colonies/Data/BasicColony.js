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
		structureName = "Colony";
		
		helpText = "Pop: "+population+"\nMax: "+maximumPopulation+"\n+1 pop/food";
		
		super.Start();
	}
	
	function GenerateResources() {
		structureNetwork.workers += population;
		
		super.GenerateResources();
	}
}