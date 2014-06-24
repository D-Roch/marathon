define([
  "Backbone"
], function(Backbone) {
  return Backbone.Model.extend({
    idAttribute: "version",

    initialize: function(options) {
      this.options = options;
    },

    getVersion: function() {
      return Date.parse(this.get("version"));
    },

    parse: function(response) {
      return response;
    },

    url: function() {
      return "/v2/apps/" + this.options.appId + "/versions/" + this.get("version");
    }
  });
});