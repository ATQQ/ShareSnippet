/**
 * 字符串数组合并
 */
export function mergeStringArr(...args: string[][]) {
    const set = new Set([''].concat.apply([], args));
    return [...set];
}