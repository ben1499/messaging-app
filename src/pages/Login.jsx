import { Typography, TextField, Stack, Box, IconButton, InputAdornment } from "@mui/material";
import { Link, useNavigate, useLocation } from "react-router-dom";
import bgImage from "../assets/bg.webp"
import { useState, useEffect } from "react";
import axios from "axios";
import { Info, Visibility, VisibilityOff } from "@mui/icons-material";
import { styled, Snackbar } from "@mui/material";
import Logo from "../assets/chat-logo.png";
import { LoadingButton } from "@mui/lab";

const StyledInfo = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  gap: "2px",
  color: "red",
  marginLeft: "-10px"
}));


function Login() {
  const url = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const location = useLocation();

  const [model, setModel] = useState({
    email: "",
    password: ""
  })

  const [errors, setErrors] = useState([]);
  const [snackOpen, setSnackOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [snackMessage, setSnackMessage] = useState(null);

  useEffect(() => {
    if (location.state?.isRedirect) {
      setSnackMessage("Please login to access account");
      setSnackOpen(true);
      // To clear the isRedirect state
      navigate(".", { replace: true })
    }
    if (localStorage.getItem("token")) {
      navigate("/home");
    }
  }, [location, navigate]);

  const handleModelChange = (e) => {
    switch(e.target.name) {
      case "email": 
        setModel({ ...model, email: e.target.value });
        break;
      case "password":
        setModel({ ...model, password: e.target.value });
        break;
    }
  }

  const submitForm = (e) => {
    e.preventDefault();
    setErrors([]);
    setLoading(true);
    axios.post(`${url}/users/login`, model)
    .then((res) => {
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user_id", res.data.user_id);
      navigate("/home");
    }).catch((err) => {
      console.log(err);
      if (!err.response || err.response.status !== 400) {
        setSnackMessage("Something went wrong. Please try again.");
        setSnackOpen(true);
        return;
      }
      if (err.response.data) {
        setErrors(err.response.data.errors);
      }
    }).finally(() => setLoading(false));
  }

  const handleSnackClose = () => {
    setSnackOpen(false);
  }

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  }

  const emailError = errors?.find((error) => error.path === "email");
  const passwordError = errors?.find((error) => error.path === "password");

  return (
    <Box sx={{ display: 'flex', height: '100vh', width: "100%" }}>
      <Snackbar
        open={snackOpen}
        autoHideDuration={3000}
        onClose={handleSnackClose}
        message={snackMessage}
      />
      <form onSubmit={submitForm} className="form-container">
        <Stack spacing={2} sx={{ width: {lg: 400, sm: 380, xs: 360} }}>
          <Box sx={{ display: "flex", gap: "12px", alignItems: "center", pb: 4, justifyContent: { lg: "flex-start", sm: "center", xs: "center" } }}>
            <div><img src={Logo} width="50" alt="" /></div>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>Messaging App</Typography>
          </Box>
          <Typography variant="h3" sx={{ fontSize: { lg: "42px", sm: "34px", xs: "32px" } }}>Welcome Back</Typography>
          <Typography sx={{ margin: '5px !important' }}>New here? <Link to="/signup">Create an account</Link></Typography>
          <TextField label="Email" name="email" type="email" required helperText={emailError && <StyledInfo component="span"><Info fontSize="small" />{emailError.msg}</StyledInfo>} value={model.email} onChange={handleModelChange} />
          <TextField 
            label="Password" 
            name="password" 
            type={showPassword ? "text" : "password"}
            required
            helperText={passwordError && <StyledInfo component="span"><Info fontSize="small" />{passwordError.msg}</StyledInfo>}
            value={model.password}  
            onChange={handleModelChange} 
            InputProps={{
              endAdornment: (<InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={toggleShowPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>)
              }}
          />
          <LoadingButton type="submit" variant="contained" loadingPosition="start" loading={loading}>Login</LoadingButton>
        </Stack>
      </form>
      <Box className="welcome-bg-image">
        <img style={{ height: '99%', width: '100%' }} src={bgImage} alt="" />
      </Box>
    </Box>
  )
}

export default Login;