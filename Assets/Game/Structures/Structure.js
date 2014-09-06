/****

	Structure Class
	
	*****/
	
class Structure extends MonoBehaviour {
	// Properties
	var tile: TileData = null;
	// Controller
	var structureNetwork: StructureNetwork = null;
	var childStructures: Structure[] = [null,null,null,null];
	
	// Methods
	function GenerateResources() {
		// generate resources for children
		for (var child in childStructures) {
			if (child != null)
				child.GenerateResources();
		}
	}	// called by child classes, which also actually generate the resources
}