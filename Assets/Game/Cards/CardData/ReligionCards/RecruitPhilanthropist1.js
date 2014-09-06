#pragma strict

/*****

	Recruit Philanthropist
	
	Recruits a Philanthropist in an AGG village faithful to you.
	
	*****/
	
class RecruitSilkTrader extends CardData {
	// Methods
	var followerObject: GameObject;
	
	function RecruitSilkTrader() {
		cardName = "Silk Trader";
		text = "Follower -  Move 3 ; +1 faith in current MER village";
		followerObject = Resources.Load("SilkTrader") as GameObject;
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