import { Route, Routes } from "react-router-dom"
import Home from "../pages/Home"

export const Routing=()=>{
    return(
    <Routes>
<Route path="/" element={<Home/>} ></Route>
    </Routes>
    )
}

