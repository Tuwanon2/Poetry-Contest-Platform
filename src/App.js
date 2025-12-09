import CompetitionsOverview from './pages/CompetitionsOverview';
import SubmitCompetition from './pages/SubmitCompetition';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import JudgeScoring from './pages/JudgeScoring';
import JudgeWorkDetail from './pages/JudgeWorkDetail';

import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
import ContestList from './pages/ContestList';
import ApplicantsList from './pages/ApplicantsList';
import CreateCompetition from './pages/CreateCompetition';
import AllCompetitions from './pages/AllCompetitions';
import StudentCompetitions from './pages/StudentCompetitions';
import UniversityCompetitions from './pages/UniversityCompetitions';
import GeneralCompetitions from './pages/GeneralCompetitions';
import SearchResults from './pages/SearchResults';
import ProductDetail from './pages/ProductDetail';
import Seller from './pages/Seller';
import MyCart from './pages/MyCart';
import Payment from './pages/Payment';
import MyProfile from './pages/MyProfile';
import Shop from './pages/Shop';
import EditAddress from './pages/EditAddress';
import Contact from './pages/Contact';
import Shipping from './pages/Shipping';
import Ship1 from './pages/Ship1';
import Ship2 from './pages/Ship2';
import Upstatus from './pages/Upstatus';
import Delivery from './pages/Delivery';
import ContestDetail from './pages/ContestDetail';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/seller/:sellerId" element={<Seller />} />
        <Route path="/create-competition" element={<CreateCompetition />} />
        {/* ลบ route ที่ render Home.jsx สำหรับการแข่งขันแต่ละประเภท */}
        <Route path="/contest-detail" element={<ContestDetail />} />
        <Route path="/submit-competition" element={<SubmitCompetition />} />
        <Route path="/MyCart" element={<MyCart />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/contests" element={<ContestList />} />
        <Route path="/admin/applicants" element={<ApplicantsList />} />
        <Route path="/Payment" element={<Payment />} />
        <Route path="/MyProfile" element={<MyProfile />} />
        <Route path="/Profile" element={<profile />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/Shop" element={<Shop />} />
        <Route path="/product/:productId" element={<ProductDetail />} />
        <Route path="/EditAddress" element={<EditAddress />} />
        <Route path="/Contact" element={<Contact />} /> 
        <Route path="/shipping" element={<Shipping />} />
        <Route path="/ship1" element={<Ship1 />} />
        <Route path="/ship2" element={<Ship2 />} />
        <Route path="/Upstatus" element={<Upstatus />} />
        <Route path="/Delivery" element={<Delivery />} />
        <Route path="/all-competitions" element={<AllCompetitions />} />
        <Route path="/competition/student" element={<StudentCompetitions />} />
        <Route path="/competition/university" element={<UniversityCompetitions />} />
        <Route path="/competition/general" element={<GeneralCompetitions />} />
        <Route path="/competitions-overview" element={<CompetitionsOverview />} />
          <Route path="/judge-scoring" element={<JudgeScoring />} />
          <Route path="/judge-work-detail" element={<JudgeWorkDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
