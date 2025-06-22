export function getLatestUpdatePriceFullFile(strings: string[], branch: string): string | null {

       const sortArr= strings
        .filter(str => str.startsWith("PriceFull") && str.includes(`-${branch}-`) ) 
        .sort().
        reverse(); 


    return sortArr[0]?sortArr[0]:null;
};

