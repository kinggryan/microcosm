#pragma strict

/*****

	Great Plains
	
	Power Cost:		3
	Range:			5
	Resources:		10G

	
	*****/
	
class GreatPlains extends CardData {
	// Methods
	
	function GreatPlains() {
		cardName = "Great Plains";
		text = "Terrain\nPowerCost:3\nRange:5\nResources:10G";
		targettingMode = InteractionMode.CardTargettingTerrain;
		
		range = 5;
		powerCost = 3;
	}
	
	function UseAbility(target: SelectableComponent) : boolean {
		// make sure you can target the village
		var targetTile = target as TileData;
		
		if(!TurnController.myTurn || (ResourceController.UsePower(powerCost + targetTile.terrain.powerCost) && IsInRange(targetTile) && !targetTile.terrain.unwalkable) ) {
			// change tile terrain
			targetTile.terrain = new GameTerrain();
			targetTile.terrain.tile = targetTile;
			targetTile.terrain.color =  Color(1,0.8,0.7);
			targetTile.terrain.isMine = TurnController.myTurn;
			targetTile.terrain.grain = 10;
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