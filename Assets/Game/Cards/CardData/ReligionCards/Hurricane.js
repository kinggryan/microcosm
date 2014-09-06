#pragma strict

/*****

	Hurricane
	
	-2 pop in villages adjacen to chosen ocean.
	
	*****/
	
class Hurricane extends CardData {
	// Methods
	
	function Hurricane() {
		cardName = "Hurricane";
		text = "Miracle - -2 population in villages adjacent to chosen ocean";
		targettingMode = InteractionMode.CardTargettingVillage; // todo card targettting terrain
	}
	
	// todo make ability work
	function UseAbility(target: SelectableComponent) : boolean {
		// make sure you can target the village
		var targetVillage = target as Village;
		
		if(TurnController.cardsPlayed == 0) {
			// Do effect
			targetVillage.AdjustPopulation(-3);
			
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