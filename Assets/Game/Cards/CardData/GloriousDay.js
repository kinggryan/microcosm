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
		
		if(!TurnController.myTurn || TurnController.cardsPlayed == 0) {
			// add faith
			if(TurnController.myTurn)
				targetVillage.AdjustFaith(2);
			else
				targetVillage.AdjustFaith(-2);
			
			Debug.Log("adjusting");
			targetVillage.AdjustInfluence(1);
			targetVillage.AdjustMight(1);
			
			if (TurnController.myTurn) {
				// send card played messages
				var deck = GameObject.Find("ControllerHub").GetComponent(Deck) as Deck;
				deck.RemoveCardFromHand(card);
				TurnController.CardPlayed();
			}
			
			return true;
		}
		
		// if we couldn't summon there
		return false;
	}
}