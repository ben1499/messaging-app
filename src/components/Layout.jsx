import Logo from "../assets/chat-logo.png";
import { Stack, IconButton, Box, Tooltip } from "@mui/material";
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonImg from "../assets/person-placeholder.jpeg";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../config/axios";

function Layout() {
  const url = import.meta.env.VITE_API_URL;

  const navigate = useNavigate();
  const location = useLocation();
  const user_id = localStorage.getItem("user_id");

  const [profileData, setProfileData] = useState(null);
  const [layoutGridStyle, setLayoutGridStyle] = useState("90px 450px 1fr");

  useEffect(() => {
    if (location.pathname === "/home") {
      setLayoutGridStyle("90px 450px 1fr");
    } else {
      setLayoutGridStyle("90px 1fr");
    }
  }, [location])

  useEffect(() => {
    axiosInstance.get(`${url}/users/${user_id}`)
    .then((res) => {
      setProfileData(res.data.data);
    }).catch((err) => {
      if (err.response.status === 401 || err.response.status === 403) {
        navigate("/login", { state: { isRedirect: true } });
      }
    })
  }, [navigate, url, user_id])

  const handleNavigate = (location) => {
    return () => {
      return navigate(location);
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    return navigate("/login");
  }

  return (
    <Box sx={{ display: "grid", gridTemplateColumns: layoutGridStyle }}>
      <div style={{ width: '', height: "100vh", backgroundColor: "#8C3061", display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
        <Stack sx={{ px: 2, py: 2}}>
          <img src={Logo} width="50" alt="" />
          <Box sx={{ mt: 2, borderTop: '2px solid #4535C1' }} />
          <Tooltip title="Messages">
            <IconButton onClick={handleNavigate("/home")} sx={{ mt: 2, mb: 2 }}><ChatBubbleOutlineIcon sx={{ color: 'white', '&:hover': { transform: 'scale(1.1)'} }} /></IconButton>
          </Tooltip>
          <Tooltip title="Profile">
            <IconButton onClick={handleNavigate(`/profile/${profileData?._id}`)}><PersonOutlineIcon sx={{ color: 'white', '&:hover': { transform: 'scale(1.1)'} }} /></IconButton>
          </Tooltip>
        </Stack>
        <Stack sx={{ px: 2, py: 2 }}>
          <Tooltip title="Logout">
            <IconButton onClick={handleLogout}><LogoutIcon sx={{ color: 'white', '&:hover': { transform: 'scale(1.1)'} }} /></IconButton>
          </Tooltip>
          <Box sx={{ mt: 2, borderTop: '2px solid #4535C1' }} />
          <Box sx={{ mt: 3, mb: 2, display: "flex", justifyContent: "center", cursor: "pointer"}}>
            <img src={profileData?.image ? profileData.image.url : PersonImg} style={{ borderRadius: "48%", objectFit: "cover" }} width="47" height="47" alt="" />
          </Box>
        </Stack>
      </div>
      {/* <div style={{width: "80%"}}> */}
        <Outlet />
      {/* </div> */}
    </Box>
  )
}

export default Layout;