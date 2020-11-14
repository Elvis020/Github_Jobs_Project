import React, {useState} from 'react';
import useFetchJobs from './useFetchJobs';
import {Container} from 'react-bootstrap';
import Job from './Job';
import JobsPagination from './JobsPagination';
import SearchForm from './SearchForm';

function App() {
  const [params, setParams] = useState({});
  const [page, setPage] = useState(1);


  // Function to handle Input Change ehen the user searches for jobs
  const handleParamChange = (e) => {
    const param = e.target.name;
    const value = e.target.value;
    setPage(1)
    setParams(prevParams => {
      return {...prevParams, [param]: value}
    })
  }

  const {jobs,error,loading, hasNextPage} = useFetchJobs(params, page);
  return (
    <Container className="my-4">
    <h1 className="mb-4 text-center text-white">Github Jobs</h1>
    <SearchForm params={params} onParamsChange={handleParamChange} />
    
    <JobsPagination page={page} setPage={setPage} hasNextPage={hasNextPage} />
      {loading && <h1>Loading...</h1>}
      {error && <h1>Error occured. Try refreshing the page</h1>}
      {/* {jobs && <h1>{jobs.length}</h1>} */}
      {jobs.map((job) => {
        return <Job key={job.id} job={job} />;
      })}
    </Container>
  );
}

export default App;
