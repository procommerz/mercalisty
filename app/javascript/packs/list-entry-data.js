var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

import sprintf from 'sprintf';

export var ListEntryData = function () {
  function ListEntryData(data) {
    _classCallCheck(this, ListEntryData);

    if (data == null) data = {};

    this.value = data.value || "";
    this.offers = null;
    this.agent = data.agent || 'crf'; //'eci';
    this.offersLoadedForQuery = null;
    this.offersExpanded = false;
    this.searchFailed = false;

    this.focusedOfferNum = null;
  }

  _createClass(ListEntryData, [{
    key: 'getValue',
    value: function getValue() {
      return this.value;
    }
  }, {
    key: 'setValue',
    value: function setValue(value) {
      this.value = value;
    }
  }, {
    key: 'placeholder',
    value: function placeholder() {
      return "Tomates, platanos, agua...";
    }
  }, {
    key: 'expand',
    value: function expand() {
      this.offersExpanded = true;
    }
  }, {
    key: 'collapse',
    value: function collapse() {
      this.offersExpanded = false;
    }
  }, {
    key: 'isBlank',
    value: function isBlank() {
      return this.value == null || this.value.length == 0 || this.value.trim() == '';
    }

    /**
     * Returns true if the query was somehow updated compared to its previous state
     * and the offers are no longer valid
     * @returns {boolean}
     */

  }, {
    key: 'isOfferValid',
    value: function isOfferValid() {
      return this.offersLoadedForQuery == this.agent + this.getValue().toString();
    }
  }, {
    key: 'loadResults',
    value: function loadResults() {
      this.offers = null;
      this.isLoading = true;
      this.searchFailed = false;
      this.offersLoadedForQuery = this.agent + this.getValue().toString();

      var entry = this;

      return new Promise(function (resolve, reject) {
        fetch(sprintf("/agents/%s/search_offers?query=%s", entry.agent, entry.getValue()), { method: 'GET' }).then(function (result) {
          result.json().then(function (data) {
            if (data.offers == null || data.offers.length == 0) entry.searchFailed = true;

            entry.offers = data.offers;
            entry.isLoading = false;
            resolve(entry.offers, entry);
          });
        });
      });
    }
  }]);

  return ListEntryData;
}();