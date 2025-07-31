// import { useContext, useEffect, useState } from 'react';

// import { Store } from '@smartcart/shared/src';
// import { StoreContext } from '../../store/storage/StoreProvider';

// export default function StorePopupSelector() {
//   const [choosetedStores, setSelectedStores] = useState<Store[]>([]);
//   const [flattenedStores, setFlattenedStores] = useState<Store[]>([]);
//   const { stores, isPopupOpen, closePopup,setselectedStores } = useContext(StoreContext);

//   useEffect(() => {
//     const flat = stores.map((s: any) => s.store || s);
//     setFlattenedStores(flat);
//     setSelectedStores(flat);
//   }, [stores]);

//   if (!isPopupOpen) return null;

//   const isSelected = (store: Store) =>
//     choosetedStores.some(s => s.storePK === store.storePK);

//   const toggleStore = (store: Store) => {
//     setSelectedStores(prev =>
//       isSelected(store)
//         ? prev.filter(s => s.storePK !== store.storePK)
//         : [...prev, store]
//     );
//   };

//   const areAllSelected =
//     choosetedStores.length === flattenedStores.length && flattenedStores.length > 0;

//   const toggleSelectAll = () => {
//     if (areAllSelected) {
//       setSelectedStores([]);
//     } else {
//       setSelectedStores(flattenedStores);
//     }
//   };

//   const handleConfirm = () => {
//     if (choosetedStores.length === 0) {
//       alert('לא בחרת שום סופר');
//     } else {
//       setselectedStores(choosetedStores);
//       closePopup();
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
//       <div className="bg-white rounded-2xl shadow-xl p-8 w-[420px] space-y-4 text-right rtl max-h-[80vh] flex flex-col">
//         <h3 className="text-xl font-semibold text-gray-800">בחר סופרים בטווח:</h3>

//         <div
//           className="text-blue-600 font-medium cursor-pointer hover:underline"
//           onClick={toggleSelectAll}
//         >
//           {areAllSelected ? 'בטל בחירה של הכול' : 'בחר הכול'}
//         </div>

//         <div className="overflow-y-auto pr-1 flex-1 min-h-0">
//           <ul className="space-y-2">
//             {flattenedStores.map((store) => (
//               <li key={store.storePK}>
//                 <label className="flex items-center space-x-2">
//                   <input
//                     type="checkbox"
//                     checked={isSelected(store)}
//                     onChange={() => toggleStore(store)}
//                     className="ml-2"
//                   />
//                   <span className="text-sm text-gray-700">
//                     {store.chainName} - {store.storeName} - {store.address}
//                   </span>
//                 </label>
//               </li>
//             ))}
//           </ul>
//         </div>

//         <div className="flex justify-between mt-4">
//           <button
//             className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
//             onClick={closePopup}
//           >
//             ביטול
//           </button>
//           <button
//             className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-4 py-2 rounded hover:opacity-90 transition"
//             onClick={handleConfirm}
//           >
//             אישור
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }


import { useContext, useEffect, useState } from 'react';
import { Store } from '@smartcart/shared/src';
import { StoreContext } from 'src/store/storage/StoreProvider';

// שלושת הסופרים הקבועים
const staticStores: Store[] = [
  {
    storePK: "7290058140886-1-010",
    storeId: 10,
    chainName: "רמי לוי שיווק השקמה",
    chainId: "7290058140886",
    subChainName: "מודיעין חדש",
    subChainId: 1,
    storeName: "מודיעין חדש",
    address: "א.ת שילת",
    city: "מודיעין עילית",
    zipCode: "7318800"
  },
  {
    storePK: "7290103152017-1-028",
    storeId: 28,
    chainName: "אושר עד",
    chainId: "7290103152017",
    subChainName: "שמגר",
    subChainId: 1,
    storeName: "שמגר",
    address: "שמגר 16",
    city: "ירושלים",
    zipCode: "9446116"
  },
  {
    storePK: "7290103152017-1-031",
    storeId: 31,
    chainName: "אושר עד",
    chainId: "7290103152017",
    subChainName: "כפר סבא",
    subChainId: 1,
    storeName: "כפר סבא",
    address: "דרך הים 9",
    city: "כפר סבא",
    zipCode: "4418001"
  },
  {
    storePK: "7290058140886-1-048",
    storeId: 48,
    chainName: "רמי לוי שיווק השקמה",
    chainId: "7290058140886",
    subChainName: "עטרות",
    subChainId: 1,
    storeName: "עטרות",
    address: "קניון עטרות",
    city: "ירושלים",
    zipCode: "9711471"
    // latitude and longitude are missing in the CSV, so not included
  }
];

export default function StorePopupSelector() {
  const [choosetedStores, setchoosetedStores] = useState<Store[]>([]);
  const [flattenedStores, setFlattenedStores] = useState<Store[]>([]);
  const { stores, isPopupOpen, closePopup, setselectedStores } = useContext(StoreContext);

  useEffect(() => {
    const flat = stores.map((s: any) => s.store || s);
    setFlattenedStores(flat);
    setchoosetedStores(flat);

  }, [stores]);

  if (!isPopupOpen) return null;

  const isSelected = (store: Store) =>
    choosetedStores.some(s => s.storePK === store.storePK);

  const toggleStore = (store: Store) => {
    setchoosetedStores(prev =>
      isSelected(store)
        ? prev.filter(s => s.storePK !== store.storePK)
        : [...prev, store]
    );
  };

  const areAllSelected =
    choosetedStores.length === flattenedStores.length && flattenedStores.length > 0;

  const toggleSelectAll = () => {
    if (areAllSelected) {
      setchoosetedStores([]);
    } else {
      setchoosetedStores(flattenedStores);
    }
  };

  const handleConfirm = () => {
    if (choosetedStores.length === 0) {
      alert('לא בחרת שום סופר');
    } else {
      setselectedStores(choosetedStores);
      closePopup();
    }
  };

   return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div
        className="bg-white rounded-2xl shadow-xl p-8 w-[420px] space-y-4 text-right rtl max-h-[80vh] flex flex-col"
        style={{ transform: 'scale(1.5)' }} // הגדלה פי 1.3
      >
        <h3 className="text-xl font-semibold text-gray-800">בחר סופרים בטווח</h3>
        {/* ...existing code... */}
        <div
          className="text-blue-600 font-medium cursor-pointer hover:underline"
          onClick={toggleSelectAll}
        >
          {areAllSelected ? 'בטל בחירה של הכול' : 'בחר הכול'}
        </div>
        <div className="overflow-y-auto pr-1 flex-1 min-h-0">
          <ul className="space-y-2">
            {flattenedStores.map((store) => (
              <li key={store.storePK}>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={isSelected(store)}
                    onChange={() => toggleStore(store)}
                    className="ml-2"
                  />
                  <span className="text-sm text-gray-700">
                    {store.chainName} - {store.storeName} 
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex justify-between mt-4">
          <button
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
            onClick={closePopup}
          >
            ביטול
          </button>
          <button
            className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-4 py-2 rounded hover:opacity-90 transition"
            onClick={handleConfirm}
          >
            אישור
          </button>
        </div>
      </div>
    </div>
  );
}