
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
            layer: 1
        }

    });

    // A Collection of Cards
    // ---------------------
    var Cards = Backbone.Collection.extend({

        // Tell the collection what model we are using
        model: Card,

        initialize: function(){
            // if any element of this collection changes its level, we must resort!
            this.on('change:layer', this.sort, this);
        },

        // Tell Backbone.Collection what to do to sort the collection.
        // This could be a function, comparator or compareTo, but we have here
        // an attribute on the model.
        comparator: "layer",

        shuffle: function (){
            this.each(function(card){
                // update the attributes, and since we are iterating over the
                // entire collection, lets wait to trigger an event until we
                // are finished.
                card.set({"layer": card.get("layer")+1 }, {silent: true});
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

            // in case anyone cares
            this.trigger("shuffle");
        }
    });
    // Create the initial piles.
    var Pile = new Cards();

    // Display a Card
    // --------------
    var CardView = Backbone.View.extend({

        tagName: "tr",

        events: {
            "click .draw": "draw"
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
            // The card becomes visible, and its level reset
            this.model.set({"layer": 0});

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
            // A deckview is invalidated if the cards are sorted, or if one is drawn
            this.listenTo(this.collection, 'sort', this.render);
            this.listenTo(this.collection, 'draw', this.render);
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

            return this;
        },

        clear: function(){
            this.$el.html("");
        }

    });

    var AppView = Backbone.View.extend({
        el: $("#deck-memory"),

        events: {
            "click .shuffle": "shuffle"
        },

        initialize: function (){
            var DeckTable = new DeckView({
                el: $("#deck"),
                collection: Pile
            });
        },

        shuffle: function () {
            console.log("shuffling");
            Pile.shuffle();
        }

    });

    // Kick it off
    // -----------
    var DeckMemory = new AppView();

    // create some dummy cards!
    var cities = ["Los Angeles", "San Francisco", "Shanghai", "Beijing", "Atlanta", "New York", "Chicago", "London", "Paris", "Sydney", "Tehran", "Bolgota", "Hong Kong", "Tokyo", "Lima", "Johannesburg", "Cairo", "St. Petersburg"];
    for (var i=0; i < cities.length; i++){
        var newCard = new Card({"city": cities[i]});
        Pile.add(newCard);
    }

});
