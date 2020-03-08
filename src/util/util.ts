// [1,2,0] @ 3 => [1,2,3]
// [1,2,0] @ 1 => [2,0,0]
// [1,2,0] @ 2 => [1,0,0]
// [1,2,3] @ 4 => [2,3,4]
export function windowMove<T>(newValue: T, oldValues: T[], zeroValue: T): T[] {
    let res = oldValues.slice();
    let newIndex = res.indexOf(newValue);
    if (newIndex === -1) {
        let zeroIndex = res.indexOf(zeroValue);
        if (zeroIndex === -1) {
            res.splice(0, 1);
            res.push(newValue);
        } else {
            res[zeroIndex] = newValue;
        }
    } else {
        res = res.splice(newIndex, 1);
        res.push(zeroValue);
    }
    return res
}