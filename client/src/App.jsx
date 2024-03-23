import { BrowserRouter,Routes,Route } from "react-router-dom"
import About from "./pages/About"
import SignIn from "./pages/SignIn"
import SignUp from "./pages/SignUp"
import Dashboard from "./pages/Dashboard"
import Home from "./pages/Home"
import Header from "./components/Header"
import FooterCompnent from "./components/Footer"
import PrivateRoute from "./components/PrivateRoute"
import AdminPrivateRoute from "./components/AdminPrivateRoute"
import CreatePost from "./pages/CreatePost"
import UpdatePost from "./pages/UpdatePost"
import PostPage from "./pages/PostPage"
import ScrollToTop from "./components/ScrollToTop.jsx"



function App() {
  return (
  
    <BrowserRouter >
    <ScrollToTop/>
    <Header/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About/>} />
        <Route path="/sign-in" element={<SignIn/>} />
        <Route path="/sign-up" element={<SignUp/>} />
        <Route element={<PrivateRoute/>}>
          <Route path="/dashboard" element={<Dashboard/>} />
        </Route>
        <Route element={<AdminPrivateRoute/>}>
          <Route path="/create-post" element={<CreatePost/>} />
          <Route path="/update-post/:postId" element={<UpdatePost/>} />
        </Route>
        <Route path="/post/:postSlug" element={<PostPage/>} />
      </Routes>
      <FooterCompnent />

    </BrowserRouter>
  
   
  )
}

export default App
