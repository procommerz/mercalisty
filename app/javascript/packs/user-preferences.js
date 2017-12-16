import _ from 'underscore';

export class UserPreferences {
  constructor(data) {
    if (data == null) data = {
      lists: []
    }

    this.loaded = false;

    this.loadFromLocalStorage();

    if (!this.loaded)
      this.data = data;
  }

  save() {
    localStorage.setItem('userPreferences', JSON.stringify(this.data));
  }

  updateList(updatedList) {
    let other = _.reject(this.data.lists, (list) => updatedList.token == list.token);
    this.data.lists = [this.serializeList(updatedList)].concat(other);
  }

  loadFromLocalStorage() {
    if (localStorage.userPreferences) {
      try {
        this.data = JSON.parse(localStorage.userPreferences);
        this.loaded = true;
      } catch(e) {
        console.warn(e);
      }
    }
  }

  serializeList(list) {
    return {
      token: list.token,
      queries: list.queries,
      agent: list.agent
    }
  }
}