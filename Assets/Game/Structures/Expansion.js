/****

	Expansion Class
	
	****/
	
class Expansion extends Structure {
	// Properties
	
	// Methods
	function GenerateResources() {
		structureNetwork.workers -= workers;
		
		super.GenerateResources();
	}
}