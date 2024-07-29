import { Typography, Button, TextField, Stack, Box } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import bgImage from "../assets/bg.webp"
import { useState } from "react";
import axios from "axios";
import { styled } from "@mui/material";
import { Info } from "@mui/icons-material";

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

  const [model, setModel] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: ""
  })

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post(`${url}/users/signup`, model)
    .then(() => {
      navigate("/login");
    }).catch((err) => {
      if (err.response.data) {
        setErrors(err.response.data.errors);
      }
      console.log(err);
    })
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

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', maxWidth: '100vw', px: 8 }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2} width={400}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', pb: 4}}>Messaging App</Typography>
            <Typography variant="h3">Sign up</Typography>
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
              type="password" 
              value={model.password} 
              required
              helperText={passwordError && <StyledInfo component="span"><Info fontSize="small" />{passwordError.msg}</StyledInfo>} 
            />
            <Button type="submit" variant="contained">Sign up</Button>
          </Stack>
        </form>
      </Box>
      <Box sx={{ maxHeight: '100vh'}}>
        <img style={{height: '99%', width: '100%'}} src={bgImage} alt="" />
      </Box>
    </Box>
  )
}

export default Signup;