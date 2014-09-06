#pragma strict

/*****
	
	Crusader
	
	Requirements:
		- MIL Village faithful to you
	
	Abilities:
		- Move 2
		- -1 population ( in this tile's village )
	
	*****/

class Crusader extends Follower {
	// initialize follower data
	function Start() {
		followerName = "Crusader";
		numberOfAbilities = 2;
		abilityTextArray = ["Move 2","-1 Pop"];
		abilityTargets = [InteractionMode.FollowerAbilityTargettingTerrain,InteractionMode.None];
		
		renderer.material.color = color;
	}
	
	function UseAbility(abilityIndex: int,target: MonoBehaviour) : boolean{
		if (abilityIndex == 0) {
			// Move 2
			if(MoveFollower(target as TileData,2)) {
				TurnController.UsePiece(this);
				return true;
			}
			else
				return false;
		}
		if (abilityIndex == 1) {
			// -1 pop
			if(tile.village != null) {
				tile.village.AdjustPopulation(-1);
				TurnController.UsePiece(this);
				return true;
			}
			else
				return false;
		}
		
		return false;	
	}
}