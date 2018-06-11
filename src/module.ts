import WixPrestoDatasource from './datasource';
import {WixPrestoQueryCtrl} from './query_ctrl';
import {WixPrestoConfigCtrl} from './config_ctrl';

class WixPrestoAnnotationsQueryCtrl {
  static templateUrl = 'partials/annotations.editor.html';
}

export {
  WixPrestoDatasource as Datasource,
  WixPrestoQueryCtrl as QueryCtrl,
  WixPrestoConfigCtrl as ConfigCtrl,
  WixPrestoAnnotationsQueryCtrl as AnnotationsQueryCtrl,
};
