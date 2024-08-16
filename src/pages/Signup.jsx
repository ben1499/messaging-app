import { Typography, Button, TextField, Stack, Box, InputAdornment, IconButton, Snackbar } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import bgImage from "../assets/bg.webp"
import { useState } from "react";
import axios from "axios";
import { styled } from "@mui/material";
import { Info, Visibility, VisibilityOff } from "@mui/icons-material";
import Logo from "../assets/chat-logo.png";
import { LoadingButton } from "@mui/lab";

const StyledInfo = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  gap: "2px",
  color: "red",
  marginLeft: "-10px"
}));

function Signup() {
  const url = import.meta.env.VITE_API_URL;

  const navigate = useNavigate();
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState(null);

  const [model, setModel] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: ""
  })

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    axios.post(`${url}/users/signup`, model)
    .then(() => {
      navigate("/login");
      setSnackMessage("User created successfully. Please login.");
      setSnackOpen(true);
    }).catch((err) => {
      if (!err.response || err.response.status !== 400) {
        setSnackMessage("Something went wrong. Please try again.");
        setSnackOpen(true);
        return;
      }
      if (err.response.data) {
        setErrors(err.response.data.errors);
      }
      console.log(err);
    }).finally(() => setLoading(false));
  }

  const firstNameError = errors?.find((error) => error.path === "first_name");
  const lastNameError = errors?.find((error) => error.path === "last_name");
  const emailError = errors?.find((error) => error.path === "email");
  const passwordError = errors?.find((error) => error.path === "password");

  const handleModelChange = (e) => {
    switch(e.target.name) {
      case "first_name": 
        setModel({...model, first_name: e.target.value});
        break;
      case "last_name": 
        setModel({...model, last_name: e.target.value});
        break;
      case "email": 
        setModel({...model, email: e.target.value});
        break;
      case "password": 
        setModel({...model, password: e.target.value});
        break;
    }
  }

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  }

  const handleSnackClose = () => {
    setSnackOpen(false);
  }

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Snackbar
        open={snackOpen}
        autoHideDuration={3000}
        onClose={handleSnackClose}
        message={snackMessage}
      />
      <form onSubmit={handleSubmit} className="form-container">
        <Stack spacing={2} width={{ lg: 400, sm: 380, xs: 360 }}>
          <Box sx={{ display: "flex", gap: "12px", alignItems: "center", pb: 4, justifyContent: { lg: "flex-start", sm: "center", xs: "center" } }}>
            <div><img src={Logo} width="50" alt="" /></div>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>Messaging App</Typography>
          </Box>
          <Typography variant="h3" sx={{ fontSize: { lg: "42px", sm: "34px", xs: "32px" } }}>Sign up</Typography>
          <Typography sx={{ margin: '5px !important' }}>Already have an account? <Link to="/login">Login</Link></Typography>
          <TextField 
            label="First Name" 
            name="first_name" 
            onChange={handleModelChange} 
            value={model.first_name} 
            required
            helperText={firstNameError && <StyledInfo component="span"><Info fontSize="small" />{firstNameError.msg}</StyledInfo>} 
          />
          <TextField 
            label="Last Name" 
            name="last_name" 
            onChange={handleModelChange} 
            value={model.last_name} 
            required
            helperText={lastNameError && <StyledInfo component="span"><Info fontSize="small" />{lastNameError.msg}</StyledInfo>} 
          />
          <TextField 
            label="Email" 
            name="email" 
            onChange={handleModelChange} 
            type="email" 
            value={model.email} 
            required 
            helperText={emailError && <StyledInfo component="span"><Info fontSize="small" />{emailError.msg}</StyledInfo>} 
          />
          <TextField 
            label="Password" 
            name="password" 
            onChange={handleModelChange} 
            type={showPassword ? "text" : "password"}
            value={model.password} 
            required
            helperText={passwordError && <StyledInfo component="span"><Info fontSize="small" />{passwordError.msg}</StyledInfo>} 
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
          <LoadingButton type="submit" variant="contained" loadingPosition="start" loading={loading}>Sign up</LoadingButton>
        </Stack>
      </form>
      <Box className="welcome-bg-image">
        <img style={{height: '99%', width: '100%'}} src={bgImage} alt="" />
      </Box>
    </Box>
  )
}

export default Signup;