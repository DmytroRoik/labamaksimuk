class Laba1 < ApplicationRecord
  belongs_to :user

  @@c=3*10**8
  
  	def CalcFreeSpace
  		result={}
  		lambda=@@c/((self.CarrierFrequency)*10**6)
  		1.upto(100){ |elt|
			result[10.0*Math.log10(((elt*1000.0*Math::PI*4.0)**2)/(lambda**2))] = (1.0*Math.log10(elt)* 10).to_i.to_f / 10;
		}
  		return result
  	end
  	def CalcHata
  		result={}
		par_h=3.2*((Math.log10(11.75*self.RXAntennaHeight))**2)-4.97;
		1.upto(100){ |elt|
			result[69.55+26.16*Math.log10(self.CarrierFrequency*(10**6))-13.82*Math.log10(self.TXAntennaHeight)-par_h+((44.9-6.55*Math.log10(self.TXAntennaHeight)))*(Math.log10(elt))] = (1.0*Math.log10(elt)* 10).to_i.to_f / 10.0;
		}
		return result

  	end
  	def CalcOkumura
  		result={}
		@Ghr=0.0;
		@A=0.0;
		@k=0.0;
		case self.RXAntennaHeight
			when 1..3
			  @Ghr=10*Math.log10(self.RXAntennaHeight/3.0);
			when 3.000001...10
			  @Ghr=20*Math.log10(self.RXAntennaHeight/3.0);
			end

		case self.CarrierFrequency
			when 100...200
			  @A=16;
			when 200..300
			  @A=17;
			when 300...500
			  @A=18;
			when 500...700
			  @A=19;
			when 700...1000
			  @A=20;
			when 1000...1500
			  @A=21;
			end

		1.upto(20){ |elt|
		case elt
			when 1...2
			  @k=1;
			when 2...5
			  @k=2;
			when 5...10
			  @k=3;
			when 10...20
			  @k=4;
			end

			result[(20.0*Math.log10((((elt*Math::PI*4.0)**2))/(@@c/(self.CarrierFrequency.to_f*(10**6)))**2))+@A+@k-20.0*Math.log10(self.TXAntennaHeight/200.0)-@Ghr-9.0] = (1.0*Math.log10(elt)* 10).to_i.to_f / 10.0;
		}
    	return	result
   	end

  	def CalcLeesUrban
  		@Lee_Philadenphia={}
		@Lee_Newark={}
		@Lee_Tokyo={}

		@alph1=(self.TXAntennaHeight/30.48)**2;
		@alph2=(self.RXAntennaHeight/3);
		@alph3=1;
		@alph4=10**(6/40); # Base Statino antenna gain is 6/4 dB corresponding to 10^(6/40) actual value
		@alph5=0.25; # alpha5=-6dB corresponding to 0.25 actual value
		@alph0=@alph1*@alph2*@alph3*@alph4*@alph5;

		1.upto(20){ |elt|
			@Lee_Philadenphia[108.49+36.8*(Math.log10(Math.log10(elt)/1.6))+10*3*Math.log10(self.CarrierFrequency/900.0)-@alph0]= (1.0*Math.log10(elt)* 10).to_i.to_f / 10;
			@Lee_Newark[101.20+43.1*(Math.log10(Math.log10(elt)/1.6))+10.0*3.0*Math.log10(self.CarrierFrequency/900.0)-@alph0]= (1.0*Math.log10(elt)* 10).to_i.to_f / 10;
			@Lee_Tokyo[123.77+30.5*(Math.log10(Math.log10(elt)/1.6))+10.0*3.0*Math.log10(self.CarrierFrequency/900.0)-@alph0]= (1.0*Math.log10(elt)* 10).to_i.to_f / 10;
		}
		[@Lee_Philadenphia,@Lee_Newark,@Lee_Tokyo]
  	end
  
end
