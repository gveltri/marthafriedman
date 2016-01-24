json.array!(@works) do |work|
  json.extract! work, :id, :name, :year, :order
  json.url work_url(work, format: :json)
end
