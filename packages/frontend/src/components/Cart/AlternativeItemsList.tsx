import React from 'react';

interface Item {
  itemId: number;
  name: string;
  amount: number;
}

interface AlternativeItemsListProps {
  originalItem: Item;
  alternatives: Item[];
}

const ItemCard: React.FC<{ item: Item; actionButton?: React.ReactNode }> = ({
  item,
  actionButton,
}) => (
  <div
    className="transition-all duration-200 cursor-pointer hover:shadow-lg"
    style={{
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '16px',
      margin: '8px 0',
      backgroundColor: '#f9f9f9',
    }}
  >
    <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
    <p className="text-gray-600">מחיר: ₪{item.amount}</p>
    {actionButton && <div className="mt-4">{actionButton}</div>}
  </div>
);

const AlternativeItemsList: React.FC<AlternativeItemsListProps> = ({
  originalItem,
  alternatives,
}) => {
  return (
    <div className="w-full max-w-3xl px-4">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">המוצר שלך</h2>
      <ItemCard item={originalItem} />

      <h3 className="text-xl font-semibold mt-8 mb-4 text-gray-700">חלופות זולות יותר</h3>
      {alternatives.map((alt) => (
        <ItemCard
          key={alt.itemId}
          item={alt}
          actionButton={
            <button
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
              onClick={() => {}}
            >
              החלף בחלופה זו
            </button>
          }
        />
      ))}
    </div>
  );
};

export default AlternativeItemsList;
