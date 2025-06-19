export function getLatestUpdatePriceFullFile(strings: string[], branch: string): string | null {

    const arr = strings
        .filter(str => str.startsWith("PriceFull") && str.includes(`-${branch}-`))
        .sort()
        .reverse();


    return arr[0] ? arr[0] : null;
};

