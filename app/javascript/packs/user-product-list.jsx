import React from 'react'
import PropTypes from 'prop-types'
import { ButtonGroup, Button, InputGroup, Input, InputGroupAddon } from 'reactstrap'
import { ListEntryData } from './list-entry-data'
import keydown, { Keys } from 'react-keydown';
import sprintf from 'sprintf';
import _ from 'underscore';
import Loader from 'react-loaders';
import $ from 'jquery';
const { ENTER, TAB } = Keys;

export class UserProductList extends React.Component {
  constructor(props) {
    super(props);

    this.entryElements = [];

    this.mercalista = props.mercalista;

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
      window.localSearchList.queries.forEach((query) => {
        this.state.entries.push(new ListEntryData({ value: query }));
      });
    } else {
      this.state.entries.push(new ListEntryData({ value: location.hostname == 'localhost' ? 'platanos' : '' }));
    }

    if (location.href != 'l/' + this.state.list.token)
      this.setListLocation();

    window.productEntries = this.state.entries;
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render(props) {
    let searchExample = "Tomates, platanos, agua...";

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
      <ButtonGroup style={{margin: '0px 15px 0px 15px'}}>
        <Button onClick={this.onAgentSelectionClick.bind(this, 'eci')} color={'eci' == this.state.agent ? 'info' : 'light'}>Supermercado El Corte Ingles</Button>
        <Button onClick={this.onAgentSelectionClick.bind(this, 'crf')} color={'crf' == this.state.agent ? 'info' : 'light'}>Supermercado Carrefour</Button>
      </ButtonGroup>
      <ul>
        { entries }
      </ul>

      <div className="text-center" style={{margin: '50px 15px 0px 15px'}}>
        <button className="btn btn-light btn-lg" onClick={ this.onCollapseAllClick.bind(this) } style={{width: '100px', float: 'left'}}>
          – todo
        </button>

        <button className="btn btn-success btn-lg btn-submit" onClick={ this.onFetchResultsClick.bind(this) } style={{minWidth: '200px'}}>
          {this.state.fetchedResultsOnce ? (<span><i className="fa fa-refresh"></i> Actualizar</span>) : (<span>Encontrar!</span>)}
        </button>

        <button className="btn btn-lg btn-default" style={{float: 'right'}}>
          Total:
          €{selectedTotal}
        </button>
      </div>
      <div className="text-center" style={{margin: '30px auto auto auto', width: '70%'}}>
        <small className="text-muted"><i>Mercalisty ltd. 2017 - 2018</i></small>
      </div>
    </div>)
  }

  renderEntry(entry, num) {
    let scope = this;

    // Set focus shortly after rendering (left without a clue about how to do it 'the react-way')
    setTimeout(function() {
      if (scope.entryElements[scope.state.currentIndex])
        scope.entryElements[scope.state.currentIndex].focus();
    }, 10);

    let productWidth = 180;
    let productResults = [];

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
        </div>)
      });

      console.log(productResults);
    }


    return (<li className="entry" key={'entry' + num}>
      <input type="text" tabIndex={ 50 + num } className="form-control entry-input"
        placeholder={ entry.placeholder() } ref={(input) => { this.entryElements[num] = input } }
        style={{color: entry.searchFailed ? '#ff0000' : null }}
        value={ entry.getValue() }
        onChange={ this.onEntryChange.bind(this, num) }
        onBlur={ this.onEntryBlur.bind(this, num) }
        onKeyDown={this.onKeyDown} onFocus={this.onEntryFocus.bind(this, num)} />

      { entry.offersExpanded && <div className="product-offers">
        <div className="scroll-container" style={{width: '5000%' }}>
          { productResults.length > 0 ? productResults : '' }
          { !entry.isLoading && productResults.length == 0 && (<span className="no-results">No encontramos ningunos productos :(...</span>) }
        </div>
        { entry.isLoading && (<div className="text-center"><Loader type="ball-grid-beat" active style={{width: 57, height: 57, margin: '10px auto' }} /></div>)}
      </div> }
    </li>)
  }

  @keydown(ENTER, TAB, Keys.down, Keys.up, Keys.backspace) // could also be an array
  onKeyDown(event) {
    if ( event.which === ENTER ) {
      let state = this.state;
      let scope = this;
      const previousEntryExpanded = this.state.entries.length > 0 && this.state.entries.offersExpanded;

      // Scroll to last empty row if available
      if (this.state.entries[this.state.entries.length - 1].isBlank()) {
        state.currentIndex = this.state.entries.length - 1;
        this.setState(state);
      } else {
        let newEntry = new ListEntryData();

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

  onEntryChange(entryNum, event) {
    let state = this.state;

    state.entries[entryNum].setValue(event.target.value);
    this.setState(state);
    // console.log(entryNum, event.target.value);
  }

  onEntryBlur(entryNum, event) {
    let query = this.state.entries[entryNum].getValue();
    let scope = this;

    if (query != null && query.length > 1 && !this.state.entries[entryNum].isOfferValid()) {
      // Load results for the entry
      this.state.entries[entryNum].agent = this.state.agent;
      this.state.entries[entryNum].loadResults().then(function(result) {
        let state = scope.state;
        scope.setState(state);
        scope.saveList();
      });
    }
  }

  onEntryFocus(entryNum, event) {
    let state = this.state;
    state.currentIndex = entryNum;
    this.setState(state);
  }

  onEntryProductClick(entryNum, productData, productNum, event) {
    this.state.currentIndex = entryNum;
    this.state.entries[entryNum].focusedOfferNum = productNum;

    // Remove intro overlays from the default UI state

    if (!this.state.clickedProductOnce) {
      this.state.clickedProductOnce = true;
      this.mercalista.onFirstProductClick();
    }

    if (this.entryElements[this.state.currentIndex])
      this.entryElements[this.state.currentIndex].focus();

    let frame = document.getElementById('shopframe');
    let scope = this;

    // Reeeally dirty way to hide the loading overlay
    setTimeout(function() {
      scope.mercalista.state.iframeLoading = false;
      scope.mercalista.setState(scope.mercalista.state);
    }, 1260);

    frame.src = productData.agent_url;

    this.mercalista.state.iframeLoading = true;
    this.mercalista.setState(this.mercalista.state);

    this.setState(this.state);

    event.preventDefault();

    return false;
  }

  onAgentSelectionClick(agent, event) {
    let agentWillChange = agent != this.state.agent;

    this.state.agent = agent;
    this.setState(this.state);

    let scope = this;

    if (agentWillChange) {
      this.state.entries.forEach((entry) => {
        entry.agent = agent;
        entry.loadResults().then((r) => scope.setState(scope.state))
      });
    }
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
          scope.state.fetchedResultsOnce = true;
          let state = scope.state;
          console.log(state.entries[0].offers);
          scope.setState(state);
        });
      } else {
        if (!entry.isBlank())
          entry.offersExpanded = true;

        this.state.fetchedResultsOnce = true;
        let state = this.state;
        this.setState(state);
      }
    });
  }

  saveList() {
    let scope = this;

    let params = {
      token: this.state.list.token,
      queries: _.map(this.state.entries, (entry) => entry.getValue()),
      results_data: _.map(this.state.entries, (entry) => ({
          query: entry.getValue(),
          offers: _.map(entry.offers, (offer) => ({
            agent: scope.state.agent,
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
}