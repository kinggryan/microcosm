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
	var powerCost: int = 0;
	var range: int = 0;
	
	// Methods
	function UseAbility(target: SelectableComponent) : boolean {}
	
	function IsInRange(target: TileData) : boolean {
		return TurnController.playerOrigin.LookForTile(target, range, false);
	}
}