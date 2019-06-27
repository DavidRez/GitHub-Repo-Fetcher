import React from 'react';
import ReactDOM from 'react-dom';
import Search from './components/Search.jsx';
import RepoList from './components/RepoList.jsx';
import axios from 'axios';

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
    axios.get('http://localhost:1128/repos')
    .then((result) => {
      if (result.data.length > 0)
        this.setState({repos:result.data});
    })
    .catch(() => console.log('error getting'))
  }

  search(term) {
    //adding repos of github user
    axios.post('http://localhost:1128/repos', term)
    .then(() => {
      this.top();
    })
    .catch(() => console.log('error posting'))
  }

  render () {
    return (<div>
      <h1>GitHub Repo Fetcher</h1>
      {/* search box */}
      <Search onSearch={this.search} />

      {/* list of repos */}
      <RepoList repos={this.state.repos}/>

    </div>)
  }
}

ReactDOM.render(<App />, document.getElementById('app'));