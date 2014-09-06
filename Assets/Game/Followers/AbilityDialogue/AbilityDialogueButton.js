#pragma strict

// this class simply displays some ability text and, when clicked, the interaction handler sends the ability index to the follower

class AbilityDialogueButton extends SelectableComponent {
	var follower: Follower;
	var text: String = "Ability";
	var abilityIndex: int = 0;
	var targettingMode = InteractionMode.None;

	var normalColor = Color.white;
	var highlightColor = Color.blue;
	var selectedColor = Color.yellow;
	
	var selected: boolean = false;

	function Start() {
		renderer.material.color = normalColor;
	}

	function OnGUI() {
		if (!Physics.Linecast(transform.position,Camera.main.transform.position)) {
			var screenPos = Camera.main.WorldToScreenPoint(transform.position);
			var dialogueBox = Rect(screenPos.x-25,Screen.height - (screenPos.y+12.5),50,25);
	
			GUI.Label(dialogueBox,text);
		}
	}

	function OnMouseEnter() {
		if(!selected)
			renderer.material.color = highlightColor;
	}

	function OnMouseExit() {
		if(!selected)
			renderer.material.color = normalColor;
	}

	function Select() {
		selected = true;
		renderer.material.color = selectedColor;
	}

	function Deselect(inheritSelection: boolean) {
		selected = false;
		renderer.material.color = normalColor;
		
		if(inheritSelection)
			follower.Deselect(inheritSelection);
	}
}