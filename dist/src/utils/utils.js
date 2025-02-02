// TODO: LEARN HOW YOU ARE SUPPOSED TO TEST SOMETHING LIKE THIS AND ALSO CSS
export function getRatingColour(rating) {
    if (rating >= 7) {
        return 'green';
    }
    else if (rating < 7 && rating > 4) {
        return 'amber';
    }
    else {
        return 'red';
    }
}
export function roundTo1DP(number) {
    return Number(number.toFixed(1));
}
