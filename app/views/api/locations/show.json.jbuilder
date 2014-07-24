json.extract! @location, :id, :name, :category, :address, :ambience, :wifi, :attire, :noise_level,
:wheelchair_accessible, :created_at, :updated_at, :average_stars
json.reviews @location.reviews do |review|
  json.id review.id
  json.user_id review.user_id
  json.user_name User.find(review.user_id).username
  json.body review.body
  json.num_stars review.num_stars
  json.created_at review.created_at
  json.updated_at review.updated_at
  json.location_id review.location_id
end
json.photo_url @location.location_photo.url