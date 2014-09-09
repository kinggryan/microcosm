#pragma strict

/*****

	Builds a farm colony on a tile
	
	*****/
	
class BuildResearchFacility extends CardData {
	// Methods
	var structureObject: GameObject;
	
	function BuildResearchFacility() {
		cardName = "Research Facility";
		text = "Expansion - Lab\nCost: M\nWorkers: 2\nPoints: 7\n";
		structureObject = Resources.Load("ResearchFacility") as GameObject;
		targettingMode = InteractionMode.CardTargettingTerrain;
	}
	
	function UseAbility(target: SelectableComponent,owner:PhotonPlayer) : boolean {
		var targetTile = target as TileData;
		
		// set cost
		var cost = new ResourceCost();
		cost.workers = 2;
		cost.metal = 1;
		
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
		return "BuildResearchFacility";
	}
}