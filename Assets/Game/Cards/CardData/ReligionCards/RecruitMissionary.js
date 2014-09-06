#pragma strict

/*****

	Recruit Missionary
	
	Recruits a missionary in a village faithful to you.
	
	*****/
	
class RecruitMissionary extends CardData {
	// Methods
	var followerObject: GameObject;
	
	function RecruitMissionary() {
		cardName = "Recruit Missionary";
		text = "Make a missionary on any village faithful to you. The missionary has 'Move 2' and '+1 faith'";
		followerObject = Resources.Load("Missionary") as GameObject;
		targettingMode = InteractionMode.CardTargettingVillage;
	}
	
	function UseAbility(target: SelectableComponent) : boolean {
		// make sure you can target the village
		var targetVillage = target as Village;
		
		if(TurnController.cardsPlayed == 0 && targetVillage.faith > 0) {
			CreateFollower(targetVillage.tile,followerObject);
			
			var deck = GameObject.Find("ControllerHub").GetComponent(Deck) as Deck;
			deck.RemoveCardFromHand(card);
			
			TurnController.CardPlayed();
			
			return true;
		}
		
		// if we couldn't summon there
		return false;
	}
}