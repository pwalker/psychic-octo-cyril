$(function(){

    // Kick it off
    var App = new DeckView;

    // create some dummy cards!
    var firstPartition = Deck.at(0);
    for (var i=0; i < 10; i++){
        var newCard = new Card({"city": "City #"+i});
        firstPartition.add(newCard);
    }

});
