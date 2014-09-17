#pragma strict

/*****

	Spoiled Jewels
	
	Power Cost:		3
	Range:			2
	Resources:		6J
	Wondrous (worth x2 faith)
	Spent: Lose 5 faith in adjacent villages
	
	*****/
	
class SpoiledJewels extends CardData {
	// Methods
	
	function SpoiledJewels() {
		cardName = "Spoiled Jewels";
		text = "Terrain\nPowerCost:3\nRange:2\nResources:6J\nWondrous - worth x2 faith.Spent: Lose 5 faith in adjacent villages.";
		targettingMode = InteractionMode.CardTargettingTerrain;
		
		range = 2;
		powerCost = 3;
	}
	
	function UseAbility(target: SelectableComponent) : boolean {
		// make sure you can target the village
		var targetTile = target as TileData;
		
		if(!TurnController.myTurn || (ResourceController.UsePower(powerCost + targetTile.terrain.powerCost) && IsInRange(targetTile) && !targetTile.terrain.unwalkable) ) {
			// change tile terrain to forest
			targetTile.terrain = new SpoiledJewelsTerrain();
			targetTile.terrain.tile = targetTile;
			targetTile.terrain.color = Color(0.95,0.7,0.7);
			targetTile.terrain.isMine = TurnController.myTurn;
			targetTile.terrain.jewels = 6;
			targetTile.terrain.powerCost = powerCost;
			targetTile.terrain.SetGraphics(targetTile.renderer);
			targetTile.terrain.helpText = "Spent: Lose 5 faith in adjacent villages";
			
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