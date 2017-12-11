var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _desc, _value, _class;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['ke' + 'ys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['define' + 'Property'](target, property, desc);
    desc = null;
  }

  return desc;
}

import React from 'react';
import PropTypes from 'prop-types';
import { ButtonGroup, Button, InputGroup, Input, InputGroupAddon } from 'reactstrap';
import { ListEntryData } from './list-entry-data.es6';
import keydown, { Keys } from 'react-keydown';
import sprintf from 'sprintf';
import _ from 'underscore';
import Loader from 'react-loaders';
import $ from 'jquery';
var ENTER = Keys.ENTER,
    TAB = Keys.TAB;


export var UserProductList = (_dec = keydown(ENTER, TAB, Keys.down, Keys.up, Keys.backspace), (_class = function (_React$Component) {
  _inherits(UserProductList, _React$Component);

  function UserProductList(props) {
    _classCallCheck(this, UserProductList);

    var _this = _possibleConstructorReturn(this, (UserProductList.__proto__ || Object.getPrototypeOf(UserProductList)).call(this, props));

    _this.entryElements = [];

    _this.state = {
      fetchedResultsOnce: false,
      agent: 'crf',
      entries: [new ListEntryData({ value: location.hostname == 'localhost' ? 'platanos' : '' })],
      currentIndex: 0 // Index num of current entry
    };

    window.productEntries = _this.state.entries;
    return _this;
  }

  _createClass(UserProductList, [{
    key: 'componentDidMount',
    value: function componentDidMount() {}
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {}
  }, {
    key: 'render',
    value: function render(props) {
      var _this2 = this;

      var searchExample = "Tomates, platanos, agua...";

      var entries = [];

      this.state.entries.forEach(function (entry, num) {
        entries.push(_this2.renderEntry(entry, num));
      });

      var selectedTotal = 0;

      try {
        selectedTotal = _.chain(this.state.entries).map(function (entry) {
          return entry.focusedOfferNum === null ? 0 : parseFloat(entry.offers[entry.focusedOfferNum].price);
        }).reduce(function (memo, num) {
          return memo + num;
        }).value();
      } catch (e) {
        console.warn("Error during calculation of total", e);
      }

      return React.createElement(
        'div',
        { className: 'UserProductList' },
        React.createElement(
          ButtonGroup,
          null,
          React.createElement(
            Button,
            { onClick: this.onAgentSelectionClick.bind(this, 'eci'), color: 'eci' == this.state.agent ? 'info' : 'light' },
            'Supermercado El Corte Ingles'
          ),
          React.createElement(
            Button,
            { onClick: this.onAgentSelectionClick.bind(this, 'crf'), color: 'crf' == this.state.agent ? 'info' : 'light' },
            'Supermercado Carrefour'
          )
        ),
        React.createElement(
          'ul',
          null,
          entries
        ),
        React.createElement(
          'div',
          { className: 'text-center', style: { marginTop: '50px' } },
          React.createElement(
            'button',
            { className: 'btn btn-light btn-lg', onClick: this.onCollapseAllClick.bind(this), style: { width: '100px', float: 'left' } },
            '\u2013 todo'
          ),
          React.createElement(
            'button',
            { className: 'btn btn-success btn-lg', onClick: this.onFetchResultsClick.bind(this), style: { minWidth: '200px' } },
            this.state.fetchedResultsOnce ? React.createElement(
              'span',
              null,
              React.createElement('i', { className: 'fa fa-refresh' }),
              ' Actualizar'
            ) : React.createElement(
              'span',
              null,
              'Encontrar!'
            )
          ),
          React.createElement(
            'button',
            { className: 'btn btn-lg btn-default', style: { float: 'right' } },
            'Total: \u20AC',
            selectedTotal
          )
        ),
        React.createElement(
          'div',
          { className: 'text-center', style: { margin: '30px auto auto auto', width: '70%' } },
          React.createElement(
            'p',
            { className: 'text-muted' },
            '1) Busca las mejores ofertas de supermercados online en tu zona y ahora el tiempo para selecionar los productos con reutilizar la lista!'
          ),
          React.createElement(
            'p',
            { className: 'text-muted' },
            '2) ',
            React.createElement(
              'strong',
              null,
              'Elige'
            ),
            ' el proveedor y ',
            React.createElement(
              'strong',
              null,
              'entra las cosas'
            ),
            ' como \'patatas\', \'agua mineral\' o \'platanos\' en la lista y busca las ofertas de provedores!'
          ),
          React.createElement(
            'small',
            { className: 'text-muted' },
            React.createElement(
              'i',
              null,
              'Mercalisty ltd. 2017 - 2018'
            )
          )
        )
      );
    }
  }, {
    key: 'renderEntry',
    value: function renderEntry(entry, num) {
      var _this3 = this;

      var scope = this;

      // Set focus shortly after rendering (left without a clue about how to do it 'the react-way')
      setTimeout(function () {
        if (scope.entryElements[scope.state.currentIndex]) scope.entryElements[scope.state.currentIndex].focus();
      }, 10);

      var productWidth = 180;
      var productResults = [];

      if (entry.offers && entry.offersExpanded) {
        _.each(entry.offers, function (product, productNum) {
          productResults.push(React.createElement(
            'div',
            { className: ["offer-item", entry.focusedOfferNum == productNum ? 'active' : ''].join(' '), key: 'offer_' + product.agent_id, onClick: _this3.onEntryClick.bind(_this3, num, product, productNum),
              style: { width: productWidth } },
            React.createElement('img', { src: product.image_url, className: 'thumb' }),
            React.createElement(
              'div',
              { className: 'offer-title' },
              product.name
            ),
            React.createElement(
              'div',
              { className: 'offer-price' },
              '\u20AC',
              product.price,
              product.price_per_kilo && React.createElement(
                'div',
                { className: 'offer-ref-price' },
                product.price_per_kilo
              )
            )
          ));
        });

        console.log(productResults);
      }

      return React.createElement(
        'li',
        { className: 'entry', key: 'entry' + num },
        React.createElement('input', { type: 'text', tabIndex: 50 + num, className: 'form-control entry-input',
          placeholder: entry.placeholder(), ref: function ref(input) {
            _this3.entryElements[num] = input;
          },
          style: { color: entry.searchFailed ? '#ff0000' : null },
          value: entry.getValue(),
          onChange: this.onEntryChange.bind(this, num),
          onBlur: this.onEntryBlur.bind(this, num),
          onKeyDown: this.onKeyDown, onFocus: this.onEntryFocus.bind(this, num) }),
        entry.offersExpanded && React.createElement(
          'div',
          { className: 'product-offers' },
          React.createElement(
            'div',
            { className: 'scroll-container', style: { width: '5000%' } },
            productResults.length > 0 ? productResults : '',
            !entry.isLoading && productResults.length == 0 && React.createElement(
              'span',
              { className: 'no-results' },
              'No encontramos ningunos productos :(...'
            )
          ),
          entry.isLoading && React.createElement(
            'div',
            { className: 'text-center' },
            React.createElement(Loader, { type: 'ball-grid-beat', active: true, style: { width: 57, height: 57, margin: '10px auto' } })
          )
        )
      );
    }
  }, {
    key: 'onKeyDown',
    // could also be an array
    value: function onKeyDown(event) {
      if (event.which === ENTER) {
        var state = this.state;
        var scope = this;
        var previousEntryExpanded = this.state.entries.length > 0 && this.state.entries.offersExpanded;

        // Scroll to last empty row if available
        if (this.state.entries[this.state.entries.length - 1].isBlank()) {
          state.currentIndex = this.state.entries.length - 1;
          this.setState(state);
        } else {
          var newEntry = new ListEntryData();

          // Add at the end or insert in the middle, depending
          // on cursor position
          if (state.currentIndex == state.entries.length - 1) {
            state.currentIndex += 1;
            state.entries.push(newEntry);
          } else {
            state.entries.splice(state.currentIndex + 1, 0, newEntry);
            state.currentIndex += 1;
          }

          this.setState(state);

          if (previousEntryExpanded) {
            newEntry.loadResults().then(function (results) {
              newEntry.offersExpanded = true;
              scope.setState(state);
            });
          }
        }
      } else if (event.which === Keys.down) {
        var _state = this.state;

        _state.currentIndex += 1;

        if (_state.currentIndex >= _state.entries.length) {
          _state.currentIndex = 0;
        }

        this.setState(_state);
      } else if (event.which === Keys.up) {
        var _state2 = this.state;

        _state2.currentIndex -= 1;

        if (_state2.currentIndex < 0) {
          _state2.currentIndex = _state2.entries.length - 1;
        }

        this.setState(_state2);
      } else if (event.which === Keys.backspace) {
        var _state3 = this.state;

        if (_state3.entries[_state3.currentIndex].getValue() && _state3.entries[_state3.currentIndex].getValue().length > 0) {
          // Do nothing
        } else {
          // Remove the empty entry
          _state3.entries.splice(_state3.currentIndex, 1);

          if (_state3.currentIndex > _state3.entries.length - 1) _state3.currentIndex = _state3.entries.length - 1;

          this.setState(_state3);
        }
      }
    }
  }, {
    key: 'onEntryChange',
    value: function onEntryChange(entryNum, event) {
      var state = this.state;

      state.entries[entryNum].setValue(event.target.value);
      this.setState(state);
      // console.log(entryNum, event.target.value);
    }
  }, {
    key: 'onEntryBlur',
    value: function onEntryBlur(entryNum, event) {
      var query = this.state.entries[entryNum].getValue();
      var scope = this;

      if (query != null && query.length > 1 && !this.state.entries[entryNum].isOfferValid()) {
        // Load results for the entry
        this.state.entries[entryNum].agent = this.state.agent;
        this.state.entries[entryNum].loadResults().then(function (result) {
          var state = scope.state;
          scope.setState(state);
        });
      }
    }
  }, {
    key: 'onEntryFocus',
    value: function onEntryFocus(entryNum, event) {
      var state = this.state;
      state.currentIndex = entryNum;
      this.setState(state);
    }
  }, {
    key: 'onEntryClick',
    value: function onEntryClick(entryNum, productData, productNum, event) {
      this.state.currentIndex = entryNum;
      this.state.entries[entryNum].focusedOfferNum = productNum;

      if (this.entryElements[this.state.currentIndex]) this.entryElements[this.state.currentIndex].focus();

      var frame = document.getElementById('shopframe');
      frame.src = productData.agent_url;

      this.setState(this.state);

      event.preventDefault();

      return false;
    }
  }, {
    key: 'onAgentSelectionClick',
    value: function onAgentSelectionClick(agent, event) {
      var agentWillChange = agent != this.state.agent;

      this.state.agent = agent;
      this.setState(this.state);

      var scope = this;

      if (agentWillChange) {
        this.state.entries.forEach(function (entry) {
          entry.agent = agent;
          entry.loadResults().then(function (r) {
            return scope.setState(scope.state);
          });
        });
      }
    }
  }, {
    key: 'onCollapseAllClick',
    value: function onCollapseAllClick(event) {
      this.state.entries.forEach(function (entry) {
        entry.offersExpanded = false;
      });

      this.setState(this.state);
    }
  }, {
    key: 'onFetchResultsClick',
    value: function onFetchResultsClick(event) {
      var _this4 = this;

      var scope = this;

      this.state.entries.forEach(function (entry) {
        if (!entry.isOfferValid() && !entry.isBlank()) {
          entry.loadResults().then(function (result) {
            entry.offersExpanded = true;
            scope.state.fetchedResultsOnce = true;
            var state = scope.state;
            console.log(state.entries[0].offers);
            scope.setState(state);
          });
        } else {
          if (!entry.isBlank()) entry.offersExpanded = true;

          _this4.state.fetchedResultsOnce = true;
          var state = _this4.state;
          _this4.setState(state);
        }
      });
    }
  }]);

  return UserProductList;
}(React.Component), (_applyDecoratedDescriptor(_class.prototype, 'onKeyDown', [_dec], Object.getOwnPropertyDescriptor(_class.prototype, 'onKeyDown'), _class.prototype)), _class));