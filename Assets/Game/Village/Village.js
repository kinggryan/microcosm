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
	private var resourcesNeededString: String = null;
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
	public var tilesToHarvest: ArrayList = null;
	
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
		progressRemaining = 8;
		
		// Connect and draw
		ConnectToVillagesInRange();
		DrawVillageConnectionLines();
		
		// initialize tiles to harvest
		tilesToHarvest = ArrayList();
		
		// add this tile and adjacent tiles
		tilesToHarvest.Add(tile);
		for(var currentTile in tile.adjacentTiles) {
			tilesToHarvest.Add(currentTile);
		}
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
		// draw resources
		var screenCoords = Camera.main.WorldToScreenPoint(transform.position);
		
		var frame = Rect(screenCoords.x-20,Screen.height-screenCoords.y+20,40,25);
		GUI.Label(frame,resourcesNeededString,displayStyle);
		
		// draw  faith
		frame = Rect(screenCoords.x-20,Screen.height-screenCoords.y-20,40,25);
		GUI.Label(frame,"F:"+faith,displayStyle);
	}
	
	function AdjustFaith(faithToAdd: int) {
		// adjust faith
		if (level == 0) {
			faith += faithToAdd;	
		}
	}
	
	function LevelUp() {
		if(level == 0) {
			if(faith >= 21) {
				// we gain control
				renderer.material.color = Color.blue;
				level = 1;
				Scorekeeper.GiveScore(1);
			}
			else if (faith <= -21) {
				// opponent gains control
				renderer.material.color = Color.red;
				level = 1;
				Scorekeeper.GiveScore(-1);
			}
		}
	}
	
	function ChangeResources() {
		// never change resources execept on master client
		if(!PhotonNetwork.isMasterClient)
			return;
		
		resourcesNeededString = "";
	
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
			var index = indexList[Random.Range(0,indexList.Count)];
			indexList.Remove(index);
			
			resourcesNeeded[resourceIndex] = resourceNames[index];
			resourcesNeededString += resourceNames[index][0] + " ";
		}
		
		if(PhotonNetwork.connected)
			if(numberOfNeededResources > 2)
				photonView.RPC("SetResources",PhotonTargets.Others,numberOfNeededResources,resourcesNeeded[0],resourcesNeeded[1],resourcesNeeded[2],resourcesNeededString);
			else
				photonView.RPC("SetResources",PhotonTargets.Others,numberOfNeededResources,resourcesNeeded[0],resourcesNeeded[1],null,resourcesNeededString);
	}
	
	@RPC
	function SetResources(count: int, resource1: String,resource2: String,resource3: String,resourceString: String) {
		resourcesNeeded = new String[count];
		resourcesNeeded[0] = resource1;
		resourcesNeeded[1] = resource2;
		
		if (count > 2)
			resourcesNeeded[2] = resource3;
		
		resourcesNeededString = resourceString;
	}
	
	@RPC
	function InitializeMightAndInfluence(mightSet : int, influenceSet:int) {
		might = mightSet;
		influence = influenceSet;
	}
	
	function DrawVillageConnectionLines() {
		var lineRenderer : LineRenderer;
		if (gameObject.GetComponent(LineRenderer) == null)
			lineRenderer = gameObject.AddComponent(LineRenderer) as LineRenderer;
		else
			lineRenderer = gameObject.GetComponent(LineRenderer) as LineRenderer;
					
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
		connectedVillages = tile.GetAllVillagesInRange(2);
		
		// remove self
		if (connectedVillages.Contains(this))
			connectedVillages.Remove(this);
	}
	
	function Harvest() {
		for(var currentObj in tilesToHarvest) {
			var currentTile = currentObj as TileData;
			
			currentTile.terrain.GiveResourcesToVillage(this);
		}
	}
	
	function AddTileToHarvestTiles(tileToAdd: TileData) {
		if(!tilesToHarvest.Contains(tileToAdd))
			tilesToHarvest.Add(tileToAdd);
	}
}	