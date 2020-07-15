/**
 * @return {string}
 */
export function AddZero(index) {
    index = index + 1;
    if (index < 10) {
        return '0' + index;
    } else return index;
}
