import Zora from './pages/Zora';
import Query from './pages/Query';
import Agents from './pages/Agents';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={Zora} />
          <Route path="/query" element={Query} />
          <Route path='/query/:id' element={Query} />
          <Route path="/agents" element={Agents} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
