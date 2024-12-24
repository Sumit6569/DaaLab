import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Grid, Paper, Box, Container, CircularProgress, Backdrop } from "@mui/material";
import { AccountCircle, School, Group } from "@mui/icons-material";
import './LoginPage.css'; // Import the CSS file


function LoginPage() {
  const navigate = useNavigate();

  const navigateHandler = (path) => {
    navigate(path);
  };
  return (
    <>
      <div className="styled-container">
        <Container>
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12} sm={6} md={4}>
              <Link to="/admin/login">
                <div onClick={() => navigateHandler("Admin")}>
                  <Paper elevation={3} className="styled-paper">
                    <Box mb={2}>
                      <AccountCircle fontSize="large" />
                    </Box>
                    <h2 className="styled-typography">Admin</h2>
                    Login as an administrator to access the dashboard to manage app data.
                  </Paper>
                </div>
              </Link>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Link to="/student/login">
                <Paper elevation={3} className="styled-paper">
                  <div onClick={() => navigateHandler("Student")}>
                    <Box mb={2}>
                      <School fontSize="large" />
                    </Box>
                    <h2 className="styled-typography">Student</h2>
                    Login as a student to explore course materials and assignments.
                  </div>
                </Paper>
              </Link>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Link to="/teacher/login">
                <Paper elevation={3} className="styled-paper">
                  <div onClick={() => navigateHandler("Teacher")}>
                    <Box mb={2}>
                      <Group fontSize="large" />
                    </Box>
                    <h2 className="styled-typography">Teacher</h2>
                    Login as a teacher to create courses, assignments, and track student progress.
                  </div>
                </Paper>
              </Link>
            </Grid>
          </Grid>
        </Container>
        <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <CircularProgress color="inherit" />
          Please Wait
        </Backdrop>
      </div>
    </>
  );
}

export default LoginPage;
