var DeckView = Backbone.View.extend({

    // bind it to a containing element
    id: "deck-view",
    tagName: "div",

    initialize: function (){
        console.log("DeckView initialized.");

        Deck.add(new Partition);
    },

    render: function(){
        var html = "rendered";

        // render each of the partitions
        Deck.each(function () {
            html = html + "another partition<br>";
        });

        // this.$el is given to us, from the id and tagName we specified earlier
        this.$el.html(html);
        return this;
    }
});
