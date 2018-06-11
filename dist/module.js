"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var datasource_1 = require("./datasource");
exports.Datasource = datasource_1.default;
var query_ctrl_1 = require("./query_ctrl");
exports.QueryCtrl = query_ctrl_1.WixPrestoQueryCtrl;
var config_ctrl_1 = require("./config_ctrl");
exports.ConfigCtrl = config_ctrl_1.WixPrestoConfigCtrl;
var WixPrestoAnnotationsQueryCtrl = (function () {
    function WixPrestoAnnotationsQueryCtrl() {
    }
    WixPrestoAnnotationsQueryCtrl.templateUrl = 'partials/annotations.editor.html';
    return WixPrestoAnnotationsQueryCtrl;
}());
exports.AnnotationsQueryCtrl = WixPrestoAnnotationsQueryCtrl;
//# sourceMappingURL=module.js.map