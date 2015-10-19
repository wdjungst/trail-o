class ListsController < ApplicationController

  def index
    render json: { lists: List.all.order(:priority) }
  end

  def show
    cards = List.find(params[:id]).cards.order('cards.priority')
    render json: { cards: cards }
  end

  def create
    last = List.order(priority: :DESC).limit(1).pluck(:priority).first || 0
    List.create(name: params[:name], priority: (last + 1))
    render json: { lists: List.order(:priority) }
  end

  def update
    list = List.find(params[:id])
    list.update(name: params[:name])
    render json: { list: list }
  end

  def destroy
    list = List.find(params[:id])
    priority = list.priority
    list.destroy
    shift_priority(priority)
    render json: :no_content
  end

  def move_left
    list = List.find(params[:id])
    left = List.find_by('priority = ?', (list.priority - 1))
    left.update(priority: list.priority)
    list.update(priority: (list.priority - 1))
    render json: :no_content
  end

  def move_right
    list = List.find(params[:id])
    right = List.find_by('priority = ?', (list.priority + 1))
    right.update(priority: list.priority)
    list.update(priority: (list.priority + 1))
    render json: :no_content
  end

  def add_card
    list = List.find(params[:id])
    last_card = list.cards.order(:priority).limit(1).first
    priority = last_card.blank? ? 1 : last_card.priority + 1
    list.cards << Card.create(title: params[:title], body: params[:body], priority: priority)
    render json: { cards: list.reload.cards.order(:priority) }
  end

  private
    def shift_priority(priority)
      List.where('priority > ?', priority).each do |list|
        list.update(priority: ( list.priority - 1 ))
      end
    end

end
