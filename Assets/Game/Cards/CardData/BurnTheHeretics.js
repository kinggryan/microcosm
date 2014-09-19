#pragma strict

/*****

	Burn The Heretics
	
	Power Cost:		4
	Miracle
	Choose a village. Each tile within 1 tile of it that is controlled by your opponent is barren for one turn.

	*****/
	
class BurnTheHeretics extends CardData {
	// Methods
	
	function BurnTheHeretics() {
		cardName = "Burn the Heretics";
		text = "Miracle\nPowerCost:4\nChoose a village. Each tile within 1 tile of it that is controlled by your opponent is barren for one turn.";
		targettingMode = InteractionMode.CardTargettingTerrain;
		
		powerCost = 4;
	}
	
	function UseAbility(target: SelectableComponent) : boolean {
		// make sure you can target the village
		var targetTile = target as TileData;
		
		if(!TurnController.myTurn || (targetTile.village != null && ResourceController.UsePower(powerCost)) ) {
			for(var adjacentTile in targetTile.adjacentTiles)
				if(!adjacentTile.terrain.isMine)
					adjacentTile.terrain.barrenTurnsRemaining += 1;
					
			if(!targetTile.terrain.isMine) {
				targetTile.terrain.barrenTurnsRemaining += 1;
			}
		
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