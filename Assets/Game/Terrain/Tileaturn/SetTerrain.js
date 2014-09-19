class Plains extends GameTerrain {
	// The color of all advanced plains
	static var advancedPlainsColor = Color(255/255.0,215/255.0,0/255.0);

	// Methods
	function Spent() {}
	
	function Initialize() {
		color = Color(227/255.0,207/255.0,87/255.0);	//227	207	87	
		name = "Plains";
		super.Initialize();
	}
	
	function GiveResourcesToVillage(village: Village) {
		// exit this if it isn't this tile's controller's turn
		if(isMine != TurnController.myTurn)
			return;
	
		// if we're barren, reduce the number of turns left we have to be barren
		if(barrenTurnsRemaining > 0) {
			barrenTurnsRemaining--;
			return;
		}
	
		if(TurnController.myTurn)
			village.AdjustFaith(3);
		else
			village.AdjustFaith(-3);
	}
}

class Mountain extends GameTerrain {
	// Properties
	// The color of all advanced plains
	static var advancedMountainColor = Color(81/255.0,81/255.0,81/255.0);

	// Methods
	function Spent() {}
	
	function Initialize() {
		color = Color(139/255.0,139/255.0,113/255.0);
		name = "Mountain";
		super.Initialize();
	}
	
	function GiveResourcesToVillage(village: Village) {
		// exit this if it isn't this tile's controller's turn
		if(isMine != TurnController.myTurn)
			return;
	
		// if we're barren, reduce the number of turns left we have to be barren
		if(barrenTurnsRemaining > 0) {
			barrenTurnsRemaining--;
			return;
		}
	
		for(var obj in village.connectedVillages) {
			var connectedVillage = obj as Village;
		
			if(TurnController.myTurn)
				connectedVillage.AdjustFaith(1);
			else
				connectedVillage.AdjustFaith(-1);
		}
		
		if(TurnController.myTurn)
			village.AdjustFaith(1);
		else
			village.AdjustFaith(-1);
	}
}

class River extends GameTerrain {
	// Properties
	// The color of all advanced plains
	static var advancedRiverColor = Color(0/255.0,199/255.0,140/255.0);

	var connectedTiles: ArrayList = null;
	var connectedRiver: ArrayList = null;

	// Methods
	function River() {
		connectedTiles = ArrayList();
		connectedRiver = ArrayList();
		super();
	}

	function Spent() {}
	
	function Initialize() {
		color = Color.green;
		name = "River";
		
		// iterate through neighbors
		for(var adjacentTile in tile.adjacentTiles) {
			// if non river, add it
			if(adjacentTile.terrain.name != "River") {
				connectedTiles.Add(adjacentTile);
			}
			else {
				// if it is a river, add it to connected rivers and combine our lists
				var river = adjacentTile.terrain as River;
				
				AddConnectedTileList(river.connectedTiles);
				connectedRiver.Add(river);
			}
		}
		
		// now give our list back to other rivers
		for(var riverPiece in connectedRiver) {
			var riverCast = riverPiece as River;
			riverPiece.connectedTiles = connectedTiles;
			riverPiece.CombineRivers(connectedRiver);
		}
		
		SetConnectionsForAllVillagesOnRiver();
	}
	
	function CombineRivers(list: ArrayList) {
		for(var currentObj in list) {
			var river = currentObj as River;
			
			if(!connectedRiver.Contains(river)) {
				connectedRiver.Add(river);
			}
		}
	}
	
	function AddConnectedTileList(list : ArrayList) {
		for(var currentTile in list)
			if(!connectedTiles.Contains(currentTile))
				connectedTiles.Add(currentTile);
	}
	
	function AddTileToRiver (tile: TileData) {
		if(!connectedTiles.Contains(tile)) {
			connectedTiles.Add(tile);
			
			for(currentObj in connectedRiver) {
				var river = currentObj as River;
				river.connectedTiles.Add(tile);
			}
		}
	}
	
	function GiveResourcesToVillage(village: Village) { }
	
	function SetConnectionsForAllVillagesOnRiver() {
		for(var currentObj in connectedTiles) {
			var currentTile = currentObj as TileData;
			
			// connect to this village
			if(currentTile.village != null)
				for(var connectedTile in connectedTiles)
					currentTile.village.AddTileToHarvestTiles(connectedTile as TileData);
		}
	}
}