#pragma strict

/*****

	Mer village class
	
	DevotionAbility: target village within 2 spaces gains 1 faith.

	******/
	
class MercantileVillage extends Village {
	// Properties
	
	// Methods
	
	function Start() {
		type = "MER";
		super.Start();
	}
	
	function DevotionAbility(target: Village) {
		// if target is in range, increase faith
		if (faith >= devotedMinimum && tile.LookForTile(target.tile,2,false)) {
			target.AdjustFaith( 1 );
			super.DevotionAbility(target);
		}
	}
}