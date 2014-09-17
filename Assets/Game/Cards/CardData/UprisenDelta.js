#pragma strict

/*****

	Uprisen Delta 
	
	Power Cost:		2
	Range:			3
	Resources:		8C
	This tile can be created on ocean
	
	*****/
	
class UprisenDelta extends CardData {
	// Methods
	
	function UprisenDelta() {
		cardName = "Uprisen Delta";
		text = "Terrain\nPowerCost:2\nRange:3\nResources:8C\nCan be created on ocean.";
		targettingMode = InteractionMode.CardTargettingTerrain;
		
		range = 3;
		powerCost = 2;
	}
	
	function UseAbility(target: SelectableComponent) : boolean {
		// make sure you can target the village
		var targetTile = target as TileData;
		
		if(!TurnController.myTurn || (ResourceController.UsePower(powerCost + targetTile.terrain.powerCost) && IsInRange(targetTile))) {
			// change tile terrain
			targetTile.terrain = new GameTerrain();
			targetTile.terrain.tile = targetTile;
			targetTile.terrain.color = Color(1,0.8,0);
			targetTile.terrain.isMine = TurnController.myTurn;
			targetTile.terrain.clay = 8;
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