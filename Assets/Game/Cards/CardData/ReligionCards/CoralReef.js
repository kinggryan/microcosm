#pragma strict

/*****

	Coral Reef
	
	Chosen ocean tile becomes a coral reef. Each turn, +1 faith in adjacent villages.
	
	*****/
	
class CoralReef extends CardData {
	// Methods
	
	function CoralReef() {
		cardName = "Coral Reef";
		text = "Miracle - Chosen tile becomes a coral reef. Each turn, adjacent villages get +1 faith.";
		targettingMode = InteractionMode.CardTargettingTerrain;
	}
	
	function UseAbility(target: SelectableComponent) : boolean {
		// make sure you can target the village
		var targetTile = target as TileData;
		
		if(TurnController.cardsPlayed == 0) {
			// change tile terrain to coral reef
			targetTile.terrain = new CoralReefTerrain();
			targetTile.terrain.tile = targetTile;
			targetTile.terrain.SetGraphics(targetTile.renderer);
			
			// send card played messages
			var deck = GameObject.Find("ControllerHub").GetComponent(Deck) as Deck;
			deck.RemoveCardFromHand(card);
			TurnController.CardPlayed();
			
			return true;
		}
		
		// if we couldn't summon there
		return false;
	}
}