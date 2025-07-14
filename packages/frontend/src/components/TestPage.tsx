import React from 'react';
import AlternativeItemsList from '../components/AlternativeItemsList';

const TestPage = () => {
  const originalItem = {
    itemId: 1,
    name: 'קפה נמס עלית',
    amount: 20,
  };

  const alternatives = [
    { itemId: 2, name: 'קפה נמס פרימיום', amount: 18 },
    { itemId: 3, name: 'קפה נמס זול', amount: 15 },
  ];

  return (
    <div className="p-8">
      <AlternativeItemsList
        originalItem={originalItem}
        alternatives={alternatives}
      />
    </div>
  );
};

export default TestPage;
