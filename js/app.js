$(function(){

    /*
     * Our basic model
     */
    var Card = Backbone.Model.extend({

        initialize: function() {
            // on update, resort
            this.on('change', function(){
                Deck.sort();
            });
        },

        defaults: {
            city: "Some City",
            partition: 0
        }

    });

    /*
     * How to display a card
     */
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
            if (Draw.contains(this.model)){
                this.model.set({"partition": 0});

                FaceUp.add(this.model);
                Draw.remove(this.model);
            }
        }

    });

    /*
     *  A collection of Cards
     */
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

    /*
     * How to display our collection
     */
    var DeckView = Backbone.View.extend({

        initialize: function (){
            console.log("DeckView initialized.");

            // this is a bit of a cop-out, using the catch all.
            this.listenTo(this.collection, 'all', this.render);

            // load the saved deck
            //Deck.fetch();
        },

        render: function(){
            // prepare the space
            this.clear();

            this.$el.append($("render"));

            // render all the partitions
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

        clear: function(){
            this.$el.html("");
        }

    });


    /*
     * Kick it off
     */
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
