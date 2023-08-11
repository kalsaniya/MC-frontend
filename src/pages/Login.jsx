import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import ReCAPTCHA from "react-google-recaptcha";

const SITE_KEY = "6LeAgC0nAAAAAISsszERKVatDXuSNCMhQX21ItBE";

function Login() {
  const [captchaValue, setCaptchaValue] = useState("");
  const [isCaptchaValid, setIsCaptchaValid] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);

  const navigate = useNavigate();

  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const handleCaptchaChange = (value) => {
    setCaptchaValue(value);
    setIsCaptchaValid(true); // Reset the validity on each captcha change
  };

  const login = () => {
    if (!captchaValue) {
      setIsCaptchaValid(false);
      return; // Exit the function if captcha is not completed
    }

    axios
      .post("http://localhost:7000/api/user/login", { ...user, captchaValue })
      .then((res) => {
        toast.success("User SignIn Successfullly!");
        setIsSuccess(true);
        navigate("/dashboard");
      })
      .catch((error) => {
        console.error(error);
        toast.error("Something went wrong!");
      });
  };
  return (
    <ThemeProvider theme={createTheme()}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <Avatar
            sx={{ m: 1, bgcolor: "#25D366" }}
            style={{ marginTop: "12%" }}
          >
            <WhatsAppIcon />
          </Avatar>
        </Box>
        <Box
          sx={{
            marginTop: 5,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
            padding: "30px",
          }}
        >
          <Typography component="h1" variant="h6" style={{ color: "#1976d2" }}>
            Sign In
          </Typography>
          <Typography
            component="h6"
            variant="h6"
            style={{ color: "gray", fontSize: "14px" }}
          >
            Welcome Back!
          </Typography>
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              size="small"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              value={user.email}
              onChange={handleChange}
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              size="small"
              required
              fullWidth
              name="password"
              value={user.password}
              onChange={handleChange}
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Grid
              container
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <Grid item xs></Grid>
              <Grid item>
                <Link
                  href="/ForgotPassword"
                  variant="body2"
                  style={{
                    textDecoration: "none",
                    color: "gray",
                    fontSize: "14px",
                  }}
                >
                  Forgot password?
                </Link>
              </Grid>
            </Grid>

            <ReCAPTCHA sitekey={SITE_KEY} onChange={handleCaptchaChange} />
            {!isCaptchaValid && (
              <Typography variant="body2" color="error">
                Invalid Captcha
              </Typography>
            )}

            <Button
              onClick={login}
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>

            <Grid container style={{ textAlign: "center" }}>
              <Grid item xs>
                <Link
                  href="/signUp"
                  variant="body2"
                  style={{
                    textDecoration: "none",
                    color: "black",
                    fontSize: "14px",
                    textAlign: "center",
                  }}
                >
                  Don't have an account?
                  <span style={{ color: "#1976d2" }}> SignUp</span>
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default Login;
