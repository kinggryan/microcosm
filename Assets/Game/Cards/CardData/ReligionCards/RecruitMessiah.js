#pragma strict

/*****

	Recruit Messiah
	
	Recruits a messiah in a village faithful to you.
	
	*****/
	
class RecruitMessiah extends CardData {
	// Methods
	var followerObject: GameObject;
	
	function RecruitMissionary() {
		cardName = "Messiah";
		text = "Follower - Move 1 ; +1 faith ; Sacrifice for +6 faith";
		followerObject = Resources.Load("Messiah") as GameObject;
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