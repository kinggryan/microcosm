#pragma strict

/*****
	
	Philanthropist
	
	Requirements:
		- AGG Village faithful to you
	
	Abilities:
		- Move 1
		- +1 population ( in this tile's village )
	
	*****/

class Philanthropist extends Follower {
	// initialize follower data
	function Start() {
		followerName = "Philanthropist";
		numberOfAbilities = 2;
		abilityTextArray = ["Move 1","+1 Pop"];
		abilityTargets = [InteractionMode.FollowerAbilityTargettingTerrain,InteractionMode.None];
		
		renderer.material.color = color;
	}
	
	function UseAbility(abilityIndex: int,target: MonoBehaviour) : boolean{
		if (abilityIndex == 0) {
			// Move 1
			if(MoveFollower(target as TileData,1)) {
				TurnController.UsePiece(this);
				return true;
			}
			else
				return false;
		}
		if (abilityIndex == 1) {
			// +1 pop
			if(tile.village != null) {
				tile.village.AdjustPopulation(1);
				TurnController.UsePiece(this);
				return true;
			}
			else
				return false;
		}
		
		return false;	
	}
}