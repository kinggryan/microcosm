#pragma strict

/*****

	Trial by Pain
	
	-2 population and +4 faith in chosen village.
	
	*****/
	
class TrialByPain extends CardData {
	// Methods
	
	function TrialByPain() {
		cardName = "Trial by Pain";
		text = "Miracle - -2 population, then +4 faith in chosen village";
		targettingMode = InteractionMode.CardTargettingVillage;
	}
	
	function UseAbility(target: SelectableComponent) : boolean {
		// make sure you can target the village
		var targetVillage = target as Village;
		
		if(TurnController.cardsPlayed == 0) {
			// add faith
			targetVillage.AdjustPopulation(-2);
			targetVillage.AdjustFaith(4);
			
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