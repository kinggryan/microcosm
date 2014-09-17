class Plains extends GameTerrain {
	function Spent() {}
	
	function Initialize() {
		color = Color(1,233/255.0,175/255.0);
		name = "Plains";
	}
	
	function GiveResourcesToVillage(village: Village) {
		// exit this if it isn't this tile's controller's turn
		if(isMine != TurnController.myTurn)
			return;
	
		if(TurnController.myTurn)
			village.faith += 3;
		else
			village.faith -= 3;
	}
}

class Gems extends GameTerrain {
	function Spent() {}
	
	function Initialize() {
		color = Color(113/255.0,298/255.0,113/255.0);
		name = "Gems";
	}
	
	function GiveResourcesToVillage(village: Village) {
		// exit this if it isn't this tile's controller's turn
		if(isMine != TurnController.myTurn)
			return;
	
		for(var obj in village.connectedVillages) {
			var connectedVillage = obj as Village;
		
			if(TurnController.myTurn)
				connectedVillage.faith += 1;
			else
				connectedVillage.faith -= 1;
		}
		
		if(TurnController.myTurn)
			village.faith += 1;
		else
			village.faith -= 1;
	}
}