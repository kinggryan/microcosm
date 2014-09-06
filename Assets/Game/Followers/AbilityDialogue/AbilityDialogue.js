#pragma strict

public var ButtonObject: AbilityDialogueButton;
public var followerName: String = "";

function SetAbilities(abilities: String[], abilityTargets: int[], follower: Follower) {
	var buttonPosition = Vector3(-2,0,0);
	var abilityIndex = 0;
	
	followerName = follower.followerName;
	
	// Layout ability buttons
	for (var ability in abilities) {
		// create new button object
		var newButton = GameObject.Instantiate(ButtonObject.gameObject,transform.position,Quaternion.identity);
		newButton.transform.parent = transform;
		newButton.transform.rotation = transform.rotation;
		
		// set button data
		var buttonData = newButton.GetComponent(AbilityDialogueButton) as AbilityDialogueButton;
		buttonData.text = ability;
		buttonData.abilityIndex = abilityIndex;
		buttonData.follower = follower;
		buttonData.targettingMode = abilityTargets[abilityIndex];
		
		// move button to correct location
		newButton.transform.localPosition += Vector3(0,0.1,0) + buttonPosition;
		buttonPosition += Vector3(2,0,0);
		newButton.transform.localScale = Vector3(0.18,1,1);
		abilityIndex++;
	}
}

function OnGUI() {
	if (!Physics.Linecast(transform.position,Camera.main.transform.position)) {
			var screenPos = Camera.main.WorldToScreenPoint(transform.position + -0.25*transform.right);
			var dialogueBox = Rect(screenPos.x-35,Screen.height - (screenPos.y+20.5),70,25);
	
			GUI.Label(dialogueBox,followerName);
		}
}