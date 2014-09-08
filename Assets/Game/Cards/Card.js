#pragma strict

/*****

	Basic Card parent class
	
	******/
	
class Card extends SelectableComponent {
	// Properties
	private var color = Color.cyan;
	private var highlightColor = Color.white;
	private var selectedColor = Color.yellow;
	
	public var data: CardData = null;	// points to the object that actually performs actions for this class
	
	public var owner: PhotonPlayer = null;	// the owner of the card
	
	// Methods
	function Start() {
		renderer.material.color = color;
	}
	
	function Select() {
		renderer.material.color = selectedColor;
	}	
	
	function Deselect(inheritSelection: boolean) {
		renderer.material.color = color;
	}
	
	function UseAbility(target: SelectableComponent) : boolean { 
		return data.UseAbility(target,PhotonNetwork.player);
	}	// extended in subclasses
	
	function UseAbility(target: SelectableComponent,owner: PhotonPlayer) : boolean { 
		return data.UseAbility(target,owner);
	}	// extended in subclasses
	
	
	function OnGUI() {
	
			var screenCoords = Camera.main.WorldToScreenPoint(transform.position);
		
			var nameOffset = Vector3(-75,50,0);
			var textOffset = Vector3(-75,30,0);
		
			var nameRect = Rect(screenCoords.x + nameOffset.x,Screen.height - (screenCoords.y + nameOffset.y),150,40);
			var textRect = Rect(screenCoords.x + textOffset.x,Screen.height - (screenCoords.y + textOffset.y),150,110);
		
			GUI.Label(nameRect,data.cardName);
			GUI.Label(textRect,data.text);

	}
	
	function GetDataNameForNetwork() : String {
		return data.GetDataNameForNetwork();
	}
}