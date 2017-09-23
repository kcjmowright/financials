"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Sum the given values.
 *
 * @param {number|number[]|any} values a number or set of numbers or an object.
 * @param {Function} [fn] optional callback function to operate on each element in the array.
 * @return {number} the sum or undefined if given invalid values.
 */
function sum(values, fn) {
    if (values === undefined || values === null) {
        return undefined;
    }
    if (!Array.isArray(values)) {
        values = [values];
    }
    if (!values.length) {
        return undefined;
    }
    if (typeof values[0] !== 'number' && !fn) {
        return undefined;
    }
    return values.reduce(function (acc, value, idx, arr) { return acc + (!!fn ? fn(value, idx, arr) : value); }, 0);
}
exports.sum = sum;
