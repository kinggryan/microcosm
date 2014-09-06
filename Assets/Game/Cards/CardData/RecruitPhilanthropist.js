#pragma strict

/*****

	Recruit Philanthropist
	
	Recruits a Philanthropist in an AGG village faithful to you.
	
	*****/
	
class RecruitPhilanthropist extends CardData {
	// Methods
	var followerObject: GameObject;
	
	function RecruitPhilanthropist() {
		cardName = "Philanthropist";
		text = "Follower - Train in faithful AGG - Move 1 ; +1 pop in current village";
		followerObject = Resources.Load("Philanthropist") as GameObject;
		targettingMode = InteractionMode.CardTargettingVillage;
	}
	
	function UseAbility(target: SelectableComponent) : boolean {
		// make sure you can target the village
		var targetVillage = target as Village;
		
		if(TurnController.cardsPlayed == 0 && targetVillage.faith > 0 && targetVillage.type == "AGG") {
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