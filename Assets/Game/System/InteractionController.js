#pragma strict

/****

	Interaction Controller Class
	
	This class functions as the hub of user commands - when the user clicks, this class determines the target and how to handle
	the click. The class doesn't actually handle the exact results of actions - ie playing cards, using devotion abilities, etc -
	but calls relevant methods in other objects when needed.
	
	Some default behaviors:
		- When using an ability, if the user clicks an invalid target, do nothing
		- When using an ability, if the user clicks the object that activated the ability, deselect it
	
	*****/

// this class is just used to define interaction modes
static class InteractionMode {
	public var None = 0;
	
	public var DevotionAbilityTargettingVillage = 1;
	
	public var SelectingFollowerAbility = 2;
	public var FollowerAbilityTargettingTerrain = 3;
	
	public var CardTargettingVillage = 4;
	public var CardTargettingTerrain = 5;
	
	public var Terraforming = 6;
}
			
// Interaction Controller class
class InteractionController extends Photon.MonoBehaviour {
	// Properties
	
	// default to nothing selected
	private var selectedObject: SelectableComponent = null;	// the currently selected object
	private var interactionMode: int = InteractionMode.None;
	
	function Start() {
		photonView.viewID = 3;
	}
	
	function Update() {
		// on click
		if (Input.GetMouseButtonDown(0)) {
			// get collision
			var ray = Camera.main.ScreenPointToRay (Input.mousePosition);
			var hit : RaycastHit;
			if (Physics.Raycast (ray, hit, 30)) {
				var clickedObject = hit.collider.gameObject;
				GameObjectClicked(clickedObject);
			}
			else if (interactionMode != InteractionMode.Terraforming) {	//	for testing just ignore this when terraforming
				Debug.Log("Deselecting");
				interactionMode = InteractionMode.None;	// deselct if user clicked nothing
				
				if(selectedObject != null) {
					selectedObject.Deselect(true);
					selectedObject = null;
				}
			}
		}
	}
	
	// Called when you click a game object
	function GameObjectClicked(clickedObject: GameObject) {
		if (clickedObject.GetComponent(Village) != null)
			VillageClicked(clickedObject.GetComponent(Village));
		else if (clickedObject.GetComponent(TileData) != null)
			TerrainClicked(clickedObject.GetComponent(TileData));
		else if (clickedObject.GetComponent(Card) != null)
			CardClicked(clickedObject.GetComponent(Card));
	}
	
	// Called when village is clicked
	function VillageClicked(village: Village) {
		// determine what to do based on interaction mode
		switch (interactionMode) {
		case InteractionMode.None:
			if(!TurnController.PieceUsed(village)) {
				// select new object
				selectedObject = village;
				selectedObject.Select();
			
				// set mode to devotion ability
				interactionMode = InteractionMode.DevotionAbilityTargettingVillage;
			}
			
			break;
			
		case InteractionMode.DevotionAbilityTargettingVillage:
			if (village != selectedObject) {
				// activate devotion ability
				var selectedVillage = selectedObject as Village;
				selectedVillage.DevotionAbility( village );
			
				// deselect
				selectedObject.Deselect(false);
				selectedObject = null;
				interactionMode = InteractionMode.None;
			}
			else {
				// Deselect
				selectedObject.Deselect(false);
				selectedObject = null;
				interactionMode = InteractionMode.None;
			}
			
			break;
			
		case InteractionMode.CardTargettingVillage:
			// if not my turn, don't play the card
			if (!TurnController.myTurn)
				break;
			
			// cast as card
			var card = selectedObject as Card;
			
			// call ability. If it was a success, deselect; otherwise, don't
			if (card.UseAbility(village)) {
				var targetView = village.GetComponent(PhotonView) as PhotonView;
				photonView.RPC("PlayCardAcrossNetwork",PhotonTargets.Others,card.GetCardDataName(),targetView.viewID);
				interactionMode = InteractionMode.None;
				
				// have button call deselect on follower
				if(card != null)
					card.Deselect(true);
					
				selectedObject = null;
			}
			
			break;
				
		default:
			break;
		}
	}
	
	function TerrainClicked(terrain: TileData) {
		switch (interactionMode) {
			
		case InteractionMode.CardTargettingTerrain:
			if (!TurnController.myTurn)
				break;
		
			// cast as card
			var card = selectedObject as Card;
			
			// call ability. If it was a success, deselect; otherwise, don't
			if (card.UseAbility(terrain)) {
				interactionMode = InteractionMode.None;
				
				// tell other player what we've done
				if(PhotonNetwork.connected) {
					var targetView = terrain.GetComponent(PhotonView) as PhotonView;
					photonView.RPC("PlayCardAcrossNetwork",PhotonTargets.Others,card.GetCardDataName(),targetView.viewID);
				}
				
				// if the card is still in hand after being played, deselect it
				if(card != null)
					card.Deselect(true);
					
				selectedObject = null;
			}
			
			break;
			
		case InteractionMode.Terraforming:
			// cast as terraformer
			var terraformer = selectedObject as Terraformer;
			
			// call ability
			if (terraformer.TerraformTile(terrain)) {
				interactionMode = InteractionMode.None;
				
				// deselect
				terraformer.Deselect(false);
				selectedObject = null;
			}
			
		default: break;
		}
	}
	
	function CardClicked(card: Card) {
		// if we clicked this card, deselect it
		if (selectedObject == card) {
			selectedObject.Deselect(true);
			selectedObject = null;
			interactionMode = InteractionMode.None;
			return;
		}	
	
		// if we click a card, we deselect everything and select the card
		if ( selectedObject != null ) {
			// have button call deselect on follower
			selectedObject.Deselect(true);
			selectedObject = null;
		}
		
		// select and set interaction mode
		selectedObject = card;
		selectedObject.Select();
		interactionMode = card.data.targettingMode;
	}
	
	// Called when playing a card across network
	@RPC
	function PlayCardAcrossNetwork(cardName: String,targetViewID: int,info: PhotonMessageInfo) {
		Debug.Log("Opponent played card");
		// get targetted object
		var targetObject = PhotonView.Find(targetViewID).GetComponent(SelectableComponent) as SelectableComponent;
		
		// generate card data
		var cardType = System.Type.GetType(cardName);
		var cardBeingPlayed = new cardType() as CardData;
		
		// Use card's effect on target
		cardBeingPlayed.UseAbility(targetObject);
	}
	
	function TerraformerClicked(terraformer: Terraformer) {
		if(selectedObject != null)
			selectedObject.Deselect(true);
			
		selectedObject = terraformer;
		interactionMode = InteractionMode.Terraforming;
		
		Debug.Log("Terraformer Clicked");
	}
}