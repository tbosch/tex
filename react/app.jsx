import React from 'react';

class Title extends React.Component {
  render() {
    return <span>{this.props.children}</span>
  }
}

class Description extends React.Component {
  render() {
    return <span>{this.props.children}</span>
  }
}

class Talk extends React.Component {
  render() {
    var c = this.props.children;
    var title = c.filter(_ => _.type === Title)[0];
    var description = c.filter(_ => _.type === Description)[0];
    var url = `someTalk/${this.props.id}`;
    var style = this.props.active ? {background: 'green'} : {background: 'white'};

    return (
      <li style={style}>
        <a href={url}>
          {title} by {this.props.speaker}
        </a>
        <p>
          {description}
        </p>
      </li>
    );
  }
}

class ConfTalks extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      fitlerValue: '',
      selected: null,
      timeout: null
    };
  }

  handleChange(event) {
    var fvalue = event.target.value;

    clearTimeout(this.state.timer);

    this.state.timer = setTimeout(() => {
      if (fvalue) {
        var filtered = this.props.children.filter(_ => _.props.speaker.indexOf(fvalue) > -1);
        this.setState({
          filterValue: fvalue,
          selected: filtered[0]
        });
      } else {
        this.setState({
          filterValue: '',
          selected: null
        });
      }
    }, 500);
  }

  render() {
    var children = React.Children.map(this.props.children, (c) => {
      if (this.state.selected === c) {
        return React.cloneElement(c, {active: true});
      } else {
        return c;
      }
    });
    return (
      <conf-talks>
        Speaker <input onChange={this.handleChange}></input>
        <ul>
          {children}
        </ul>
      </conf-talks>
    );
  }
}

var value = (
  <ConfTalks>
    <Talk id="1" speaker="Igor Minar">
      <Title>Some Title</Title>
      <Description>Some2<b>Description</b></Description>
    </Talk>
    <Talk id="2" speaker="Jeff Cross">
      <Title>Data</Title>
      <Description>Data Stuff</Description>
    </Talk>
  </ConfTalks>
);

React.render(value, document.getElementById('content'))
