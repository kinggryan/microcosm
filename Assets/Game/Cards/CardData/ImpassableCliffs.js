#pragma strict

/*****

	Impassable Cliffs
	
	Power Cost:		5
	Terrain - Mountain
	Impassable.

	*****/
	
class ImpassableCliffsCard extends CardData {
	// Methods
	
	function ImpassableCliffsCard() {
		cardName = "Impassable Cliffs";
		text = "Terrain - Mountain\nPowerCost:5\nImpassable.";
		targettingMode = InteractionMode.CardTargettingTerrain;
		
		powerCost = 5;
	}
	
	function UseAbility(target: SelectableComponent) : boolean {
		// make sure you can target the village
		var targetTile = target as TileData;
		
		if(!TurnController.myTurn || (!targetTile.terrain.name == "Mountain" && ResourceController.UsePower(powerCost)) ) {
			var previousController = targetTile.terrain.isMine;
			
			// change tile terrain
			targetTile.terrain = ImpassableCliffs();
			targetTile.terrain.tile = targetTile;
			targetTile.terrain.Initialize();
			targetTile.terrain.isMine = previousController;
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