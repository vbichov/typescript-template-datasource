///<reference path="../node_modules/grafana-sdk-mocks/app/headers/common.d.ts" />
System.register(['lodash'], function(exports_1) {
    var lodash_1;
    var MySimpleJsonDatasource;
    return {
        setters:[
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            }],
        execute: function() {
            MySimpleJsonDatasource = (function () {
                /** @ngInject */
                function MySimpleJsonDatasource(instanceSettings, backendSrv, templateSrv, $q) {
                    this.backendSrv = backendSrv;
                    this.templateSrv = templateSrv;
                    this.$q = $q;
                    this.name = instanceSettings.name;
                    this.id = instanceSettings.id;
                    this.url = instanceSettings.url;
                }
                MySimpleJsonDatasource.prototype.query = function (options) {
                    return this.backendSrv.datasourceRequest({
                        url: this.url + '/query',
                        data: options,
                        method: 'POST'
                    }).then(function (result) {
                        console.log(result);
                        return result;
                    });
                };
                MySimpleJsonDatasource.prototype.annotationQuery = function (options) {
                    throw new Error("Annotation Support not implemented yet.");
                };
                MySimpleJsonDatasource.prototype.metricFindQuery = function (query) {
                    return this.backendSrv.datasourceRequest({
                        url: this.url + '/search',
                        data: query,
                        method: 'POST',
                    }).then(this.mapToTextValue);
                };
                MySimpleJsonDatasource.prototype.testDatasource = function () {
                    return this.backendSrv.datasourceRequest({
                        url: this.url,
                        method: 'GET'
                    }).then(function (response) {
                        if (response.status === 200) {
                            return { status: "success", message: "Data source is working", title: "Success" };
                        }
                    });
                };
                MySimpleJsonDatasource.prototype.mapToTextValue = function (result) {
                    return lodash_1.default.map(result.data, function (d) {
                        return { text: d, value: d };
                    });
                };
                return MySimpleJsonDatasource;
            })();
            exports_1("default", MySimpleJsonDatasource);
        }
    }
});
//# sourceMappingURL=datasource.js.map