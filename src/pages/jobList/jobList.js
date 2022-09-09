import { useEffect, useState } from "react";
import EnhancedTable from "../../components/enhancedTable/enhancedTable";
import { getJobs } from "../../services/jobServices";

function JobList() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    getJobs()
      .then((response) => {
        setJobs(response.data);
      })
      .catch(() => {
        setJobs([]);
      });
  }, []);

  return (
    <div>
      <EnhancedTable records={jobs} />
    </div>
  );
}

export default JobList;
