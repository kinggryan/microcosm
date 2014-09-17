﻿#pragma strict

/*****

	ColossalWaterfall
	
	Power Cost:		2
	Range:			3
	Resources:		4M
	Creation: Add 4 stock to adjacent wood and grain you control
	
	*****/
	
class ColossalWaterfall extends CardData {
	// Methods
	
	function ColossalWaterfall() {
		cardName = "Colossal Waterfal";
		text = "Terrain\nPowerCost:2\nRange:3\nResources:4M\nCreation:Add 4 stock to adjacent wood and grain you control";
		targettingMode = InteractionMode.CardTargettingTerrain;
		
		range = 3;
		powerCost = 2;
	}
	
	function UseAbility(target: SelectableComponent) : boolean {
		// make sure you can target the village
		var targetTile = target as TileData;
		
		if(!TurnController.myTurn || (ResourceController.UsePower(powerCost + targetTile.terrain.powerCost) && IsInRange(targetTile) && !targetTile.terrain.unwalkable) ) {
			// change tile terrain
			targetTile.terrain = new GameTerrain();
			targetTile.terrain.tile = targetTile;
			targetTile.terrain.color = Color(0,0.7,0);
			targetTile.terrain.isMine = TurnController.myTurn;
			targetTile.terrain.metal = 4;
			targetTile.terrain.powerCost = powerCost;
			targetTile.terrain.SetGraphics(targetTile.renderer);
			
			// do card creation effect
			for(var adjacentTile in targetTile.adjacentTiles) {
				if(adjacentTile.terrain.isMine == true) {
					if(adjacentTile.terrain.wood > 0)
						adjacentTile.terrain.wood += 4;
					if(adjacentTile.terrain.grain > 0)
						adjacentTile.terrain.grain += 4;
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