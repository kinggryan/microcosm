#pragma strict

/*****

	Glittery River
	
	Power Cost:		2
	Range:			2
	Resources:		8C, 2J
	Jewels on this tile are Wondrous (worth x2 faith)
	
	*****/
	
class GlitteryRiver extends CardData {
	// Methods
	
	function GlitteryRiver() {
		cardName = "Glittery River";
		text = "Terrain\nPowerCost:2\nRange:2\nResources:8C, 2J\nJewels on this tile are Wondrous - worth x2 faith";
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
			targetTile.terrain.color = Color(0.95,0.8,0.8);
			targetTile.terrain.isMine = TurnController.myTurn;
			targetTile.terrain.jewels = 2;
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