import React from 'react'
import {findDOMNode} from 'react-dom';
import {UserPreferences} from './user-preferences'
import {Agent} from './agent'
import sprintf from 'sprintf';
import _ from 'underscore';
import $ from 'jquery';

export class PreferencesDialog extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      prefs: new UserPreferences()
    }

    this.mercalista = props.mercalista;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.visible !== this.props.visible) {
      if (nextProps.visible) {
        $(findDOMNode(this)).stop(true, true).fadeIn('slow');
      } else {
        $(findDOMNode(this)).stop(true, true).fadeOut('slow');
      }
    }
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render(props) {
    let lists = [];
    let scope = this;

    console.log(this.state.prefs.data);

    this.state.prefs.data.lists.forEach(function(savedList) {
      let queries = savedList.queries ? savedList.queries.join(', ') : null;
      lists.push(<li key={ "search" + savedList.token } onClick={scope.selectList.bind(this, savedList)}>
        <div className="queries">{ queries }</div>
        <div className="agent">{ Agent.AGENTS[savedList.agent].name }</div>
      </li>)
    });

    return (<div className={'PreferencesDialog ui-dialog ' + (this.props.displayed ? 'ui-displayed' : '') + ' ' + (!this.props.displayed ? 'ui-hidden' : '')} style={this.props.style}>
      <div className="float-right">
        <a className="close-button" onClick={this.hideDialog.bind(this)}><i className="fa fa-block"></i></a>
      </div>

      <ul className="lists">
        { lists }
      </ul>
    </div>)
  }

  hideDialog() {
    this.mercalista.setState({showPreferences: false})
  }

  selectList(list) {
    location.href = sprintf('/l/%s', list.token);
  }
}