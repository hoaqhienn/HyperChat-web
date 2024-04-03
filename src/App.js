import {Routes , Route, BrowserRouter,Link} from 'react-router-dom'
import Onboarding from './components/Onboarding';
import Login from './components/Login';
import Home from './components/Home/Home';
import Resgister from './components/Resgister';
import OptionList from './components/OptionList/OptionList';
import Verify from './components/Verify'
import Forgotpassword from './components/Forgotpassword';
import Verifyforgotpassword from './components/Verifyforgotpassword';
function App() {
  
  return (
 
   <Routes>
    <Route  index element={<Onboarding/>} />
    <Route path='/login' element={<Login/>}/>
    <Route path='/forgotpassword' element={<Forgotpassword/>} />
    <Route path='/verifyforgotpassword' element={<Verifyforgotpassword/>} />
    <Route path='/home' element={<Home/>} />
    <Route path='/register' element={<Resgister/>} />
    <Route path='/verify' element={<Verify/>}/>
    <Route path='/optionlist' element={<OptionList/>}/>
   </Routes>
   
  );
}

export default App;
