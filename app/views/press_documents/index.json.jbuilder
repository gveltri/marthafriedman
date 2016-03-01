json.array!(@press_documents) do |press_document|
  json.extract! press_document, :id, :pdf, :information_id
  json.url press_document_url(press_document, format: :json)
end
