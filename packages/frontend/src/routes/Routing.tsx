import { Route, Routes } from "react-router-dom"
import Home from "../pages/Home"
import MapPage from "../components/MapPage"

export const Routing=()=>{
    return(
    <Routes>
<Route path="/" element={<Home/>} ></Route>
<Route path="/map" element={<MapPage/>} ></Route>
    </Routes>
    )
}

