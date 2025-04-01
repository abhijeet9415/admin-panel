import { Grid, Button } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation after logout
import SummaryGrid from '../components/common/SummaryGrid';
import ToursData from '../components/common/ToursData';
import Animate from '../components/common/Animate';
import UserBookingCard from '../components/common/UserBookingCard';
import TotalIncome from '../components/common/TotalIncome';
import BookedData from '../components/common/BookedData';
import StatisticData from '../components/common/StatisticData';

const DashboardPage = () => {
  const navigate = useNavigate(); // Hook to programmatically navigate
  const handleLogout = () => {
    // Clear the user's session or token
    localStorage.removeItem('authToken'); // Assuming token is stored in localStorage
    sessionStorage.removeItem('authToken'); // If using sessionStorage

    // Redirect to the login page
    navigate('/');
  };

  return (
    <Grid container spacing={3}>
      {/* Logout Button */}
      <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="contained" color="secondary" onClick={handleLogout}>
          Logout
        </Button>
      </Grid>

      {/* Dashboard Grid */}
      <Grid item xs={12}>
        <SummaryGrid />
      </Grid>
      <Grid item xs={12} lg={4}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Animate delay={1}>
              <ToursData />
            </Animate>
          </Grid>
          <Grid item xs={12}>
            <Animate delay={1.5}>
              <UserBookingCard />
            </Animate>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} lg={8}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Animate type="fade" delay={1.5} sx={{ height: "100%" }}>
              <TotalIncome />
            </Animate>
          </Grid>
          <Grid item xs={12} md={6}>
            <Animate type="fade" delay={2} sx={{ height: "100%" }}>
              <BookedData />
            </Animate>
          </Grid>
          <Grid item xs={12}>
            <Animate delay={2.5}>
              <StatisticData />
            </Animate>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default DashboardPage;
