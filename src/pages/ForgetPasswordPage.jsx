import {
    Box, Button, CircularProgress, Stack, TextField, Typography, colors,
  } from "@mui/material";
  import React, { useState } from "react";
  import { images } from "../assets";
  import { Link, useNavigate } from "react-router-dom";
  import Animate from "../components/common/Animate";
  
  const ForgetPasswordPage = () => {
    const [onRequest, setOnRequest] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setOnRequest(true);
      setErrorMessage("");
      setSuccessMessage("");
  
      const formData = new FormData(e.target);
      const email = formData.get("email");
      const password = formData.get("newPassword");
  
      try {
        const response = await fetch("https://admin-panel-with-go.onrender.com/users/update-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
  
        const data = await response.json();
  
        if (response.ok) {
          setSuccessMessage("Password updated successfully!");
          setTimeout(() => navigate("/"), 2000); // Redirect to login
        } else {
          setErrorMessage(data.message || "Failed to update password.");
        }
      } catch (error) {
        setErrorMessage("Server error. Please try again.");
      } finally {
        setOnRequest(false);
      }
    };
  
    return (
      <Box position="relative" height="100vh">
        {/* Background */}
        <Box sx={{
          position: "absolute",
          right: 0,
          height: "100%",
          width: "70%",
          backgroundImage: `url(${images.loginBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }} />
        {/* Form Panel */}
        <Box sx={{
          position: "absolute",
          left: 0,
          width: { xl: "30%", lg: "40%", md: "50%", xs: "100%" },
          height: "100%",
          bgcolor: colors.common.white,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}>
          <Box sx={{ textAlign: "center", p: 5 }}>
            <Animate type="fade">
              <img src={images.logo} alt="logo" height={60} />
            </Animate>
          </Box>
          <Box sx={{ px: 5 }}>
            <Animate type="fade" delay={0.2}>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Update Password
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                Enter your email and new password below to update it.
              </Typography>
            </Animate>
  
            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <TextField label="Email" name="email" type="email" required fullWidth />
                <TextField label="New Password" name="newPassword" type="password" required fullWidth />
                {errorMessage && <Typography color="error">{errorMessage}</Typography>}
                {successMessage && <Typography color="success.main">{successMessage}</Typography>}
                <Button type="submit" variant="contained" color="success">
                  Update Password
                </Button>
              </Stack>
            </Box>
  
            <Box mt={3} textAlign="center">
              <Typography variant="body2">
                <Link to="/" style={{ color: colors.red[700] }}>
                  Back to Login
                </Link>
              </Typography>
            </Box>
          </Box>
  
          {onRequest && (
            <Stack alignItems="center" justifyContent="center" sx={{
              height: "100%", width: "100%", position: "absolute", top: 0, left: 0,
              bgcolor: colors.common.white, zIndex: 1000
            }}>
              <CircularProgress size={100} sx={{ color: colors.green[600] }} />
            </Stack>
          )}
        </Box>
      </Box>
    );
  };
  
  export default ForgetPasswordPage;
  