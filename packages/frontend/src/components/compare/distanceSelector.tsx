import { useContext, useEffect, useState } from "react";
import { useUserLocation } from "../../hooks/useUserLocation";
import { Store } from "@smartcart/shared/src";
import StorePopupSelector from "./storePopupSelect";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "../../store/storage/StoreProvider";

type StoreLocatorProps = {
    onFinish?: () => void; // Optional if not always required
    // ...other props
};


export const StoreLocator: React.FC<StoreLocatorProps> = ({ onFinish }) => {
    const userLocation = useUserLocation();
    const [distance, setDistance] = useState(1);
    const { setStores, openPopup, isPopupOpen, selectedStores, closePopupSlaider } = useContext(StoreContext);

    useEffect(() => {
        const fetchStores = async () => {

            if (userLocation.latitude != null && userLocation.longitude != null) {
                const response = await fetch(
                    `http://localhost:3001/api/findStores/withLocationAndRadius/${userLocation.latitude}/${userLocation.longitude}/${distance}`
                );
                const storesData: Store[] = await response.json();
                debugger
                if (storesData.length > 0) {
                    debugger
                    setStores(storesData);
                    openPopup();
                }
            }
        };

        fetchStores();
    }, [distance]);
    const navigate = useNavigate();

    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDistance(Number(e.target.value));
    };
    const close = () => {
        if (selectedStores.length === 0) {
            alert('יש לבחור סופר כדי להמשיך');
        }
        else
            closePopupSlaider();
    };
    const close2 = () => {
        closePopupSlaider();
    }
return (
    <div
        className="p-6 bg-white shadow-2xl rounded-2xl mx-auto flex flex-col items-center justify-center"
        style={{
            maxWidth: '630px', // הקטנה בכ-30% (900px * 0.7)
            minHeight: '42vh', // הקטנה בכ-30% (60vh * 0.7)
            transform: 'scale(0.7)', // הקטנה פי 0.7
        }}
    >
        <h2 className="text-3xl font-bold text-green-700 mb-2 text-center">
            בחירת המרחק הרצוי מהבית עד הסופרים
        </h2>
        <h3 className="text-xl font-semibold text-gray-700 mb-6 text-center">
            בחר את המרחק הרצוי
        </h3>
        <label className="block mb-4 font-bold text-2xl text-gray-700 text-center">
            טווח מהבית:  {distance} ק"מ
        </label>
        <input
            type="range"
            min={1}
            max={400}
            value={distance}
            onChange={handleSliderChange}
            className="w-full accent-green-600 mb-6"
            style={{ height: '2.5rem' }}
        />
        <button
            onClick={close}
            className="w-full bg-green-600 text-white py-4 rounded-xl text-xl hover:bg-green-700 transition"
        >
            לבחירת חנויות בטווח הנבחר
        </button>
        {/* <button onClick={close2} 
        className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition">לסיום...</button> */}
        {isPopupOpen && <StorePopupSelector />}
    </div>
);
};
