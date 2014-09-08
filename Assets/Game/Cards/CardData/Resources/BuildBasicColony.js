#pragma strict

/*****

	Builds a basic colony on a tile
	
	*****/
	
class BuildBasicColony extends CardData {
	// Methods
	var structureObject: GameObject;
	
	function BuildBasicColony() {
		cardName = "Basic Colony";
		text = "Colony\nStarting Pop: 2\nMax Pop: 10\nEach turn, +1 pop/food";
		structureObject = Resources.Load("BasicColony") as GameObject;
		targettingMode = InteractionMode.CardTargettingTerrain;
	}
	
	function UseAbility(target: SelectableComponent,owner: PhotonPlayer) : boolean {
		// make sure you can target the tile
		var targetTile = target as TileData;
		
		if(owner != PhotonNetwork.player || (TurnController.myTurn && TurnController.cardsPlayed == 0 && targetTile.structure == null)) {
			CreateStructure(targetTile,structureObject,owner);
			
			if (owner == PhotonNetwork.player) {
				var deck = GameObject.Find("ControllerHub").GetComponent(Deck) as Deck;
				deck.RemoveCardFromHand(card);
			
				TurnController.CardPlayed();
			}
			
			return true;
		}
		
		// if we couldn't build there
		return false;
	}
	
	function GetDataNameForNetwork() : String {
		return "BuildBasicColony";
	}
}