class CardController < ApplicationController
  def destroy
    card = Card.find(params[:id])
    priority = card.priority
    card.destroy
    shift_priority(priority)
    render json: :no_content
  end

  private
    def shift_priority(priority)
      Card.where('priority > ?', priority).each do |card|
        card.update(priority: ( card.priority - 1))
      end
    end
end
