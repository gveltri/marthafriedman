class PressDocumentsController < ApplicationController
  before_action :set_press_document, only: [:show, :edit, :update, :destroy]

  # GET /press_documents
  # GET /press_documents.json
  def index
    @press_documents = PressDocument.all
  end

  # GET /press_documents/1
  # GET /press_documents/1.json
  def show
  end

  # GET /press_documents/new
  def new
    @information = Information.find(params[:information_id])
    @press_document = @information.press_documents.new
  end

  # GET /press_documents/1/edit
  def edit
  end

  # POST /press_documents
  # POST /press_documents.json
  def create
    @press_document = PressDocument.new(press_document_params)

    respond_to do |format|
      if @press_document.save
        format.html { redirect_to [@press_document.information,@press_document], notice: 'Press document was successfully created.' }
        format.json { render :show, status: :created, location: @press_document }
      else
        format.html { render :new }
        format.json { render json: @press_document.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /press_documents/1
  # PATCH/PUT /press_documents/1.json
  def update
    respond_to do |format|
      if @press_document.update(press_document_params)
        format.html { redirect_to @press_document, notice: 'Press document was successfully updated.' }
        format.json { render :show, status: :ok, location: @press_document }
      else
        format.html { render :edit }
        format.json { render json: @press_document.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /press_documents/1
  # DELETE /press_documents/1.json
  def destroy
    @press_document.destroy
    respond_to do |format|
      format.html { redirect_to information_press_documents_url, notice: 'Press document was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_press_document
      @press_document = PressDocument.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def press_document_params
      params.require(:press_document).permit(:pdf, :information_id)
    end
end
