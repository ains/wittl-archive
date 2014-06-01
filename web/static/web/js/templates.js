this["Handlebars"] = this["Handlebars"] || {};
this["Handlebars"]["Templates"] = this["Handlebars"]["Templates"] || {};

this["Handlebars"]["Templates"]["item_template"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
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

this["Handlebars"]["Templates"]["modal_template"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n            <tr>\n                <td class=\"key\">\n                    <p>"
    + escapeExpression(((stack1 = (data == null || data === false ? data : data.key)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</p>\n                </td>\n                <td class=\"value\">\n                    <strong>"
    + escapeExpression((typeof depth0 === functionType ? depth0.apply(depth0) : depth0))
    + "</strong>\n                </td>\n            </tr>\n            ";
  return buffer;
  }

  buffer += "<div class=\"modal-body\">\n    <!--button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">&times;</button-->\n    <div class=\"details\">\n        <header>\n            <h4 class=\"title\">";
  if (helper = helpers.name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h4>\n\n            <p class=\"city\">";
  if (helper = helpers.city) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.city); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</p>\n        </header>\n        <hr/>\n        <div class=\"image-wrapper\">\n            <img class=\"item-image\" src=\"";
  if (helper = helpers.image) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.image); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\"/>\n        </div>\n        <hr/>\n        <p class=\"description\">";
  if (helper = helpers.description) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.description); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</p>\n    </div>\n\n    <div class=\"stats\">\n        <table class=\"table\">\n            <tbody>\n            ";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.sortable_attrs), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n            </tbody>\n        </table>\n    </div>\n    <div id=\"map\">\n    </div>\n</div>";
  return buffer;
  });