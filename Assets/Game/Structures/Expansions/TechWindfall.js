#pragma strict

/***

	Tech Windfall
	Expansion - Lab
	Req : 			M
	Workers : 		1
	Point Value:	4
	Draw Two cards when played.
	
	***/
	
class TechWindfall extends Expansion {
	function Start() {
		workers = 1;
		pointValue = 4;
		
		structureName = "Tech Windfall";
		
		helpText = "Workers: "+workers+"\n";
		
		// Draw 2 cards
		var deck = GameObject.FindObjectOfType(Deck) as Deck;
		deck.DrawCard();
		deck.DrawCard();
		
		super.Start();
	}
}