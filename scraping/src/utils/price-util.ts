export function getNormalizedPrice(price: string) : number
{
    var normalizedString = price.replace(/\s/g, '');
    if(normalizedString)
    {
        return parseFloat(normalizedString);
    }
    return 0;
}