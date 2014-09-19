#pragma strict

/*****

	Blizzard
	
	Power Cost:		2
	Miracle
	A plains or mountain is barren for one turn.

	*****/
	
class Blizzard extends CardData {
	// Methods
	
	function Blizzard() {
		cardName = "Blizzard";
		text = "Miracle\nPowerCost:2\nA plains or mountain is barren for one turn.";
		targettingMode = InteractionMode.CardTargettingTerrain;
		
		powerCost = 2;
	}
	
	function UseAbility(target: SelectableComponent) : boolean {
		// make sure you can target the village
		var targetTile = target as TileData;
		
		if(!TurnController.myTurn || ((targetTile.terrain.name == "Plains" || targetTile.terrain.name == "Mountain") && ResourceController.UsePower(powerCost)) ) {
			targetTile.terrain.barrenTurnsRemaining += 1;
		
			// send card played messages
			if(TurnController.myTurn) {
				targetTile.SetLineColor(Color.blue);
				var deck = GameObject.Find("ControllerHub").GetComponent(Deck) as Deck;
				deck.RemoveCardFromHand(card);
				TurnController.CardPlayed();
			}
			else {
				targetTile.SetLineColor(Color.red);
			}
			
			return true;
		}
		
		// if we couldn't summon there
		return false;
	}
}