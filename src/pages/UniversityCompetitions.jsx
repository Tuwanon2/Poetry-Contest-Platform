import React from 'react';
import TopNav from '../components/TopNav';
import ActivitiesList from '../components/ActivitiesList';

const UniversityCompetitions = () => (
  <>
    <TopNav />
    <div style={{ paddingTop: '80px' }}>
      <ActivitiesList filterCategory="นักศึกษา" />
    </div>
  </>
);

export default UniversityCompetitions;
