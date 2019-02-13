import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import Search from './components/Search.jsx';
import RepoList from './components/RepoList.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.top = this.top.bind(this);
    this.search = this.search.bind(this);

    this.state = {
      repos: [] //hold data for each repo pulled from database
    }
  }

  componentDidMount() {
    this.top();
  }

  top() {
    // get top 25 repos from database
    $.ajax({
      url : 'http://localhost:1128/repos',
      type : 'GET',
      contentType: 'application/json',
      success: result => {
        console.log('react getting top 25');
        this.setState({repos:result});
      },
      error: err => {
        console.log('error getting top 25');
      }
    });
  }

  search(term) {
    // get repos from github api for username entered
    $.ajax({
      url : 'http://localhost:1128/repos',
      type : 'POST',
      data: term,
      success: result => {
        console.log('react success');
        this.top();
      },
      error: err => {
        console.log('error from react');
      }
    });
  }

  render () {
    return (<div>
      <h1>GitHub Repo Fetcher</h1>
      {/* search box */}
      <Search onSearch={this.search}/>

      {/* list of repos */}
      <RepoList repos={this.state.repos}/>

    </div>)
  }
}

ReactDOM.render(<App />, document.getElementById('app'));