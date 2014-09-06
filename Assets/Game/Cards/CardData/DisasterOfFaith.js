#pragma strict

/*****

	Disaster of Faith
	
	Faith of chosen village becomes 0.
	
	*****/
	
class DisasterOfFaith extends CardData {
	// Methods
	
	function DisasterOfFaith() {
		cardName = "Disaster of Faith";
		text = "Faith of chosen village becomes 0";
		targettingMode = InteractionMode.CardTargettingVillage;
	}
	
	function UseAbility(target: SelectableComponent) : boolean {
		// make sure you can target the village
		var targetVillage = target as Village;
		
		if(TurnController.cardsPlayed == 0) {
			// Do effect
			targetVillage.AdjustFaith(-targetVillage.faith);
			
			// send card played messages
			var deck = GameObject.Find("ControllerHub").GetComponent(Deck) as Deck;
			deck.RemoveCardFromHand(card);
			TurnController.CardPlayed();
			
			return true;
		}
		
		// if we couldn't playe card
		return false;
	}
}