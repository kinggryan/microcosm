#pragma strict

/*****

	Field
	
	Power Cost:		1
	Range:			4
	Resources:		2G
	
	*****/
	
class Field extends CardData {
	// Methods
	
	function Field() {
		cardName = "Field";
		text = "Terrain\nPowerCost:1\nRange:4\nResources:2G";
		targettingMode = InteractionMode.CardTargettingTerrain;
		
		range = 4;
		powerCost = 1;
	}
	
	function UseAbility(target: SelectableComponent) : boolean {
		// make sure you can target the village
		var targetTile = target as TileData;
		
		if(!TurnController.myTurn || (ResourceController.UsePower(powerCost + targetTile.terrain.powerCost) && IsInRange(targetTile) && !targetTile.terrain.unwalkable) ) {
			// change tile terrain to forest
			targetTile.terrain = new GameTerrain();
			targetTile.terrain.tile = targetTile;
			targetTile.terrain.color = Color(1,0.8,0.7);
			targetTile.terrain.isMine = TurnController.myTurn;
			targetTile.terrain.grain = 2;
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