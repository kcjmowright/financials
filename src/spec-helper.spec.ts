import {DisplayProcessor, SpecReporter} from 'jasmine-spec-reporter';
import * as sourceMapSupport from 'source-map-support';

sourceMapSupport.install({
  environment: 'node'
});

jasmine.getEnv().clearReporters();
jasmine.getEnv().addReporter(new SpecReporter({
  customProcessors: [DisplayProcessor],
  spec: {
    displayStacktrace: true
  }
}));
