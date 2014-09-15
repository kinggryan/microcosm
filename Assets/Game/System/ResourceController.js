/*****

	Handles the Power resource
	
	*****/
	
class ResourceController extends MonoBehaviour {
	// Properties
	static private var currentPowerLevel: int = 0;
	static private var availablePower: int	= 0;
	static private var maximumPower: int = 6;
	
	// Methods
	static function StartTurn() {
		if (currentPowerLevel < maximumPower)
			currentPowerLevel++;
			
		availablePower = currentPowerLevel;
	}
	
	// returns true if this was possible
	static function UsePower(power: int) : boolean {
		if (power > availablePower)
			return false;
		
		availablePower -= power;
		return true;
	}
	
	// draw power
	function OnGUI() {
		var powerLabelPosition = Rect(80,28,80,70);
		
		GUI.Label(powerLabelPosition,"Power : "+availablePower +"/"+currentPowerLevel);
	}
}