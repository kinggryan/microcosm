#pragma strict

/*****

	Recruit Missionary
	
	Recruits a missionary in a village faithful to you.
	
	*****/
	
class RecruitCrusader extends CardData {
	// Methods
	var followerObject: GameObject;
	
	function RecruitCrusader() {
		cardName = "Crusader";
		text = "Follower - Train in faithful MIL - Move 2 ; -1 pop in current village";
		followerObject = Resources.Load("Crusader") as GameObject;
		targettingMode = InteractionMode.CardTargettingVillage;
	}
	
	function UseAbility(target: SelectableComponent) : boolean {
		// make sure you can target the village
		var targetVillage = target as Village;
		
		if(TurnController.cardsPlayed == 0 && targetVillage.faith > 0 && targetVillage.type == "MIL") {
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