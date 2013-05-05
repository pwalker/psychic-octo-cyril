var CardView = Backbone.View.extend({

    tagName: "li",


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
    }

});
