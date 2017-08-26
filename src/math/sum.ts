/**
 * Sum the given values.
 *
 * @param {number|number[]} values a number or set of numbers.
 * @param {Function} [fn] optional callback function to operate on each.
 * @return {number}
 */
export function sum(values: number | number[], fn?: Function): number {
  if(!Array.isArray(values)) {
    if(typeof values !== 'number') {
      return undefined;
    }
    values = [ values ];
  }
  if(!values.length) {
    return undefined;
  }
  return values.reduce((acc, value) => acc + ( fn ? fn.call(null, value) : value ), 0);
}
