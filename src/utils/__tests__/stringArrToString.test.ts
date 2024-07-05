import stringArrToString from "../stringArrToString";

describe('#stringArrToString', () => {
  test('should take an array of strings as input and return a comma separated list by default', () => {
    expect(stringArrToString(['foo', 'bar', 'loom'])).toEqual('foo,bar,loom');
  });

  test('when supplied a custom delimeter it should return the list separated by that limiter', () => {
    expect(stringArrToString(['foo', 'bar', 'loom'], ' ')).toEqual('foo bar loom');
    expect(stringArrToString(['foo', 'bar', 'loom'], '=')).toEqual('foo=bar=loom');
  });
});
