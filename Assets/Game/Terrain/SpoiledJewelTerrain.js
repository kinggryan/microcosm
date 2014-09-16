class SpoiledJewelsTerrain extends WondrousJewelTerrain {
	function Spent() {
		for(var currentTile in tile.adjacentTiles) {
			if(currentTile.village != null) {
				if(TurnController.myTurn)
					currentTile.village.faith -= 5;
				else
					currentTile.village.faith += 5;
			}
		}
		
		super.Spent();
	}
}