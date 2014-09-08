/****

	Feeding Queue class
	
	This class is used by the structure network to distribute food. Colonies are organized in it based on their rate of pop/food.
	The queue can distribute food to classes in a way that generates the most population
	
	****/
	
class FeedingQueue {
	// Properties
	public var queue : ArrayList;
	
	// Methods
	function FeedingQueue() {
		queue = new ArrayList();
	}
	
	function AddColony(colony: Colony) {
		// find proper index
		var index:int;
		for(index = 0 ; index < queue.Count ; index++) {
			var colonyAtIndex = queue[index] as Colony;
		
			if(colony.popPerFoodRate >= colonyAtIndex.popPerFoodRate)
				break;
		}
		
		// insert the element
		queue.Insert(index,colony);
	}
	
	function RemoveColony(colony: Colony) {
		queue.Remove(colony);
	}
	
	function GiveFoodToColonies(food: int) {
		var remainingFood = food;
	
		while(remainingFood > 0 && queue.Count > 0) {
			// give one food to first colony
			var colonyToFeed = queue[0] as Colony;
			
			remainingFood = colonyToFeed.FeedAndReturnRemainder(remainingFood);
			
			// if there was food left over, remove this colony from the queue
			if (remainingFood > 0)
				RemoveColony(colonyToFeed);
		}
	}
	
	function Combine(otherQ: FeedingQueue) {
		// go through other queue and take all of their elements
		for(var colony in otherQ.queue) {
			queue.AddColony(colony as Colony);
		}
		
		// clear out the other q. Shouldn't be relevant
		otherQ.queue.Clear();
	}
}

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
	
	var feedingQ: FeedingQueue;
	
	// Static properties
	static var playerOneStructureNetworks: ArrayList = null;
	static var playerTwoStructureNetworks: ArrayList = null;
	
//	var player: PhotonPlayer;

	// Methods
	function StructureNetwork() {
		Debug.Log("New structure network");
	
		if (playerOneStructureNetworks == null) {
			playerOneStructureNetworks = new ArrayList();
			playerTwoStructureNetworks = new ArrayList();
		}
		
		// initialize feeding queue
		feedingQ = new FeedingQueue();
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
		
		// combine feeding queues
		feedingQ.Combine(otherNetwork.feedingQ);
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
			
			// Feed colonies
			currentNetwork.feedingQ.GiveFoodToColonies(currentNetwork.food);
		}
	}
	
	static function StartTurnForPlayerOne() {
		RefreshResourcesAndGrowColoniesForStructureNetworkList(playerOneStructureNetworks);
	}
	
	static function StartTurnForPlayerTwo() {
			RefreshResourcesAndGrowColoniesForStructureNetworkList(playerTwoStructureNetworks);
	}
}