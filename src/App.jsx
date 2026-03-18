import Drawingapp from "./Components/Drawing"
import Body from "./Components/Body"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Signin from "./Components/signin"
import Canvas from "./Components/canvas"

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Body />}></Route>
          <Route path="/canvas" element={<Canvas />}></Route>
          <Route path="/signin" element={<Signin />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
