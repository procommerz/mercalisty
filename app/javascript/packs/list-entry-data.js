import sprintf from 'sprintf';

export class ListEntryData {
  constructor(data) {
    if (data == null) data = {};

    this.value = data.value || "";
    this.offers = null;
    this.agent = data.agent || 'crf'; //'eci';
    this.offersLoadedForQuery = null;
    this.offersExpanded = false;
    this.searchFailed = false;

    this.focusedOfferNum = null;
  }

  getValue() {
    return this.value;
  }

  setValue(value) {
    this.value = value;
  }

  placeholder() {
    return "Tomates, platanos, agua...";
  }

  expand() {
    this.offersExpanded = true;
  }

  collapse() {
    this.offersExpanded = false;
  }

  isBlank() {
    return this.value == null || this.value.length == 0 || this.value.trim() == '';
  }

  /**
   * Returns true if the query was somehow updated compared to its previous state
   * and the offers are no longer valid
   * @returns {boolean}
   */
  isOfferValid() {
    return this.offersLoadedForQuery == (this.agent + this.getValue().toString());
  }

  loadResults() {
    this.offers = null;
    this.isLoading = true;
    this.searchFailed = false;
    this.offersLoadedForQuery = this.agent + this.getValue().toString();

    let entry = this;

    return new Promise(function(resolve, reject) {
      fetch(sprintf("/agents/%s/search_offers?query=%s", entry.agent, encodeURIComponent(entry.getValue())), { method: 'GET' })
        .then(result => {
          result.json().then(data => {
            if (data.offers == null || data.offers.length == 0)
              entry.searchFailed = true;

            entry.offers = data.offers;
            entry.isLoading = false;
            resolve(entry.offers, entry);
          });
        });
    })
  }
}