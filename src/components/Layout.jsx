import Logo from "../assets/chat-logo.png";
import { Stack, IconButton, Box, Tooltip, Snackbar } from "@mui/material";
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonImg from "../assets/person-placeholder.jpeg";
import { Outlet, useNavigate, useLocation, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../config/axios";

function Layout() {
  const url = import.meta.env.VITE_API_URL;

  const navigate = useNavigate();
  const location = useLocation();
  const user_id = localStorage.getItem("user_id");

  const [profileData, setProfileData] = useState(null);
  const [layoutGridStyle, setLayoutGridStyle] = useState("90px 450px 1fr");
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState(null);

  useEffect(() => {
    if (location.pathname === "/home") {
      setLayoutGridStyle("80px 450px 1fr");
    } else {
      setLayoutGridStyle("80px 1fr");
    }
  }, [location])

  useEffect(() => {
    axiosInstance.get(`${url}/users/${user_id}`)
    .then((res) => {
      setProfileData(res.data.data);
    }).catch((err) => {
      console.log(err);
      if (!err.response || err.response.status !== 400) {
        setSnackMessage("Something went wrong. Please try again.");
        setSnackOpen(true);
        navigate("/login");
        return;
      }
      if (err.response.status === 401 || err.response.status === 403) {
        localStorage.removeItem("token");
        localStorage.removeItem("user_id");
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

  const handleSnackClose = () => {
    setSnackOpen(false);
  }

  return (
    <Box sx={{ minHeight: "100vh", display: "grid", gridTemplateRows: { lg: "none", sm: "1fr 70px", xs: "1fr 70px" }, gridTemplateColumns: { lg: layoutGridStyle, sm: location.pathname === "/home" ? "none" : "none", xs: location.pathname === "/home" ? "none" : "none" } }}>
      <Snackbar
        open={snackOpen}
        autoHideDuration={3000}
        onClose={handleSnackClose}
        message={snackMessage}
      />
      <Box sx={{ height: { lg: "100vh", sm: "10vh", xs: "8vh"}, backgroundColor: "#8C3061", display: "flex", flexDirection: { lg: "column", sm: "row", xs: "row"}, justifyContent: "space-between", alignItems: { lg: "", sm: "center", xs: "center"}, order: { lg: 0, sm: 1, xs: 1} }}>
        <Stack sx={{ px: 2, py: { lg: 2, sm: 0, xs: 0 }}} direction={{ lg: "column", xs: "row" }}>
          <Link to="/home"><img className="layout-logo" src={Logo} width={50} alt="" /></Link>
          <Box sx={{ mt: 2, borderTop: '2px solid #4535C1' }} />
          <Tooltip title="Messages">
            <IconButton onClick={handleNavigate("/home")} sx={{ mt: 2, mb: 2 }}><ChatBubbleOutlineIcon sx={{ color: location.pathname === "/home" ? "#3795BD" : "white", '&:hover': { transform: 'scale(1.1)'} }} /></IconButton>
          </Tooltip>
          <Tooltip title="Profile">
            <IconButton onClick={handleNavigate(`/profile/${profileData?._id}`)}><PersonOutlineIcon sx={{ color: location.pathname?.split("/")[2] === profileData?._id ? "#3795BD" : "white", '&:hover': { transform: 'scale(1.1)'} }} /></IconButton>
          </Tooltip>
        </Stack>
        <Stack sx={{ px: 2, py: { lg: 2, sm: 0, xs: 0, gap: "8px" }}} alignItems="center" direction={{ lg: "column", sm: "row", xs: "row" }}>
          <Tooltip title="Logout">
            <IconButton onClick={handleLogout}><LogoutIcon sx={{ color: 'white', '&:hover': { transform: 'scale(1.1)'} }} /></IconButton>
          </Tooltip>
          {/* <Box sx={{ mt: 2, borderTop: '2px solid #4535C1' }} /> */}
          {/* <Box sx={{ mt: 3, mb: 2, ml: { sm: 1, xs: 1}, display: "flex", justifyContent: "center", cursor: "pointer"}}> */}
            <Link to={`/profile/${profileData?._id}`}><img className="layout-profile-img" src={profileData?.image ? profileData.image.url : PersonImg} style={{ borderRadius: "48%", objectFit: "cover", width: "47px", height: "47px" }} alt="" /></Link>
          {/* </Box> */}
        </Stack>
      </Box>
      {/* <div style={{width: "80%"}}> */}
        <Outlet />
      {/* </div> */}
    </Box>
  )
}

export default Layout;