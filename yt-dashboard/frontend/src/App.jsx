
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom' ;
import MainDashboard from './components/MainDashboard';
import Login from './components/Login';

export const BaseUrl = import.meta.env.VITE_API_BASE_URL;
 console.log('base url is =',BaseUrl);
 
function App() {

  return (
    <BrowserRouter>
      <Routes> 
        <Route path = "/" element = {<Login />}>  </Route>
        <Route path = "/dashboard" element = {<MainDashboard />}>  </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
