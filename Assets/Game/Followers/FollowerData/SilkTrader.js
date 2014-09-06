#pragma strict

/*****
	
	Silk Trader
	
	Requirements:
		- Village faithful to you
	
	Abilities:
		- Move 3
		- +1 Faith in MER( in this tile's village )
	
	*****/

class SilkTrader extends Follower {
	// initialize follower data
	function Start() {
		followerName = "Silk Trader";
		numberOfAbilities = 2;
		abilityTextArray = ["Move 3","+1 Faith in MER"];
		abilityTargets = [InteractionMode.FollowerAbilityTargettingTerrain,InteractionMode.None];
		
		renderer.material.color = color;
	}
	
	function UseAbility(abilityIndex: int,target: MonoBehaviour) : boolean{
		if (abilityIndex == 0) {
			// Move 3
			if(MoveFollower(target as TileData,3)) {
				TurnController.UsePiece(this);
				return true;
			}
			else
				return false;
		}
		else if (abilityIndex == 1) {
			// +1 faith in MER
			if(tile.village != null && tile.village.type == "MER") {
				tile.village.AdjustFaith(1);
				TurnController.UsePiece(this);
				return true;
			}
			else
				return false;
		}
		
		return false;	
	}
}