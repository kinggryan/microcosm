#pragma strict

/*****************

	TileData class
	
	This component should be attached to all tiles objects. Contains references to data related to the tile.
	
	********/

class TileData extends SelectableComponent {

	// Begin Properties

	public var adjacentTiles: TileData[];
	public var terrain: GameTerrain;
	public var tileCenter: Vector3;
	public var village: Village;
	public var followers: ArrayList;
	public var showText: boolean = false;

	// Static Properties
	public static var followerRowOffset = Vector3.right*0.5;
	private static var visitedTiles: ArrayList;
	private static var foundVillages: ArrayList;
	private static var displayStyle:GUIStyle = null;

	// End Properties

	// Begin Methods

	function Start() {
		// Set rendering info to terrain
		terrain.SetGraphics(renderer);
		
		// set display style
		if (displayStyle == null) {
			displayStyle = GUIStyle();
			displayStyle.fontSize = 14;
			displayStyle.wordWrap = true;
		}
	}

	// adds a tile to the end of the adjacent tile array
	function AddAdjacentTile(newTile: TileData) {
		for (var tile in adjacentTiles)
			if (tile == newTile)
				return;
			else if (tile == null) {
				tile = newTile;
				return;
			}
	}

	function Initialize() {
		// initialize adjacent tiles
		adjacentTiles = new TileData[4];
		for (var tile in adjacentTiles)
			tile = null;
		
		// init relevant children
		if (terrain != null)
			terrain.Initialize();
		
		// set up follower array list
		followers = new ArrayList();
	}

	// sets placement of followers
	function PlaceFollowers() {
		// TODO extend to multiple followers
		var followerRowWidth = .35 * (followers.Count -1);
	
		var cross = Vector3.Cross(Vector3.up,tileCenter);
		var angle = Vector3.Angle(Vector3.up,tileCenter);
		var thisFollowerOffset = Vector3(0,0,-1 * (followerRowWidth / 2));
	
		for (var follower in followers) {
			var followerObject = follower as GameObject;
			var followerRowPlacement = 1.15*tileCenter + (Quaternion.AngleAxis(angle,cross)*(followerRowOffset+thisFollowerOffset));
	
			followerObject.transform.position = followerRowPlacement;
			followerObject.transform.rotation = Quaternion.LookRotation(Vector3.forward,Vector3.up);
			followerObject.transform.RotateAround(followerObject.transform.position,cross,angle);
		
			if (followers.Count > 1)
				thisFollowerOffset += Vector3(0,0,followerRowWidth/(followers.Count - 1));
		}
	}
	
	function LookForTile(target: TileData, distance: int,mustBeWalkable: boolean ) : boolean {
		PurgeVisitedTiles();
		var returnValue = RecursivelyLookForTile(target,distance,mustBeWalkable);
		PurgeVisitedTiles();
		return returnValue;
	}
	
	function PurgeVisitedTiles() {
		if(visitedTiles == null)
			visitedTiles = new ArrayList();
		else
			visitedTiles.Clear();
	}
	
	function PurgeFoundVillages() {
		foundVillages = new ArrayList();
	}
	
	function RecursivelyLookForTile(target: TileData, distance: int,mustBeWalkable: boolean) : boolean {
		// todo make revisiting work
		// don't revisit tiles
	/*	if (visitedTiles.Contains(this)) {
			return false;
		}
		else
			visitedTiles.Add(this); */
			
		// don't traverse unwalkable tiles if we can't
		if(terrain.unwalkable && mustBeWalkable)
			return false;
	
		// found it
		if (this == target) {
			return true;
		}
		
		// if we didn't just catch it and distance is 0, then this isn't it
		if (distance == 0)
			return false;
		
		// recursive call	
		for (neighborTile in adjacentTiles) {
			if (neighborTile.RecursivelyLookForTile(target,distance - 1,mustBeWalkable))
				return true;
		
		}
		
		// else, we didn't find it so return false
		return false;
	}
	
	function GetAllVillagesInRange(range: int) : ArrayList {
		PurgeFoundVillages();
		RecursivelyFindAllVillages(range);
		return foundVillages;
	}
	
	function RecursivelyFindAllVillages(distance: int) {
		// todo make revisiting work
			
		// found new village
		if (village != null)
			if(!foundVillages.Contains(village))
				foundVillages.Add(village);
		
		// if we didn't just catch it and distance is 0, then this isn't it
		if (distance == 0 || terrain.unwalkable == true )
			return;
		
		// recursive call	
		for (neighborTile in adjacentTiles)
			neighborTile.RecursivelyFindAllVillages(distance - 1);
		
		// else, we didn't find it so return false
		return;
	}
	
	function OnMouseEnter() {
		showText = true;
	}
	
	function OnMouseExit() {
		showText = false;
	}
	
	function OnGUI() {
		if (showText) {
			var textScreenOrigin = Camera.main.WorldToScreenPoint(tileCenter);
			textScreenOrigin.y = Screen.height - textScreenOrigin.y;
			
			var textRect = Rect(textScreenOrigin.x - 45,textScreenOrigin.y-30,90,100);
			
			GUI.Label(textRect,terrain.helpText,displayStyle);
		}
		
		if (!Physics.Linecast(1.1*tileCenter,Camera.main.transform.position) && displayStyle != null) {
			// Draw resources
			var localizationRotation = Quaternion.FromToRotation(Vector3.up,tileCenter.normalized);
			var drawDirection = localizationRotation*Vector3.right*0.4;
			var rotation = Quaternion.AngleAxis(360/5,tileCenter);
	
			// draw wood
			if(terrain.wood > 0) {
	//			Debug.Log("Font is null " + (displayStyle.font == null));
//				displayStyle.font.material.color = Color(1,1,0);
				var worldCoords = tileCenter+drawDirection;
				var screenCoords = Camera.main.WorldToScreenPoint(worldCoords);
		
				var frame = Rect(screenCoords.x-20,Screen.height-screenCoords.y,40,25);
				GUI.Label(frame,"W: " + terrain.wood.ToString(),displayStyle);
				drawDirection = rotation*drawDirection;
			}
		
			// Draw metal
			if(terrain.metal > 0) {
//				displayStyle.font.material.color = Color.gray;
				worldCoords = tileCenter+drawDirection;
				screenCoords = Camera.main.WorldToScreenPoint(worldCoords);
		
				frame = Rect(screenCoords.x-20,Screen.height-screenCoords.y,40,25);
				GUI.Label(frame,"M: " + terrain.metal.ToString(),displayStyle);
				drawDirection = rotation*drawDirection;
			}
		
			// Draw grain
			if(terrain.grain > 0) {
//				displayStyle.font.material.color = Color.yellow;
				worldCoords = tileCenter+drawDirection;
				screenCoords = Camera.main.WorldToScreenPoint(worldCoords);
			
				frame = Rect(screenCoords.x-20,Screen.height-screenCoords.y,40,25);
				GUI.Label(frame,"G: " + terrain.grain.ToString(),displayStyle);
				drawDirection = rotation*drawDirection;
			}
		
			// Draw clay
			if(terrain.clay > 0) {
	//			displayStyle.font.material.color = Color(0.9,0.6,0);
				worldCoords = tileCenter+drawDirection;
				screenCoords = Camera.main.WorldToScreenPoint(worldCoords);
		
				frame = Rect(screenCoords.x-20,Screen.height-screenCoords.y,40,25);
				GUI.Label(frame,"C: " + terrain.clay.ToString(),displayStyle);
				drawDirection = rotation*drawDirection;
			}
		
			// Draw jewels
			if(terrain.jewels > 0) {
//				displayStyle.font.material.color = Color.white;
				worldCoords = tileCenter+drawDirection;
				screenCoords = Camera.main.WorldToScreenPoint(worldCoords);
		
				frame = Rect(screenCoords.x-20,Screen.height-screenCoords.y,40,25);
				GUI.Label(frame,"J: " + terrain.jewels.ToString(),displayStyle);
			}
			
//displayStyle.font.material.color = Color.black;
		}
	}
}