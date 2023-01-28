import { getRowsForSubmittedPairing, nullSubmission } from './helpers';

describe('getRowsForSubmittedPairing', () => {
  it('should return null submission if pairing submissions is null', () => {
    expect(getRowsForSubmittedPairing(null, [], [], '0', 'jared')).toEqual(
      nullSubmission
    );
  });
});

export {};
