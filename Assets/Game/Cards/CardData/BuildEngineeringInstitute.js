#pragma strict

/*****

	Builds a farm colony on a tile
	
	*****/
	
class BuildEngineeringInstitute extends CardData {
	// Methods
	var structureObject: GameObject;
	
	function BuildEngineeringInstitute() {
		cardName = "Engineering Institute";
		text = "Expansion - Lab\nCost: MM\nWorkers: 3\nPoints: 5\nDraw an additional card each turn.";
		structureObject = Resources.Load("EngineeringInstitute") as GameObject;
		targettingMode = InteractionMode.CardTargettingTerrain;
	}
	
	function UseAbility(target: SelectableComponent,owner:PhotonPlayer) : boolean {
		// make sure you can target the tile
		var targetTile = target as TileData;
		var cost = new ResourceCost();
		cost.workers = 3;
		cost.metal = 2;
		
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
		return "BuildEngineeringInstitute";
	}
}