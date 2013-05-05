var Partition = Backbone.Collection.extend({

    model: Card,

    localStorage: new Backbone.LocalStorage("partitions"),

    initalize: function () {
        console.log("Partition initialized.");
    },

    // Sort the partition by city name
    comparator: "city"
});
