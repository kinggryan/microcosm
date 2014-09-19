#pragma strict

/*****

	Mountain
	
	Power Cost:		1
	Range:			2
	Resources:		10M
	
	*****/
	
class Mountain2 extends CardData {
	// Methods
	
	function Mountain2() {
		cardName = "Mountain";
		text = "Terrain\nPowerCost:1\nRange:2\nResources:10M";
		targettingMode = InteractionMode.CardTargettingTerrain;
		
		range = 2;
		powerCost = 1;
	}
	
	function UseAbility(target: SelectableComponent) : boolean {
		// make sure you can target the village
		var targetTile = target as TileData;
		
		if(!TurnController.myTurn || (ResourceController.UsePower(powerCost + targetTile.terrain.powerCost) && IsInRange(targetTile) && !targetTile.terrain.unwalkable) ) {
			// change tile terrain to forest
			targetTile.terrain = new GameTerrain();
			targetTile.terrain.tile = targetTile;
			targetTile.terrain.color = Color.gray;
			targetTile.terrain.isMine = TurnController.myTurn;
			targetTile.terrain.metal = 10;
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