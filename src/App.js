import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store, persistor } from './redux/store'; // Adjusted import here
import { PersistGate } from 'redux-persist/integration/react';

import Onboarding from './components/Onboarding';
import Login from './components/Login';
import Home from './components/Home/Home';
import Register from './components/Resgister';
import OptionList from './components/OptionList/OptionList';
import Verify from './components/Verify';
import ForgotPassword from './components/Forgotpassword';
import VerifyForgotPassword from './components/Verifyforgotpassword';
import ChatWithFriend from './components/Chat/ChatWithFriend';

function Root() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}> {/* Wrap your application with PersistGate if you're using Redux Persist */}
          <Routes>
            <Route index element={<Onboarding />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgotpassword" element={<ForgotPassword />} />
            <Route path="/verifyforgotpassword" element={<VerifyForgotPassword />} />
            <Route path="/home" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify" element={<Verify />} />
            <Route path="/optionlist" element={<OptionList />} />
            <Route path="/chatwithfriend" element={<ChatWithFriend />} />
          </Routes>
      </PersistGate>
    </Provider>
  );
}

export default Root;
