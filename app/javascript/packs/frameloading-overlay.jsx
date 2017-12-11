import React from 'react'
import {findDOMNode} from 'React-dom';
import sprintf from 'sprintf';
import _ from 'underscore';
import $ from 'jquery';
import Loader from 'react-loaders';

export class FrameloadingOverlay extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

    }
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
    return (<div className="framebar-overlay frameloading-overlay" style={this.props.style}>
      <Loader type="ball-grid-beat" active style={{width: 57, height: 57, margin: '10px auto' }} />
    </div>)
  }
}