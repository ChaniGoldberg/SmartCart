import { Store } from "@smartcart/shared";
import { ReactNode, useState, createContext } from "react";

// סוג הנתונים של הקונטקסט
interface StoreContextType {
  stores: Store[];
  setStores: (stores: Store[]) => void;
  selectedStores: Store[];
  setselectedStores: (stores: Store[]) => void;
  isPopupOpen: boolean;
  openPopup: () => void;
  closePopup: () => void;
  isPopupOpenSlaider: boolean;
  openPopupSlaider: () => void;
  closePopupSlaider: () => void;
}

// יצירת הקונטקסט עם ערכי ברירת מחדל
export const StoreContext = createContext<StoreContextType>({
  stores: [],
  setStores: () => [],
  selectedStores: [],
  setselectedStores: () => [],
  isPopupOpen: false,
  openPopup: () => { },
  closePopup: () => { },
  isPopupOpenSlaider: false,
  openPopupSlaider: () => { },
  closePopupSlaider: () => { },
});

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [stores, setStores] = useState<Store[]>([]);
  const [selectedStores, setselectedStores] = useState<Store[]>([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false); // חדש
   const [isPopupOpenSlaider, setIsPopupOpenSlaider] = useState(false); // חדש



  const openPopup = () => setIsPopupOpen(true);   // חדש
  const closePopup = () => setIsPopupOpen(false); // חדש 



  const openPopupSlaider = () => setIsPopupOpenSlaider(true);   // חדש
  const closePopupSlaider = () => setIsPopupOpenSlaider(false); // חדש

  return (
    <StoreContext.Provider
      value={{
        stores,
        setStores,
        selectedStores,
        setselectedStores,
        isPopupOpen,
        openPopup,
        closePopup,
        isPopupOpenSlaider,
        openPopupSlaider,
        closePopupSlaider,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};
