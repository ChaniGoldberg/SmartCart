export function getLatestDate(strings: string[], branch: string): string | null {
    let latestDate: Date | null = null;
    let latestString: string | null = null;

    for (const str of strings) {
        if (str.startsWith("PriceFull")) {
            
            const subBranch = str.split("-");
            if (subBranch.length > 1 && subBranch[1] === branch) {

                const match = str.match(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})$/)
                if (match) {
                    const year = parseInt(match[1]);
                    const month = parseInt(match[2]) - 1; // months are 0-indexed in JavaScript
                    const day = parseInt(match[3]);
                    const hour = parseInt(match[4]);
                    const minute = parseInt(match[5]);
                    const date = new Date(year, month, day, hour, minute)
                    if (!latestDate || date > latestDate) {
                        latestDate = date;
                        latestString = str;
                    }
                }
            }
        }
    }

    return latestString;
};