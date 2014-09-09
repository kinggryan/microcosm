#pragma strict

/*****

	Builds a farm colony on a tile
	
	*****/
	
class BuildFoodProcessingPlant extends CardData {
	// Methods
	var structureObject: GameObject;
	
	function BuildFoodProcessingPlant() {
		cardName = "Food Processing Plant";
		text = "Expansion - Factory\nCost: MW\nWorkers: 2\nPoints: 2\nDouble the food of all farms in this network.";
		structureObject = Resources.Load("FoodProcessingPlant") as GameObject;
		targettingMode = InteractionMode.CardTargettingTerrain;
	}
	
	function UseAbility(target: SelectableComponent,owner:PhotonPlayer) : boolean {
		var targetTile = target as TileData;
		
		// set cost
		var cost = new ResourceCost();
		cost.workers = 2;
		cost.metal = 1;
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
		return "BuildFoodProcessingPlant";
	}
}