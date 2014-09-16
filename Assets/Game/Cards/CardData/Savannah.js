#pragma strict

/*****

	Savannah 
	
	Power Cost:		2
	Range:			2
	Resources:		2G
	Creation: Steal 1 wood stock from each adjacent tile, if possible.
	
	*****/
	
class Savannah extends CardData {
	// Methods
	
	function Savannah() {
		cardName = "Savannah";
		text = "Terrain\nPowerCost:2\nRange:2\nResources:2G\nCreation:Steal 1 wood stock from each adjacent tile, if possible";
		targettingMode = InteractionMode.CardTargettingTerrain;
		
		range = 2;
		powerCost = 2;
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
			targetTile.terrain.grain = 2;
			targetTile.terrain.powerCost = powerCost;
			targetTile.terrain.SetGraphics(targetTile.renderer);
			
			// do card creation effect
			for(var adjacentTile in targetTile.adjacentTiles) {
				if(adjacentTile.terrain.wood > 0) {
					adjacentTile.terrain.wood--;
					targetTile.terrain.wood++;
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