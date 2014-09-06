#pragma strict

/*****

	CardData class
	
	This object is stored in decks and pointed to by card in game. It's methods determine the effects of cards
	
	******/
	
class CardData extends Object {
	// Properties
	var cardName: String = "Name";
	var text: String = "Help Text";
	var targettingMode: int = InteractionMode.None;
	
	var card: Card = null;
	
	// Methods
	function UseAbility(target: SelectableComponent) : boolean {}
	
	function CreateFollower(target: TileData, followerPrefab: GameObject) {
		var follower = GameObject.Instantiate(followerPrefab,Vector3.zero,Quaternion.identity);
		var followerData = follower.GetComponent(Follower);
		
		followerData.StartOnTile(target);
	}
}