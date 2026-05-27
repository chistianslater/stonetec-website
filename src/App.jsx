import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'
import Home from './pages/Home.jsx'
import Leistungen from './pages/Leistungen.jsx'
import Projekte from './pages/Projekte.jsx'
import Lookbook from './pages/Lookbook.jsx'
import Team from './pages/Team.jsx'
import Kontakt from './pages/Kontakt.jsx'
import Magazin from './pages/Magazin.jsx'

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="leistungen" element={<Leistungen />} />
          <Route path="projekte" element={<Projekte />} />
          <Route path="lookbook" element={<Lookbook />} />
          <Route path="team" element={<Team />} />
          <Route path="kontakt" element={<Kontakt />} />
          <Route path="magazin" element={<Magazin />} />
        </Route>
      </Routes>
    </>
  )
}
