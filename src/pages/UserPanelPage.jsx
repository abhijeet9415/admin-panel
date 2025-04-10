import {
  Box,
  Typography,
  CircularProgress,
  Stack,
  Paper,
  colors,
  Grid,
} from "@mui/material";
import React, { useEffect, useState } from "react";

const UserPanelPage = () => {
  const [users, setUsers] = useState([]);
  const [onRequest, setOnRequest] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      setOnRequest(true);
      setErrorMessage("");
      try {
        const res = await fetch("https://admin-panel-with-go.onrender.com/users");
        const data = await res.json();

        if (res.ok) {
          setUsers(data);
        } else {
          setErrorMessage(data.message || "Failed to fetch users.");
        }
      } catch (error) {
        setErrorMessage("Server error. Please try again.");
      } finally {
        setOnRequest(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <Box p={4} bgcolor={colors.grey[100]} minHeight="100vh">
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        User Panel
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={4}>
        Below is the list of registered users.
      </Typography>

      {onRequest ? (
        <Stack alignItems="center" justifyContent="center" sx={{ mt: 5 }}>
          <CircularProgress sx={{ color: colors.green[600] }} />
        </Stack>
      ) : errorMessage ? (
        <Typography color="error">{errorMessage}</Typography>
      ) : users.length === 0 ? (
        <Typography>No users found.</Typography>
      ) : (
        <Grid container spacing={3}>
          {users.map((user, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  bgcolor: colors.common.white,
                  height: "100%",
                }}
              >
                <Typography variant="subtitle1" fontWeight="bold">
                  {user.name || "No Name"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {user.email}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default UserPanelPage;
