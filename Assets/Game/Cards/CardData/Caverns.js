#pragma strict

/*****

	Caverns
	
	Power Cost:		2
	Range:			2
	Resources:		2J
	Wondrous (worth x2 faith)
	
	*****/
	
class Caverns extends CardData {
	// Methods
	
	function Caverns() {
		cardName = "Caverns";
		text = "Terrain\nPowerCost:2\nRange:2\nResources:2J\nWondrous - worth x2 faith";
		targettingMode = InteractionMode.CardTargettingTerrain;
		
		range = 2;
		powerCost = 2;
	}
	
	function UseAbility(target: SelectableComponent) : boolean {
		// make sure you can target the village
		var targetTile = target as TileData;
		
		if(!TurnController.myTurn || (ResourceController.UsePower(powerCost + targetTile.terrain.powerCost) && IsInRange(targetTile) && !targetTile.terrain.unwalkable) ) {
			// change tile terrain to forest
			targetTile.terrain = new WondrousJewelTerrain();
			targetTile.terrain.tile = targetTile;
			targetTile.terrain.color = Color(0.95,0.95,1);
			targetTile.terrain.isMine = TurnController.myTurn;
			targetTile.terrain.jewels = 2;
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