class HomeController < ApplicationController
  def index
    load_list
  end

  def load_list
    list_id = params[:path]

    existing_list = list_id ? SearchList.find_by!(token: list_id) : nil

    if existing_list
      @search_list = existing_list
    else
      @search_list = SearchList.create(user_id: current_user.try(:id))
    end
  end
end
