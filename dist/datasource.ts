///<reference path="../node_modules/grafana-sdk-mocks/app/headers/common.d.ts" />

import _ from 'lodash';

export default class MySimpleJsonDatasource {
  id: number;
  name: string;
  url: string;

  /** @ngInject */
  constructor(instanceSettings, private backendSrv, private templateSrv, private $q) {
    this.name = instanceSettings.name;
    this.id = instanceSettings.id;
    this.url = instanceSettings.url;
  }

  query(options) {
    return this.backendSrv.datasourceRequest({
      url: this.url + '/query',
      data: options,
      method: 'POST'
    }).then(result => {
      console.log(result);
      return result;
    });
  }

  annotationQuery(options) {
    throw new Error("Annotation Support not implemented yet.");
  }

  metricFindQuery(query: string) {
    return this.backendSrv.datasourceRequest({
      url: this.url + '/search',
      data: query,
      method: 'POST',
    }).then(this.mapToTextValue);
  }

  testDatasource() {
    return this.backendSrv.datasourceRequest({
      url: this.url,
      method: 'GET'
    }).then(response => {
      if (response.status === 200) {
        return { status: "success", message: "Data source is working", title: "Success" };
      }
    });
  }

  mapToTextValue(result) {
    return _.map(result.data, (d) => {
      return { text: d, value: d };
    });
  }
}
