/// <reference path="../node_modules/grafana-sdk-mocks/app/headers/common.d.ts" />
export default class MySimpleJsonDatasource {
    private backendSrv;
    private templateSrv;
    private $q;
    id: number;
    name: string;
    url: string;
    /** @ngInject */
    constructor(instanceSettings: any, backendSrv: any, templateSrv: any, $q: any);
    query(options: any): any;
    annotationQuery(options: any): void;
    metricFindQuery(query: string): any;
    testDatasource(): any;
    mapToTextValue(result: any): any;
}
