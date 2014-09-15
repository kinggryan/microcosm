#pragma strict

/*****

	Hills
	
	Power Cost:		1
	Range:			2
	Resources:		4C
	
	*****/
	
class Hills extends CardData {
	// Methods
	
	function Hills() {
		cardName = "Hills";
		text = "Terrain\nPowerCost:1\nRange:2\nResources:4C";
		targettingMode = InteractionMode.CardTargettingTerrain;
		
		range = 2;
		powerCost = 1;
	}
	
	function UseAbility(target: SelectableComponent) : boolean {
		// make sure you can target the village
		var targetTile = target as TileData;
		
		if(!TurnController.myTurn || (ResourceController.UsePower(powerCost) && IsInRange(targetTile))) {
			// change tile terrain to forest
			targetTile.terrain = new GameTerrain();
			targetTile.terrain.tile = targetTile;
			targetTile.terrain.color = Color(1,0.8,0);
			targetTile.terrain.isMine = TurnController.myTurn;
			targetTile.terrain.clay = 4;
			targetTile.terrain.SetGraphics(targetTile.renderer);
			
			// send card played messages
			if(TurnController.myTurn) {
				var deck = GameObject.Find("ControllerHub").GetComponent(Deck) as Deck;
				deck.RemoveCardFromHand(card);
				TurnController.CardPlayed();
			}
			
			return true;
		}
		
		// if we couldn't summon there
		return false;
	}
}