#pragma strict

/*****

	Resource Class
	
	*****/
	
class NaturalResource extends MonoBehaviour {
	// Properties
	var type: String = "";
	var localPosition: Vector3 = Vector3.zero;
	static var displayStyle: GUIStyle = null;
	
	// Methods
	function Start() {
		// set display style
		if (displayStyle == null) {
			displayStyle = GUIStyle();
			displayStyle.fontSize = 18;
		}
	}
	
	function GenerateResources(network: StructureNetwork) { }	// implemented in subclasses
	
	function OnGUI() {
		if (!Physics.Linecast(1.1*localPosition,Camera.main.transform.position)) {
			var screenPos = Camera.main.WorldToScreenPoint(localPosition);
			var dialogueBox = Rect(screenPos.x-35,Screen.height - (screenPos.y+20.5),70,25);
	
			GUI.Label(dialogueBox,type,displayStyle);
		}
	}
}

// Water subclass
class Water extends NaturalResource {
	function Start() {
		type = "W";
		
		super.Start();
	}
	
	function GenerateResources(network:StructureNetwork) {
		network.water++;
		Debug.Log("W");
	}
}

// Metal subclass
class Metal extends NaturalResource {
	function Start() {
		type = "M";
		
		super.Start();
	}
	
	function GenerateResources(network:StructureNetwork) {
		network.metal++;
		Debug.Log("M");
	}
}

// Gas subclass
class Gas extends NaturalResource {
	function Start() {
		type = "G";
		
		super.Start();
	}
	
	function GenerateResources(network:StructureNetwork) {
		network.gas++;
		Debug.Log("G");
	}
}