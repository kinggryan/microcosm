#pragma strict

/*****

	Faultline 
	
	Power Cost:		2
	Range:			2
	Resources:		6C
	Creation: Add 3 to the needed progress of all adjacent villages.
	
	*****/
	
class Faultline extends CardData {
	// Methods
	
	function Faultline() {
		cardName = "Savannah";
		text = "Terrain\nPowerCost:2\nRange:2\nResources:6C\nCreation: Add 3 to the needed progress of all adjacent villages.";
		targettingMode = InteractionMode.CardTargettingTerrain;
		
		range = 2;
		powerCost = 2;
	}
	
	function UseAbility(target: SelectableComponent) : boolean {
		// make sure you can target the village
		var targetTile = target as TileData;
		
		if(!TurnController.myTurn || (ResourceController.UsePower(powerCost + targetTile.terrain.powerCost) && IsInRange(targetTile) && !targetTile.terrain.unwalkable) ) {
			// change tile terrain
			targetTile.terrain = new GameTerrain();
			targetTile.terrain.tile = targetTile;
			targetTile.terrain.color = Color(1,0.8,0);
			targetTile.terrain.isMine = TurnController.myTurn;
			targetTile.terrain.clay = 6;
			targetTile.terrain.powerCost = powerCost;
			targetTile.terrain.SetGraphics(targetTile.renderer);
			
			// do card creation effect
			for(var adjacentTile in targetTile.adjacentTiles) {
				if(adjacentTile.village != null) {
					adjacentTile.village.progressRemaining += 3;
				}
			}
			
			// send card played messages
			if(TurnController.myTurn) {
				targetTile.SetLineColor(Color.blue);
				var deck = GameObject.Find("ControllerHub").GetComponent(Deck) as Deck;
				deck.RemoveCardFromHand(card);
				TurnController.CardPlayed();
			}
			else
				targetTile.SetLineColor(Color.red);
			
			return true;
		}
		
		// if we couldn't summon there
		return false;
	}
}