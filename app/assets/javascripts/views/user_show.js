YelpClone.Views.UserShow = Backbone.CompositeView.extend({
  template: JST["user_show"],
  
  initialize: function () {
    this.listenTo(this.model, 'sync', this.render);
    this.model.reviews().each(this.addReview.bind(this));
    this.listenTo(this.model.reviews(), "add", this.addReview);
    
    this.model.favorites().each(this.addFavorite.bind(this));
    this.listenTo(this.model.favorites(), "add", this.addFavorite);
    
    this.userMapView = new YelpClone.Views.UserMap({ model: this.model });
    this.addSubview(".user-map", this.userMapView);
    
    this.listenTo(this.model.reviews(), "mouseEnter", this.bounceReview);
    this.listenTo(this.model.reviews(), "mouseLeave", this.unbounceReview);
    
    this.listenTo(this.model.favorites(), "mouseEnter", this.bounceFavorite);
    this.listenTo(this.model.favorites(), "mouseLeave", this.unbounceFavorite);
  },
  
  bounceReview: function (review) {
    this.userMapView.markers[review.get("id")].setAnimation(google.maps.Animation.BOUNCE);
  },
  
  unbounceReview: function (review) {
    this.userMapView.markers[review.get("id")].setAnimation(null);
  },
  
  bounceFavorite: function(favorite) {
    this.userMapView.markers[favorite.get("id")].setAnimation(google.maps.Animation.BOUNCE);
  },
  
  unbounceFavorite: function(favorite) {
    this.userMapView.markers[favorite.get("id")].setAnimation(null);
  },
  
  events: {
    "click a#info-tab": "handleInfoTab",
    "click a#reviews-tab": "handleReviewsTab",
    "click a#favorites-tab": "handleFavoritesTab"
  },
  
  handleInfoTab: function () {
    $(".user-map-header").html(this.model.get("username"));
    this.userMapView.trigger("showUser");
  },
  
  handleReviewsTab: function () {
    $(".user-map-header").html("Reviews");
    this.userMapView.trigger("showReviews");
  },
  
  handleFavoritesTab: function () {
    $(".user-map-header").html('Favorites');
    this.userMapView.trigger("showFavorites");
  },
  
  addFavorite: function (favorite) {
    var subview = new YelpClone.Views.UserFavoriteShow({ model: favorite });
    this.subviews("#favorites").push(subview);
    this.$("#favorites").prepend(subview.render().$el);
    subview.delegateEvents();
  },
  
  addReview: function (review) {
    var subview = new YelpClone.Views.UserReviewShow({ model: review });
    this.subviews("#reviews").push(subview);
    this.$("#reviews").prepend(subview.render().$el);
    subview.delegateEvents();
  },
  
  render: function () {
    var renderedContent = this.template({ user: this.model });
    this.$el.html(renderedContent);
    this.attachSubviews();
    
    return this;
  }
})