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
	public var lineMaterial: Material;
	
	private var selected: boolean = false;
	
	protected static var devotedMinimum = 3;
	
	private static var villageIDNumber = 500;
	
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
		Scorekeeper.AddVillage(this);
		
		photonView.viewID = villageIDNumber++;
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
			
		// change color based on faith
		if (faith < 0)
			renderer.material.color = Color.red;
		else if (faith > 0)
			renderer.material.color = Color.blue;
		else
			renderer.material.color = Color.gray;
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
	
	function InfluenceAndBattleAdjacentVillages() {
		for(var currentObject in connectedVillages) {
			// get adjacent village
			var currentVillage = currentObject as Village;
			
			// spread faith and kill enemies
			if(influence > currentVillage.influence)
				currentVillage.AdjustFaith(1);
			if(might > currentVillage.might)
				currentVillage.AdjustPopulation(-1);
		}
	}
	
	function DrawVillageConnectionLines() {
		var lineRenderer : LineRenderer = gameObject.AddComponent(LineRenderer) as LineRenderer;
					
		lineRenderer.material = lineMaterial;
		lineRenderer.SetColors(Color.yellow, Color.yellow);
		lineRenderer.SetWidth(0.1,0.1);
		lineRenderer.SetVertexCount(10 * connectedVillages.Count);
		
		var currentVillageIndex = 0;
	
		for(var currentObject in connectedVillages) {
			// get adjacent village
			var currentVillage = currentObject as Village;
			var currentVillageObject = currentVillage.gameObject;
			
			var vertexPosition:Vector3 = transform.position*1.1;
			for(var i = 0 ;  i < 5 ; i++) {
				lineRenderer.SetPosition(currentVillageIndex*10 + i,vertexPosition);
				if( i < 5)
					vertexPosition = Vector3.RotateTowards(vertexPosition,currentVillageObject.transform.position*1.1,0.32,0.7);
				else
					vertexPosition = Vector3.RotateTowards(vertexPosition,transform.position*1.1,0.32,0.7);
			}

			currentVillageIndex++;
		}
	}
}	