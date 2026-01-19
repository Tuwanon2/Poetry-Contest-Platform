import React from 'react';
import TopNav from '../components/TopNav';
import ActivitiesList from '../components/ActivitiesList';

const GeneralCompetitions = () => (
  <>
    <TopNav />
    <div style={{ paddingTop: '80px' }}>
      <ActivitiesList filterCategory="ประชาชนทั่วไป" />
    </div>
  </>
);

export default GeneralCompetitions;
