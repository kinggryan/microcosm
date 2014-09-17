#pragma strict

/*****

	Pleasant Wood
	
	Power Cost:		3
	Range:			3
	Resources:		6W
	Creation: Gain 2 faith in adjacent villages.
	
	*****/
	
class PleasantWood extends CardData {
	// Methods
	
	function PleasantWood() {
		cardName = "Pleasant Wood";
		text = "Terrain\nPowerCost:3\nRange:3\nResources:6W\nCreation:Gain 2 faith in adjacent villages.";
		targettingMode = InteractionMode.CardTargettingTerrain;
		
		range = 3;
		powerCost = 3;
	}
	
	function UseAbility(target: SelectableComponent) : boolean {
		// make sure you can target the village
		var targetTile = target as TileData;
		
		if(!TurnController.myTurn || (ResourceController.UsePower(powerCost + targetTile.terrain.powerCost) && IsInRange(targetTile) && !targetTile.terrain.unwalkable) ) {
			// change tile terrain
			targetTile.terrain = new GameTerrain();
			targetTile.terrain.tile = targetTile;
			targetTile.terrain.color = Color(0,0.7,0);
			targetTile.terrain.isMine = TurnController.myTurn;
			targetTile.terrain.wood = 6;
			targetTile.terrain.powerCost = powerCost;
			targetTile.terrain.SetGraphics(targetTile.renderer);
			
			// do card creation effect
			for(var adjacentTile in targetTile.adjacentTiles) {
				if(adjacentTile.village != null) {
					if (TurnController.myTurn)
						adjacentTile.village.faith += 2;
					else
						adjacentTile.village.faith -= 2;
				}
			}
			
			// send card played messages
			if(TurnController.myTurn) {
				targetTile.SetLineColor(Color.blue);
				var deck = GameObject.Find("ControllerHub").GetComponent(Deck) as Deck;
				deck.RemoveCardFromHand(card);
				TurnController.CardPlayed();
			}
			else
				targetTile.SetLineColor(Color.red);
			
			return true;
		}
		
		// if we couldn't summon there
		return false;
	}
}