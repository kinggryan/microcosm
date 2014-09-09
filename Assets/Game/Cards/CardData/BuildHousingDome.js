#pragma strict

/*****

	Builds an exploration base on a tile
	
	*****/
	
class BuildHousingDome extends CardData {
	// Methods
	var structureObject: GameObject;
	
	function BuildHousingDome() {
		cardName = "Housing Dome";
		text = "Colony\nStarting Pop: 0\nMax Pop: 6\n+2 pop/food";
		structureObject = Resources.Load("HousingDome") as GameObject;
		targettingMode = InteractionMode.CardTargettingTerrain;
	}
	
	function UseAbility(target: SelectableComponent,owner: PhotonPlayer) : boolean {
		// make sure you can target the tile
		var targetTile = target as TileData;
		
		// play automatically if it was played by another player. Otherwise, make sure it's playable
		if(owner != PhotonNetwork.player || (TurnController.myTurn && TurnController.coloniesPlayed == 0 && TurnController.expansionsPlayed == 0 && targetTile.structure == null)) {
			CreateStructure(targetTile,structureObject,owner);
			
			// remove card from hand
			if (owner == PhotonNetwork.player) {
				var deck = GameObject.Find("ControllerHub").GetComponent(Deck) as Deck;
				deck.RemoveCardFromHand(card);
			
				TurnController.ColonyPlayed();
			}
			
			return true;
		}
		
		// if we couldn't build there
		return false;
	}
	
	function GetDataNameForNetwork() : String {
		return "BuildHousingDome";
	}
}