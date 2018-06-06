"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var datasource_1 = require("./datasource");
exports.Datasource = datasource_1.default;
var query_ctrl_1 = require("./query_ctrl");
exports.QueryCtrl = query_ctrl_1.ChangeMyNameQueryCtrl;
var config_ctrl_1 = require("./config_ctrl");
exports.ConfigCtrl = config_ctrl_1.ChangeMyNameConfigCtrl;
var ChangeMyNameAnnotationsQueryCtrl = (function () {
    function ChangeMyNameAnnotationsQueryCtrl() {
    }
    ChangeMyNameAnnotationsQueryCtrl.templateUrl = 'partials/annotations.editor.html';
    return ChangeMyNameAnnotationsQueryCtrl;
}());
exports.AnnotationsQueryCtrl = ChangeMyNameAnnotationsQueryCtrl;
//# sourceMappingURL=module.js.map