
// The purpose of this app is create a *perfect memory* for a deck of cards in
// the boardgame _Pandemic_.  This is necessary because it is really difficult
// to win the game!  Also, in the spirit of the game, I think that trying to
// solve the issues facing the players with their skills (i.e. l33t computer
// programming) is probably OK.

$(function(){

    // The Card Model
    // --------------
    var Card = Backbone.Model.extend({

        initialize: function() {
        },

        // Each card will represent a city.  There is nothing else on a card but
        // a city name.  We also want to keep track of what layer of the deck
        // we *think* the card is in.
        defaults: {
            city: "Some City",
            layer: 0
        }

    });

    // A Collection of Cards
    // ---------------------
    var Pile = Backbone.Collection.extend({

        // Tell the collection what model we are using
        model: Card,

        // This is specific to the backbone.localStorage.js.
        // TODO how would you specify a real backend?
        localStorage: new Backbone.LocalStorage("stacks"),

        initialize: function(){
            // Hooray for debugging
            console.log("Deck initialized");
        },

        // Tell Backbone.Collection what to do to sort the collection.
        // This could be a function, comparator or compareTo, but we have here
        // an attribute on the model.
        comparator: "layer",

        shuffle: function (){
            // put all cards in layer 0 into layer 1

        }

    });
    // Create the initial piles.
    var Draw = new Pile();
    var FaceUp = new Pile();

    // Display a Card
    // --------------
    var CardView = Backbone.View.extend({

        tagName: "li",

        events: {
            "dblclick": "draw"
        },

        initialize: function (){
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'destroy', this.remove);

            // this is in the initialize because we need the DOM.
            this.template = _.template($("#card-template").html());
        },

        render: function () {
            // get JSON of attributes, render template, put in $el
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        },

        // maybe move the card to the faceup pile
        draw: function (event){
            // Debugging
            console.log('draw '+this.model.get('city'));
            // Lets just rethrow this event, but pass along the model.  Hopefully
            // something with knowledge of the two decks will hear this, and
            // move the card accordingly.
            this.model.trigger('draw', this.model);
        }

    });

    // Display a collection of cards
    // -----------------------------
    var DeckView = Backbone.View.extend({

        initialize: function (){
            console.log("DeckView initialized.");

            // this is a bit of a cop-out, using the catch all.
            this.listenTo(this.collection, 'all', this.render);

            // We might hear from a card in this collection that it has been drawn!
            // if thats true, this is more appropriate place to deal with it.
            this.listenTo(this.collection, 'draw', this.drawCard);

            // load the saved deck
            //Deck.fetch();
        },

        render: function(){
            // prepare the space
            this.clear();

            this.$el.append($("render"));

            // render all the layers
            if (typeof this.collection !== "undefined"){
                this.collection.each(function(card){
                    // render all the cards
                    var view = new CardView({model: card});
                    this.$el.append(view.render().el);
                }, this);
            }

            // I don't think we need to do much here.
            return this;
        },

        // Maybe move the given card from the Draw pile to the FaceUp pile.
        drawCard: function(card){
            // "Drawing" only goes one way, from the Draw pile to the FaceUp pile
            if (Draw.contains(card)){
                // Follow along in the console
                console.log('drawing '+card.get("city"));

                // The Layer isn't important in the FaceUp pile.
                card.set({"layer": 0});

                // Perform the move.
                FaceUp.add(card);
                Draw.remove(card);
            }
        },

        clear: function(){
            this.$el.html("");
        }

    });


    // Kick it off
    // -----------
    var app = {};
    app.DrawView = new DeckView({
        el: $("#draw-pile"),
        collection: Draw
    });
    app.FaceUpView = new DeckView({
        el: $("#faceup-pile"),
        collection: FaceUp
    });

    // TODO move this click and callback into an AppView!
    $("#shuffle-faceup").click(function(){
        // increase all layer #'s in drawpile
        Draw.each(function(model){
            model.set({ "layer": model.get("layer")+1 });
        });

        // move everything in faceup to draw
        while (FaceUp.size() > 0){
            Draw.add(FaceUp.pop());
        }
        
    });

    // create some dummy cards!
    var cities = ["Los Angeles", "San Francisco", "Shanghai", "Beijing", "Atlanta", "New York", "Chicago", "London", "Paris", "Sydney", "Tehran", "Bolgota", "Hong Kong", "Tokyo", "Lima", "Johannesburg", "Cairo", "St. Petersburg"];
    for (var i=0; i < cities.length; i++){
        var newCard = new Card({"city": cities[i]});
        Draw.add(newCard);
    }

});
