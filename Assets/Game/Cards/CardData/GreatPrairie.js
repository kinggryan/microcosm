#pragma strict

/*****

	Great Prairie
	
	Power Cost:		2
	Terrain - Plains
	Harvest: Gives 2 faith plus 2 additional faith for each plains adjacent to this one.

	*****/
	
class GreatPrairieCard extends CardData {
	// Methods
	
	function GreatPrairieCard() {
		cardName = "Great Prairie";
		text = "Terrain - Plains\nPowerCost:2\nHarvest: Gives 2 faith plus 2 additional faith for each plains adjacent to this one.";
		targettingMode = InteractionMode.CardTargettingTerrain;
		
		powerCost = 2;
	}
	
	function UseAbility(target: SelectableComponent) : boolean {
		// make sure you can target the village
		var targetTile = target as TileData;
		
		if(!TurnController.myTurn || (!targetTile.terrain.name == "Plains" && targetTile.terrain.isMine && ResourceController.UsePower(powerCost)) ) {
			// change tile terrain
			targetTile.terrain = GreatPrairie();
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