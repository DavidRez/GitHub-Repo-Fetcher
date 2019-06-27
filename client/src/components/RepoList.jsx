import React from 'react';

const RepoList = (props) => (
  <div id="list">
    {props.repos.map((repo, i) => {
      return <div className="repo" key={i}>
              <div className="top">
                <div className="reponame"><b><a href={repo.html_url}>{repo.repo_name}</a></b></div>
                <div className="reponum">#{i+1}</div>
              </div>
              <div className="bottom">
                <div className="username">Username: {repo.user_login}</div>
                <div className="forks">Forks: {repo.forks}</div>
              </div>
            </div>;
    })}
  </div>
)

export default RepoList;