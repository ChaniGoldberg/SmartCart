import { Route, Routes } from "react-router-dom"
import Home from "../pages/Home"
import MapPage from "../components/MapPage";
// import Login from "../pages/Login";
import Cart from "../components/Cart"
import AuthForm from "../components/authForm";
import Login from "../pages/Login";
import ProductSearchComponent from "../components/product-search-component";
import AlertsList from "../components/Notification";
import path from "path";
import UserEditComponent from "../pages/EditUser";
import StorePopupSelector from "src/components/compare/storePopupSelect";
import { StoreLocator } from "src/components/compare/distanceSelector";
import { ProductList } from "src/components/compare/compare";
import ComparePage from "src/pages/ComparePage";
import CompareComponent from "src/components/compare/CompareComponent";

export const routes = [
    { path: "/", element: <Home />, label: "בית" },
    { path: "/map", element: <MapPage />, label: "מפה" },
    { path: "/login", element: <AuthForm onClose={() => { }} />, label: "התחברות" },
    //  { path: "/login", element: <Login />, label: "התחברות" },
    { path: "/cart", element: <Cart />, label: "סל" },
    { path: "/search", element: <ProductSearchComponent />, label: "סל" },
    { path: "/notification", element: <AlertsList />, label: "ההתראות שלי" },
    { path: "/profile", element: <UserEditComponent></UserEditComponent>, label: "פרופיל" },
    { path: "/compare", element: <ComparePage />, label: "השוואת מוצר" },
    { path: "/storePopupSelector", element: <StorePopupSelector /> },
    { path: "/storeLocator", element: <StoreLocator />, label: "" },
    { path: "/productList", element: <ProductList />, label: "" },
];

export const Routing = () => {
    return (
        <Routes>
            {routes.map(({ path, element }) => (
                <Route key={path} path={path} element={element} />
            ))}
        </Routes>
    )
}

