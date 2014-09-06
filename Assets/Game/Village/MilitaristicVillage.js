#pragma strict

/*****

	MIL village class
	
	DevotionAbility: target village within 2 spaces loses 1 population.

	******/
	
class MilitaristicVillage extends Village {
	// Properties
	
	// Methods
	
	function Start() {
		type = "MIL";
		super.Start();
	}
	
	function DevotionAbility(target: Village) {
		// if target is in range
		if (faith >= devotedMinimum && tile.LookForTile(target.tile,2,false)) {
			target.AdjustPopulation(-1);
			super.DevotionAbility(target);
		}
	}
}