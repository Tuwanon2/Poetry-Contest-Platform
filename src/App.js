import CompetitionsOverview from './pages/CompetitionsOverview';
import SubmitCompetition from './pages/SubmitCompetition';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import JudgeWorkDetail from './pages/JudgeWorkDetail';
import JudgeContests from './pages/JudgeContests';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import AuthCallback from './pages/auth/AuthCallback';
import Home from './pages/Home';
import AdminDashboard from './pages/admin/AdminDashboard_Simple';
import ContestList from './pages/ContestList';
import ApplicantsList from './pages/ApplicantsList';
import CreateCompetition from './pages/CreateCompetition';
import AllCompetitions from './pages/public/AllCompetitions';
import UniversityCompetitions from './pages/public/UniversityCompetitions';
import GeneralCompetitions from './pages/public/GeneralCompetitions';
import PrimaryCompetitions from './pages/public/PrimaryCompetitions';
import SecondaryCompetitions from './pages/public/SecondaryCompetitions';
import ContestDetail from './pages/ContestDetail';
import CompetitionResults from './pages/CompetitionResults';
import About from './pages/public/About';
import SearchResults from './pages/SearchResults';
import MyWorks from './pages/MyWorks';
import MyWork from './pages/MyWork';
import ScoreSubmission from './pages/ScoreSubmission';
import SubmissionDetail from './pages/SubmissionDetail';
import MyOrganizations from './pages/MyOrganizations';
import CreateOrganization from './pages/CreateOrganization';
import OrganizationDetail from './pages/OrganizationDetail';
import CompetitionManagement from './pages/CompetitionManagement';
import CompetitionSubmissions from './pages/CompetitionSubmissions';
import EditCompetition from './pages/EditCompetition';
import SubmissionReview from './pages/SubmissionReview';
import TestPage from './pages/TestPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/test" element={<TestPage />} />
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
        <Route path="/judge-work-detail" element={<JudgeWorkDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/results" element={<CompetitionResults />} />
        <Route path="/about" element={<About />} />
        <Route path="/my-works" element={<MyWorks />} />
        <Route path="/my-work/:competitionId" element={<MyWork />} />
        <Route path="/score-submission/:submissionId" element={<ScoreSubmission />} />
        <Route path="/submission/:submissionId" element={<SubmissionDetail />} />
        <Route path="/all-competitions" element={<AllCompetitions />} />
        <Route path="/competition/primary" element={<PrimaryCompetitions />} />
        <Route path="/competition/secondary" element={<SecondaryCompetitions />} />
        <Route path="/competition/university" element={<UniversityCompetitions />} />
        <Route path="/competition/general" element={<GeneralCompetitions />} />
        <Route path="/my-organizations" element={<MyOrganizations />} />
        <Route path="/create-organization" element={<CreateOrganization />} />
        <Route path="/organization/:orgId" element={<OrganizationDetail />} />
        <Route path="/competition/:competitionId/manage" element={<CompetitionManagement />} />
        <Route path="/competition/:competitionId/submissions" element={<CompetitionSubmissions />} />
        <Route path="/competition/:competitionId/edit" element={<EditCompetition />} />
        <Route path="/competition/:competitionId/submission/:submissionId" element={<SubmissionReview />} />
        <Route path="/judge/contests" element={<JudgeContests />} />
      </Routes>
    </Router>
  );
}

export default App;
