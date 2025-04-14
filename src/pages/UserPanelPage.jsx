import {
  Box,
  Typography,
  CircularProgress,
  Stack,
  colors,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  Button,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const UserPanelPage = () => {
  const [users, setUsers] = useState([]);
  const [onRequest, setOnRequest] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    sessionStorage.removeItem("authToken");
    navigate("/");
  };

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
      <Grid container spacing={3}>
        <Grid item xs={12} sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button variant="contained" color="secondary" onClick={handleLogout}>
            Logout
          </Button>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            User Details
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
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>S.No.</strong></TableCell>
                    <TableCell><strong>Name</strong></TableCell>
                    <TableCell><strong>Email</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{user.name || "No Name"}</TableCell>
                      <TableCell>{user.email}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserPanelPage;
