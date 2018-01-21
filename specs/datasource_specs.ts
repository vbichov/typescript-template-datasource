import {describe, beforeEach, it, sinon, expect, angularMocks} from './lib/common';
import MySimpleJsonDatasource from '../src/datasource';
import TemplateSrvStub from './lib/template_srv_stub';
import Q from 'q';
import moment from 'moment';

describe('MySimpleJsonDatasource', () => {
  let ctx: any = {
    backendSrv: {},
    templateSrv: new TemplateSrvStub()
  };

  beforeEach(() => {
    ctx.$q = Q;
    ctx.instanceSettings = {};

    ctx.ds = new MySimpleJsonDatasource(ctx.instanceSettings, ctx.backendSrv, ctx.templateSrv, ctx.$q);
  });

  describe('When performing testDatasource', () => {
    describe('and the response works', () => {
      const response = {
        data: {
        },
        status: 200,
        statusText: 'OK'
      };

      beforeEach(() => {
        ctx.backendSrv.datasourceRequest = (options) => {
          return ctx.$q.when({data: response, status: 200});
        };
      });

      it('should return success status', () => {
        return ctx.ds.testDatasource().then((results) => {
          expect(results.status).to.equal('success');
          expect(results.message).to.equal('Data source is working');
        });
      });
    });
  });

  describe('when executing metricFindQuery called', () => {
    const response = {data: ['upper_25','upper_50','upper_75','upper_90','upper_95']};

    beforeEach(() => {
      ctx.backendSrv.datasourceRequest = (options) => {
        return ctx.$q.when(response);
      };
    });

    it('should return a list of percentiles', () => {
      return ctx.ds.metricFindQuery('').then(result => {
        expect(result[0].text).to.be('upper_25');
        expect(result[1].text).to.be('upper_50');
        expect(result[2].text).to.be('upper_75');
        expect(result[3].text).to.be('upper_90');
        expect(result[4].text).to.be('upper_95');
      });
    });

  });

  describe('When performing query', () => {
    const options = {
      range: {
        from: moment.utc('2017-08-22T20:00:00Z'),
        to: moment.utc('2017-08-22T23:59:00Z'),
      },
      targets: [
        {
          refId: 'A',
          target: 'upper_50',
          type: 'timeserie'
        }
      ]
    };

    const response = {data: [{'target': 'upper_50', 'datapoints': [[130,1516386002000]]}]};

    beforeEach(() => {
      ctx.backendSrv.datasourceRequest = (options) => {
        return ctx.$q.when(response);
      };
    });

    it('should return a list of timeseries', () => {
      return ctx.ds.query().then(result => {
        expect(result.data.length).to.be(1);
      });
    });
  });
});
