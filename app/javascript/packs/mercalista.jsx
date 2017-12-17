// Run this example by adding <%= javascript_pack_tag 'hello_react' %> to the head of your layout file,
// like app/views/layouts/application.html.erb. All it does is render <div>Hello React</div> at the bottom
// of the page.

import 'loaders.css'
import 'bootstrap/dist/css/bootstrap.css';

import _ from 'underscore'
import 'jquery'

import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import {UserProductList} from './user-product-list'
import {IntroOverlay} from './intro-overlay'
import {Button} from 'reactstrap'
import {PreferencesDialog} from './preferences-dialog'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {FrameloadingOverlay} from "./frameloading-overlay";

class Mercalista extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showIntro: true,
      showPreferences: false,
      iframeLoading: false,
      showIframe: window.isMobile ? false : true,
    };

    if (window.environment == 'development')
      window.mercalista = this;

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

    let showIframe = this.state.showIframe;

    // Mobile layout
    if (window.isMobile) {
      listviewWidth = appWidth;
      framebarWidth = appWidth;
    }

    let dialogs = [];

    if (this.state.showPreferences) {
      dialogs.push(<PreferencesDialog className="PreferencesDialog ui-dialog"
       key="preferences"
       displayed={this.state.showPreferences}
       style={{width: listviewWidth, height: appHeight }}
       mercalista={this} />);
    }

    return (<div id="main-view" className={"" + (window.isMobile ? " mobile " : '')} style={{height: appHeight}}>
      <div className="splitter-listview" style={{width: listviewWidth, height: appHeight, overflowY: 'scroll'}}>
        <UserProductList setIframeOffer={this.setIframeOffer.bind(this)} framebarWidth={framebarWidth}
                         onPreferencesClick={this.onPreferencesClick.bind(this)}
                         openOfferResource={this.openOfferResource.bind(this)}
                         mercalista={this} />
        <ReactCSSTransitionGroup
          transitionName="ui-dialog"
          transitionEnterTimeout={300}
          transitionLeaveTimeout={200}>
          {dialogs}
        </ReactCSSTransitionGroup>
      </div>
      <div className={'splitter-framebar ' + (this.state.showIframe ? 'displayed' : 'hidden')} style={{height: appHeight, width: framebarWidth, position: 'fixed', top: '0', right: '0' }}>
        <div className="iframe-container" style={{width: '100%', height: appHeight - 48, webkitOverflowScrolling: 'touch', overflowY: 'scroll', width: '100%'}}>
          <iframe key={1} id="shopframe" style={{border: 'none', width: '100%', height: (window.isMobile ? '100%' : appHeight - 48), display: 'block' }} width="100%"></iframe>
        </div>
        {!window.isMobile ? this.renderIframeToolbarDesktop(props) : this.renderIframeToolbarMobile(props)}
      </div>
      {this.state.showIframe && <FrameloadingOverlay visible={this.state.iframeLoading} style={{width: framebarWidth, height: appHeight }} />}
      {!window.isMobile && <IntroOverlay visible={(this.state.showIntro && this.state.showIframe) ? true : false} style={{width: framebarWidth, height: appHeight }} />}
    </div>)
  }

  renderIframeToolbarDesktop(props) {
    return (<Button onClick={this.onOpenInTabClick.bind(this)} style={{borderRadius: 0, width: '100%', height: 48}}>
      <i className="fa fa-publish"></i>
      Abrir en pestaña
    </Button>);
  }

  renderIframeToolbarMobile(props) {
    return (<div className="mobile-toolbar-iframe-bottom">
      <Button onClick={this.hideIframe.bind(this)} className="button-close" style={{borderRadius: 0, width: '20%', height: 48}}>
        <i className="fa fa-block"></i>
      </Button>
      <Button onClick={this.onOpenInTabClick.bind(this)} style={{borderRadius: 0, width: '80%', height: 48}}>
        <i className="fa fa-publish"></i>
        Abrir en pestaña
      </Button>
    </div>);
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

  openOfferResource(offer) {
    this.setIframeOffer(offer)

    let frame = document.getElementById('shopframe');
    let scope = this;

    this.showFrameLoader();

    // Reeeally dirty way to hide the loading overlay
    setTimeout(function() {
      scope.hideFrameLoader();
    }, 1260);

    if (window.isMobile) {
      this.setState({showIframe: true});
    }

    frame.src = offer.agent_url;
  }

  onOpenInTabClick() {
    if (this.currentOffer && this.currentOffer.agent_url) {
      window.open(this.currentOffer.agent_url, '_blank');
      sendGaEvent('exit', 'openShop', this.currentOffer.agent);
    }
  }

  showFrameLoader() {
    this.setState({iframeLoading: true, showIntro: false});
  }

  hideFrameLoader() {
    this.setState({iframeLoading: false});
  }

  /**
   * Hides the iFrame panel, but does so only for mobile view
   */
  hideIframe() {
    if (window.isMobile) {
      this.setState({showIframe: false});
    }
  }

  onPreferencesClick() {
    this.setState({showPreferences: !this.state.showPreferences});
  }
}

setTimeout(function() {
  let frame = document.getElementById('shopframe');

  if (frame) {
    frame.src = 'about:blank';

    frame.onload = function() {
      console.log("loaded iframe");
    }
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
