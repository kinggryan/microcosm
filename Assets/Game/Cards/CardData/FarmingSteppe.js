#pragma strict

/*****

	Farming Steppe
	
	Power Cost:		4
	Terrain - Plains
	Can be harvested by villages up to two tiles away.

	*****/
	
class FarmingSteppeCard extends CardData {
	// Methods
	
	function FarmingSteppeCard() {
		cardName = "Farming Steppe";
		text = "Terrain - Plains\nPowerCost:4\nCan be harvested by villages up to two tiles away.";
		targettingMode = InteractionMode.CardTargettingTerrain;
		
		powerCost = 4;
	}
	
	function UseAbility(target: SelectableComponent) : boolean {
		// make sure you can target the village
		var targetTile = target as TileData;
		
		if(!TurnController.myTurn || (!targetTile.terrain.name == "Plains" && targetTile.terrain.isMine && ResourceController.UsePower(powerCost)) ) {
			// change tile terrain
			targetTile.terrain = FarmingSteppe();
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