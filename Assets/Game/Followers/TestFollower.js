#pragma strict

// Test follower class

class TestFollower extends Follower {
	// initialize follower data
	function Start() {
		followerName = "Test Follower";
		numberOfAbilities = 1;
		abilityTextArray = ["Move 1"];
		abilityTargets = [InteractionMode.FollowerAbilityTargettingTerrain];
		
		renderer.material.color = color;
	}
	
	function UseAbility(abilityIndex: int,target: MonoBehaviour) : boolean{
		if (abilityIndex == 0) {
			if(MoveFollower(target as TileData,1)) {
				TurnController.UsePiece(this);
				return true;
			}
			else
				return false;
		}
		
		return false;	
	}
}