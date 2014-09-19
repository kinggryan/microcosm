#pragma strict

/*****

	Slowgrowth Fields
	
	Power Cost:		2
	Terrain - Plains
	Barren for first 2 turns after being played.
	Harvest: Gives 6 faith instead of 3.

	*****/
	
class SlowgrowthFieldsCard extends CardData {
	// Methods
	
	function SlowgrowthFieldsCard() {
		cardName = "Slowgrowth Fields";
		text = "Terrain - Plains\nPowerCost:2\nBarren for first 2 turns after being played.\nHarvest: Gives 6 faith instead of 3.";
		targettingMode = InteractionMode.CardTargettingTerrain;
		
		powerCost = 2;
	}
	
	function UseAbility(target: SelectableComponent) : boolean {
		// make sure you can target the village
		var targetTile = target as TileData;
		
		if(!TurnController.myTurn || (!targetTile.terrain.name == "Plains" && targetTile.terrain.isMine && ResourceController.UsePower(powerCost)) ) {
			// change tile terrain
			targetTile.terrain = SlowgrowthFields();
			targetTile.terrain.tile = targetTile;
			targetTile.terrain.Initialize();
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