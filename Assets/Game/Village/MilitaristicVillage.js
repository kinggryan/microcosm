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
}