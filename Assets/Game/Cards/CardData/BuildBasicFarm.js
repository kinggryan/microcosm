#pragma strict

/*****

	Builds a farm colony on a tile
	
	*****/
	
class BuildBasicFarm extends CardData {
	// Methods
	var structureObject: GameObject;
	
	function BuildBasicFarm() {
		cardName = "Basic Farm";
		text = "Expansion - Farm\nCost: W\nWorkers: 1\nEach turn, +1 food";
		structureObject = Resources.Load("BasicFarm") as GameObject;
		targettingMode = InteractionMode.CardTargettingTerrain;
	}
	
	function UseAbility(target: SelectableComponent,owner:PhotonPlayer) : boolean {
		// make sure you can target the tile
		var targetTile = target as TileData;
		var cost = new ResourceCost();
		cost.workers = 1;
		cost.water = 1;
		
		if(owner != PhotonNetwork.player || (TurnController.myTurn && TurnController.coloniesPlayed == 0 && targetTile.structure == null && UseResourcesToBuildStructureOnTile(targetTile,cost,owner))) {
			CreateStructure(targetTile,structureObject,owner);
			
			if (owner == PhotonNetwork.player) {
				var deck = GameObject.Find("ControllerHub").GetComponent(Deck) as Deck;
				deck.RemoveCardFromHand(card);
			
				TurnController.ExpansionPlayed();
			}
			
			return true;
		}
		
		// if we couldn't build there
		return false;
	}
	
	function GetDataNameForNetwork() : String {
		return "BuildBasicFarm";
	}
}