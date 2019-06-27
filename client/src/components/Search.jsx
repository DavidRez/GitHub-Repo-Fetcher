import React from 'react';

class Search extends React.Component {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
    this.search = this.search.bind(this);

    this.state = {
      term: ''
    }
  }

  onChange(e) {
    this.setState({
      term: e.target.value
    });
  }

  search(e) {
    this.props.onSearch(this.state.term);
    this.setState({term:''});
    e.preventDefault();
  }

  render() {
    return (
    <div id="searchbox">
      Enter a github username: <br/>
      <form>
      <input value={this.state.term} onChange={this.onChange} /> <br/>
      <button onClick={this.search}> Add Repos </button>
      </form>
    </div>)
  }
}

export default Search;