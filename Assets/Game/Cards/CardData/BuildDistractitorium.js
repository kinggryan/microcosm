#pragma strict

/*****

	Builds a farm colony on a tile
	
	*****/
	
class BuildDistractitorium extends CardData {
	// Methods
	var structureObject: GameObject;
	
	function BuildDistractitorium() {
		cardName = "Distractitorium";
		text = "Expansion - Luxury\nCost: G\nWorkers: 1\nPoints: 4\nWhen built, adjacent enemy structures now use an additional worker.";
		structureObject = Resources.Load("Distractitorium") as GameObject;
		targettingMode = InteractionMode.CardTargettingTerrain;
	}
	
	function UseAbility(target: SelectableComponent,owner:PhotonPlayer) : boolean {
		// make sure you can target the tile
		var targetTile = target as TileData;
		var cost = new ResourceCost();
		cost.workers = 3;
		cost.gas = 1;
		
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
		return "BuildDistractitorium";
	}
}