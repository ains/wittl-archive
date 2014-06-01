this["JST"] = this["JST"] || {};

this["JST"]["web/static/web/hbs/item_template.hbs"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, options, functionType="function", escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing;


  buffer += "<div class=\"col-sm-4 card-wrapper\">\n    <div class=\"card\">\n        <div class=\"pic\">\n            <a class=\"favourite pull-right\" href=\"#\"><i class=\"icon_star_alt\"></i></a>\n            <img src=\"";
  if (helper = helpers.card_image) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.card_image); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" title=\"Name of thing here\"/>\n        </div>\n\n        <div class=\"detail\">\n            <header class=\"col-xs-9\">\n                <h3 class=\"title\"> "
    + escapeExpression((helper = helpers.truncate || (depth0 && depth0.truncate),options={hash:{},data:data},helper ? helper.call(depth0, (depth0 && depth0.name), 12, options) : helperMissing.call(depth0, "truncate", (depth0 && depth0.name), 12, options)))
    + "</h3>\n\n                <p class=\"wittl-meta-description\">"
    + escapeExpression((helper = helpers.truncate || (depth0 && depth0.truncate),options={hash:{},data:data},helper ? helper.call(depth0, ((stack1 = (depth0 && depth0.attributes)),stack1 == null || stack1 === false ? stack1 : stack1.city), 15, options) : helperMissing.call(depth0, "truncate", ((stack1 = (depth0 && depth0.attributes)),stack1 == null || stack1 === false ? stack1 : stack1.city), 15, options)))
    + "</p>\n            </header>\n            <div class=\"user-metrics col-xs-3\">\n                <div class=\"row\">\n                    <span class=\"col-xs-6 icon_building key\"></span>\n                    <small class=\"col-xs-6 value\">25</small>\n                </div>\n                <div class=\"row\">\n                    <span class=\"col-xs-6 icon_pin_alt key\"></span>\n                    <small class=\"col-xs-6 value\">3</small>\n                </div>\n            </div>\n        </div>\n    </div>\n</div>";
  return buffer;
  });