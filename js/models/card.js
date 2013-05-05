var Card = Backbone.Model.extend({

    initialize: function() {
        console.log("Card initialized");

        this.on("change:city", function(model) {
            console.log("City name to: " + model.get("city"));
        });
    },

    defaults: {
        city: "Some City"
    }

});
