import React from 'react';

const RepoList = (props) => (
  <div id="list">
    <table>
    <tbody>
    {props.repos.map((repo, i) => {
      return <tr key={i}>
            <td>
            <div className="reponame"><b><a href={repo.html_url}>{repo.repo_name}</a></b></div>
            <div className="reponum">#{i+1}</div>
            <div className="username">Username: {repo.user_login}</div>
            <div className="forks">Forks: {repo.forks}</div>
            </td>
            </tr>;s
    })}
    </tbody>
    </table>
  </div>
)

export default RepoList;