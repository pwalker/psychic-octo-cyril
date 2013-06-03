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

    $("#shuffle-faceup").click(function(){
        // increase all partitions #'s in drawpile
        Draw.each(function(model){
            model.set({ "partition": model.get("partition")+1 });
        });

        // move everything in faceup to draw
        
    });

    // create some dummy cards!
    for (var i=0; i < 10; i++){
        var newCard = new Card({"city": "City #"+i});
        Draw.add(newCard);
    }

});
