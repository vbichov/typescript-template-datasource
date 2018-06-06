"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var sdk_1 = require("app/plugins/sdk");
require("./css/query_editor.css!");
var ChangeMyNameQueryCtrl = (function (_super) {
    __extends(ChangeMyNameQueryCtrl, _super);
    function ChangeMyNameQueryCtrl($scope, $injector, templateSrv) {
        var _this = _super.call(this, $scope, $injector) || this;
        _this.templateSrv = templateSrv;
        _this.defaults = {};
        console.log(_this.target);
        console.log(_this.defaults);
        _this.target.target = _this.target.target || 'select metric';
        _this.target.type = _this.target.type || 'timeserie';
        return _this;
    }
    ChangeMyNameQueryCtrl.prototype.getOptions = function (query) {
        console.log("getOptions on quety_ctrl");
        console.log(query);
        return this.datasource.metricFindQuery(query || '');
    };
    ChangeMyNameQueryCtrl.prototype.onChangeInternal = function () {
        this.panelCtrl.refresh();
    };
    ChangeMyNameQueryCtrl.templateUrl = 'partials/query.editor.html';
    return ChangeMyNameQueryCtrl;
}(sdk_1.QueryCtrl));
exports.ChangeMyNameQueryCtrl = ChangeMyNameQueryCtrl;
//# sourceMappingURL=query_ctrl.js.map