#pragma strict

/*****

	Resource Cost struct
	
	Stores the cost of structures
	
	*****/
	
class ResourceCost {
	// Properties
	var water: int = 0;
	var gas: int = 0;
	var metal: int = 0;
	var food: int = 0;
	var workers: int = 0;
	
	// Methods
	
	// returns true if the given resources are all contained within this resource
	function ContainsNaturalResourcesAndWorkers(resources: ResourceCost) : boolean {
		if( resources.water > water ||
			resources.metal > metal ||
			resources.gas 	> gas 	||
			resources.workers > workers)
			return false;
		else
			return true;
	}
	
	function ConsumeResourcesFromNetworkAndReturnRemainder(structureNetwork: StructureNetwork) : ResourceCost {
		// store remainder
		var remainder = new ResourceCost();
		
		// if we get negative values, set those values instead to 0 and add the negative value to the remainder
		structureNetwork.water -= water;
		if (structureNetwork.water < 0) {
			remainder.water = -structureNetwork.water;
			structureNetwork.water = 0;
		}
		structureNetwork.metal -= metal;
		if (structureNetwork.metal < 0) {
			remainder.metal = -structureNetwork.metal;
			structureNetwork.metal = 0;
		}
		structureNetwork.gas -= gas;
		if (structureNetwork.gas < 0) {
			remainder.gas = -structureNetwork.gas;
			structureNetwork.gas = 0;
		}
		structureNetwork.workers -= workers;
		if (structureNetwork.workers < 0) {
			remainder.workers = -structureNetwork.workers;
			structureNetwork.workers = 0;
		}
		structureNetwork.food -= food;
		if (structureNetwork.food < 0) {
			remainder.food = -structureNetwork.food;
			structureNetwork.food = 0;
		}
		
		return remainder;
	}
	
	function IsEmpty() : boolean {
		if( water == 0 &&
			metal == 0 &&
			gas 	== 0 	&&
			workers == 0 &&
			food == 0)
			return true;
		else
			return false;
	}
}

/*****

	CardData class
	
	This object is stored in decks and pointed to by card in game. It's methods determine the effects of cards
	
	******/
	
class CardData extends Object {
	// Properties
	var cardName: String = "Name";
	var text: String = "Help Text";
	var targettingMode: int = InteractionMode.None;
	
	var card: Card = null;
	
	// Methods
	function UseAbility(target: SelectableComponent,owner: PhotonPlayer) : boolean {}
	
	function CreateFollower(target: TileData, followerPrefab: GameObject) {
		var follower = GameObject.Instantiate(followerPrefab,Vector3.zero,Quaternion.identity);
		var followerData = follower.GetComponent(Follower);
		
		followerData.StartOnTile(target);
	}
	
	function CreateStructure(target: TileData, structureObject: GameObject,owner: PhotonPlayer) {
		var structure = GameObject.Instantiate(structureObject,Vector3.zero,Quaternion.identity);
		var structureData = structure.GetComponent(Structure);
		
		target.PlaceStructure(structure);
		target.structure = structureData;
		structureData.tile = target;
		structureData.InitializeChildren();
		structureData.owner = owner;
		structureData.CreateOrJoinStructureNetwork();
	}
	
	function UseResourcesToBuildStructureOnTile(targetTile: TileData, cost: ResourceCost,owner: PhotonPlayer) : boolean {
		var totalResourcesOfConnectedNetworks = new ResourceCost();
		
		var connectedNetworks = new ArrayList();
		
		for(connectedTile in targetTile.adjacentTiles) {
			if (connectedTile.structure != null && !connectedNetworks.Contains(connectedTile.structure.structureNetwork) && connectedTile.structure.owner == owner) {
				connectedNetworks.Add(connectedTile.structure.structureNetwork);
				
				// add network's resources to total resources
				totalResourcesOfConnectedNetworks.water += connectedTile.structure.structureNetwork.water;
				totalResourcesOfConnectedNetworks.metal += connectedTile.structure.structureNetwork.metal;
				totalResourcesOfConnectedNetworks.gas += connectedTile.structure.structureNetwork.gas;
				totalResourcesOfConnectedNetworks.food += connectedTile.structure.structureNetwork.food;
				totalResourcesOfConnectedNetworks.workers += connectedTile.structure.structureNetwork.workers;
			}
		}
		
		// if we can pay
		if (totalResourcesOfConnectedNetworks.ContainsNaturalResourcesAndWorkers(cost)) {
			var networkIndex = 0;
			
			var remainingCostToPay = cost;
			
			// iterate through and remove resources
			while(!remainingCostToPay.IsEmpty()) {
				var currentNetwork = connectedNetworks[networkIndex] as StructureNetwork;
				remainingCostToPay = remainingCostToPay.ConsumeResourcesFromNetworkAndReturnRemainder(currentNetwork);
				networkIndex++;
			}
			
			// we can build it!
			return true;
		}
		else
			return false;
	}
	
	function GetDataNameForNetwork() : String {
		return "Error";
	}
}

