class Laba1Controller < ApplicationController
  before_action :set_post, only: [:show, :edit, :update, :destroy]
  before_action :authenticate_user!
  def index
  	@lab1s=Laba1.all.where(user_id:current_user.id)
  end
  def new
  	@l=Laba1.new
  end
  def show
    @dataFreeSpace=@l.CalcFreeSpace.invert
    @dataHata=@l.CalcHata.invert
    @dataOkumura=@l.CalcOkumura.invert
    @Lee_Philadenphia,@Lee_Newark,@Lee_Tokyo=@l.CalcLeesUrban
  end
  def create
  	@l=Laba1.create(laba1_params)
    @l.user_id=current_user.id
  	if @l.save
      redirect_to root_path
    end
  end
  
  def destroy
    @l.destroy
    redirect_to laba1_index_path
  end
  private
    # Use callbacks to share common setup or constraints between actions.
    def set_post
      @l = Laba1.find(params[:id])
    end
    def laba1_params
      params.require(:laba1).permit(:TRSeparation, :CarrierFrequency,:TXAntennaHeight,:RXAntennaHeight)
    end
end
