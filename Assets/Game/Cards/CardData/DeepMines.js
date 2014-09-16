#pragma strict

/*****

	Deep Mines
	
	Power Cost:		3
	Range:			1
	Resources:		8M

	
	*****/
	
class DeepMines extends CardData {
	// Methods
	
	function DeepMines() {
		cardName = "DeepMines";
		text = "Terrain\nPowerCost:3\nRange:1\nResources:8M";
		targettingMode = InteractionMode.CardTargettingTerrain;
		
		range = 1;
		powerCost = 3;
	}
	
	function UseAbility(target: SelectableComponent) : boolean {
		// make sure you can target the village
		var targetTile = target as TileData;
		
		if(!TurnController.myTurn || (ResourceController.UsePower(powerCost + targetTile.terrain.powerCost) && IsInRange(targetTile) && !targetTile.terrain.unwalkable) ) {
			// change tile terrain
			targetTile.terrain = new GameTerrain();
			targetTile.terrain.tile = targetTile;
			targetTile.terrain.color =  Color.gray;
			targetTile.terrain.isMine = TurnController.myTurn;
			targetTile.terrain.metal = 8;
			targetTile.terrain.powerCost = powerCost;
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