var DeckView = Backbone.View.extend({

    events: {
        "dblclick li": "dblClick"
    },

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
    },

    dblClick: function (model){
        console.log(event);
    }

});
