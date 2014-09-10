// Sphere Constructor Class
// 	Using the point prefab, this constructs the needed points of the sphere

#pragma strict

public var pointObject: GameObject = null;	// used to place points
public var subpointObject: GameObject = null;

public var lineMaterial: Material;

public var tileObject: GameObject;
public var aggVillageObject: GameObject;
public var milVillageObject: GameObject;
public var mercVillageObject: GameObject;
public var followerObject: GameObject;

// NEW STUFF
public var villageList: ArrayList;

// Other mathematical constants that should be modifiable in editor
public var radius = 3;

private var vertexAdjacencyLists: ArrayList[];
private var vertexTileLists: ArrayList[];

function Start () {
	vertexAdjacencyLists = new ArrayList[12];
	vertexTileLists = new ArrayList[12];
	
	for (var list in vertexAdjacencyLists)
		list = new ArrayList();
	for (var list in vertexTileLists)
		list = new ArrayList();
	
	villageList = new ArrayList();
	
	BuildSphere();
}

function BuildSphere() {
	// Make array of twelve key points
	var keyPoints: Vector3[] = new Vector3[12];
	
	// placement direction
	var placementDirection = Vector3.up;
	
	// Point creation loop
	for (var i = 0 ; i < 12 ; i++) {
		keyPoints[i] = transform.position + radius*placementDirection;
		
		var previousPlacementDirection = placementDirection;
		
		if (i == 0 || i == 6) {
			// modify placement Direction	
			var alpha = 2 * Mathf.Asin(1/(2*Mathf.Sin(2*Mathf.PI/5)));
			var alphaDegrees = alpha * 180 / Mathf.PI;
			placementDirection = Quaternion.AngleAxis(alphaDegrees,Vector3.right) * placementDirection;	
		}
		else if (i == 5)
			placementDirection = Vector3.down;
		else
			placementDirection = Quaternion.AngleAxis(72,Vector3.up) * placementDirection;
	} 
	
	// arrays of tiles to make villages on
	var aggTiles: ArrayList = new ArrayList();
	var milTiles: ArrayList = new ArrayList();
	var mercTiles: ArrayList = new ArrayList();
	
	
	// Draw tiles for top half of sphere
	for (var index = 1; index <= 5; index++) {
		if (index < 3 || index == 4)
			if (index == 1)
				aggTiles.Add(DrawTile(keyPoints,0,index,new TerrainForest()));
			else if (index == 4)
				milTiles.Add(DrawTile(keyPoints,0,index,new TerrainForest()));
			else 
				mercTiles.Add(DrawTile(keyPoints,0,index,new TerrainForest()));
		else
			DrawTile(keyPoints,0,index,new TerrainOcean());
			
		if (index == 3) 
			DrawTile(keyPoints,index,index+1,new TerrainOcean());
		else if(index < 5)
			DrawTile(keyPoints,index,index+1,new TerrainForest());
		else // index == 5
			DrawTile(keyPoints,index,1,new TerrainOcean());
	}
	
	// draw tiles for bottom half
	for (index = 7; index <= 11; index++) {
		if (index < 9 || index == 10)
			if (index == 7)
				aggTiles.Add(DrawTile(keyPoints,6,index,new TerrainForest()));
			else if (index == 10)
				milTiles.Add(DrawTile(keyPoints,6,index,new TerrainForest()));
			else
				mercTiles.Add(DrawTile(keyPoints,6,index,new TerrainForest()));
		else
			DrawTile(keyPoints,6,index,new TerrainOcean());
		
		if (index == 9)
			DrawTile(keyPoints,index,index+1,new TerrainOcean());
		else if(index < 11)
			DrawTile(keyPoints,index,index+1,new TerrainForest());
		else
			DrawTile(keyPoints,index,7,new TerrainOcean());
	}
	
	// Draw middle tiles
	aggTiles.Add(DrawTile(keyPoints,1,10,new TerrainForest()));
	mercTiles.Add(DrawTile(keyPoints,2,11,new TerrainForest()));
	DrawTile(keyPoints,3,7,new TerrainOcean());
	DrawTile(keyPoints,4,8,new TerrainForest());
	milTiles.Add(DrawTile(keyPoints,5,9,new TerrainForest()));
	
	DrawTile(keyPoints,1,9,new TerrainOcean());
	DrawTile(keyPoints,2,10,new TerrainForest());
	milTiles.Add(DrawTile(keyPoints,3,11,new TerrainForest()));
	aggTiles.Add(DrawTile(keyPoints,4,7,new TerrainForest()));
	mercTiles.Add(DrawTile(keyPoints,5,8,new TerrainForest()));
	
	
	// Add Villages
	for (var mercTile in mercTiles) {
		var newVillage = GameObject.Instantiate(mercVillageObject,Vector3.zero,Quaternion.identity);
		PlaceVillageOnTile(mercTile as TileData,newVillage);
	}
	
	for (var milTile in milTiles) {
		var newmilVillage = GameObject.Instantiate(milVillageObject,Vector3.zero,Quaternion.identity);
		PlaceVillageOnTile(milTile as TileData,newmilVillage);
	}
	
	for (var aggTile in aggTiles) {
		var newaggVillage = GameObject.Instantiate(aggVillageObject,Vector3.zero,Quaternion.identity);
		PlaceVillageOnTile(aggTile as TileData,newaggVillage);
	}
	
	// connect tiles
	for (var vertex = 0 ; vertex < 12; vertex++) {
		ConnectAllEdgesOfVertex(vertex);
	}
	
	// connect villages
	for (var currObject:Village in villageList) {
		var nearVillages = currObject.tile.GetAllVillagesInRange(2);
		
		currObject.connectedVillages = nearVillages;
		currObject.DrawVillageConnectionLines();
	}	
}

function MakePoints(points: Vector3[], object: GameObject) {
	for (point in points) {
		if (point != null) {
			GameObject.Instantiate(object,point,Quaternion.identity);
			yield WaitForSeconds(0.1);
		}	
	}
}

// Gaps are caused because halfway point is incorrectly calculated: we don't want to rotate around the cross product. Just halve
//		the expected angle from above

// Call this function on two points to draw a line between them
function DrawTile(array: Vector3[], index1: int, index2: int, gameTerrain: GameTerrain): TileData {
	var tile = GenerateTile(array[index1],array[index2],gameTerrain);
	AddToLists(index1,index2,tile);
	
	return tile;
}

function GenerateTile(pointA: Vector3, pointB: Vector3, gameTerrain: GameTerrain) : TileData {
		// get the cross product - we will rotate around this
	var cross = Vector3.Cross(pointA,pointB);
	
	// make subpoints
	var alpha = Mathf.Asin(1/(2*Mathf.Sin(2*Mathf.PI/5)));
	var alphaDegrees = alpha * 180 / Mathf.PI;
	
	var halfwayPoint = Quaternion.AngleAxis(alphaDegrees,cross) * pointA;
	
	// get the axis perpendicular to halfpoint
	var halfwayCross = Vector3.Cross(halfwayPoint,cross);
	
	var subpointA = Quaternion.AngleAxis(21,halfwayCross) * halfwayPoint;
	var subpointB = Quaternion.AngleAxis(-21,halfwayCross) * halfwayPoint;
	
	// add line renderer
	var tileObject: GameObject = GameObject.Instantiate(tileObject,transform.position,Quaternion.identity);
	
	var lineRenderer : LineRenderer = tileObject.AddComponent(LineRenderer);
	lineRenderer.material = lineMaterial;
	lineRenderer.SetColors(Color.gray, Color.gray);
	lineRenderer.SetWidth(0.1,0.1);
	lineRenderer.SetVertexCount(5);
	
	lineRenderer.SetPosition(0,pointA);
	lineRenderer.SetPosition(1,subpointA);
	lineRenderer.SetPosition(2,pointB);
	lineRenderer.SetPosition(3,subpointB);
	lineRenderer.SetPosition(4,pointA);  
	
	// generate mesh
	var newVertices : Vector3[] = [pointA,subpointA,subpointB,pointB];
	var newTriangles : int[] = [0,1,2,  1,2,3,  2,1,0,  3,2,1, 1,0,2]; // , 0,2,3,   3,2,0, 0,1,3,   3,1,0 
	var newNormals : Vector3[] = newVertices;	// since the vertices are based around (0,0) , the normals are the same
	var newUV: Vector2[] = new Vector2[newVertices.Length];
	
	for (var i = 0 ; i < newUV.Length ; i++) {
		newUV[i] = Vector2(newVertices[i].x,newVertices[i].z);
	}
	
	var mesh : Mesh = new Mesh ();
	tileObject.GetComponent(MeshFilter).mesh = mesh;
	mesh.vertices = newVertices;
	mesh.triangles = newTriangles;
	mesh.normals = newNormals;
	mesh.uv = newUV;
	mesh.RecalculateBounds();
	tileObject.GetComponent(MeshCollider).sharedMesh = mesh;
	
	//initiliaze tileData
	var tileData = tileObject.GetComponent(TileData) as TileData;
	tileData.terrain = gameTerrain;
	tileData.tileCenter = (pointA + pointB) / 2;
	tileData.Initialize();
	
	// give terrain tile data
	gameTerrain.tile = tileData;
	
	return tileData;
}

function AddToLists(pointA: int, pointB: int, tile: TileData) {
	// now set relevant adjacency list data
	vertexAdjacencyLists[pointA].Add(pointB);
	vertexAdjacencyLists[pointB].Add(pointA);
	vertexTileLists[pointA].Add(tile);
	vertexTileLists[pointB].Add(tile);
}

function SetAdjacentTiles(tileOne: TileData, tileTwo: TileData) {
	tileOne.AddAdjacentTile(tileTwo);
	tileTwo.AddAdjacentTile(tileOne);
}

function CheckIfConnected(vertexOne: int, vertexTwo: int) : boolean {
	if (vertexAdjacencyLists[vertexOne].Contains(vertexTwo))
		return true;
	
	return false;
}

function ConnectAllEdgesOfVertex(vertex: int) {
	// run through each connected vertex and attempt to connect it to other vertices
	for (var i = 0 ; i < vertexAdjacencyLists[vertex].Count -1; i++) {
		for (var j = i ; j < vertexAdjacencyLists[vertex].Count; j++ ) {
			if (CheckIfConnected(vertexAdjacencyLists[vertex][i],vertexAdjacencyLists[vertex][j])) {
				SetAdjacentTiles(vertexTileLists[vertex][i] as TileData,vertexTileLists[vertex][j] as TileData);
			}
		}
	}
}

function PlaceVillageOnTile(tile: TileData, village: GameObject) {
	// move village and rotate it
	village.transform.position = tile.tileCenter * 1.1;
	village.transform.up = tile.tileCenter / tile.tileCenter.magnitude;
	
	// point at each other
	var villageData = village.GetComponent(Village) as Village;
	tile.village = villageData;
	villageData.tile = tile;
	
	// add to village list
	villageList.Add(villageData);
}

function PlaceFollowerOnTile(tile: TileData, follower: GameObject) {
	// have tile palce follower
	tile.followers.Add(follower);
	tile.PlaceFollowers();
	
	// point at each other
	var followerData = follower.GetComponent(Follower) as Follower;
	followerData.tile = tile;
}