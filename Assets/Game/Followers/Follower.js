#pragma strict

/********

	Follower class
	
	Holds controller property, follower abilities, and folower location.
	
	*********/
	
class Follower extends SelectableComponent {
	// Properties
	public var followerName: String = "Follower";
	// controller
	public var selected: boolean = false;
	public var numberOfAbilities: int = 0;
	public var abilityTextArray: String[] = null;
	public var abilityTargets: int[] = null;
	
	public var tile: TileData;
	
	public var abilityDialogueType: AbilityDialogue;
	public var abilityDialogue: AbilityDialogue;
	
	protected var color = Color.gray;
	protected var highlightColor = Color.white;
	protected var selectedColor = Color.yellow;
	
	public var used:boolean = false;
	protected var selectedAbility: int = -1;
	
	// Methods
	
	function Select() {
		selected = true;
		renderer.material.color = selectedColor;
		
		if (!TurnController.PieceUsed(this)) {
			abilityDialogue = GameObject.Instantiate(abilityDialogueType,transform.position + .5*Vector3.up,Quaternion.LookRotation(Vector3.Cross(transform.up,Vector3.up),transform.up));
			abilityDialogue.transform.position += abilityDialogue.transform.up * 0.25;
			abilityDialogue.SetAbilities(abilityTextArray,abilityTargets,this);
		}
	}
	
	function Deselect(inheritSelection: boolean) {
		selected = false;
		renderer.material.color = color;
		
		// remove ability dialogue
		if (abilityDialogue != null) {
			GameObject.Destroy(abilityDialogue.gameObject,0);
			abilityDialogue = null;
		}
	}
	
	// highlight methods
	function OnMouseEnter() {
		if(!selected)
			renderer.material.color = highlightColor;
	}
	
	function OnMouseExit() {
		if (!selected)
			renderer.material.color = color;
	}
	
	function UseAbility(abilityIndex: int,target: MonoBehaviour) : boolean { return false; } // implemented in subclasses. Returns true if ability was successful, false if otherwise

	function MoveFollower(target: TileData,maximumDistance: int) : boolean {
		// return false if we're already on that tile or it's unwalkable
		if (target == tile || target.terrain.unwalkable)
			return false;
		else if (tile.LookForTile(target,maximumDistance,true)) {
			// move and return true
			tile.followers.Remove(this.gameObject);
			tile = target;
			tile.followers.Add(this.gameObject);
			tile.PlaceFollowers();
			
			return true;
		}
		
		// target out of range
		return false;
	}
	
	// Start this follower on a tile
	function StartOnTile(target: TileData) {
		tile = target;
		tile.followers.Add(this.gameObject);
		tile.PlaceFollowers();
	}
}