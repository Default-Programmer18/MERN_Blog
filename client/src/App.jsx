import { BrowserRouter,Routes,Route } from "react-router-dom"
import About from "./pages/About"
import SignIn from "./pages/SignIn"
import SignUp from "./pages/SignUp"
import Dashboard from "./pages/Dashboard"
import Home from "./pages/Home"
import Header from "./components/Header"
import FooterCompnent from "./components/Footer"



function App() {
  return (
    <BrowserRouter>
    <Header/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About/>} />
        <Route path="/sign-in" element={<SignIn/>} />
        <Route path="/sign-up" element={<SignUp/>} />
        <Route path="/dashboard" element={<Dashboard/>} />

      </Routes>
      <FooterCompnent />

    </BrowserRouter>
   
  )
}

export default App
