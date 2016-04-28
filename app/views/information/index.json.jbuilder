json.array!(@information) do |information|
  json.extract! information, :id
  json.url information_url(information, format: :json)
end
