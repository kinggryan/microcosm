/***

	Exploration Base
	-Starting Pop: 5
	-Max pop: 5
	
	***/
	
class ExplorationBase extends Colony {
	// Methods
	function Start() {
		population = 5;
		maximumPopulation = 5;
		structureName = "ExplorationBase";
		
		RefreshHelpText();
		
		super.Start();
	}
	
	function RefreshHelpText() {
		helpText = String.Format("Pop: {0}\nMax: {1}",population,maximumPopulation);
	}
}