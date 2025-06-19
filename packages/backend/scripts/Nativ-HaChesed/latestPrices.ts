export function getLatestUpdatePriceFullFile(strings: string[], branch: string): string | null {

    const arr = strings.filter(str => str.startsWith("PriceFull") && str.includes(`-${branch}-`) && str.match(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})$/));
    arr.sort((a, b) => {
    ;
        const dateA =a.slice(-12);// חותך את 12 התווים האחרונים וממיר לתאריך
        const dateB = b.slice(-12); // חותך את 12 התווים האחרונים וממיר לתאריך
        return +dateB - +dateA; // מחזיר את תוצאת ההשוואה
    })


    return arr[0]?arr[0]:null;
};

