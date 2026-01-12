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
import AllCompetitions from './pages/AllCompetitions';
import StudentCompetitions from './pages/StudentCompetitions';
import UniversityCompetitions from './pages/UniversityCompetitions';
import GeneralCompetitions from './pages/GeneralCompetitions';
import ContestDetail from './pages/ContestDetail';
import CompetitionResults from './pages/CompetitionResults';
import About from './pages/public/About';
function App() {
  return (
    <Router>
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create-competition" element={<CreateCompetition />} />
          <Route path="/contest-detail" element={<ContestDetail />} />
          <Route path="/submit-competition" element={<SubmitCompetition />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/contests" element={<ContestList />} />
          <Route path="/admin/applicants" element={<ApplicantsList />} />
          <Route path="/all-competitions" element={<AllCompetitions />} />
          <Route path="/competition/student" element={<StudentCompetitions />} />
          <Route path="/competition/university" element={<UniversityCompetitions />} />
          <Route path="/competition/general" element={<GeneralCompetitions />} />
          <Route path="/competitions-overview" element={<CompetitionsOverview />} />
          <Route path="/judge-scoring" element={<JudgeScoring />} />
          <Route path="/judge-work-detail" element={<JudgeWorkDetail />} />
          <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
         <Route path="/results" element={<CompetitionResults />} />
         <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}

export default App;
