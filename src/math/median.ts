/**
 *
 * @param {number | number[] | any[]} values
 * @param {Function} [fn] optional callback function to operate on each element in the array.
 * @return {number} The median value or undefined if given invalid values.
 */
export function median(values: number | number[] | any[], fn?: (value: any, index: number, array: any[]) => number): number {
  if(values === undefined || values === null) {
    return undefined;
  }
  if(!Array.isArray(values)) {
    values = [values];
  }
  if(!values.length) {
    return undefined;
  }
  if(typeof values[0] !== 'number' && !fn) {
    return undefined;
  }
  if(typeof values[0] === 'object') {
    values = (<any[]>values).map(fn);
  }
  let midIndex = Math.floor(values.length / 2);

  (<number[]>values).sort((a, b) => ( a === b ) ? 0 : a > b ? -1 : 1 );
  if(values.length % 2 === 0) {
    return (values[ midIndex ] + values[ midIndex - 1 ]) / 2;
  }
  return values[ midIndex ];
}
