import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/home/home";
import Login from "./pages/login/login";
import Signup from "./pages/signup/signup";
import Connection from "./pages/connection/connection";
import Job from "./pages/job/job";
import JobList from "./pages/jobList/jobList";
import ProtectedRoute from "./ProtectedRoute";
import Header from "./components/header/header";
import PrivateRoute from "./PrivateRoute";
import React from "react";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            exact
            path="/"
            element={
              <React.Fragment>
                <Header />
                <Home />
              </React.Fragment>
            }
          />
          <Route
            exact
            path="/connection"
            element={
              <ProtectedRoute>
                <Header />
                <Connection />
              </ProtectedRoute>
            }
          />
          <Route
            exact
            path="/job"
            element={
              <ProtectedRoute>
                <Header />
                <Job />
              </ProtectedRoute>
            }
          />
          <Route
            exact
            path="/jobs"
            element={
              <ProtectedRoute>
                <Header />
                <JobList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PrivateRoute>
                <Login />
              </PrivateRoute>
            }
          />
          <Route
            exact
            path="/signup"
            element={
              <PrivateRoute>
                <Signup />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
