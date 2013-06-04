
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
            color: "red",
            layer: 0,
            faceup: false
        }

    });

    // A Collection of Cards
    // ---------------------
    var Cards = Backbone.Collection.extend({

        // Tell the collection what model we are using
        model: Card,

        initialize: function(){
            // Hooray for debugging
            console.log("Deck initialized");

            this.listenTo(this, "shuffle", this.shuffle);
        },

        // Tell Backbone.Collection what to do to sort the collection.
        // This could be a function, comparator or compareTo, but we have here
        // an attribute on the model.
        comparator: "layer",

        shuffle: function (){
            this.each(function(card){
                // To make this explicit, lets prepare the new attributes
                var newAttrs = {
                    // the layer number gets incremented unless we were faceup
                    "layer" : card.get("faceup") === true ? 0 : card.get("layer") + 1,
                    // In shuffling, everycard in the infect piles gets turned facedown
                    "faceup" : false
                };
                // update the attributes, and since we are iterating over the
                // entire collection, lets wait to trigger an event until we
                // are finished.
                card.set(newAttrs, {silent: true});
            }, this);
            
            // Our new layer and faceup values might have changed the order, let's
            // ensure its correct.
            this.sort();

            // Since we did some bulk work, and suppressed all events when updating,
            // we should still trigger something.  Luckily for us, the sort() method
            // fires off a "sort" event, which gets caught in the CardView's
            // "all" handler.
            //
            //  Otherwise a "change" even should suffice
            // this.trigger("change");
        }
    });
    // Create the initial piles.
    var Draw = new Cards();

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

            // The card becomes visible, and its level reset
            this.model.set({"faceup": true, "level": 0});

            // Lets just rethrow this event, but pass along the model.  Hopefully
            // something with knowledge of the two decks will hear this, and
            // refresh the display accordingly.
            this.model.trigger('draw', this.model);
        }

    });

    // Display a collection of cards
    // -----------------------------
    var DeckView = Backbone.View.extend({

        initialize: function (opt){
            console.log("DeckView initialized.");

            this.where = opt.where;

            // this is a bit of a cop-out, using the catch all.
            this.listenTo(this.collection, 'all', this.render);

            // We might hear from a card in this collection that it has been drawn!
            // if thats true, this is more appropriate place to deal with it.
            this.listenTo(this.collection, 'draw', this.drawCard);
        },

        render: function(){
            // prepare the space
            this.clear();

            this.$el.append($("render"));

            // render all the layers
            if (typeof this.collection !== "undefined"){
                var models = this.collection.where(this.where);
                for (var i=0; i < models.length; i++){
                    // render all the cards
                    var view = new CardView({model: models[i]});
                    this.$el.append(view.render().el);
                }
            }

            // I don't think we need to do much here.
            return this;
        },

        // Maybe move the given card from the Draw pile to the FaceUp pile.
        drawCard: function(card){
            // If a card was drawn, we should refresh the display!
            this.render();
        },

        clear: function(){
            this.$el.html("");
        },

        where: {}

    });


    // Kick it off
    // -----------
    var app = {};
    app.DrawView = new DeckView({
        el: $("#draw-pile"),
        collection: Draw,
        where: {"faceup": false}
    });
    app.FaceUpView = new DeckView({
        el: $("#faceup-pile"),
        collection: Draw,
        where: {"faceup": true}
    });

    // TODO move this click and callback into an AppView!
    $("#shuffle-faceup").click(function(){
        // increase all layer #'s in drawpile
        Draw.trigger("shuffle");
    });

    // create some dummy cards!
    var cities = ["Los Angeles", "San Francisco", "Shanghai", "Beijing", "Atlanta", "New York", "Chicago", "London", "Paris", "Sydney", "Tehran", "Bolgota", "Hong Kong", "Tokyo", "Lima", "Johannesburg", "Cairo", "St. Petersburg"];
    for (var i=0; i < cities.length; i++){
        var newCard = new Card({"city": cities[i]});
        Draw.add(newCard);
    }

});
