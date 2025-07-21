import React, { useEffect, useState } from "react";
import { Item } from "@smartcart/shared/src/item";
interface SelectedItemsProps {
    initialItems: Item[];
    setSelectedItems: React.Dispatch<React.SetStateAction<Item[]>>
}
const SelectedItems: React.FC<SelectedItemsProps> = ({ initialItems, setSelectedItems }) => {
    const [items, setItems] = useState<Item[]>(initialItems);
    useEffect(() => {
        setSelectedItems(initialItems);
        setItems(initialItems);
    }, [initialItems]);
    const handleRemove = (itemCode: string): void => {
        setSelectedItems(prev => prev.filter(item => item.itemCode !== itemCode));
    };
    
    if (SelectedItems.length === 0) {
        return (
            <p className="text-center text-gray-500 mt-10">
                לא נבחרו מוצרים
            </p>
        );
    }
    return (
        <>
            <div className="relative bg-white border border-gray-300 rounded-lg p-4 w-full">
                <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-500 text-white text-lg font-bold">
                    {items.length}
                </div>
                <div className="font-bold text-lg">מוצרים נבחרים לתיוג</div>
            </div>

            <div className="flex flex-col w-full space-y-4 mt-4">
                {items.map((product) => (
                    <div
                        key={product.itemCode}
                        className="relative bg-white border border-gray-300 rounded-lg p-4 w-full"
                    >
                        <div className="flex flex-col text-right pr-8">
                            <h1 className="font-bold text-lg">{product.itemName}</h1>
                            {product.manufacturerName && (
                                <div className="text-gray-500 text-sm mt-0.5">
                                    {product.manufacturerName}
                                </div>
                            )}
                        </div>
                        <button
                            onClick={() => handleRemove(product.itemCode)}
                            aria-label="Remove item"
                            className="absolute bottom-6 left-5 text-gray-400 hover:text-red-600 transition-colors duration-200"
                        >
                            <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-500 text-white text-lg font-bold">
                                ×
                            </div>
                        </button>
                    </div>
                ))}
            </div>
        </>
        
    );
};
export default SelectedItems;