export function getNormalizedPrice(price: string): number {
    if (price) {
        var normalizedString = price.replace(/\s/g, '');
        if (normalizedString) {
            return parseFloat(normalizedString);
        }
    }
    return 0;
}