/****

	Colony Class
	
	****/
	
class Colony extends Structure {
	// Properties
	var population: int = 0;
	var maximumPopulation: int = 0;
	var popPerFoodRate: int = 0;
	
	// Methods
	function CreateOrJoinStructureNetwork() {
		var foundAdjacentNetwork = false;
	
		// look at adjacent tiles for a tiles
		for (connectedTile in tile.adjacentTiles) {
			// we haven't yet found an adjacent tile
			if (!foundAdjacentNetwork && connectedTile.structure != null && connectedTile.structure.owner == owner) {
				// add self to the network
				connectedTile.structure.AddChildStructure(this);
				structureNetwork = connectedTile.structure.structureNetwork;
				foundAdjacentNetwork = true;
			}
			if (foundAdjacentNetwork && connectedTile.structure != null && connectedTile.structure.structureNetwork != structureNetwork && connectedTile.structure.owner == owner) {
				// we must combine the two disjoint networks
				structureNetwork.Combine(connectedTile.structure.structureNetwork,this);
			}
		}
		
		// if we've found no network, create a new one
		if (!foundAdjacentNetwork) {
			structureNetwork = new StructureNetwork();
			structureNetwork.head = this;
			if(owner == TurnController.playerOne)
				structureNetwork.playerOneStructureNetworks.Add(structureNetwork);
			else
				structureNetwork.playerTwoStructureNetworks.Add(structureNetwork);
		}
		
		// add self to the feeding queue of our network
		Debug.Log("adding to FQ");
		structureNetwork.feedingQ.AddColony(this);
	}
	
	function FeedAndReturnRemainder(food: int) : int{
		Debug.Log("Feeding");
		var remainingFood = food;
		
		Debug.Log("Food: " + remainingFood);
		while(remainingFood > 0 && population != maximumPopulation) {
			// use a food to increase population
			remainingFood--;
			
			Debug.Log("Decremented food. Population before feed: "+population);
			population += popPerFoodRate;
			Debug.Log("After pop:  "+population);
			if(population > maximumPopulation)
				population = maximumPopulation;
		}
		
		RefreshHelpText();
		
		return remainingFood;
	}
}