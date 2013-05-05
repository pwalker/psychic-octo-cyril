var Pile = Backbone.Collection.extend({

    model: Card,

    localStorage: new Backbone.LocalStorage("stacks"),

    initialize: function(){
        console.log("Deck initialized");
    },

    comparator: "partition",

    shuffle: function (){
        // put all cards in partition 0 into partition 1

    }

});

// Create the initial piles.
var Draw = new Pile;
var FaceUp = new Pile;
