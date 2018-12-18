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
      repos: []
    }
  }

  componentDidMount() {
    this.top();
  }

  top() {
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
    console.log(`${term} was searched`);
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
      <Search onSearch={this.search}/>
      <RepoList repos={this.state.repos}/>

    </div>)
  }
}

ReactDOM.render(<App />, document.getElementById('app'));