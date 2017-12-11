var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Run this example by adding <%= javascript_pack_tag 'hello_react' %> to the head of your layout file,
// like app/views/layouts/application.html.erb. All it does is render <div>Hello React</div> at the bottom
// of the page.

import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { UserProductList } from './user-product-list';
import _ from 'underscore';
import 'jquery';

import 'loaders.css';
import 'bootstrap/dist/css/bootstrap.css';

var Mercalista = function (_React$Component) {
  _inherits(Mercalista, _React$Component);

  function Mercalista(props) {
    _classCallCheck(this, Mercalista);

    var _this = _possibleConstructorReturn(this, (Mercalista.__proto__ || Object.getPrototypeOf(Mercalista)).call(this, props));

    _this.state = {};
    return _this;
  }

  _createClass(Mercalista, [{
    key: 'componentWillMount',
    value: function componentWillMount() {}
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      if (this.onWindowResizeBound == null) this.onWindowResizeBound = this.onWindowResize.bind(this);
      window.addEventListener("resize", this.onWindowResizeBound);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      if (this.onWindowResizeBound) window.removeEventListener("resize", this.onWindowResizeBound);
    }
  }, {
    key: 'render',
    value: function render(props) {
      var appHeight = window.innerHeight;
      var appWidth = window.innerWidth;

      var framebarWidth = appWidth * 0.3;
      var listviewWidth = appWidth - framebarWidth;

      return React.createElement(
        'div',
        { id: 'main-view', style: { height: appHeight } },
        React.createElement(
          'div',
          { className: 'splitter-listview', style: { width: listviewWidth, height: appHeight, overflowY: 'scroll' } },
          React.createElement(UserProductList, null)
        ),
        React.createElement(
          'div',
          { className: 'splitter-framebar', style: { height: appHeight, width: framebarWidth, position: 'fixed', top: '0', right: '0' } },
          React.createElement('iframe', { key: 1, id: 'shopframe', style: { border: 'none', width: '100%', height: appHeight }, width: '100%' })
        )
      );
    }
  }, {
    key: 'onWindowResize',
    value: function onWindowResize(event) {
      this.setState(this.state);
    }
  }]);

  return Mercalista;
}(React.Component);

setTimeout(function () {
  var frame = document.getElementById('shopframe');
  frame.src = 'https://beta.elcorteingles.es/';
}, 500);

Mercalista.defaultProps = {
  name: 'David'
};

Mercalista.propTypes = {
  name: PropTypes.string
};

document.addEventListener('DOMContentLoaded', function () {
  ReactDOM.render(React.createElement(Mercalista, { name: 'React' }), document.body.appendChild(document.createElement('div')));
});