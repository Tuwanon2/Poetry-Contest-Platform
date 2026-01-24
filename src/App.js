import CompetitionsOverview from './pages/CompetitionsOverview';
import SubmitCompetition from './pages/SubmitCompetition';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import JudgeScoring from './pages/JudgeScoring';
import JudgeWorkDetail from './pages/JudgeWorkDetail';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Home from './pages/Home';
import AdminDashboard from './pages/admin/AdminDashboard';
import ContestList from './pages/ContestList';
import ApplicantsList from './pages/ApplicantsList';
import CreateCompetition from './pages/CreateCompetition';
import AllCompetitions from './pages/public/AllCompetitions';
import UniversityCompetitions from './pages/public/UniversityCompetitions';
import GeneralCompetitions from './pages/public/GeneralCompetitions';
import PrimaryCompetitions from './pages/public/PrimaryCompetitions';
import SecondaryCompetitions from './pages/public/SecondaryCompetitions';
import ContestDetail from './pages/ContestDetail';
import About from './pages/public/About';
import SearchResults from './pages/SearchResults';
import MyWorks from './pages/MyWorks';
import SubmissionDetail from './pages/SubmissionDetail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/create-competition" element={<CreateCompetition />} />
        <Route path="/contest-detail/:id" element={<ContestDetail />} />
        <Route path="/submit-competition/:id" element={<SubmitCompetition />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/all-competitions" element={<AllCompetitions />} />
        <Route path="/competition/primary" element={<PrimaryCompetitions />} />
        <Route path="/competition/secondary" element={<SecondaryCompetitions />} />
        <Route path="/competition/university" element={<UniversityCompetitions />} />
        <Route path="/competition/general" element={<GeneralCompetitions />} />
        <Route path="/competitions-overview" element={<CompetitionsOverview />} />
        <Route path="/judge-scoring" element={<JudgeScoring />} />
        <Route path="/judge-work-detail" element={<JudgeWorkDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/all-competitions" element={<AllCompetitions />} />
        <Route path="/about" element={<About />} />
        <Route path="/my-works" element={<MyWorks />} />
        <Route path="/submission/:submissionId" element={<SubmissionDetail />} />
      </Routes>
    </Router>
  );
}

export default App;