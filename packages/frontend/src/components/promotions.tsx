import React, { useEffect, useState } from 'react';
import { Promotion } from '@smartcart/shared/src/promotion';

interface PromotionsProps {
  storePk: string;
  storeName: string;
  chainName: string;
}

export const Promotions: React.FC<PromotionsProps> = ({ storePk ,storeName,chainName}) => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/promotions/by-id/${storePk}`);
        if (!response.ok) {
          throw new Error("שגיאה בטעינת המבצעים");
        }
        const data = await response.json();

        const withMappedFields = data.map((promo: any) => ({
          promotionId: promo.promotion_id,
          promotionDescription: promo.promotion_description,
          startDate: new Date(promo.start_date),
          endDate: new Date(promo.end_date),
          originalPrice: promo.original_price,
          discountedPrice: promo.discounted_price,
          discountAmount: promo.discount_amount,
          discountPercentage: promo.discount_percentage,
          requiresCoupon: promo.requires_coupon,
          requiresClubMembership: promo.requires_club_membership,
          remarks: promo.remarks,
        }));

        setPromotions(withMappedFields);
      } catch (err: any) {
        console.error("שגיאה בטעינת המבצעים:", err.message);
      }
    };

    fetchPromotions();
  }, [storePk]);

  return (
  <div className="p-4 max-w-4xl mx-auto text-right">
    <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
      מבצעים ברשת {chainName}, סניף {storeName}
    </h2>

    {promotions.length === 0 ? (
      <div className="text-center text-gray-600 text-lg">
        לא נמצאו מבצעים
      </div>
    ) : (
      <div className="space-y-6">
        {promotions.map((promo) => (
          <div
            key={promo.promotionId}
            className="rounded-2xl shadow-md bg-gradient-to-br from-[#e6f7f4] to-[#f1fdf8] p-6 space-y-2 border border-[#d4f1ea]"
          >
            <div className="text-lg font-bold text-gray-800 mb-2">
              {promo.promotionDescription}
            </div>

            <div className="text-sm text-gray-700">
              <span className="font-semibold">תוקף:</span>{' '}
              {promo.startDate?.toLocaleDateString()} - {promo.endDate?.toLocaleDateString()}
            </div>

            <div className="text-sm text-gray-700">
              <span className="font-semibold">מחיר מקורי:</span>{' '}
              {typeof promo.originalPrice === 'number'
                ? promo.originalPrice.toFixed(2) + ' ₪'
                : 'לא ידוע'}
            </div>

            <div className="text-sm text-gray-700">
              <span className="font-semibold">מחיר אחרי הנחה:</span>{' '}
              {typeof promo.discountedPrice === 'number'
                ? promo.discountedPrice.toFixed(2) + ' ₪'
                : 'לא ידוע'}
            </div>

            <div className="text-sm text-gray-700">
              <span className="font-semibold">הנחה:</span>{' '}
              {typeof promo.discountAmount === 'number'
                ? `${promo.discountAmount.toFixed(2)} ₪`
                : ''}
              {typeof promo.discountPercentage === 'number'
                ? ` / ${promo.discountPercentage.toFixed(2)}%`
                : ''}
            </div>

            {(promo.requiresCoupon || promo.requiresClubMembership || promo.remarks) && (
              <div className="text-sm text-gray-700 space-y-1 mt-2">
                {promo.requiresCoupon && (
                  <div className="text-red-600 font-bold">⚠ נדרש קופון</div>
                )}
                {promo.requiresClubMembership && (
                  <div className="text-red-600 font-bold">⚠ נדרשת חברות מועדון</div>
                )}
                {promo.remarks && <div>{promo.remarks}</div>}
              </div>
            )}
          </div>
        ))}
      </div>
    )}
  </div>
)

  
//   return (
//   <div className="p-4 max-w-4xl mx-auto text-right">
//     <h2 className="text-xl font-semibold text-center mb-6 text-gray-800">
//       מבצעים לדוגמה בסניף
//     </h2>

//     <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
//       {[
//         {
//           promotionId: 1,
//           promotionDescription: "מבצע על תפוחים",
//           startDate: new Date("2025-06-20"),
//           endDate: new Date("2025-06-30"),
//           originalPrice: 4.5,
//           discountedPrice: 3.5,
//           discountAmount: 1.0,
//           discountPercentage: 22.22,
//           requiresCoupon: false,
//           requiresClubMembership: false,
//           remarks: "עד גמר המלאי"
//         },
//         {
//           promotionId: 2,
//           promotionDescription: "מבצע על עגבניות",
//           startDate: new Date("2025-07-01"),
//           endDate: new Date("2025-07-10"),
//           originalPrice: 5.5,
//           discountedPrice: 4.2,
//           discountAmount: 1.3,
//           discountPercentage: 23.64,
//           requiresCoupon: true,
//           requiresClubMembership: false,
//           remarks: "בתוקף עד סוף השבוע"
//         },
//         {
//           promotionId: 3,
//           promotionDescription: "מבצע על בננות",
//           startDate: new Date("2025-07-15"),
//           endDate: new Date("2025-07-25"),
//           originalPrice: 6.0,
//           discountedPrice: 3.0,
//           discountAmount: 3.0,
//           discountPercentage: 50.0,
//           requiresCoupon: false,
//           requiresClubMembership: true,
//           remarks: "ללקוחות מועדון בלבד"
//         }
//       ].map((promo) => (
//         <div
//           key={promo.promotionId}
//           className="bg-gradient-to-br from-[#e6f7f4] to-[#f1fdf8] shadow-md rounded-2xl p-4 text-right"
//         >
//           <p className="text-gray-700 font-bold mb-1">תיאור:</p>
//           <p>{promo.promotionDescription}</p>

//           <p className="text-gray-700 font-bold mt-3">תוקף:</p>
//           <p>
//             {promo.startDate?.toLocaleDateString?.()} -{' '}
//             {promo.endDate?.toLocaleDateString?.()}
//           </p>

//           <p className="text-gray-700 font-bold mt-3">מחיר מקורי:</p>
//           <p>{promo.originalPrice.toFixed(2)} ₪</p>

//           <p className="text-gray-700 font-bold mt-3">מחיר אחרי הנחה:</p>
//           <p>{promo.discountedPrice.toFixed(2)} ₪</p>

//           <p className="text-gray-700 font-bold mt-3">הנחה:</p>
//           <p>
//             {promo.discountAmount.toFixed(2)} ₪ / {promo.discountPercentage.toFixed(2)}%
//           </p>

//           <p className="text-gray-700 font-bold mt-3">הערות:</p>
//           {promo.requiresCoupon && (
//             <p className="text-red-600 font-bold">⚠ נדרש קופון</p>
//           )}
//           {promo.requiresClubMembership && (
//             <p className="text-red-600 font-bold">⚠ נדרשת חברות מועדון</p>
//           )}
//           {promo.remarks && <p>{promo.remarks}</p>}
//         </div>
//       ))}
//     </div>
//   </div>
// );

};


