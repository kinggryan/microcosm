#pragma strict

/*****
	
	Missionary
	
	Requirements:
		- Village faithful to you
	
	Abilities:
		- Move 2
		- +1 Faith ( in this tile's village )
	
	*****/

class Missionary extends Follower {
	// initialize follower data
	function Start() {
		followerName = "Missionary";
		numberOfAbilities = 2;
		abilityTextArray = ["Move 2","+1 Faith"];
		abilityTargets = [InteractionMode.FollowerAbilityTargettingTerrain,InteractionMode.None];
		
		renderer.material.color = color;
	}
	
	function UseAbility(abilityIndex: int,target: MonoBehaviour) : boolean{
		if (abilityIndex == 0) {
			// Move 2
			Debug.Log("try Move 2");
			if(MoveFollower(target as TileData,2)) {
				Debug.Log("Move 2");
				TurnController.UsePiece(this);
				return true;
			}
			else
				return false;
		}
		if (abilityIndex == 1) {
			// +1 faith
			if(tile.village != null) {
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