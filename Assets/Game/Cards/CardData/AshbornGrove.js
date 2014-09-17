#pragma strict

/*****

	Ashborn Grove
	
	Power Cost:		3
	Range:			3
	Resources:		6W
	Creation: Add 5 stock if this replaced a tile with grain.
	
	*****/
	
class AshbornGrove extends CardData {
	// Methods
	
	function AshbornGrove() {
		cardName = "Ashborn Grove";
		text = "Terrain\nPowerCost:3\nRange:2\nResources:3W\nCreation: Add 5 stock if this replaced a tile with grain.";
		targettingMode = InteractionMode.CardTargettingTerrain;
		
		range = 3;
		powerCost = 3;
	}
	
	function UseAbility(target: SelectableComponent) : boolean {
		// make sure you can target the village
		var targetTile = target as TileData;
		
		if(!TurnController.myTurn || (ResourceController.UsePower(powerCost + targetTile.terrain.powerCost) && IsInRange(targetTile) && !targetTile.terrain.unwalkable) ) {
			// do creation effect
			var extraStock = 0;
			if(targetTile.terrain.grain > 0)
				extraStock = 5;
			
			// change tile terrain
			targetTile.terrain = new GameTerrain();
			targetTile.terrain.tile = targetTile;
			targetTile.terrain.color = Color(0.1,0.7,0);
			targetTile.terrain.isMine = TurnController.myTurn;
			targetTile.terrain.wood = 6 + extraStock;
			targetTile.terrain.powerCost = powerCost;
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