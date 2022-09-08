import axios from "axios";
import { useEffect, useState } from "react";
import EnhancedTable from "../../components/table/table";

function JobList() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/job/list", {
        withCredentials: true,
      })
      .then((response) => {
        setJobs(response.data);
      });
  }, []);

  return (
    <div>
      <EnhancedTable records={jobs} />
    </div>
  );
}

export default JobList;
