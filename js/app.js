$(function(){

    // Kick it off
    var app = {};
    app.DrawView = new DeckView({
        el: $("#draw-pile"),
        collection: Draw
    });
    app.FaceUpView = new DeckView({
        el: $("#faceup-pile"),
        collection: FaceUp
    });

    // create some dummy cards!
    for (var i=0; i < 10; i++){
        var newCard = new Card({"city": "City #"+i});
        Draw.add(newCard);
    }

});
