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
