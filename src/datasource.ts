///<reference path="../node_modules/grafana-sdk-mocks/app/headers/common.d.ts" />

import _ from 'lodash';
import * as $ from 'jquery';
import { QueryCtrl } from '../dist/module';
// /Users/vitalyb/devel/typescript-template-datasource/node_modules/presto-client

export default class WixPrestoDatasource {
  id: number;
  name: string;
  foo: object;
  url: string;
  poatname: number;
  hoatname: string;
  withCredentials: boolean;
  headers: object;

  /** @ngInject */
  constructor(instanceSettings, private backendSrv, private templateSrv, private $q) {
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
      "X-Presto-User":"vitaly",
      "X-Presto-Catalog": "hive",
      "X-Presto-Schema": "captain" 
  };
    console.log(instanceSettings)
  }


  buildQueryParameters(options) {
    //remove placeholder targets
    console.log("buildQueryParameters")
    console.log(options)
    options.targets = _.filter(options.targets, target => {
      return target.target !== 'select metric';
    });

    let targets = _.map(options.targets, target => {
      return {
        target: this.templateSrv.replace(target.target, options.scopedVars, 'regex'),
        refId: target.refId,
        hide: target.hide,
        type: target.type || 'timeserie'
      };
    });

    options.targets = targets;

    return options;
  }
//TODO theere are some results in the frist response (showul check for data and collect it)
  getResult(res,toralRes) {
    console.log("starting getResult")
    console.log(res)
    // if (res.status !== 200 || res.data.hasOwnProperty('error') === true) {
    //   console.log(`status is ${res.status} and state is ${res.data.state}`)
    if (res.status !== 200) {
      throw new Error(`got http error code ${res.status}`)
    }
    if (res.data.hasOwnProperty('error') === true) {
      throw new Error(res.data.error.message)
    }
      // throw new Error("something wrong with the ressponse");
    // }
    const u = new URL(res.data.nextUri)
    return this.doRequest({
      url: `${this.url}${u.pathname}`,
      method: 'GET'
    }).then(r => {
      console.log("tried to get data and got")
      console.log(r)
      if ('data' in r.data) {
        const x = r.data.data
        toralRes.data.columns = r.data.columns
        toralRes.data.data.push(...x)
      }
      if ('nextUri' in r.data) {
        return this.getResult(r, toralRes)
      }
      return this.processQueryResult(toralRes)

      })

  }

  query(options) {
    console.log("running query func:")
    console.log(options)
    console.log(`the sql is ${options.targets[0].rawSql}`)
    const sql = this.templateSrv.replace(options.targets[0].rawSql)
    console.log(`actual sql ${sql}`)
    return this.doRequest({
      url: `${this.url}/v1/statement`,
      method: 'POST',
      data: sql
      // data: 'select id, post_date, post_content from captain_log_posts order by post_date desc limit 3'
    }).then(resp => { return this.getResult(resp, {data: {columns: [], data: []}})


    }
  )
    // throw new Error("Query Support not implemented yet.");
  }

  //Grafana types:
  //https://github.com/grafana/grafana/blob/51148709bbd33b37600229844a410ff8e261e32a/public/app/plugins/panel/table/column_options.ts#L32
  //Presto types:
  //https://github.com/prestodb/presto/blob/master/presto-spi/src/main/java/com/facebook/presto/spi/type/StandardTypes.java


  // this.columnTypes = [
  //   { text: 'Number', value: 'number' },
  //   { text: 'String', value: 'string' },
  //   { text: 'Date', value: 'date' },
  //   { text: 'Hidden', value: 'hidden' },
  // ];



  processQueryResult(res) {

    function prestoToGrafanaType(grafanaType: string): string {
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
          return 'string'
      }
    }

    console.log("starting processQueryResult")
    console.log(res)
    console.log(res.data.columns)
    let data = {
      columns: res.data.columns.map(function(e) {
        return {text: e.name,title: e.name, type: prestoToGrafanaType(e.type)};
      }),
      rows: res.data.data,
      "type": "table"
    }

    // for (let key in res.data.results) {
    //   let queryRes = res.data.results[key];

    //   if (queryRes.series) {
    //     for (let series of queryRes.series) {
    //       data.push({
    //         target: series.name,
    //         datapoints: series.points,
    //         refId: queryRes.refId,
    //         meta: queryRes.meta,
    //       });
    //     }
    //   }

    //   if (queryRes.tables) {
    //     for (let table of queryRes.tables) {
    //       table.type = 'table';
    //       table.refId = queryRes.refId;
    //       table.meta = queryRes.meta;
    //       data.push(table);
    //     }
    //   }
    // }

    return { data: [data] };
  }

  annotationQuery(options) {
    console.log("anotation query");
    console.log(options);
    throw new Error("Annotation Support not implemented yet.");
  }

  metricFindQuery(query: string) {
    console.log("metric find query");
    console.log(query);
    return this.doPrestoRequest(query).then(resp => { return this.getResult(resp, {data: {columns: [], data: []}})})
    // throw new Error("Template Variable Support not implemented yet.");
  }



  doRequest(options) {
    options.headers = this.headers;
    console.log(options)
    return this.backendSrv.datasourceRequest(options);
  }
  
  doPrestoRequest(query: string) {
    return this.doRequest({
      url: `${this.url}/v1/statement`,
      method: 'POST',
      data: query
    })
  }

  testDatasource() {

    return this.doRequest({
      // url: `http://${this.hoatname}:${this.poatname}/v1/statement`,
      url: `${this.url}/v1/statement`,
      method: 'POST',
      data: 'show schemas'
    }).then(resp => {
      console.log(resp);
      if (resp.status === 200) {
        return  { status: "success", message: "Hujak Hujak i v Productiion", title: "Pipetz!!!" };
      }
      else {
        return {status: "failure", message: "Naebnulos", title: ":("}
      }
    })
    // console.log("balabla")
    // const url = `http://${this.hoatname}:${this.poatname}/v1/statement`
    // console.log(url)
    // $.ajax({
    //   url: url,
    //   type: 'post',
    //   data: 'show shceema',
    //   headers: {
    //     "X-Presto-User":"",
    //     "X-Presto-Catalog": "hive",
    //     "X-Presto-Schema": "default" 
    //   },
    //   dataType: 'json'
    // }).done((data) => console.log(data))
    // .fail((error) => console.log(error))
    
    // .always(() => console.log("done"))  ;
    // console.log("haha")
    // // console.log(x)
    // return this.$q.when({
    //   status: 'error',
    //   message: 'Data Source is just a template and has not been implemented yet.',
    //   title: 'Error'
    // });
  }
}
