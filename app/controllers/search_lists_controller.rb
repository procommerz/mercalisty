class SearchListsController < ApplicationController
  # [PATCH]
  def update
    @search_list = SearchList.find_by(token: params[:id])

    @search_list.queries = params[:queries]
    @search_list.delivery_zone = params[:zone]
    @search_list.results_data = params[:results_data]
    @search_list.save!

    render json: @search_list.as_json(only: [:token, :queries])
  end

  def create
    @search_list = SearchList.create(user_id: current_user.try(:id))

    render json: @search_list.as_json
  end
end