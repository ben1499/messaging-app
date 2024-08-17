import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";

function Error() {
  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", minHeight: "90vh"}}>
      <Typography variant="h1">404</Typography>
      <Typography variant="h5">Page not found. Go back to <Link to="/home">Home</Link></Typography>
    </Box>
  )
}

export default Error;