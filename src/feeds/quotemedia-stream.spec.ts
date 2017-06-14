import {QuotemediaStream} from './quotemedia-stream';

describe('CLASS: QuotemediaStream', () => {

  it('should retrieve historical quotes for NVDA', (done) => {
    new QuotemediaStream('NVDA').get((parsed) => {
      expect(parsed).toBeDefined();
      expect(parsed.length).toBeTruthy();
      done();
    });
  });
});
