import React from 'react';
import Header from './components/header'
import Footer from './components/footer'

import { Route, Routes } from 'react-router-dom'
import { Home } from './pages/home'
import { Contact } from './pages/add-edit-contact'

function App() {
  return (
    <div>
      {/* <Header /> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add-contact" element={<Contact />} />
        <Route path="/edit-contact/:id" element={<Contact />} />
      </Routes>
      {/* <Footer /> */}
    </div>
  );
}

export default App;
