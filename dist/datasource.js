"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
var WixPrestoDatasource = (function () {
    function WixPrestoDatasource(instanceSettings, backendSrv, templateSrv, $q) {
        this.backendSrv = backendSrv;
        this.templateSrv = templateSrv;
        this.$q = $q;
        this.name = instanceSettings.name;
        this.id = instanceSettings.id;
        this.url = instanceSettings.url;
        this.hoatname = instanceSettings.jsonData.hoatname;
        this.poatname = instanceSettings.jsonData.poatname;
        this.foo = instanceSettings;
        this.backendSrv = backendSrv;
        this.templateSrv = templateSrv;
        this.withCredentials = instanceSettings.withCredentials;
        this.headers = {
            'Content-Type': 'application/json',
            "X-Presto-User": "vitaly",
            "X-Presto-Catalog": "hive",
            "X-Presto-Schema": "captain"
        };
        console.log(instanceSettings);
    }
    WixPrestoDatasource.prototype.buildQueryParameters = function (options) {
        var _this = this;
        console.log("buildQueryParameters");
        console.log(options);
        options.targets = lodash_1.default.filter(options.targets, function (target) {
            return target.target !== 'select metric';
        });
        var targets = lodash_1.default.map(options.targets, function (target) {
            return {
                target: _this.templateSrv.replace(target.target, options.scopedVars, 'regex'),
                refId: target.refId,
                hide: target.hide,
                type: target.type || 'timeserie'
            };
        });
        options.targets = targets;
        return options;
    };
    WixPrestoDatasource.prototype.getResult = function (res, toralRes) {
        var _this = this;
        console.log("starting getResult");
        console.log(res);
        if (res.status !== 200) {
            throw new Error("got http error code " + res.status);
        }
        if (res.data.hasOwnProperty('error') === true) {
            throw new Error(res.data.error.message);
        }
        var u = new URL(res.data.nextUri);
        return this.doRequest({
            url: "" + this.url + u.pathname,
            method: 'GET'
        }).then(function (r) {
            console.log("tried to get data and got");
            console.log(r);
            if ('data' in r.data) {
                var x = r.data.data;
                toralRes.data.columns = r.data.columns;
                (_a = toralRes.data.data).push.apply(_a, x);
            }
            if ('nextUri' in r.data) {
                return _this.getResult(r, toralRes);
            }
            return _this.processQueryResult(toralRes);
            var _a;
        });
    };
    WixPrestoDatasource.prototype.query = function (options) {
        var _this = this;
        console.log("running query func:");
        console.log(options);
        console.log("the sql is " + options.targets[0].rawSql);
        var sql = this.templateSrv.replace(options.targets[0].rawSql);
        console.log("actual sql " + sql);
        return this.doRequest({
            url: this.url + "/v1/statement",
            method: 'POST',
            data: sql
        }).then(function (resp) {
            return _this.getResult(resp, { data: { columns: [], data: [] } });
        });
    };
    WixPrestoDatasource.prototype.processQueryResult = function (res) {
        function prestoToGrafanaType(grafanaType) {
            switch (grafanaType) {
                case 'bigint':
                case 'integer':
                case 'smallint':
                case 'tinyint':
                case 'decimal':
                case 'real':
                case 'double':
                    return 'number';
                case 'date':
                case 'timestamp':
                case 'time':
                    return 'date';
                default:
                    return 'string';
            }
        }
        console.log("starting processQueryResult");
        console.log(res);
        console.log(res.data.columns);
        var data = {
            columns: res.data.columns.map(function (e) {
                return { text: e.name, title: e.name, type: prestoToGrafanaType(e.type) };
            }),
            rows: res.data.data,
            "type": "table"
        };
        return { data: [data] };
    };
    WixPrestoDatasource.prototype.annotationQuery = function (options) {
        console.log("anotation query");
        console.log(options);
        throw new Error("Annotation Support not implemented yet.");
    };
    WixPrestoDatasource.prototype.metricFindQuery = function (query) {
        var _this = this;
        console.log("metric find query");
        console.log(query);
        return this.doPrestoRequest(query).then(function (resp) { return _this.getResult(resp, { data: { columns: [], data: [] } }); });
    };
    WixPrestoDatasource.prototype.doRequest = function (options) {
        options.headers = this.headers;
        console.log(options);
        return this.backendSrv.datasourceRequest(options);
    };
    WixPrestoDatasource.prototype.doPrestoRequest = function (query) {
        return this.doRequest({
            url: this.url + "/v1/statement",
            method: 'POST',
            data: query
        });
    };
    WixPrestoDatasource.prototype.testDatasource = function () {
        return this.doRequest({
            url: this.url + "/v1/statement",
            method: 'POST',
            data: 'show schemas'
        }).then(function (resp) {
            console.log(resp);
            if (resp.status === 200) {
                return { status: "success", message: "Hujak Hujak i v Productiion", title: "Pipetz!!!" };
            }
            else {
                return { status: "failure", message: "Naebnulos", title: ":(" };
            }
        });
    };
    return WixPrestoDatasource;
}());
exports.default = WixPrestoDatasource;
//# sourceMappingURL=datasource.js.map