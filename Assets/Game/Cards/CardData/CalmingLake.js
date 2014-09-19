#pragma strict

/*****

	Calming Lake
	
	Power Cost:		2
	Terrain - River
	Harvest: Gives 3 faith to adjacent villages.

	*****/
	
class CalmingLakeCard extends CardData {
	// Methods
	
	function CalmingLakeCard() {
		cardName = "Calming Lake";
		text = "Terrain - River\nPowerCost:2\nHarvest: Gives 3 faith to adjacent villages.";
		targettingMode = InteractionMode.CardTargettingTerrain;
		
		powerCost = 2;
	}
	
	function UseAbility(target: SelectableComponent) : boolean {
		// make sure you can target the village
		var targetTile = target as TileData;
		
		if(!TurnController.myTurn || (!targetTile.terrain.name == "River" && targetTile.terrain.isMine && ResourceController.UsePower(powerCost)) ) {
			// change tile terrain
			targetTile.terrain = CalmingLake();
			targetTile.terrain.tile = targetTile;
			targetTile.terrain.Initialize();
			targetTile.terrain.SetGraphics(targetTile.renderer);
			
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