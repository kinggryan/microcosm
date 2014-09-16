#pragma strict

/*****

	Forest
	
	Power Cost:		1
	Range:			3
	Resources:		3W
	
	*****/
	
class ForestCard extends CardData {
	// Methods
	
	function ForestCard() {
		cardName = "Forest";
		text = "Terrain\nPowerCost:1\nRange:3\nResources:3W";
		targettingMode = InteractionMode.CardTargettingTerrain;
		
		range = 3;
		powerCost = 1;
	}
	
	function UseAbility(target: SelectableComponent) : boolean {
		// make sure you can target the village
		var targetTile = target as TileData;
		
		if(!TurnController.myTurn || (ResourceController.UsePower(powerCost + targetTile.terrain.powerCost) && IsInRange(targetTile) && !targetTile.terrain.unwalkable) ) {
			// change tile terrain to forest
			targetTile.terrain = new GameTerrain();
			targetTile.terrain.tile = targetTile;
			targetTile.terrain.color = Color.green;
			targetTile.terrain.isMine = TurnController.myTurn;
			targetTile.terrain.wood = 3;
			targetTile.terrain.powerCost = 1;
			targetTile.terrain.SetGraphics(targetTile.renderer);
			
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