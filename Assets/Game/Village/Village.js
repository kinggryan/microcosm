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
	
	public var startTurnPopulationChange: int = 0;
	public var startTurnFaithChange: int = 0;
	
	public var connectedVillages: ArrayList = null;
	// End new stuff
	
	public var level: int = 0;
	public var resourcesNeeded: String[] = null;
	private static var resourceNames: String[] = ["wood","metal","grain","clay","jewels"];
	public var altarCount: int = 0;
	public var progressRemaining: int = 8;
	
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
		
		// set view id
		photonView.viewID = villageIDNumber++;
		
		// set might and influence
		if (PhotonNetwork.isMasterClient ) {
			influence = Random.Range(0,2);
			might = Random.Range(0,2);
			
			photonView.RPC("InitializeMightAndInfluence",PhotonTargets.Others,might,influence);
		}
		
		// add self to scorekeeper
		Scorekeeper.AddVillage(this);
		
		// initialize resources
		ChangeResources();
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
	
		// adjust faith
		faith += faithToAdd;
		
		// cap faith
		if (faith > population)
			faith = population;
		if (faith < -population)
			faith = population;
			
		// change color based on faith
		if (faith < 0) {
			renderer.material.color = Color.red;
			color = Color.red;
		}
		else if (faith > 0) {
			renderer.material.color = Color.blue;
			color = Color.blue;
		}
		else {
			renderer.material.color = Color.gray;
			color = Color.gray;
		}
	}
	
	function AdjustPopulation(populationToAdd: int) {
		population += populationToAdd;
		
		// cap population
		if (population < 0)
			population = 0;
			
		// cap faith, strength, and influence
		faith = Mathf.Clamp(faith,-population,population);
		influence = Mathf.Clamp(influence,-population,population);
		might = Mathf.Clamp(might,-population,population);
	}
	
	function AdjustInfluence(influenceToAdd: int) {
		Debug.Log("adjusting");
		// adjust might
		influence += influenceToAdd;
		
		// cap might
		influence = Mathf.Clamp(influence,0,population);
	}
	
	function AdjustMight(mightToAdd: int) {
		// adjust might
		might += mightToAdd;
		
		// cap might
		might = Mathf.Clamp(might,0,population);
	}
	
	function AdjustHappiness(happinessToAdd: int) {
		// adjust might
		happiness += happinessToAdd;
		
		// cap might
		happiness = Mathf.Clamp(happinessToAdd,-population,population);
	}
	
	function InfluenceAndBattleAdjacentVillages() {
		if (faith > 0 && TurnController.myTurn) {
			for(var currentObject in connectedVillages) {
				// get adjacent village
				var currentVillage = currentObject as Village;
			
				// spread faith and kill enemies
				if(happiness > 0 && influence > currentVillage.influence)
					currentVillage.startTurnFaithChange += 1;
				if(happiness < 0 && might > currentVillage.might && currentVillage.faith <= 0)
					currentVillage.startTurnPopulationChange -= 1;
			}
		}
		if (faith < 0 && !TurnController.myTurn) {
			for(var currentObject in connectedVillages) {
				// get adjacent village
				var currentVillage2 = currentObject as Village;
			
				// spread faith and kill enemies
				if(happiness > 0 && influence > currentVillage2.influence)
					currentVillage2.startTurnFaithChange -= 1;
				if(happiness < 0 && might > currentVillage2.might && currentVillage2.faith >= 0)
					currentVillage2.startTurnPopulationChange -= 1;
			}
		}
	}
	
	function ChangeFaithAndPopulationForTurnStart() {
		AdjustFaith(startTurnFaithChange);
		AdjustPopulation(startTurnPopulationChange);
		
		startTurnFaithChange = 0;
		startTurnPopulationChange = 0;
	}
	
	function DrawVillageConnectionLines() {
		var lineRenderer: LineRenderer;
	
		// create new line renderer or get old one
		if (GetComponent(LineRenderer) == null)
			lineRenderer = gameObject.AddComponent(LineRenderer) as LineRenderer;
		else
			lineRenderer = gameObject.GetComponent(LineRenderer) as LineRenderer;
				
		// set its appearance		
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
	
	function ConnectToVillagesInRange() {
		var range = 3;
		
		var nearVillages = tile.GetAllVillagesInRange(range);
		
		connectedVillages = nearVillages;
		DrawVillageConnectionLines();
	}
	
	function LevelUp() {
		// if we are level 0 or 1, we always level up. If level 2, make sure altar count is 0, ie this is still neutral
		if(progressRemaining <= 0 && level < 2 || (altarCount == 0)) {
			// if faithful in either direction:
			//	-increase / decrease altar count
			//	- increase level
			//	- change resources
			//	- reset faith
			//	- if altarCount is > 1 or < -1, tell scorekeeper
			if (faith == 0) {
				progressRemaining = 0;
				return;
			}
				
			if(faith > 0) {
				altarCount++;
				faith = 2;
			}
			else if (faith < 0) {
				altarCount--;
				faith = -2;
			}
			
			level++;
			ChangeResources();
			progressRemaining = 8 + 4*level;
			
			if (altarCount == 2) {
				// todo tell scorekeeper
			}
			else if (altarCount == -2) {
				// tell scorekeeper
			}
		}
	}
	
	function ChangeResources() {
		// Create indices for randomness
		var indexList = ArrayList();
		for(var i = 0 ; i < 5 ; i++)
			indexList.Add(i);
		
		var numberOfNeededResources: int = 0;
		if(level == 0)
			numberOfNeededResources = 2;
		else
			numberOfNeededResources = 3;
		
		// refresh resources array
		resourcesNeeded = new String[numberOfNeededResources];
		
		// generate needed resources
		for(var resourceIndex = 0; resourceIndex < numberOfNeededResources; resourceIndex++) {
			var index = Random.Range(0,indexList.Count);
			indexList.RemoveAt(index);
			
			resourcesNeeded[resourceIndex] = resourceNames[index];
		}
	}
	
	@RPC
	function InitializeMightAndInfluence(mightSet : int, influenceSet:int) {
		might = mightSet;
		influence = influenceSet;
	}
}	