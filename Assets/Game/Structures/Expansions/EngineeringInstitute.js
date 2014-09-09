#pragma strict

/***

	Engineering Institute
	Expansion - Lab
	Req : 			MM
	Workers : 		3
	Point Value:	5
	Draw an additional card each turn.
	
	***/
	
class EngineeringInstitute extends Expansion {
	function Start() {
		workers = 3;
		pointValue = 5;
		
		structureName = "Engineering Institute";
		
		helpText = "Workers: "+workers+"\nDraw an additional card each turn.";
		
		super.Start();
	}
	
	function StartTurn() {
		// Draw card
		var deck = GameObject.FindObjectOfType(Deck) as Deck;
		deck.DrawCard();
		
		super.StartTurn();
	}
}