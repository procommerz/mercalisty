class SearchListsController < ApplicationController
  # [PATCH]
  def update
    @search_list = SearchList.find_by(token: params[:id])

    @search_list.queries = params[:queries] if params[:queries]
    @search_list.delivery_zone = params[:zone] if params[:zone]
    @search_list.agents = params[:agents] if params[:agents]
    @search_list.done_states = params[:done_states] if params[:done_states]
    @search_list.focused_offers = params[:focused_offers] if params[:focused_offers]
    @search_list.results_data = params[:results_data] if params[:results_data]
    @search_list.save!

    render json: @search_list.as_json(only: [:token, :queries, :done_states])
  end

  def create
    @search_list = SearchList.create(user_id: current_user.try(:id))

    render json: @search_list.as_json
  end
end