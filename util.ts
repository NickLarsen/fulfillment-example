export function toDictionary<TITEM, TVALUE>(
    items: TITEM[],
    keySelector: (item: TITEM) => string,
    valueSelector: (item: TITEM) => TVALUE
): Record<string, TVALUE> {
    return items.reduce(
        (agg, item) => {
            const key = keySelector(item);
            const value = valueSelector(item);
            agg[key] = value;
            return agg;
        },
        {} as Record<string, TVALUE>
    );
}