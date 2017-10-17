     //global variable
      var map;
      var can_place_station=false;
      var markers=[];
      var areas=[];
    //global variable
    //system parameters
        var f=0;
        var Pt=0;
        var Gt=0;
        var Gr=0;
        var d=0;
        var L=0;
        var ht=0;
        var hm=0;
    //system parameters
    
      function initMap() 
      {//create a map
            map = new google.maps.Map(document.getElementById('map'), {
              zoom: 2,
              center: {lat: -33.865427, lng: 151.196123},
              mapTypeId: 'terrain'
            });

        google.maps.event.addListener(map,"click",function(e)
        {
            place_station(e.latLng.lat(),e.latLng.lng());
        });
      }
     function getValue_from_element(id) 
     {
         var element=document.getElementById(id);
         return element.value;
     }
     function setValue_to_element(id,value) 
     {
         var element=document.getElementById(id);
         element.value=value;
     }
     function SystemParameters_init() {
        f=getValue_from_element("Frequency");
        Pt=getValue_from_element("TransmitingPower");
        Gt=getValue_from_element("TransmittingGain");
        Gr=getValue_from_element("ReveiverGain");
        d=getValue_from_element("Distance");
        L=getValue_from_element("SystemLoss");
        ht=getValue_from_element("ReceiverHeight");
        hm=getValue_from_element("TransmittierHeight");
        if(f==0||Pt==0||Gt==0||d==0||L==0||ht==0||hm==0){}
        else
        {
            setValue_to_element("PathLoss",FreeSpace_loss());
            setValue_to_element("ReceiverPower",ReceivedPower());
            HataCalc();
        }
     }
     function FreeSpace_loss() {
        return 32.44+20*Math.log10(d)+20*Math.log10(f)-Gt-Gr;
     }
     function ReceivedPower() {
        var c=3*10e8;
        var lambda=c/f;
        var Pr = Pt+Gt+Gr+(20*Math.log10(lambda))-(20*Math.log10(4*Math.PI))-(20*Math.log10(d))-L;
        return Pr;
     }
    //HataCalc
    var Cm_p=0;    //Cost231 correction factors     
    var Cm_g=3;
    function HataCalc() 
    {
        var am_p=(1.1*Math.log10(f)-0.7)*hm-(1.56*Math.log10(f)-0.8);    
        var am_g=0;  
        if(f<=200)
        {
            am_g=8.29*(Math.pow((Math.log10(1.54*hm)),2))-1.1;    
        }
        else
        {
            am_g=3.2*(Math.pow((Math.log10(11.75*hm)),2))-4.97;
        }
        var AA=0,AA_g=0,AA_p=0;
        if (f<1500 && f>=150){
            //Hata basic loss (Urban environment).
            AA=69.55+26.16*Math.log10(f)-13.82*Math.log10(ht);
            AA_g=AA-am_g;
            AA_p=AA-am_p;
            }
        else if (f>=1500 && f<=2000)
            {            // Hata-COST231 basic loss.
            AA=46.3+33.9*Math.log10(f)-13.82*Math.log10(ht);
            AA_g=AA-am_g+Cm_g;
            AA_p=AA-am_p+Cm_p;
            }     
        //wrong message
        else
        {
                 alert('Wrong frequency. Range [150,2000] MHz');
                 return;
        }

        //
            var BB=0,nn=0,L_g=0,L_p=0;
            if (d>=1 && d<=20)
            {
                var BB=44.9-6.55*Math.log10(ht);
                var nn=BB/10;
                var L_g=AA_g+BB*Math.log10(d);
                var L_p=AA_p+BB*Math.log10(d);
            }
            else{
                alert('Wrong distance. Range [1,20] km');
                return;
            }

            //Suburban zone loss.
            var Ls=L_p-2*(Math.pow((Math.log10(f/28)),2))-5.4;
            setValue_to_element("Suburban",Ls);
            //Rural zone loss.
            var Lr=L_p-4.78*(Math.pow((Math.log10(f))),2)+18.33*Math.log10(f)-40.94;
            setValue_to_element("Rural",Lr);
    }
    function coverege_calculation(argument) {
        var SL=1;
        var Lcorr=20;                     
        var ls=5;                                                 
        var maxradius=d*100;

        var interprate=Math.round(Lcorr/ls);
        Lcorr=ls*interprate;
        var Nsamples=Math.round(maxradius/Lcorr);

//         map1=randn(2*Nsamples,2*Nsamples)*SL;
// xaxis=[-Nsamples:Nsamples-1]*Lcorr;
// yaxis=[-Nsamples:Nsamples-1]*Lcorr;
// xaxisinterp=[-Nsamples:1/interprate:Nsamples-1]*Lcorr;
// yaxisinterp=[-Nsamples:1/interprate:Nsamples-1]*Lcorr;

// map1interp=interp2(xaxis,yaxis,map1,xaxisinterp,yaxisinterp','spline');


// map2interp=zeros(length(xaxisinterp),length(yaxisinterp));
// for ii=1:length(xaxisinterp),
//     for jj=1:length(yaxisinterp),
//         map2interp(jj,ii)=sqrt(xaxisinterp(ii).^2+yaxisinterp(jj).^2);
//     end
// end
    }

    function place_station_agreement()
    {//can you place station?
        can_place_station=!can_place_station;
    }
    function place_station(lat,lng,gmap)
    {
        if(can_place_station)
        {
            var icon = {
            url: "https://cdn2.iconfinder.com/data/icons/hotel-and-restaurant-solid-icons-vol-1/64/013-128.png", // url
            scaledSize: new google.maps.Size(30, 30), // scaled size
            origin: new google.maps.Point(0,0), // origin
            anchor: new google.maps.Point(15, 30) // anchor
            };

            var marker = new google.maps.Marker({
             position: new google.maps.LatLng(lat,lng),
             map: map,
             icon:icon,
            title: 'Click to zoom'
             });
            markers.push(marker);
            can_place_station=false;
        }
    }
    function place_station_cover(lat,lng)
    {
        var circle = new google.maps.Circle({
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35,
            map: map,
            center: new google.maps.LatLng(lat,lng),
            radius:100000
        },);
        return circle;
    }

 function setMapOnAll(mark,map1) {
    for (var i = 0; i < mark.length; i++) {
      mark[i].setMap(map1);
      mark[i]=null;
    }
    if(map1==null)mark.length=0;
  }
function clear_map(argument) {//delete all obj from map
    setMapOnAll(areas,null);
    setMapOnAll(markers,null);
}
    function show_stations_cover()//pred_cover_button
    {//show actions area each station
        if(areas.length>0){setMapOnAll(areas,null);}
        
        for(var i=0;i<markers.length;i++)
        {   
            console.log(markers[i].position.lat()+"iii"+markers[i].position.lng());
            areas.push(place_station_cover(markers[i].position.lat(),markers[i].position.lng()));
        }
    }