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
		hand = new Card[6];
		
		for(card in hand)
			card = null;
			
		deck = new CardData[30];
		
		SetStarterDeck();
		DrawStartingHand();
	}
	
	function SetStarterDeck() {
		// Construct Shuffle Indices
		var remainingCardIndices = ArrayList();
		for(var index = 1 ; index < 30 ; index++)
			remainingCardIndices.Add(index);
	
		// first card should be basic colony
		deck[0] = BuildBasicColony();
	
		// Construct rest of deck randomly
		// Deck list (29 cards) :
		// 		Basic Colony 			x2
		//		Housing Dome 			x2
		// 		Exploration Base 		x2
		//		Basic Farm				x5
		//		Research Facility 		x2
		//		Tech Windfall			x2
		//		Production Plant		x2
		//		Distractitorium			x2
		//		Utopia Dome				x2
		//		Space Plantation		x2
		//		Food Processing Plant	x2
		//		Engineering Institute	x2
		//		Viewing Platform		x2
		
		deck[RandomIndexFromIndexList(remainingCardIndices)] = BuildBasicColony();
		deck[RandomIndexFromIndexList(remainingCardIndices)] = BuildBasicColony();
		deck[RandomIndexFromIndexList(remainingCardIndices)] = BuildHousingDome();
		deck[RandomIndexFromIndexList(remainingCardIndices)] = BuildHousingDome();
		deck[RandomIndexFromIndexList(remainingCardIndices)] = BuildExplorationBase();
		deck[RandomIndexFromIndexList(remainingCardIndices)] = BuildExplorationBase();
		deck[RandomIndexFromIndexList(remainingCardIndices)] = BuildBasicFarm();
		deck[RandomIndexFromIndexList(remainingCardIndices)] = BuildBasicFarm();
		deck[RandomIndexFromIndexList(remainingCardIndices)] = BuildBasicFarm();
		deck[RandomIndexFromIndexList(remainingCardIndices)] = BuildBasicFarm();
		deck[RandomIndexFromIndexList(remainingCardIndices)] = BuildBasicFarm();
		deck[RandomIndexFromIndexList(remainingCardIndices)] = BuildResearchFacility();
		deck[RandomIndexFromIndexList(remainingCardIndices)] = BuildResearchFacility();
		deck[RandomIndexFromIndexList(remainingCardIndices)] = BuildTechWindfall();
		deck[RandomIndexFromIndexList(remainingCardIndices)] = BuildTechWindfall();
		deck[RandomIndexFromIndexList(remainingCardIndices)] = BuildProductionPlant();
		deck[RandomIndexFromIndexList(remainingCardIndices)] = BuildProductionPlant();
		deck[RandomIndexFromIndexList(remainingCardIndices)] = BuildDistractitorium();
		deck[RandomIndexFromIndexList(remainingCardIndices)] = BuildDistractitorium();
		deck[RandomIndexFromIndexList(remainingCardIndices)] = BuildUtopiaDome();
		deck[RandomIndexFromIndexList(remainingCardIndices)] = BuildUtopiaDome();
		deck[RandomIndexFromIndexList(remainingCardIndices)] = BuildSpacePlantation();
		deck[RandomIndexFromIndexList(remainingCardIndices)] = BuildSpacePlantation();
		deck[RandomIndexFromIndexList(remainingCardIndices)] = BuildFoodProcessingPlant();
		deck[RandomIndexFromIndexList(remainingCardIndices)] = BuildFoodProcessingPlant();
		deck[RandomIndexFromIndexList(remainingCardIndices)] = BuildEngineeringInstitute();
		deck[RandomIndexFromIndexList(remainingCardIndices)] = BuildEngineeringInstitute();
		deck[RandomIndexFromIndexList(remainingCardIndices)] = BuildViewingPlatform();
		deck[RandomIndexFromIndexList(remainingCardIndices)] = BuildViewingPlatform();
		
		// END DECKLIST
	}
	
	function DrawStartingHand() {
		var startingHandSize = 5;
		
		for(var cardCount = 0 ; cardCount<startingHandSize ; cardCount++) {
			DrawCard();
		}
		hand[5] = null;
	}
	
	function RandomIndexFromIndexList(list: ArrayList) : int {
		var randomNum = Random.Range(0,list.Count);
		var returnValue = list[randomNum];
		list.RemoveAt(randomNum);
		return returnValue;
	}
	
	function DrawCard() {
		// limit based on max handsize
		if(numberOfCardsInHand < 6) {
			hand[numberOfCardsInHand++] = GenerateCardObject(deck[currentCardIndex++]);
		
			LayoutHand();
		}
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
				card.transform.localPosition = Vector3(2.3,1.4-cardVerticalOffset,3);
				cardVerticalOffset += 0.6;
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