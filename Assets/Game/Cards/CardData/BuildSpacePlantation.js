#pragma strict

/*****

	Builds a farm colony on a tile
	
	*****/
	
class BuildSpacePlantation extends CardData {
	// Methods
	var structureObject: GameObject;
	
	function BuildSpacePlantation() {
		cardName = "Space Plantation";
		text = "Expansion - Farm\nCost: WW\nWorkers: 3\nPoints: 3\n+3 food each turn";
		structureObject = Resources.Load("SpacePlantation") as GameObject;
		targettingMode = InteractionMode.CardTargettingTerrain;
	}
	
	function UseAbility(target: SelectableComponent,owner:PhotonPlayer) : boolean {
		var targetTile = target as TileData;
		
		// set cost
		var cost = new ResourceCost();
		cost.workers = 3;
		cost.water = 2;
		
		// verify targettability
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
		return "BuildSpacePlantation";
	}
}