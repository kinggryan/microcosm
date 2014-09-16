﻿#pragma strict

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
		
		// draw level and faith
		frame = Rect(screenCoords.x-20,Screen.height-screenCoords.y-20,40,25);
		GUI.Label(frame,"L:"+level+" F:"+faith,displayStyle);

		// draw progress remaining
		frame = Rect(screenCoords.x-20,Screen.height-screenCoords.y+0,40,25);
		GUI.Label(frame,"PR: "+progressRemaining,displayStyle);
	}
	
	function AdjustFaith(faithToAdd: int) {
		// if this has just become ours, we want to treat it as used
		if (faith <= 0 && faithToAdd > 0)
			TurnController.UsePiece(this);
	
		// adjust faith
		faith += faithToAdd;
	}
	
	function LevelUp() {
		// if we are level 0 or 1, we always level up. If level 2, make sure altar count is 0, ie this is still neutral
		if(progressRemaining <= 0 && (level < 2 || (altarCount == 0))) {
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
				Scorekeeper.GiveScore(1);
			}
			else if (altarCount == -2) {
				Scorekeeper.GiveScore(-1);
			}
			
			// change color based on faith
			if (altarCount < 0) {
				renderer.material.color = Color.red;
				color = Color.red;
			}
			else if (altarCount > 0) {
				renderer.material.color = Color.blue;
				color = Color.blue;
			}
			else {
				renderer.material.color = Color.gray;
				color = Color.gray;
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
}	