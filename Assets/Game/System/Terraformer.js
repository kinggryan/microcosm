#pragma strict

/****

	Terraformer Class
	
	****/
	
class Terraformer extends SelectableComponent {
	//Properties
	var hasTerraformed: boolean = true;
	var tileToMake: String = "";
	
	// Methods
	function OnGUI() {
		if(TurnController.myTurn && !hasTerraformed) {
			var controller = GameObject.FindObjectOfType(InteractionController) as InteractionController;
			
			// Draw buttons
			if(GUI.Button(Rect(175,50,75,30),"Plains")) {
				controller.TerraformerClicked(this);
				
				tileToMake = "Plains";
			}
			if(GUI.Button(Rect(260,50,75,30),"Mountain")) {
				controller.TerraformerClicked(this);
				
				tileToMake = "Mountain";
			}
			if(GUI.Button(Rect(345,50,75,30),"Ocean")) {
				controller.TerraformerClicked(this);
				
				tileToMake = "Ocean";
			}
			if(GUI.Button(Rect(430,50,75,30),"River")) {
				controller.TerraformerClicked(this);
				
				tileToMake = "River";
			}
		}
	}
	
	function TerraformTile(target: TileData) : boolean{
		// if it hasn't been terraformed
		if(TurnController.myTurn && target.terrain.name == "") {
			// create terrain
			if(tileToMake == "Plains")
				target.terrain = Plains();
			else if (tileToMake == "Mountain")
				target.terrain = Mountain();
			else if (tileToMake == "Ocean") {
				target.terrain = TerrainOcean();
				
				// draw a card when an ocean is played
				var deck = GameObject.FindObjectOfType(Deck) as Deck;
				deck.DrawCard();
			}
			else if (tileToMake == "River") {
				// if there's a village on the tile, we can't make rivers there
				if (target.village != null)
					return false;
			
				target.terrain = River();
			}
			
			target.terrain.tile = target;	
			target.terrain.Initialize();
			target.terrain.SetGraphics(target.gameObject.renderer);
			target.SetLineColor(Color.blue);
			
			photonView.RPC("TerraformAcrossNetwork",PhotonTargets.Others,target.photonView.viewID,tileToMake);
			
			// we've terraformed
			hasTerraformed = true;
			
			return true;
		}
		else
			return false;
	}
	
	@RPC
	function TerraformAcrossNetwork(targetID: int, terrainType: String) {
		var target = PhotonView.Find(targetID).GetComponent(TileData) as TileData;
		Debug.Log("target : "+target);
	
		if(terrainType == "Plains")
			target.terrain = Plains();
		else if (terrainType == "Mountain")
			target.terrain = Mountain();
		else if (terrainType == "Ocean") {
			target.terrain = TerrainOcean();
		}
		else if (tileToMake == "River")
			target.terrain = River();
				
		target.terrain.tile = target;	
		target.terrain.Initialize();
		target.terrain.SetGraphics(target.gameObject.renderer);
		target.SetLineColor(Color.red);
	}
}