import Drawingapp from "./Components/Drawing"
import Body from "./Components/Body"
import { BrowserRouter, Route, Routes } from "react-router-dom"

import Canvas from "./Components/canvas"
import Signup from "./Components/signup"
import Dashboard from "./Components/Dashboard"


const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Body />}></Route>
          <Route path="/canvas" element={<Canvas />}></Route>
          <Route path="/signup" element={<Signup />}></Route>
          <Route path="/dashboard" element={<Dashboard />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
