import React from 'react';
import Header from './components/header'
import Footer from './components/footer'

import { Route, Routes } from 'react-router-dom'
import Home from './pages/home'
import Contact from './pages/add-edit-contact'

function App() {
  return (
    <div>

      <Home />
      <Contact />

      <Routes>
        <Route path="/" component={<Home />} />
        <Route path="/add-contact" component={<Contact />} />
        <Route path="/edit-contact/:id" component={<Contact />} />
      </Routes>
    </div>
  );
}

export default App;
