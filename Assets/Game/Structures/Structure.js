/****

	Structure Class
	
	*****/
	
class Structure extends MonoBehaviour {
	// Properties
	var tile: TileData = null;
	var workers: int = 0;
	// Controller
	var structureNetwork: StructureNetwork = null;
	var childStructures: Structure[];
	
	var structureName: String = "Structure";
	var helpText:		String = "";
	
	var pointValue: int = 0;
	
	static var displayStyle : GUIStyle = null;

	var owner: PhotonPlayer;
	
	// Methods
	function Start() {
		// set display style
		if (displayStyle == null) {
			Debug.Log("setting style");
			displayStyle = GUIStyle();
			displayStyle.fontSize = 18;
		}
		
		// set color
		if (owner == PhotonNetwork.player)
			renderer.material.color = Color.blue;
		else
			renderer.material.color = Color.red;
			
		// add points
		Scorekeeper.AddScoreForPlayer(pointValue,owner);
	}
	
	function InitializeChildren() {
		childStructures = new Structure[4];
	}
	
	function GenerateResources() {
		for (var resource in tile.resources) {
			if (resource != null)
				resource.GenerateResources(structureNetwork);
		}
		
		// generate resources for children
		for (var child in childStructures) {
			if (child != null)
				child.GenerateResources();
		}
	}	// called by child classes, which also actually generate the resources
	
	function AddChildStructure(child: Structure) {
		for(var currentChild in childStructures) {
			if (currentChild == null) {
				currentChild = child;
				break;
			}
		}
	}
	
	function CreateOrJoinStructureNetwork() {
		var foundAdjacentNetwork = false;
	
		// look at adjacent tiles for a tiles
		for (connectedTile in tile.adjacentTiles) {
			// we haven't yet found an adjacent tile
			if (!foundAdjacentNetwork && connectedTile.structure != null && connectedTile.structure.owner == owner) {
				// add self to the network
				connectedTile.structure.AddChildStructure(this);
				structureNetwork = connectedTile.structure.structureNetwork;
				foundAdjacentNetwork = true;
			}
			if (foundAdjacentNetwork && connectedTile.structure != null && connectedTile.structure.structureNetwork != structureNetwork && connectedTile.structure.owner == owner) {
				// we must combine the two disjoint networks
				structureNetwork.Combine(connectedTile.structure.structureNetwork,this);
			}
		}
	}
	
	function DrawStats() {
		var namePosition = Vector3(0,0,1.1);
		var helpTextPosition = Vector3(0,0,0.7);
	
		// draw name
		var nameWorldCoords = transform.TransformPoint(namePosition);
		var nameScreencoords = Camera.main.WorldToScreenPoint(nameWorldCoords);
		
		var nameFrame = Rect(nameScreencoords.x-30,Screen.height-nameScreencoords.y,40,25);
		GUI.Label(nameFrame,structureName,displayStyle);
		
		// draw text
		var textWorldCoords = transform.TransformPoint(helpTextPosition);
		var textScreencoords = Camera.main.WorldToScreenPoint(textWorldCoords);
		
		var textFrame = Rect(textScreencoords.x-50,Screen.height-textScreencoords.y,100,100);
		GUI.Label(textFrame,helpText,displayStyle);
	}
	
	function OnGUI() {
		if (!Physics.Linecast(transform.position,Camera.main.transform.position)) {
			// if there's a straight line to the camera, draw stats
			DrawStats();
		}
	}
	
	function RefreshHelpText() {}
}