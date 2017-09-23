"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var average_1 = require("./average");
/**
 * The average of the squared differences from the mean.
 * @param {number | number[] | any[]} values data.
 * @param {(value: any, index: number, array: any[]) => number} [fn] optional callback function to operate on each element in the array.
 * @return {number} the variance.
 */
function variance(values, fn) {
    if (values === void 0) { values = []; }
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
    var avg = average_1.average(values, fn);
    return average_1.average(_.map(values, function (v, idx, arr) { return Math.pow((!!fn ? fn(v, idx, arr) : v) - avg, 2); }));
}
exports.variance = variance;
