// import React, { useContext, useEffect, useState } from "react";
// import { StoreLocator } from "./distanceSelector";
// import { StoreContext } from "../../store/storage/StoreProvider";
// import CompareComponent from "../CompareComponent";

// export const ProductList = () => {
//   const { openPopupSlaider, isPopupOpenSlaider, selectedStores } = useContext(StoreContext);

//   useEffect(() => {
//     if (selectedStores.length === 0 && !isPopupOpenSlaider) {
//       openPopupSlaider();
//     }
//   }, [selectedStores, isPopupOpenSlaider, openPopupSlaider]);

//   if (isPopupOpenSlaider) {
//     return null; // או אפשר להחזיר <StoreLocator /> כאן אם רוצים
//   }

//   if (selectedStores.length === 0) {
//     return <div>יש לבחור סופר כדי להמשיך</div>;
    
//   }

//   return (
//     <div style={{ display: "flex", flexDirection: "row", gap: "1rem" }}>
//     <CompareComponent/>
//     </div>
//   );
// };

import React, { useContext, useEffect } from "react";
import { StoreLocator } from "./distanceSelector";
import { StoreContext } from "../../store/storage/StoreProvider";
import CompareComponent from "./CompareComponent";

export const ProductList = () => {
  const { openPopupSlaider, isPopupOpenSlaider, selectedStores } = useContext(StoreContext);

  useEffect(() => {
  console.log("selectedStores", selectedStores);
  console.log("isPopupOpenSlaider", isPopupOpenSlaider);
  if (selectedStores.length === 0 && !isPopupOpenSlaider) {
    openPopupSlaider();
        debugger

  }
}, [selectedStores, isPopupOpenSlaider, openPopupSlaider]);
    debugger

  if (selectedStores.length === 0 && isPopupOpenSlaider) {
    return (
      <div className="popup-bg">
        <div className="popup-content">
          <StoreLocator />
        </div>
      </div>
    );
  }

  if (selectedStores.length === 0) {
    return <div>יש לבחור סופר כדי להמשיך</div>;
  }
  return (
    <div style={{ display: "flex", flexDirection: "row", gap: "1rem" }}>
      <CompareComponent />
    </div>
  );
};

// import React, { useContext, useEffect, useState } from "react";
// import { StoreLocator } from "./distanceSelector";
// import { StoreContext } from "../../store/storage/StoreProvider";
// import CompareComponent from "../CompareComponent";

// export const ProductList = () => {
//   const { openPopupSlaider, isPopupOpenSlaider, selectedStores } = useContext(StoreContext);

//   useEffect(() => {
//     if (selectedStores.length === 0 && !isPopupOpenSlaider) {
//       openPopupSlaider();
//     }
//   }, [selectedStores, isPopupOpenSlaider, openPopupSlaider]);

//   if (isPopupOpenSlaider) {
//     return null; // או אפשר להחזיר <StoreLocator /> כאן אם רוצים
//   }

//   if (selectedStores.length === 0) {
//     return <div>יש לבחור סופר כדי להמשיך</div>;
    
//   }

//   return (
//     <div style={{ display: "flex", flexDirection: "row", gap: "1rem" }}>
//     <CompareComponent/>
//     </div>
//   );
// };

// import React, { useContext, useEffect } from "react";
// import { StoreLocator } from "./distanceSelector";
// import { StoreContext } from "../../store/storage/StoreProvider";
// import CompareComponent from "../CompareComponent";

// export const ProductList = () => {
//   const { openPopupSlaider, isPopupOpenSlaider, selectedStores } = useContext(StoreContext);

//   useEffect(() => {
//   console.log("selectedStores", selectedStores);
//   console.log("isPopupOpenSlaider", isPopupOpenSlaider);
//   if (selectedStores.length === 0 && !isPopupOpenSlaider) {
//     openPopupSlaider();
//   }
// }, [selectedStores, isPopupOpenSlaider, openPopupSlaider]);
//   if (isPopupOpenSlaider) {
//     return (
//       <div className="popup-bg">
//         <div className="popup-content">
//           <StoreLocator />
//         </div>
//       </div>
//     );
//   }

//   if (selectedStores.length === 0) {
//     return <div>יש לבחור סופר כדי להמשיך</div>;
//   }

//   return (
//     <div style={{ display: "flex", flexDirection: "row", gap: "1rem" }}>
//       <CompareComponent />
//     </div>
//   );
// };
// import React, { useContext, useEffect, useState } from "react";
// import { StoreLocator } from "./distanceSelector";
// import { StoreContext } from "../../store/storage/StoreProvider";

// export const ProductList = () => {
//   const {openPopupSlaider, isPopupOpenSlaider ,selectedStores} = useContext(StoreContext);
//     useEffect(() => {
//         if(selectedStores.length == 0) {
//             alert("לא בחרת סופר" + selectedStores);
//             openPopupSlaider();
//         }
//                     alert( selectedStores.length);

//     })

//   return (
//     <div style={{ display: "flex", flexDirection: "row", gap: "1rem" }}>
//             {isPopupOpenSlaider && <StoreLocator />}
//     </div>
//   );
// };
