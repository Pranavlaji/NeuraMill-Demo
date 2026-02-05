import { Navbar } from './components/layout/Navbar';
import { HazardStrip } from './components/layout/HazardStrip';
import { Hero } from './components/home/Hero';

function App() {
  return (
    <>
      <div className="app-frame">
        <Navbar />
        <HazardStrip className="aligned-strip" />
        <Hero />
      </div>
    </>
  )
}

export default App
