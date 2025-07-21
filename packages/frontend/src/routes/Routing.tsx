import { Route, Routes } from "react-router-dom"
import Home from "../pages/Home"
import MapPage from "../components/MapPage";
// import Login from "../pages/Login";
import Cart from "../components/Cart"
import AuthForm from "../components/authForm";
import Login from "../pages/Login";
import ProductSearchComponent from "../components/product-search-component";

export const routes = [
    { path: "/", element: <Home />, label: "בית" },
    { path: "/map", element: <MapPage />, label: "מפה" },
     { path: "/login", element: <AuthForm onClose={() => {}}/>, label: "התחברות" },
    //  { path: "/login", element: <Login />, label: "התחברות" },
     { path: "/cart", element: <Cart />, label: "סל" },
    { path: "/search", element: <ProductSearchComponent />, label: "סל" },

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

