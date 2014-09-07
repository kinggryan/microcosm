/****

	Colony Class
	
	****/
	
class Colony extends Structure {
	// Properties
	var population: int = 0;
	var maximumPopulation: int = 0;
	
	// Methods
	function CreateOrJoinStructureNetwork() {
		var foundAdjacentNetwork = false;
	
		// look at adjacent tiles for a tiles
		for (connectedTile in tile.adjacentTiles) {
			// we haven't yet found an adjacent tile
			if (!foundAdjacentNetwork && connectedTile.structure != null) {
				// add self to the network
				connectedTile.structure.AddChild(this);
				structureNetwork = connectedTile.structure.structureNetwork;
				foundAdjacentNetwork = true;
			}
			if (foundAdjacentNetwork && connectedTile.structure != null && connectedTile.structure.structureNetwork != structureNetwork) {
				// we must combine the two disjoint networks
				structureNetwork.Combine(connectedTile.structure.structureNetwork,this);
			}
		}
		
		// if we've found no network, create a new one
		if (!foundAdjacentNetwork) {
			structureNetwork = new StructureNetwork();
			structureNetwork.head = this;
		}
	}
}