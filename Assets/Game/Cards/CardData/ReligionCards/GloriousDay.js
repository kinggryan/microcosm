#pragma strict

/*****

	Glorious Day
	
	+2 faith in chosen village.
	
	*****/
	
class GloriousDay extends CardData {
	// Methods
	
	function GloriousDay() {
		cardName = "Glorious Day";
		text = "Miracle - +2 faith in any village";
		targettingMode = InteractionMode.CardTargettingVillage;
	}
	
	function UseAbility(target: SelectableComponent) : boolean {
		// make sure you can target the village
		var targetVillage = target as Village;
		
		if(TurnController.cardsPlayed == 0) {
			// add faith
			targetVillage.AdjustFaith(2);
			
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