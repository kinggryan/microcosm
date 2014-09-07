/****

		Structure Network class
		
		****/
		
class StructureNetwork extends Object {
	// Properties
	var head : Structure;
	var water: int = 0;
	var metal: int = 0;
	var gas: int = 0;
	var food: int = 0;
	
	var workers: int = 0;
	
	// Static properties
	static var playerOneStructureNetworks: ArrayList = null;
	
//	var player: PhotonPlayer;

	// Methods
	function StructureNetwork() {
		Debug.Log("New structure network");
	
		if (playerOneStructureNetworks == null)
			playerOneStructureNetworks = new ArrayList();
			
		playerOneStructureNetworks.Add(this);
	}
	
	function Combine(otherNetwork : StructureNetwork, structureToChildTo: Structure) {
		// starting with the head, recursively add to network
		AddStructureToNetwork(otherNetwork.head);
	
		// have the structure that triggered this call point to the old network head
		structureToChildTo.AddChild(otherNetwork.head);
		
		// Add the other network's resources to this network
		water += otherNetwork.water;
		metal += otherNetwork.metal;
		gas += otherNetwork.gas;
		food += otherNetwork.food;
	}
	
	// recursively adds structures to the network
	function AddStructureToNetwork(structure: Structure) {
		structure.structureNetwork = this;
		
		for(var child in structure.childStructures) {
			if(child != null)
				AddStructureToNetwork(child);
		}
	}
	
	function RefreshResources() : boolean {	// returns false if there was no head
		// set all resources to 0
		water = 0;
		metal = 0;
		gas = 0;
		food = 0;
		
		// send message to head to generate resources
		if (head != null) {
			head.GenerateResources();
			
			return true;
		}
		else {
			return false;
		}
	}
	
	static function RefreshResourcesAndGrowColoniesForStructureNetworkList(list: ArrayList) {
		// iterate through networks
		for (var index = 0; index < list.Count ; ) {
			// refresh resources
			var currentNetwork = list[index] as StructureNetwork;
			if(!currentNetwork.RefreshResources())
				list.Remove(currentNetwork);
			else
				index++;
			
			// TODO generate food and increment population
		}
	}
	
	static function StartTurnForPlayer() {
		// TODO function with multiple players
		RefreshResourcesAndGrowColoniesForStructureNetworkList(playerOneStructureNetworks);
	}
}