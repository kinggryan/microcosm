#pragma strict

/*****

	Gold Rush
	
	+3 faith in chosen MER village.
	
	*****/
	
class GoldRush extends CardData {
	// Methods
	
	function GoldRush() {
		cardName = "Gold Rush";
		text = "Miracle - +3 faith in chosen mercantile village";
		targettingMode = InteractionMode.CardTargettingVillage;
	}
	
	function UseAbility(target: SelectableComponent) : boolean {
		// make sure you can target the village
		var targetVillage = target as Village;
		
		if(TurnController.cardsPlayed == 0 && targetVillage.type == "MER") {
			// add faith
			targetVillage.AdjustFaith(3);
			
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