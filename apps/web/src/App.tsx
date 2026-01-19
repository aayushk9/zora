import Zora from './pages/Zora/Zora';
import Query from './pages/Query';
import Agents from './pages/Agents/Agents';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home/Home';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/app' element={<Zora/>}/>
          <Route path="/query" element={<Query/>} />
          <Route path='/query/:id' element={<Query/>} />
          <Route path="/agents" element={<Agents/>} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
