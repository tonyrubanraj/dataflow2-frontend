import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/home/home";
import Login from "./pages/login/login";
import Signup from "./pages/signup/signup";
import Connection from "./pages/connection/connection";
import Job from "./pages/job/job";
import JobList from "./pages/jobList/jobList";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/connection" element={<Connection />} />
          <Route exact path="/job" element={<Job />} />
          <Route exact path="/job/list" element={<JobList />} />
          <Route path="/login" element={<Login />} />
          <Route exact path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
