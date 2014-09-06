#pragma strict

/*****

	Resource Class
	
	*****/
	
class NaturalResource extends MonoBehaviour {
	// Properties
	var type: String = "";
	var localPosition: Vector3 = Vector3.zero;
	
	// Methods
	function GenerateResources(network: StructureNetwork) { }	// implemented in subclasses
	
	function OnGUI() {
		if (!Physics.Linecast(transform.position,Camera.main.transform.position)) {
			var screenPos = Camera.main.WorldToScreenPoint(localPosition);
			var dialogueBox = Rect(screenPos.x-35,Screen.height - (screenPos.y+20.5),70,25);
	
			GUI.Label(dialogueBox,type);
		}
	}
}