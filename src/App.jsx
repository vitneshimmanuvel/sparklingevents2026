
import './App.css';
import { Routes, Route } from 'react-router-dom';
import EliteInstitutions from './components/EliteInstitutions';
import Footer from './components/Footer';
import Myhero from './components/Myhero'
import Secfour from './components/Secfour';
import Secthree from './components/Secthree'
import Sectiontwo from './components/Sectiontwo'
import SuccessStory from './components/SuccessStory';
import ContactForm from './components/ContactForm';
import VideoDisplay from './components/VideoDisplay';
import AdminPortal from './components/AdminPortal';

// Main website page
function HomePage() {
  return (
    <>
      <Myhero/>
      <Sectiontwo/>
      <Secthree/>
      <EliteInstitutions/>
      <SuccessStory/>
      <Secfour/>
      <VideoDisplay/>
      <ContactForm/>
      <Footer/>
    </>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/admin" element={<AdminPortal />} />
    </Routes>
  )
}

export default App
