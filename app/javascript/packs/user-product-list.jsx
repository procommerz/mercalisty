import React from 'react';
import PropTypes from 'prop-types';
import {ButtonGroup, Button, InputGroup, Input, InputGroupAddon} from 'reactstrap';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {ListEntryData} from './list-entry-data';
import {UserPreferences} from './user-preferences';
import ReactGesture from 'react-gesture';
import keydown, {Keys} from 'react-keydown';
import sprintf from 'sprintf';
import _ from 'underscore';
import Loader from 'react-loaders';
import $ from 'jquery';
const {ENTER, TAB} = Keys;

export class UserProductList extends React.Component {
  constructor(props) {
    super(props);

    this.entryElements = [];
    this.mercalista = props.mercalista;
    this.framebarWidth = props.framebarWidth;

    this.setIframeOffer = props.setIframeOffer;
    this.onPreferencesClick = props.onPreferencesClick;
    this.openOfferResource = props.openOfferResource;

    this.state = {
      fetchedResultsOnce: false,
      agent: 'eci',
      list: window.localSearchList || { token: null },
      showIntroOverlay: true,
      showLoadingOverlay: false,
      clickedProductOnce: false,
      entries: [],
      currentIndex: 0 // Index num of current entry
    }

    if (window.localSearchList && window.localSearchList.queries && window.localSearchList.queries.length > 0) {
      window.localSearchList.queries.forEach((query, num) => {
        this.state.entries.push(new ListEntryData({ value: query, agent: window.localSearchList.agents[num], done: window.localSearchList.done_states[num]  }));
      });
    } else {
      this.state.entries.push(new ListEntryData({ value: location.hostname == 'localhost' ? 'platanos' : '' }));
    }

    if (this.state.entries[0])
      this.state.agent = this.state.entries[0].agent;

    if (location.href != 'l/' + this.state.list.token)
      this.setListLocation();

    this.extWindow = null;

    window.UserProductList = this;
    window.productEntries = this.state.entries;
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render(props) {
    let searchExample = "Tomates, agua, ropa...";

    let entries = [];

    this.state.entries.forEach((entry, num) => {
      entries.push(this.renderEntry(entry, num))
    });

    let selectedTotal = 0;

    try {
      selectedTotal = _.chain(this.state.entries)
        .map((entry) => entry.focusedOfferNum === null ? 0 : parseFloat(entry.offers[entry.focusedOfferNum].price))
        .reduce((memo, num) => memo + num).value();

    } catch(e) {
      console.warn("Error during calculation of total", e);
    }

    return (<div className="UserProductList">
      {!window.isMobile ? this.renderAgentsDesktop(props) : this.renderAgentsMobile(props)}

      <ul>
        { entries }
      </ul>

      {!window.isMobile ? this.renderButtonsDesktop(props, selectedTotal) : this.renderButtonsMobile(props, selectedTotal)}

      <div className="text-center" style={{margin: '30px auto auto auto', width: '70%'}}>
        <small className="text-muted"><i>Mercalisty ltd. 2017 - 2018</i></small>
      </div>
    </div>)
  }

  renderAgentsDesktop(props) {
    return (<ButtonGroup style={{margin: '0px 15px 0px 15px'}}>
      {this.isMixedList() && <Button onClick={this.onAgentSelectionClick.bind(this, 'mix')} color={this.isMixedList() ? 'info' : 'light'}>MIX</Button>}
      <Button onClick={this.onAgentSelectionClick.bind(this, 'eci')} color={!this.isMixedList() && 'eci' == this.state.agent ? 'info' : 'light'}>Supermercado El Corte Inglés</Button>
      <Button onClick={this.onAgentSelectionClick.bind(this, 'crf')} color={!this.isMixedList() && 'crf' == this.state.agent ? 'info' : 'light'}>Supermercado Carrefour</Button>
      <Button onClick={this.onAgentSelectionClick.bind(this, 'ula')} color={!this.isMixedList() && 'ula' == this.state.agent ? 'info' : 'light'}>Ulabox</Button>
      <Button onClick={this.onAgentSelectionClick.bind(this, 'amz')} color={!this.isMixedList() && 'amz' == this.state.agent ? 'info' : 'light'}>Amazon</Button>
      <Button onClick={this.onAgentSelectionClick.bind(this, 'mmk')} color={!this.isMixedList() && 'mmk' == this.state.agent ? 'info' : 'light'}>Mediamarkt</Button>
      <Button onClick={this.onPreferencesClick}>
        <i className="fa fa-th-list"></i>
      </Button>
    </ButtonGroup>);
  }

  renderAgentsMobile(props) {
    {/*<Button onClick={this.onAgentSelectionClick.bind(this, 'eci')} color={'eci' == this.state.agent ? 'info' : 'light'}>Supermercado El Corte Inglés</Button>*/}
    {/*<Button onClick={this.onAgentSelectionClick.bind(this, 'crf')} color={'crf' == this.state.agent ? 'info' : 'light'}>Supermercado Carrefour</Button>*/}
    {/*<Button onClick={this.onAgentSelectionClick.bind(this, 'amz')} color={'amz' == this.state.agent ? 'info' : 'light'}>Amazon</Button>*/}
    return (<div className="mobile-toolbar-top">
      <i className="fa fa-down-open select-arrow"></i>
      <Input type="select" className="agent-select" onChange={this.onAgentSelectionChange.bind(this)} value={this.isMixedList() ? 'mix' : this.state.agent}>
        {this.isMixedList() && <option value="mix">MIX</option>}
        <option value="eci">Supermercado El Corte Inglés</option>
        <option value="crf">Supermercado Carrefour</option>
        <option value="ula">Ulabox</option>
        <option value="amz">Amazon</option>
        <option value="mmk">Mediamarkt</option>
      </Input>
      <div className="buttons" style={{margin: '0px 15px 0px auto', textAlign: 'right'}}>
        <Button onClick={this.onPreferencesClick}>
          <i className="fa fa-th-list"></i>
        </Button>
      </div>
      <div className="clearfix"></div>
    </div>);
  }

  renderButtonsDesktop(props, selectedTotal) {
    return (<div className="text-center" style={{margin: '50px 15px 0px 15px'}}>
      <button className="btn btn-light btn-lg" onClick={ this.onCollapseAllClick.bind(this) } style={{width: '100px', float: 'left'}}>
        <i className={"fa-resize-small"}></i> todo
      </button>

      <button className="btn btn-success btn-lg btn-xl btn-submit" onClick={ this.onFetchResultsClick.bind(this) } style={{minWidth: '200px'}}>
        {this.state.fetchedResultsOnce ? (<span><i className="fa fa-arrows-ccw"></i> Actualizar</span>) : (<span>Encontrar!</span>)}
      </button>

      <button className="btn btn-lg btn-default" style={{float: 'right'}}>
        Total:
        €{selectedTotal}
      </button>
      </div>
      );
  }

  renderButtonsMobile(props, selectedTotal) {
    return (<div className="text-center" style={{margin: '50px 15px 0px 15px'}}>
        <button className="btn btn-light btn-lg" onClick={ this.onCollapseAllClick.bind(this) } style={{width: '61px', float: 'left'}}>
          <i className={"fa-resize-small"}></i>
        </button>

        <button className="btn btn-success btn-lg btn-submit" onClick={ this.onFetchResultsClick.bind(this) } style={{minWidth: '200px'}}>
          {this.state.fetchedResultsOnce ? (<span><i className="fa fa-arrows-ccw"></i> Actualizar</span>) : (<span>Encontrar!</span>)}
        </button>
      </div>
    );
  }

  renderSettings(entry, num) {
    return (<div className="settings-container entry-settings" key={"entry_" + num}><div className="slide-container">
      <label htmlFor="agents">Elige la tienda:</label>
      <Input type="select" name='agents' onChange={this.onEntryAgentChange.bind(this, entry, num)} value={entry.agent}>
        <option value="eci">Supermercado El Corte Inglés</option>
        <option value="crf">Supermercado Carrefour</option>
        <option value="ula">Ulabox</option>
        <option value="amz">Amazon</option>
        <option value="mmk">Mediamarkt</option>
      </Input>
    </div></div>)
  }

  renderEntry(entry, num) {
    let scope = this;

    // Set focus shortly after rendering (left without a clue about how to do it 'the react-way')
    setTimeout(function() {
      if (!window.isMobile && scope.entryElements[scope.state.currentIndex])
        scope.entryElements[scope.state.currentIndex].focus();
    }, 10);

    let productWidth = 180;
    let productResults = [];

    // Offers section (hidden by default)

    if (entry.offers && entry.offersExpanded) {
      _.each(entry.offers, (product, productNum) => {
        productResults.push(<div className={["offer-item", (entry.focusedOfferNum == productNum) ? 'active' : ''].join(' ')} key={'offer_' + product.agent_id} onClick={this.onEntryProductClick.bind(this, num, product, productNum)}
          style={{width: productWidth}}>
          <img src={product.image_url} className="thumb" />
          <div className="offer-title">
            {product.name}
          </div>
          <div className="offer-price">
            €{product.price}
            {product.price_per_kilo && <div className="offer-ref-price">{product.price_per_kilo}</div>}
          </div>
          <button className="pin-offer" onClick={scope.pinOffer.bind(scope, num, product)}>
            <i className="fa fa-pin"></i>
          </button>
        </div>)
      });

      // console.log(productResults);
    }

    // Entry main body

    return (<li className={"entry " + (entry.done ? " done" : "") } key={'entry' + num}>
      <ReactGesture onSwipeLeft={this.onEntrySwipeLeft.bind(this, entry, num)} onSwipeRight={this.onEntrySwipeRight.bind(this, entry, num)}>
        <div>
        <input type="text" tabIndex={ 50 + num } className="form-control entry-input"
          placeholder={ entry.placeholder() } ref={(input) => { this.entryElements[num] = input } }
          style={{color: entry.searchFailed ? '#ff0000' : null }}
          value={ entry.getValue() }
          onChange={ this.onEntryChange.bind(this, num) }
          onBlur={ this.onEntryBlur.bind(this, num) }
          onKeyDown={this.onKeyDown} onFocus={this.onEntryFocus.bind(this, num)} />

        <div className="active-buttons">
          { !window.isMobile && <button onClick={this.onToggleEntryDone.bind(this, num)} className={entry.done ? "done" : ""}>
            <i className={"fa " + (entry.done ? "fa-ok-outline" : "fa-ok")}></i>
          </button> }
          <button onClick={this.onToggleEntrySettingsClick.bind(this, num)}>
            <i className={"fa " + (entry.settingsExpanded ? "fa-dot-3" : "fa-dot-3")}></i>
          </button>
          <button onClick={this.onToggleEntryClick.bind(this, num)}>
            <i className={"fa " + (entry.offersExpanded ? "fa-resize-small" : "fa-resize-full-alt")}></i>
          </button>
        </div>

        <ReactCSSTransitionGroup
          transitionName="entry-settings"
          transitionEnterTimeout={300}
          transitionLeaveTimeout={200}>
          { entry.settingsExpanded && this.renderSettings(entry, num) }
        </ReactCSSTransitionGroup>

        { entry.offersExpanded && <div className="product-offers">
          <div className="scroll-container" style={{width: '5000%', WebkitOverflowScrolling: 'touch', overflowY: 'visible' }}>
            { productResults.length > 0 ? productResults : '' }
            { !entry.isLoading && productResults.length == 0 && (<span className="no-results">No encontramos ningunos productos :(...</span>) }
          </div>
          { entry.isLoading && (window.isMobile ? <img src="/loaders/colorbar.gif" style={{borderRadius: 16, height: 16, width: 104, margin: '5px auto', display: 'block',  border: '3px solid #868e96'}} /> : <div className="text-center"><Loader type="ball-grid-beat" active style={{width: 57, height: 57, margin: '10px auto' }} /></div>)}
        </div> }
        </div>
      </ReactGesture>
    </li>)
  }

  @keydown(ENTER, TAB, Keys.down, Keys.up, Keys.backspace, Keys[',']) // could also be an array
  onKeyDown(event) {
    if ( event.which === ENTER || event.which === Keys[',']) {
      let state = this.state;
      let scope = this;
      const previousEntryExpanded = this.state.entries.length > 0 && this.state.entries.offersExpanded;

      // Remove trailing comma from the current entry if needed
      if (event.which === Keys[',']) {
        event.stopPropagation();
        event.preventDefault();
      }

      // Scroll to last empty row if available
      if (this.state.entries[this.state.entries.length - 1].isBlank()) {
        state.currentIndex = this.state.entries.length - 1;
        this.setState(state);
      } else {
        let newEntry = new ListEntryData({ agent: this.state.entries.length > 0 ? this.state.entries[this.state.entries.length - 1].agent : null,
                                           done: false });

        // Add at the end or insert in the middle, depending
        // on cursor position
        if (state.currentIndex == state.entries.length - 1) {
          state.currentIndex += 1;
          state.entries.push(newEntry);
          this.saveList();
        } else {
          state.entries.splice(state.currentIndex + 1, 0, newEntry);
          state.currentIndex += 1;
        }

        setTimeout(function() {
          if (scope.entryElements[scope.state.currentIndex])
            scope.entryElements[scope.state.currentIndex].focus();
        }, 10);

        this.setState(state);

        if (previousEntryExpanded) {
          newEntry.loadResults().then((results) => {
            newEntry.offersExpanded = true;
            scope.setState(state);
          })
        }
      }

    }

    else if (event.which === Keys.down) {
      let state = this.state;

      state.currentIndex += 1;

      if (state.currentIndex >= state.entries.length) {
        state.currentIndex = 0;
      }

      this.setState(state);
    }

    else if (event.which === Keys.up) {
      let state = this.state;

      state.currentIndex -= 1;

      if (state.currentIndex < 0) {
        state.currentIndex = state.entries.length - 1;
      }

      this.setState(state);
    }

    else if (event.which === Keys.backspace) {
      let state = this.state;

      if (state.entries[state.currentIndex].getValue() && state.entries[state.currentIndex].getValue().length > 0) {
        // Do nothing
      } else {
        // Remove the empty entry
        state.entries.splice(state.currentIndex, 1);

        if (state.currentIndex > state.entries.length - 1)
          state.currentIndex = state.entries.length - 1;

        this.setState(state);
        this.saveList();
      }
    }

  }

  isMixedList() {
    if (this.state.entries == null || this.state.entries.lenght == 0)
      return false;

    let firstAgent = this.state.entries[0].agent;
    return _.any(this.state.entries, (e) => e.agent != firstAgent);
  }

  pinOffer(entryNum, productData) {
    this.state.entries[entryNum].value = productData.name;
    this.setState(this.state);
    this.saveList();
  }

  onEntryChange(entryNum, event) {
    let state = this.state;

    state.entries[entryNum].setValue(event.target.value);
    this.setState(state);
    // console.log(entryNum, event.target.value);
  }

  onEntryBlur(entryNum, event) {
    let query = this.state.entries[entryNum].getValue();
    let scope = this;

    // Process input-by URL, inspecting the URL first and extracting offer name, price and image first
    if (this.isExternalLink(scope.state.entries[entryNum])) {
      sendGaEvent('list', 'urlEntered', this.state.entries[entryNum].getValue());

      let params = { link: scope.state.entries[entryNum].getValue() };

      // Get link metadata, then update entry and save the list
      fetch(sprintf("/link_parser/get_search_term.json"), { method: 'POST',  headers: { 'Content-Type':'application/json' }, body: JSON.stringify(params) })
        .then(result => {
          result.json().then(data => {
            // TODO: Transform and modify the entry, based on findings
            let offerData = data;

            console.log("external offer:", data);

            scope.state.entries[entryNum].value = data.name;

            // Save the list
            scope.setState({entries: scope.state.entries});
            scope.saveList();

            sendGaEvent('list', 'entryUpdated', this.state.entries[entryNum].getValue());

          });
        }).catch((error) => reject(error));
    } else { // Or save the entry immediately
      if (query != null && query.length > 1 && !this.state.entries[entryNum].isOfferValid()) {
        // Load results for the entry
        if (this.state.entries[entryNum].agent == null)
          this.state.entries[entryNum].agent = this.state.agent;

        this.state.entries[entryNum].loadResults().then(function(result) {
          let state = scope.state;
          scope.setState(state);
          scope.saveList();
        });

        sendGaEvent('list', 'entryUpdated', this.state.entries[entryNum].getValue());
      }
    }

  }

  onEntryFocus(entryNum, event) {
    let state = this.state;
    state.currentIndex = entryNum;
    this.setState(state);
  }

  onToggleEntryClick(entryNum, event) {
    let scope = this;

    scope.state.entries[entryNum].offersExpanded = !scope.state.entries[entryNum].offersExpanded;
    this.setState({entries: scope.state.entries});
    // this.setState((state) => state.entries[entryNum].offersExpanded = !state.entries[entryNum].offersExpanded);

    if (!this.state.entries[entryNum].isOfferValid())
      this.state.entries[entryNum].loadResults().then(() => scope.setState({entries: scope.state.entries}));
  }

  onToggleEntrySettingsClick(entryNum, event) {
    let scope = this;

    _.each(this.state.entries, (e, num) => {
      num != entryNum ? e.settingsExpanded = false : null
    });

    this.state.entries[entryNum].settingsExpanded = !this.state.entries[entryNum].settingsExpanded;
    this.setState({entries: this.state.entries });
  }

  onToggleEntryDone(entryNum, event) {
    this.state.entries[entryNum].done = !this.state.entries[entryNum].done;
    this.setState({entries: this.state.entries});
    this.saveList();
  }

  onEntryProductClick(entryNum, productData, productNum, event) {
    this.state.currentIndex = entryNum;
    this.state.entries[entryNum].focusedOfferNum = productNum;

    // Remove intro overlays from the default UI state

    if (!this.state.clickedProductOnce) {
      this.state.clickedProductOnce = true;
      this.mercalista.onFirstProductClick();
    }

    if (!window.isMobile && this.entryElements[this.state.currentIndex])
      this.entryElements[this.state.currentIndex].focus();

    // Some exceptions for paranoid agents disallowing frames.
    if (this.state.entries[entryNum].agent == 'amz' || this.state.entries[entryNum].agent == 'ula') {
      if (this.extWindow == null) {
        this.extWindow = window.open(productData.agent_url, '_blank',
          sprintf('toolbar=no, location=no, status=no, menubar=no, scrollbars=yes, resizable=yes, width=%d, height=%d', this.framebarWidth, window.screen.height));
      } else {
        this.extWindow = window.open(productData.agent_url, '_blank',
          sprintf('toolbar=no, location=no, status=no, menubar=no, scrollbars=yes, resizable=yes, width=%d, height=%d', this.framebarWidth, window.screen.height), true);
      }

      this.extWindow.moveBy(window.innerWidth - this.framebarWidth, 0);
      this.mercalista.showFrameLoader();
    } else {
      this.openOfferResource(productData)
    }

    this.setState(this.state);

    this.saveListFocusedOffers();

    event.preventDefault();

    sendGaEvent('clicks', 'offerClick', productData.name);

    return false;
  }

  onAgentSelectionChange(event) {
    this.onAgentSelectionClick(event.target.value, event);
  }

  onEntryAgentChange(entry, num, event) {
    let oldAgent = this.state.entries[num].agent;
    let newAgent = event.target.value;

    this.state.entries[num].agent = newAgent;

    if (oldAgent != newAgent) {
      this.state.entries[num].settingsExpanded = false;
    }

    this.setState(this.state);
    this.saveList();

    if (oldAgent != newAgent) {
      this.onEntryBlur(num);
    }
  }

  onEntrySwipeLeft(entry, num) {
    if (entry.done) {
      entry.done = false;
      this.setState({entries: this.state.entries});
      this.saveList();
    }
  }

  onEntrySwipeRight(entry, num) {
    if (!entry.done) {
      entry.done = true;
      this.setState({entries: this.state.entries});
      this.saveList();
    }
  }

  onAgentSelectionClick(agent, event) {
    let agentWillChange = agent != this.state.agent;

    this.state.agent = agent;
    this.setState(this.state);

    let scope = this;

    if (agentWillChange) {
      var count = this.state.entries.length;

      this.state.entries.forEach((entry, num) => {
        entry.agent = agent;

        if (entry.isBlank()) {
          count -= 1;
          return;
        }

        entry.loadResults().then((r) => {
          scope.setState(scope.state);

          // Update list on last save
          if (num == count - 1) {
            setTimeout(() => scope.saveList());
          }
        })
      });
    }

    sendGaEvent('clicks', 'agentChange', agent);
  }

  onCollapseAllClick(event) {
    this.state.entries.forEach((entry) => {
      entry.offersExpanded = false;
    });

    this.setState(this.state);
  }

  onFetchResultsClick(event) {
    let scope = this;

    this.state.entries.forEach((entry) => {
      if (!entry.isOfferValid() && !entry.isBlank()) {
        entry.loadResults().then(function(result) {
          entry.offersExpanded = true;

          // console.log(state.entries[0].offers);
          scope.setState({fetchedResultsOnce: true});
        });
      } else {
        if (!entry.isBlank())
          entry.offersExpanded = true;

        this.setState({fetchedResultsOnce: true});
      }
    });

    sendGaEvent('clicks', 'search');
  }

  /**
   * Saves the list, but sends only list positions of selected offers,
   * which makes the request much smaller. It's important because the request
   * gets fired effectively on every offer click.
   *
   * @returns {Promise}
   */
  saveListFocusedOffers() {
    let scope = this;

    let params = {
      token: this.state.list.token,
      focused_offers: _.map(this.state.entries, (entry) => (entry.focusedOfferNum && entry.offers[entry.focusedOfferNum]) ? entry.offers[entry.focusedOfferNum].name : '')
    };

    return new Promise(function(resolve, reject) {
      fetch(sprintf("/search_lists/%s.json", scope.state.list.token), { method: 'PATCH',  headers: { 'Content-Type':'application/json' }, body: JSON.stringify(params) })
        .then(result => {
          result.json().then(data => {
            scope.state.list = data;
            scope.setState(scope.state);
            resolve(data);
          });
        }).catch((error) => reject(error));
    })
  }

  saveList() {
    let scope = this;

    let params = {
      token: this.state.list.token,
      agents: _.map(this.state.entries, (entry) => entry.agent || scope.state.agent),
      queries: _.map(this.state.entries, (entry) => entry.getValue()),
      focused_offers: _.map(this.state.entries, (entry) => (entry.focusedOfferNum && entry.offers[entry.focusedOfferNum]) ? entry.offers[entry.focusedOfferNum].name : ''),
      done_states: _.map(this.state.entries, (entry) => entry.done ? true : false),
      results_data: _.map(this.state.entries, (entry) => ({
          query: entry.getValue(),
          offers: _.map(entry.offers, (offer) => ({
            agent: entry.agent || scope.state.agent,
            agent_id: offer.entry_id,
            agent_url: offer.agent_url,
            name: offer.name,
            price: offer.price,
            price_per_kilo: offer.price_per_kilo,
            price_per_kilo_text: offer.price_per_kilo_text
          }))
        }))
    };

    return new Promise(function(resolve, reject) {
      fetch(sprintf("/search_lists/%s.json", scope.state.list.token), { method: 'PATCH',  headers: { 'Content-Type':'application/json' }, body: JSON.stringify(params) })
        .then(result => {
          result.json().then(data => {
            scope.state.list = data;
            scope.setState(scope.state);

            // Serialize localStorage
            let prefs = new UserPreferences();

            prefs.updateList(Object.assign({}, data, { agent: scope.state.agent }));
            prefs.save();

            resolve(data);
          });
        }).catch((error) => reject(error));
    })
  }

  // startNewList() {
  //   return new Promise(function(resolve, reject) {
  //     fetch(sprintf("/search_lists.json"), { method: 'POST' })
  //       .then(result => {
  //         result.json().then(data => {
  //           if (data.offers == null || data.offers.length == 0)
  //             entry.searchFailed = true;
  //
  //           entry.offers = data.offers;
  //           entry.isLoading = false;
  //           resolve(entry.offers, entry);
  //         });
  //       });
  //   })
  // }

  setListLocation() {
    // Set location to reloadable url
    window.history.pushState({"html":"","pageTitle":"Mi lista de compras"},"", sprintf("l/%s", this.state.list.token));
  }

  isExternalLink(entry) {
    if (entry.getValue().indexOf('http') == 0) 
      return true;
    
    return false;
  }
}