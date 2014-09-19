#pragma strict

/*****

	Divine Eagles
	
	Power Cost:		4
	Miracle
	Gain 3 faith for every mountain adjacent to a chosen village.

	*****/
	
class DivineEagles extends CardData {
	// Methods
	
	function DivineEagles() {
		cardName = "Divine Eagles";
		text = "Miracle\nPowerCost:4\nGain 3 faith for every mountain within 1 tile of a chosen village.";
		targettingMode = InteractionMode.CardTargettingTerrain;
		
		powerCost = 4;
	}
	
	function UseAbility(target: SelectableComponent) : boolean {
		// make sure you can target the village
		var targetTile = target as TileData;
		
		if(!TurnController.myTurn || (targetTile.village != null && ResourceController.UsePower(powerCost)) ) {
			var mountainCount = 0;
			
			for(var adjacentTile in targetTile.adjacentTiles)
				if(adjacentTile.terrain.name == "Mountain")
					mountainCount++;
					
			if(targetTile.terrain.name == "Mountain") {
				mountainCount++;
			}
		
			// send card played messages
			if(TurnController.myTurn) {
				targetTile.village.AdjustFaith(mountainCount*3);
			
				targetTile.SetLineColor(Color.blue);
				var deck = GameObject.Find("ControllerHub").GetComponent(Deck) as Deck;
				deck.RemoveCardFromHand(card);
				TurnController.CardPlayed();
			}
			else {
				targetTile.village.AdjustFaith(mountainCount*-3);
				targetTile.SetLineColor(Color.red);
			}
			
			return true;
		}
		
		// if we couldn't summon there
		return false;
	}
}