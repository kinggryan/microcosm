#pragma strict

/*****
	
	Messiah
	
	Requirements:
		- Village faithful to you
	
	Abilities:
		- Move 1
		- +1 Faith ( in this tile's village )
		- Sacrifice this follower to get +6 faith in this tile's village
	
	*****/

class Messiah extends Follower {
	// initialize follower data
	function Start() {
		followerName = "Messiah";
		numberOfAbilities = 3;
		abilityTextArray = ["Move 1","+1 Faith","Sacrifice: +6 faith"];
		abilityTargets = [InteractionMode.FollowerAbilityTargettingTerrain,InteractionMode.None,InteractionMode.None];
		
		renderer.material.color = color;
	}
	
	function UseAbility(abilityIndex: int,target: MonoBehaviour) : boolean{
		if (abilityIndex == 0) {
			// Move 1
			if(MoveFollower(target as TileData,1)) {
				Debug.Log("Move 1");
				TurnController.UsePiece(this);
				return true;
			}
			else
				return false;
		}
		else if (abilityIndex == 1) {
			// +1 faith
			if(tile.village != null) {
				tile.village.AdjustFaith(1);
				TurnController.UsePiece(this);
				return true;
			}
			else
				return false;
		}
		else if (abilityIndex == 2) {
			// Sacrifice: +6 faith
			if(tile.village != null) {
				tile.village.AdjustFaith(6);
				
				// sacrifice
				GameObject.Destroy(gameObject,0);
				return true;
			}
			else
				return false;
		}
		
		return false;	
	}
}