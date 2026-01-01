import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Zora from './pages/Zora/Zora';
const Agents = lazy(() => import("./pages/Agents/Agents"))
const Query = lazy(() => import("./pages/Query"))

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Zora/>} />
          <Route path="/query" element={
            <Suspense fallback={<div>loading...</div>}>
               <Query/>
            </Suspense>
          } />
          <Route path='/query/:id' element={
            <Suspense fallback={<div>loading...</div>}>
               <Query/>
            </Suspense>
          } />
          <Route path="/agents" element={
            <Suspense fallback={<div>loading...</div>}>
              <Agents/>
            </Suspense>
          } />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
