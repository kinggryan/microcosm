#pragma strict

/*****

	Builds a farm colony on a tile
	
	*****/
	
class BuildProductionPlant extends CardData {
	// Methods
	var structureObject: GameObject;
	
	function BuildProductionPlant() {
		cardName = "Production Plant";
		text = "Expansion - Factory\nCost: M\nWorkers: 1\nPoints: 5\nDouble the natural resource on this tile.";
		structureObject = Resources.Load("ProductionPlant") as GameObject;
		targettingMode = InteractionMode.CardTargettingTerrain;
	}
	
	function UseAbility(target: SelectableComponent,owner:PhotonPlayer) : boolean {
		var targetTile = target as TileData;
		
		// set cost
		var cost = new ResourceCost();
		cost.workers = 1;
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
		return "BuildProductionPlant";
	}
}