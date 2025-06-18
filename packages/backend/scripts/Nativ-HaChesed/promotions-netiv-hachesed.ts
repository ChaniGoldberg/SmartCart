
export function getMostUpdatePromoFile(filesNames: string[], branchNumber: string): string | null {
   
    const filtered = filesNames.filter(item => item.startsWith('PromoFull'));

    const sortedFiltered = filtered.sort((a, b) => b.localeCompare(a));

        for (const item of sortedFiltered) {
        const subBranch = item.split("-");
        if (subBranch.length > 1 && subBranch[1] === branchNumber) {
            return item; 
        }
    }

    return null; 
}

