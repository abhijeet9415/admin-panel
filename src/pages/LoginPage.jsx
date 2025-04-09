import { 
  Box, Button, Checkbox, CircularProgress, FormControlLabel, FormGroup, Stack, 
  TextField, Typography, colors 
} from "@mui/material";
import React, { useState } from "react";
import { images } from "../assets";
import { Link, useNavigate } from "react-router-dom";
import Animate from "../components/common/Animate";

const LoginPage = () => {
  const navigate = useNavigate();

  const [onRequest, setOnRequest] = useState(false);
  const [loginProgress, setLoginProgress] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const onSignin = async (e) => {
    e.preventDefault();
    setOnRequest(true);
    setErrorMessage("");

    const formData = new FormData(e.target);
    const credentials = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    try {
      const response = await fetch("https://admin-panel-with-go.onrender.com/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token); // Store JWT token
        setIsLoggedIn(true);
        setTimeout(() => navigate("/dashboard"), 1000);
      } else {
        setErrorMessage(data.message || "Invalid username or password!");
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
      {/* Login Form */}
      <Box sx={{
        position: "absolute",
        left: 0,
        height: "100%",
        width: isLoggedIn ? "100%" : { xl: "30%", lg: "40%", md: "50%", xs: "100%" },
        transition: "all 1s ease-in-out",
        bgcolor: colors.common.white
      }}>
        <Box sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          opacity: isLoggedIn ? 0 : 1,
          transition: "all 0.3s ease-in-out",
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
              <Box component="form" maxWidth={400} width="100%" onSubmit={onSignin}>
                <Stack spacing={3}>
                  <TextField label="Email" name="email" fullWidth required />
                  <TextField label="Password" name="password" type="password" fullWidth required />
                  {errorMessage && (
                    <Typography color="error" fontWeight="bold">{errorMessage}</Typography>
                  )}
                  <Button type="submit" size="large" variant="contained" color="success">
                    Sign In
                  </Button>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <FormGroup>
                      <FormControlLabel control={<Checkbox />} label="Remember me" />
                    </FormGroup>
                    <Typography color="error" fontWeight="bold">
                      <Link to="/forgot-password">Forgot password?</Link>
                    </Typography>
                  </Stack>
                </Stack>
              </Box>
            </Animate>
          </Box>
          {/* Footer */}
          <Box sx={{ textAlign: "center", p: 5, zIndex: 2 }}>
            <Animate type="fade" delay={1}>
              <Typography display="inline" fontWeight="bold" sx={{ "& > a": { color: colors.red[900], ml: "5px" } }}>
                Don't have an account? <Link to="/register">Register now</Link>
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

export default LoginPage;
