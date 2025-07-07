import ItemService from "../itemService";

export async function SearchForProductByName(name: string) {
  const itemService = new ItemService();
    const allItems = await itemService.getAllItem();
    let goodItems = []
    for (const item of allItems) {
        if (item.itemName.includes(name))
            goodItems.push(item);
        else 
        if (item.manufacturerItemDescription.includes(name))
            goodItems.push(item);
    }
    return goodItems;
}

