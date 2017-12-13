// Run this example by adding <%= javascript_pack_tag 'hello_react' %> to the head of your layout file,
// like app/views/layouts/application.html.erb. All it does is render <div>Hello React</div> at the bottom
// of the page.

import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import {UserProductList} from './user-product-list'
import {IntroOverlay} from './intro-overlay'
import {Button} from 'reactstrap'
import _ from 'underscore'
import 'jquery'

import 'loaders.css'
import 'bootstrap/dist/css/bootstrap.css';
import {FrameloadingOverlay} from "./frameloading-overlay";

class Mercalista extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showIntro: true,
      iframeLoading: false,
    };

    this.hideFrameLoader = this.hideFrameLoader.bind(this);
    this.showFrameLoader = this.showFrameLoader.bind(this);
    this.onFirstProductClick = this.onFirstProductClick.bind(this);
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
        <UserProductList setIframeOffer={this.setIframeOffer.bind(this)} mercalista={this} />
      </div>
      <div className="splitter-framebar" style={{height: appHeight, width: framebarWidth, position: 'fixed', top: '0', right: '0' }}>
        <iframe key={1} id="shopframe" style={{border: 'none', width: '100%', height: appHeight - 48, display: 'block' }} width="100%"></iframe>
        <Button onClick={this.onOpenInTabClick.bind(this)} style={{borderRadius: 0, width: '100%', height: 48}}>
          <i className="fa fa-publish"></i>
          Abrir en pestaña
        </Button>
      </div>
      <FrameloadingOverlay visible={this.state.iframeLoading} style={{width: framebarWidth, height: appHeight }} />
      <IntroOverlay visible={this.state.showIntro} style={{width: framebarWidth, height: appHeight }} />
    </div>)
  }

  onWindowResize(event) {
    this.setState(this.state);
  }

  onFirstProductClick() {
    this.setState({showIntro: false});
  }

  setIframeOffer(offer) {
    this.currentOffer = offer;
  }

  onOpenInTabClick() {
    if (this.currentOffer && this.currentOffer.agent_url) {
      window.open(this.currentOffer.agent_url, '_blank');
      sendGaEvent('exit', 'openShop');
    }
  }

  showFrameLoader() {
    this.setState({iframeLoading: true});
  }

  hideFrameLoader() {
    this.setState({iframeLoading: false});
  }
}

setTimeout(function() {
  let frame = document.getElementById('shopframe');
  frame.src = 'about:blank';

  frame.onload = function() {
    console.log("loaded iframe");
  }
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
