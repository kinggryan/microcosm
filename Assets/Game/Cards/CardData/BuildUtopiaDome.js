#pragma strict

/*****

	Builds a farm colony on a tile
	
	*****/
	
class BuildUtopiaDome extends CardData {
	// Methods
	var structureObject: GameObject;
	
	function BuildUtopiaDome() {
		cardName = "Utopia Dome";
		text = "Expansion - Luxury\nCost: MGW\nWorkers: 3\nPoints: 10";
		structureObject = Resources.Load("UtopiaDome") as GameObject;
		targettingMode = InteractionMode.CardTargettingTerrain;
	}
	
	function UseAbility(target: SelectableComponent,owner:PhotonPlayer) : boolean {
		var targetTile = target as TileData;
		
		// set cost
		var cost = new ResourceCost();
		cost.workers = 3;
		cost.metal = 1;
		cost.gas = 1;
		cost.water = 1;
		
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
		return "BuildUtopiaDome";
	}
}