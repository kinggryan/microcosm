#pragma strict

/*****

	Plague
	
	-3 pop in chosen village.
	
	*****/
	
class Plague extends CardData {
	// Methods
	
	function Plague() {
		cardName = "Plague";
		text = "Miracle - -3 population in any village";
		targettingMode = InteractionMode.CardTargettingVillage;
	}
	
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