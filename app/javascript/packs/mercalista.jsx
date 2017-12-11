// Run this example by adding <%= javascript_pack_tag 'hello_react' %> to the head of your layout file,
// like app/views/layouts/application.html.erb. All it does is render <div>Hello React</div> at the bottom
// of the page.

import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import {UserProductList} from './user-product-list'
import _ from 'underscore'
import 'jquery'

import 'loaders.css'
import 'bootstrap/dist/css/bootstrap.css';

class Mercalista extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

    };
  }

  componentWillMount() {

  }

  componentDidMount() {
    if (this.onWindowResizeBound == null)
      this.onWindowResizeBound = this.onWindowResize.bind(this);
    window.addEventListener("resize", this.onWindowResizeBound);
  }

  componentWillUnmount() {
    if (this.onWindowResizeBound)
      window.removeEventListener("resize", this.onWindowResizeBound);
  }

  render(props) {
    let appHeight = window.innerHeight;
    let appWidth = window.innerWidth;

    let framebarWidth = appWidth * 0.3;
    let listviewWidth = appWidth - framebarWidth;

    return (<div id="main-view" style={{height: appHeight}}>
      <div className="splitter-listview" style={{width: listviewWidth, height: appHeight, overflowY: 'scroll'}}>
        <UserProductList />
      </div>
      <div className="splitter-framebar" style={{height: appHeight, width: framebarWidth, position: 'fixed', top: '0', right: '0' }}>
        <iframe key={1} id="shopframe" style={{border: 'none', width: '100%', height: appHeight }} width="100%"></iframe>
      </div>
    </div>)
  }

  onWindowResize(event) {
    this.setState(this.state);
  }
}

setTimeout(function() {
  let frame = document.getElementById('shopframe');
  frame.src = 'https://beta.elcorteingles.es/';
}, 500);

Mercalista.defaultProps = {
  name: 'David'
}

Mercalista.propTypes = {
  name: PropTypes.string
}

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <Mercalista name="React" />,
    document.body.appendChild(document.createElement('div')),
  )
})
