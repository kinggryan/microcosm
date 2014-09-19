#pragma strict

/*****

	Sprawling Grasslands
	
	Power Cost:		1
	Terrain - Plains
	Harvest: Gives 4 faith instead of 3.

	*****/
	
class SprawlingGrasslandsCard extends CardData {
	// Methods
	
	function SprawlingGrasslandsCard() {
		cardName = "Sprawling Grasslands";
		text = "Terrain - Plains\nPowerCost:1\nHarvest: Gives 4 faith instead of 3.";
		targettingMode = InteractionMode.CardTargettingTerrain;
		
		powerCost = 1;
	}
	
	function UseAbility(target: SelectableComponent) : boolean {
		// make sure you can target the village
		var targetTile = target as TileData;
		
		if(!TurnController.myTurn || (!targetTile.terrain.name == "Plains" && targetTile.terrain.isMine && ResourceController.UsePower(powerCost)) ) {
			// change tile terrain
			targetTile.terrain = SprawlingGrasslands();
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