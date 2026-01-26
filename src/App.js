import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Pages
import Home from './pages/Home';
import About from './pages/public/About';
import TestPage from './pages/TestPage';
import SearchResults from './pages/SearchResults';
import CompetitionsOverview from './pages/CompetitionsOverview';
import CompetitionResults from './pages/CompetitionResults'; // <--- ADD THIS IMPORT
import CreateCompetition from './pages/CreateCompetition';
import SubmitCompetition from './pages/SubmitCompetition';
import ContestDetail from './pages/ContestDetail';
import ContestList from './pages/ContestList'; // Note: You imported this but didn't use it in routes
import ApplicantsList from './pages/ApplicantsList'; // Note: You imported this but didn't use it in routes

// Public Competitions
import AllCompetitions from './pages/public/AllCompetitions';
import PrimaryCompetitions from './pages/public/PrimaryCompetitions';
import SecondaryCompetitions from './pages/public/SecondaryCompetitions';
import UniversityCompetitions from './pages/public/UniversityCompetitions';
import GeneralCompetitions from './pages/public/GeneralCompetitions';

// Auth
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import AuthCallback from './pages/auth/AuthCallback';

// User/Works
import MyWorks from './pages/MyWorks';
import SubmissionDetail from './pages/SubmissionDetail';
import SubmissionReview from './pages/SubmissionReview';

// Organizations
import MyOrganizations from './pages/MyOrganizations';
import CreateOrganization from './pages/CreateOrganization';
import OrganizationDetail from './pages/OrganizationDetail';

// Admin/Management
import AdminDashboard from './pages/admin/AdminDashboard_Simple';
import CompetitionManagement from './pages/CompetitionManagement';
import CompetitionSubmissions from './pages/CompetitionSubmissions';
import EditCompetition from './pages/EditCompetition';

// Judging
import JudgeScoring from './pages/JudgeScoring';
import JudgeWorkDetail from './pages/JudgeWorkDetail';
import JudgeContests from './pages/JudgeContests';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/test" element={<TestPage />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/about" element={<About />} />
        
        {/* Competition Browsing */}
        <Route path="/competitions-overview" element={<CompetitionsOverview />} />
        <Route path="/all-competitions" element={<AllCompetitions />} />
        <Route path="/competition/primary" element={<PrimaryCompetitions />} />
        <Route path="/competition/secondary" element={<SecondaryCompetitions />} />
        <Route path="/competition/university" element={<UniversityCompetitions />} />
        <Route path="/competition/general" element={<GeneralCompetitions />} />
        <Route path="/contest-detail/:id" element={<ContestDetail />} />
        <Route path="/results" element={<CompetitionResults />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/auth/callback" element={<AuthCallback />} />

        {/* User Actions */}
        <Route path="/create-competition" element={<CreateCompetition />} />
        <Route path="/submit-competition/:id" element={<SubmitCompetition />} />
        <Route path="/my-works" element={<MyWorks />} />
        <Route path="/submission/:submissionId" element={<SubmissionDetail />} />

        {/* Organizations */}
        <Route path="/my-organizations" element={<MyOrganizations />} />
        <Route path="/create-organization" element={<CreateOrganization />} />
        <Route path="/organization/:orgId" element={<OrganizationDetail />} />

        {/* Competition Management */}
        <Route path="/competition/:competitionId/manage" element={<CompetitionManagement />} />
        <Route path="/competition/:competitionId/submissions" element={<CompetitionSubmissions />} />
        <Route path="/competition/:competitionId/edit" element={<EditCompetition />} />
        <Route path="/competition/:competitionId/submission/:submissionId" element={<SubmissionReview />} />

        {/* Admin */}
        <Route path="/admin" element={<AdminDashboard />} />

        {/* Judging */}
        <Route path="/judge/contests" element={<JudgeContests />} />
        <Route path="/judge-scoring" element={<JudgeScoring />} />
        <Route path="/judge-scoring/:competitionId" element={<JudgeScoring />} />
        <Route path="/judge-work-detail" element={<JudgeWorkDetail />} />
      </Routes>
    </Router>
  );
}

export default App;