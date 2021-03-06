module Api
  class ReviewsController < ApiController
    def create
      @review = Review.new(review_params)
      @review.user_id = current_user.id
      
      if @review.save
        @review.location.update_stars!
        render "create.json.jbuilder"
      else
        render json: @review.errors.full_messages, status: :unprocessable_entity
      end
    end
    
    def destroy
      @review = Review.find(params[:id])
      @review.try(:destroy)
      render json: {}
    end
    
    def index
      if params[:location_id]
        @reviews = Review.where(location_id: params[:location_id])
      elsif params[:user_id]
        @reviews = Review.where(user_id: params[:user_id])
      end
        
      render json: @reviews, include: [:user]
    end
    
    def show
      @review = Review.find(params[:id])
      render json: @review, include: [:user]
    end
    
    private
    
    def review_params
      params.require(:review).permit(
        :user_id,
        :location_id,
        :body,
        :num_stars
      )
    end
    
  end
end