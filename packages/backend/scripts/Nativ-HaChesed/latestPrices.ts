export function getLatestUpdatePriceFullFile(strings: string[], branch: string): string | null {

       const sortArr= strings
        .filter(str => str.startsWith("PriceFull") && str.includes(`-${branch}-`) && str.match(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})$/)) 
        .sort().
        reverse(); 


    return sortArr[0]?sortArr[0]:null;
};

