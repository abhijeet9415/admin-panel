import { 
    Box, Button, Checkbox, CircularProgress, FormControlLabel, FormGroup, Stack, 
    TextField, Typography, colors 
  } from "@mui/material";
  import React, { useState } from "react";
  import { images } from "../assets";
  import { Link, useNavigate } from "react-router-dom";
  import Animate from "../components/common/Animate";
  
  const RegisterPage = () => {
    const navigate = useNavigate();
    
    const [onRequest, setOnRequest] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
  
    const onRegister = async (e) => {
      e.preventDefault();
      setOnRequest(true);
      setErrorMessage("");
      setSuccessMessage("");
  
      const formData = new FormData(e.target);
      const credentials = {
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
        confirmPassword: formData.get("confirmPassword"),
      };
  
      // Password validation
      if (credentials.password !== credentials.confirmPassword) {
        setErrorMessage("Passwords do not match!");
        setOnRequest(false);
        return;
      }
  
      try {
        const response = await fetch("https://my-admin-panel-5d5p.onrender.com/users/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials),
        });
  
        const data = await response.json();
  
        if (response.ok) {
          setSuccessMessage("Registration successful! Redirecting...");
          setTimeout(() => navigate("/"), 2000);
        } else {
          setErrorMessage(data.message || "Registration failed!");
        }
      } catch (error) {
        setErrorMessage("Server error. Please try again.");
      } finally {
        setOnRequest(false);
      }
    };
  
    return (
      <Box position="relative" height="100vh" sx={{ "::-webkit-scrollbar": { display: "none" } }}>
        {/* Background Box */}
        <Box sx={{
          position: "absolute",
          right: 0,
          height: "100%",
          width: "70%",
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundImage: `url(${images.loginBg})`
        }} />
        {/* Register Form */}
        <Box sx={{
          position: "absolute",
          left: 0,
          height: "100%",
          width: { xl: "30%", lg: "40%", md: "50%", xs: "100%" },
          bgcolor: colors.common.white
        }}>
          <Box sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "100%",
            "::-webkit-scrollbar": { display: "none" }
          }}>
            {/* Logo */}
            <Box sx={{ textAlign: "center", p: 5 }}>
              <Animate type="fade" delay={0.5}>
                <img src={images.logo} alt="logo" height={60} />
              </Animate>
            </Box>
            {/* Form */}
            <Box sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              "::-webkit-scrollbar": { display: "none" }
            }}>
              <Animate type="fade" sx={{ maxWidth: 400, width: "100%" }}>
                <Box component="form" maxWidth={400} width="100%" onSubmit={onRegister}>
                  <Stack spacing={3}>
                    <TextField label="Name" name="name" fullWidth required />
                    <TextField label="Email" name="email" type="email" fullWidth required />
                    <TextField label="Password" name="password" type="password" fullWidth required />
                    <TextField label="Confirm Password" name="confirmPassword" type="password" fullWidth required />
                    
                    {errorMessage && (
                      <Typography color="error" fontWeight="bold">{errorMessage}</Typography>
                    )}
                    {successMessage && (
                      <Typography color="success.main" fontWeight="bold">{successMessage}</Typography>
                    )}
  
                    <Button type="submit" size="large" variant="contained" color="success">
                      Register
                    </Button>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <FormGroup>
                        <FormControlLabel control={<Checkbox />} label="Remember me" />
                      </FormGroup>
                      <Typography color="primary">
                        <Link to="/login">Already have an account? Login</Link>
                      </Typography>
                    </Stack>
                  </Stack>
                </Box>
              </Animate>
            </Box>
            {/* Footer */}
            <Box sx={{ textAlign: "center", p: 5, zIndex: 2 }}>
              <Animate type="fade" delay={1}>
                <Typography display="inline" fontWeight="bold">
                  <Link to="/">Back to Home</Link>
                </Typography>
              </Animate>
            </Box>
            {/* Loading Indicator */}
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
      </Box>
    );
  };
  
  export default RegisterPage;
  