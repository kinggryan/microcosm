#pragma strict

// Village Class

// Subclasses store village info

class Village extends SelectableComponent {
	// Properties
	
	public var type: String = "";
	public var population: int = 3;
	public var faith: int = 0;
	
	// New stuff 9-3-14
	public var influence: int = 0;
	public var might: int = 0;
	public var happiness: int = 0;
	
	public var connectedVillages: ArrayList = null;
	// End new stuff
	
	public var tile: TileData;
	
	private var color = Color.grey;
	private var highlightColor = Color.white;
	private var selectedColor = Color.yellow;
	
	private static var displayStyle:GUIStyle = null;
	
	private var selected: boolean = false;
	
	protected static var devotedMinimum = 3;
	
	// Methods
	function Start() {
		renderer.material.color = color;
		
		// set display style
		if (displayStyle == null) {
			displayStyle = GUIStyle();
			displayStyle.fontSize = 18;
		}
		
		// set might and influence
		influence = Random.Range(0,2);
		might = Random.Range(0,2);
		
		// add self to scorekeeper
//		Scorekeeper.AddVillage(this);
	}
	
	function DevotionAbility(target: Village) { 
		Debug.Log("used");
		TurnController.UsePiece(this);	
	}	// implemented in subclasses
	
	// highlight methods
	function OnMouseEnter() {
		if(!selected)
			renderer.material.color = highlightColor;
			
		for(village in connectedVillages)
			Debug.Log(village);
	}
	
	function OnMouseExit() {
		if(!selected)
			renderer.material.color = color;
	}
	
	function Select() {
		renderer.material.color = selectedColor;
		selected = true;
	}
	
	function Deselect(inheritSelection: boolean) {
		renderer.material.color = color;
		selected = false;
	}
	
	function OnGUI() {
		var selfTransform:Transform = GetComponent(Transform) as Transform;
	
		if (!Physics.Linecast(selfTransform.position,Camera.main.transform.position)) {
			// if there's a straight line to the camera, draw stats
			DrawStats();
		}
	}
	
	// Draws the faith and population
	function DrawStats() {
		// CHANGES
		var drawDirection = Vector3.right;
		var rotation = Quaternion.AngleAxis(360/5,Vector3.up);
	
		// draw faith
		var faithWorldCoordsPosition = transform.TransformPoint(drawDirection);
		var faithScreenCoords = Camera.main.WorldToScreenPoint(faithWorldCoordsPosition);
		
		var faithFrame = Rect(faithScreenCoords.x-20,Screen.height-faithScreenCoords.y,40,25);
		GUI.Label(faithFrame,"F: " + faith.ToString(),displayStyle);
		drawDirection = rotation*drawDirection;
		
		// Draw population
		var popWorldCoordsPosition = transform.TransformPoint(drawDirection);
		var popScreenCoords = Camera.main.WorldToScreenPoint(popWorldCoordsPosition);
		
		var popFrame = Rect(popScreenCoords.x-25,Screen.height-popScreenCoords.y,40,25);
		GUI.Label(popFrame,"P: " + population.ToString(),displayStyle);
		drawDirection = rotation*drawDirection;
		
		// Draw Might
		popWorldCoordsPosition = transform.TransformPoint(drawDirection);
		popScreenCoords = Camera.main.WorldToScreenPoint(popWorldCoordsPosition);
		
		popFrame = Rect(popScreenCoords.x-25,Screen.height-popScreenCoords.y,40,25);
		GUI.Label(popFrame,"M: " + might.ToString(),displayStyle);
		drawDirection = rotation*drawDirection;
		
		// Draw Influence
		popWorldCoordsPosition = transform.TransformPoint(drawDirection);
		popScreenCoords = Camera.main.WorldToScreenPoint(popWorldCoordsPosition);
		
		popFrame = Rect(popScreenCoords.x-25,Screen.height-popScreenCoords.y,40,25);
		GUI.Label(popFrame,"I: " + influence.ToString(),displayStyle);
		drawDirection = rotation*drawDirection;
		
		// Draw Happiness
		popWorldCoordsPosition = transform.TransformPoint(drawDirection);
		popScreenCoords = Camera.main.WorldToScreenPoint(popWorldCoordsPosition);
		
		popFrame = Rect(popScreenCoords.x-25,Screen.height-popScreenCoords.y,40,25);
		GUI.Label(popFrame,"H: " + happiness.ToString(),displayStyle);
		
		// draw faith
		/*var faithWorldCoordsPosition = transform.position + .5*Vector3.up;
		var faithScreenCoords = Camera.main.WorldToScreenPoint(faithWorldCoordsPosition);
		
		var faithFrame = Rect(faithScreenCoords.x-20,Screen.height-faithScreenCoords.y,40,25);
		GUI.Label(faithFrame,"F: " + faith.ToString(),displayStyle);
		
		// draw population
		var popWorldCoordsPosition = transform.position - .5*Vector3.up;
		var popScreenCoords = Camera.main.WorldToScreenPoint(popWorldCoordsPosition);
		
		var popFrame = Rect(popScreenCoords.x-25,Screen.height-popScreenCoords.y,40,25);
		GUI.Label(popFrame,"Pop: " + population.ToString(),displayStyle);
		*/
		
		
		// Draw type
/*		var typeWorldCoordsPosition = transform.position;
		var typeScreenCoords = Camera.main.WorldToScreenPoint(typeWorldCoordsPosition);
		
		var typeFrame = Rect(typeScreenCoords.x-25,Screen.height-typeScreenCoords.y,40,25);
		GUI.Label(typeFrame,type,displayStyle); */
	}
	
	function AdjustFaith(faithToAdd: int) {
		// if this has just become ours, we want to treat it as used
		if (faith <= 0 && faithToAdd > 0)
			TurnController.UsePiece(this);
	
		faith += faithToAdd;
		
		if (faith > population)
			faith = population;
		if (faith < -population)
			faith = population;
	}
	
	function AdjustPopulation(populationToAdd: int) {
		population += populationToAdd;
		
		// cap population
		if (population < 0)
			population = 0;
			
		// cap faith
		if (faith > population)
			faith = population;
		if (faith < -population)
			faith = -population;
	}
}	