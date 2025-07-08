import { Route, Routes } from "react-router-dom"
import Home from "../pages/Home"
import MapPage from "../components/MapPage";
import Login from "../pages/Login";

export const routes = [
    { path: "/", element: <Home />, label: "בית" },
    { path: "/map", element: <MapPage />, label: "מפה" },
     { path: "/login", element: <Login />, label: "התחברות" },

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

