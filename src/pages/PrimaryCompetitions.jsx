import React from 'react';
import TopNav from '../components/TopNav';
import ActivitiesList from '../components/ActivitiesList';

const PrimaryCompetitions = () => (
  <>
    <TopNav />
    <div style={{ paddingTop: '80px' }}>
      <ActivitiesList filterCategory="ประถม" />
    </div>
  </>
);

export default PrimaryCompetitions;
