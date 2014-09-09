#pragma strict

/*********

	Deck Class
	
	**********/
	
class Deck extends MonoBehaviour {
	// Properties
	var hand: Card[];
	var deck: CardData[];
	
	public var CardObject: GameObject;	// used for card backgrounds
	
	private var currentCardIndex = 0;
	private var numberOfCardsInHand = 0;
	
	// Methods
	function Start() {
		//initialize deck and hand
		hand = new Card[5];
		
		for(card in hand)
			card = null;
			
		deck = new CardData[30];
		
		SetStarterDeck();
		DrawStartingHand();
	}
	
	function SetStarterDeck() {
		// Construct Shuffle Indices
		var remainingCardIndices = ArrayList();
		for(var index = 0 ; index < 30 ; index++)
			remainingCardIndices.Add(index);
	
				// todo make deck consist of test cards
		// default card is basic colony
		for(deckCard in deck)
			deckCard = new BuildBasicColony();
	
		// ConstructDeck by randomly pulling indices out.
		for (var test = 0 ; test < 15 ; test++)
		deck[RandomIndexFromIndexList(remainingCardIndices)] = BuildBasicFarm();
	}
	
	function DrawStartingHand() {
		var startingHandSize = 5;
		
		for(var cardCount = 0 ; cardCount<startingHandSize ; cardCount++) {
			DrawCard();
		}
	}
	
	function RandomIndexFromIndexList(list: ArrayList) : int {
		var randomNum = Random.Range(0,list.Count);
		var returnValue = list[randomNum];
		list.RemoveAt(randomNum);
		return returnValue;
	}
	
	function DrawCard() {
		hand[numberOfCardsInHand++] = GenerateCardObject(deck[currentCardIndex++]);
		
		LayoutHand();
	}
	
	function GenerateCardObject(data: CardData) : Card {
		var cardObject = GameObject.Instantiate(CardObject,Vector3.zero,Quaternion.LookRotation(Camera.main.transform.right,-Camera.main.transform.forward));
		var card = cardObject.GetComponent(Card);
		card.data = data;
		data.card = card;
		
		cardObject.transform.parent = Camera.main.transform;
		
		return card;
	}
	
	function LayoutHand() {
		var cardVerticalOffset = 0.0;
	
		for (card in hand) {
			if (card != null)	
				card.transform.localPosition = Vector3(2.3,0.9-cardVerticalOffset,3);
				cardVerticalOffset += 0.55;
		}
	}
	
	function RemoveCardFromHand(card: Card) {
		var cardFound = false;
	
		for (var i = 0 ; i < 5 ; i++) {
			if (cardFound) {
				// move cards down
				hand[i-1] = hand[i];
			}
		
			if (hand[i] == card) {
				// remove card
				GameObject.Destroy(card.gameObject,0);
				cardFound = true;
				numberOfCardsInHand--;
			}
		}
		
		LayoutHand();
	}
}