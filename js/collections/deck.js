var Stack = Backbone.Collection.extend({

    model: Partition,

    localStorage: new Backbone.LocalStorage("stacks"),

    initialize: function(){
        console.log("Deck initialized");
    }

});

// Create the initial deck.
var Deck = new Stack;
