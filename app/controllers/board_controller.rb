class BoardController < ApplicationController
  def index
    @lists = List.all.order(:priority)
  end
end
