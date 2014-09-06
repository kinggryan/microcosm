#pragma strict

/*****

	Agg village class
	
	Is like a basic village : has no devotion ability

	******/
	
class AggriculturalVillage extends Village {
	// Properties
	
	// Methods
	
	function Start() {
		type = "AGG";
		super.Start();
	}
	
	function DevotionAbility(target: Village) {
		// do nothing
	}
}