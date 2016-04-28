require 'test_helper'

class PressDocumentsControllerTest < ActionController::TestCase
  setup do
    @press_document = press_documents(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:press_documents)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create press_document" do
    assert_difference('PressDocument.count') do
      post :create, press_document: { information_id: @press_document.information_id, pdf: @press_document.pdf }
    end

    assert_redirected_to press_document_path(assigns(:press_document))
  end

  test "should show press_document" do
    get :show, id: @press_document
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @press_document
    assert_response :success
  end

  test "should update press_document" do
    patch :update, id: @press_document, press_document: { information_id: @press_document.information_id, pdf: @press_document.pdf }
    assert_redirected_to press_document_path(assigns(:press_document))
  end

  test "should destroy press_document" do
    assert_difference('PressDocument.count', -1) do
      delete :destroy, id: @press_document
    end

    assert_redirected_to press_documents_path
  end
end
