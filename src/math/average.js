"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sum_1 = require("./sum");
/**
 *
 * @param {number | number[] | any[]} values. a number, array of numbers
 * @param {Function} [fn] optional callback function to operate on each element in the array.
 * @return {number} the average value or undefined if given invalid values.
 */
function average(values, fn) {
    if (values === undefined || values === null) {
        return undefined;
    }
    if (!Array.isArray(values)) {
        values = [values];
    }
    if (!values.length) {
        return undefined;
    }
    return sum_1.sum(values, fn) / values.length;
}
exports.average = average;
