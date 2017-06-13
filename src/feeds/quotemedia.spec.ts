import {Quotemedia} from './quotemedia';

describe('CLASS: Quotemedia', () => {

  it('should retrieve historical quotes for NVDA', (done) => {
    new Quotemedia('NVDA').get((parsed) => {
      expect(parsed).toBeDefined();
      expect(parsed.length).toBeTruthy();
      done();
    });
  });
});
