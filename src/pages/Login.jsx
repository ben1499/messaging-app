import { Typography, Button, TextField, Stack, Box } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import bgImage from "../assets/bg.webp"
import { useState } from "react";
import axios from "axios";
import { Info } from "@mui/icons-material";
import { styled } from "@mui/material";

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

  const [model, setModel] = useState({
    email: "",
    password: ""
  })

  const [errors, setErrors] = useState([]);

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
    axios.post(`${url}/users/login`, model)
    .then((res) => {
      localStorage.setItem("token", res.data.token);
      navigate("/home");
    }).catch((err) => {
      console.log(err.response);
      if (err.response.data) {
        setErrors(err.response.data.errors);
      }
    });
  }

  // console.log(errors);
  const emailError = errors?.find((error) => error.path === "email");
  const passwordError = errors?.find((error) => error.path === "password");

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', maxWidth: '100vw', px: 8 }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <form onSubmit={submitForm}>
          <Stack spacing={2} width={400}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', pb: 4}}>Messaging App</Typography>
            <Typography variant="h3">Welcome Back</Typography>
            <Typography sx={{ margin: '5px !important' }}>New here? <Link to="/signup">Create an account</Link></Typography>
            <TextField label="Email" name="email" type="email" helperText={emailError && <StyledInfo component="span"><Info fontSize="small" />{emailError.msg}</StyledInfo>} value={model.email} onChange={handleModelChange} />
            <TextField 
              label="Password" 
              name="password" 
              type="password"
              helperText={passwordError && <StyledInfo component="span"><Info fontSize="small" />{passwordError.msg}</StyledInfo>}
              value={model.password}  
              onChange={handleModelChange} 
            />
            <Button type="submit" variant="contained">Login</Button>
          </Stack>
        </form>
      </Box>
      <Box sx={{ maxHeight: '100vh'}}>
        <img style={{height: '99%', width: '100%'}} src={bgImage} alt="" />
      </Box>
    </Box>
  )
}

export default Login;