
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
import ImageSlideshow from './components/ImageSlideshow';
import Testimonials from './components/Testimonials';

// Main website pageeeeee
function HomePage() {
  return (
    <>
      <Myhero/>
      <ImageSlideshow/>
      <Sectiontwo/>
      <Secthree/>
      <EliteInstitutions/>
      <SuccessStory/>
      <Testimonials/>
      <Secfour/>
      <VideoDisplay/>
      <ContactForm/>
      <Footer/>
    </>
  );
}

import { Analytics } from '@vercel/analytics/react';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<AdminPortal />} />
      </Routes>
      <Analytics />
    </>
  )
}

export default App
