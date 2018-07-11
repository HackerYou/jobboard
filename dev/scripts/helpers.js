export const sortJobsChronologically = (jobs) => {
    const jobDates = Object.keys(jobs).map(jobId => {
        return [jobId, jobs[jobId].timeCreated];
      });
    const compare = function(a,b){
        if (a[1] < b[1])
        return 1;
        if (a[1] > b[1])
        return -1;
        return 0;
    }
    const sortedJobIds = jobDates.sort(compare).map(jobs => jobs[0]);
    return sortedJobIds;
};

export const keywordList = ['css', 'js', 'html', 'jquery', 'indesign', 'ruby', 'sketch', 'react', 'angular', 'mongoDB', 'node', 'wordpress', 'full stack', 'front end', 'back end', 'ux', 'ui', 'design', 'photoshop', 'excel'];
