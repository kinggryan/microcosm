#pragma strict

/*****

	Builds a farm colony on a tile
	
	*****/
	
class BuildViewingPlatform extends CardData {
	// Methods
	var structureObject: GameObject;
	
	function BuildViewingPlatform() {
		cardName = "Viewing Platform";
		text = "Expansion - Luxury\nCost: GM\nWorkers: 3\nPoints: 2\nEach turn +1 point for each unused adjacent tile";
		structureObject = Resources.Load("ViewingPlatform") as GameObject;
		targettingMode = InteractionMode.CardTargettingTerrain;
	}
	
	function UseAbility(target: SelectableComponent,owner:PhotonPlayer) : boolean {
		var targetTile = target as TileData;
		
		// set cost
		var cost = new ResourceCost();
		cost.workers = 3;
		cost.metal = 1;
		cost.gas = 1;
		
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
		return "BuildViewingPlatform";
	}
}