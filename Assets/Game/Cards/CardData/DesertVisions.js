#pragma strict

/*****

	Desert Visions
	
	Power Cost:		2
	Miracle
	Gain 5 faith in a village on a desert.
	
	*****/
	
class DesertVisions extends CardData {
	// Methods
	
	function DesertVisions() {
		cardName = "Desert Visions";
		text = "Miracle\nPowerCost:2\nGain 5 faith in a village on a desert.";
		targettingMode = InteractionMode.CardTargettingTerrain;
		
		powerCost = 2;
	}
	
	function UseAbility(target: SelectableComponent) : boolean {
		// make sure you can target the village
		var targetTile = target as TileData;
		
		if(!TurnController.myTurn || (targetTile.terrain.name == "" && targetTile.village != null && ResourceController.UsePower(powerCost)) ) {
			// send card played messages
			if(TurnController.myTurn) {
				targetTile.village.AdjustFaith(5);
			
				targetTile.SetLineColor(Color.blue);
				var deck = GameObject.Find("ControllerHub").GetComponent(Deck) as Deck;
				deck.RemoveCardFromHand(card);
				TurnController.CardPlayed();
			}
			else {
				targetTile.village.AdjustFaith(-5);
				targetTile.SetLineColor(Color.red);
			}
			
			return true;
		}
		
		// if we couldn't summon there
		return false;
	}
}