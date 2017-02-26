var headers;
var paramLines = [];

$(function() {
    $(".real").on("mouseover",function(e){
		$(e.currentTarget).children('img').css('content', 'url("asset/listeHover.gif")')
	});
	$(".real").on("mouseout",function(e){
		$(e.currentTarget).children('img').css('content', 'url("asset/liste.gif")')
	});
});


function loadContenu(type){
	// var doc = "html/"+html+".html";
	// console.log(doc);
	// $('#ContenuPrincipal').load(doc)
		$('#ContenuPrincipal').html( "" );
		switch(type){
			case "accueil":
				$('#ContenuPrincipal').append("<div id='HeaderAccueil'><h1>Realisation et mise en volume de vos projets</h1></div>");
				break;
			case "el_ex":
				var el_ex_elt = filterByType("el_ex",headers,paramLines);
				constructMenu(el_ex_elt,"el_ex");
				
				break;
			case "ac_br":
				var ac_br_elt = filterByType("ac_br",headers,paramLines);
				constructMenu(ac_br_elt,"ac_br");
				
				break;
				
			case "clients":
				constructClient();				
				break;
			case "contacts":
				$('#ContenuPrincipal').load("html/contact.html");
				break;
		}
	
	// });
	
	
}
function initSite(){
	$(document).ready(function(){
	   loadContenu('accueil');
   });
   
    $(document).ready(function() {
    $.ajax({
        type: "GET",
        url: CONFIG.urlParam,
        dataType: "text",
        success: function(data) {processData(data);}
     });
	});
	
	resizePrincipalContent();
	$( window ).resize(function() {		
		resizePrincipalContent();
	});

}

function resizePrincipalContent(){
	var WinW = $( window ).width();
	var PLW = $("#PanneauLat").width();
	
	var nW = WinW - $("#PanneauLat").width() - 4;
	
	$("#ContenuPrincipal").width(nW);
	
}

function processData(allText) {
    var allTextLines = allText.split(/\r\n|\n/);
    headers = allTextLines[0].split(';');
    

    for (var i=1; i<allTextLines.length; i++) {
        var data = allTextLines[i].split(';');
        if (data.length == headers.length) {

            var tarr = [];
            for (var j=0; j<headers.length; j++) {
                tarr.push(data[j]);
            }
            paramLines.push(tarr);
        }
    }
	
    
}
function filterByType(type,headers,data){
	var type_id = headers.indexOf("type");
	var elts = [];
	for (key in data){
		if (data[key][type_id] == type){
			elts.push(data[key]);
		}	
	}
	return elts;
}

function filterData(headers,data){
	// construction de la page el_ex
	
	acc_elt = filterByType("acc",headers,data);
	maq_elt = filterByType("maq",headers,data);
	
	// var el_ex_elt = data[0].filter(function(vari){return vari == "el_ex"});
}
function constructClient(){
	$('#ContenuPrincipal').append("<h1 class='page-header'>Clients</h1>");
			
	$('#ContenuPrincipal').append("<div class='clientGrid'></div>");
	
	var fileextension = CONFIG.imagesExt;
	var urlDIR = CONFIG.imagesDIR+"/clients/";
	$.ajax({
        url: urlDIR,
        success: function(data) {
			var cc = 0;
			$(data).find("a:contains(" + fileextension + ")").each(function () {
				var filename_arr = this.href.split('/');
				var filename = filename_arr[filename_arr.length - 1];
				
				var urlPhoto = urlDIR+'/'+filename;
				
				var imgHTML = "<a><figure><img src='"+urlPhoto+"' alt=''></figure></a>";
				
				$('.clientGrid').append(imgHTML);

			});
		}
	});
}

function constructMenu(elts,type){
	$('#ContenuPrincipal').append("<h1 class='page-header'>"+CONFIG.descriptions[type]+"</h1>");
			
	$('#ContenuPrincipal').append("<div class='grid'></div>");
	$('.grid').append("<div class='grid-sizer'></div>");
	
	for (var key in elts){
		var ID = elts[key][headers.indexOf("nomCourt")];
		$('.grid').append("<div class='grid-item' id='grid_"+ID+"'></div>");
		$('#grid_'+ID).append("<div id='view_"+ID+"' class='view view-sixth'></div>");
		$('#view_'+ID).append("<img src=asset/"+elts[key][headers.indexOf("type")]+"/"+elts[key][headers.indexOf("photoP")]+" />");
		$('#view_'+ID).append("<div id='mask_"+ID+"' class='mask'></div>");
		$('#mask_'+ID).append("<h2>"+elts[key][headers.indexOf("nom/expo")]+"</h2>");
		$('#mask_'+ID).append("<p>"+elts[key][headers.indexOf("client")]+"</p>");
		$('#mask_'+ID).append("<a href='#' id='info_"+ID+"' class='info'>Plus d'infos...</a>");
		
		$('#info_'+ID).on("click",function(evt){
			loadContenuElt(evt,elts,type);
		});
	}
	
	console.log($('.grid'));
	var $grid = $('.grid').masonry({
	  // options
	  itemSelector: '.grid-item',
	  columnWidth: '.grid-sizer'
	});
	
	$grid.imagesLoaded().progress( function() {
	  $grid.masonry();
	});
	
}
function loadContenuElt(evt,elts,type){
	$('#ContenuPrincipal').html( "" );
	$('#ContenuPrincipal').append("<h1>"+CONFIG.descriptions[type]+"</h1>");
	
	$('#ContenuPrincipal').append("<div class='grid-elx'></div>");
	$('.grid-elx').append("<div class='grid-sizer-elx'></div>");
	
	var id_el = evt.currentTarget.id.split("_")[1];
	
	for (var key in elts){

		if (elts[key][0] == id_el) {var lineEl = elts[key];}
	}
	
	$('.grid-elx').append('<div class="stamp InfoElEx"></div>');
	
	$('.stamp').append('<div class="ElExInfoHeader">');
	
	$('.ElExInfoHeader').append(lineEl[headers.indexOf("client")]);
	
	if(lineEl[headers.indexOf("option")]){
		$('.ElExInfoHeader').append('<div class="ElExInfoOpt">'+lineEl[headers.indexOf("option")]+"</br>"+"</div>");
	}	
	// var desc = lineEl[headers.indexOf("description")].split("/");
	// $('.stamp').append("<div>");
	// for (var keyd in desc){
		// $('.stamp').append(desc[keyd]+"</br>");
	// }
	// $('.stamp').append("</div>");
	
	$('.stamp').append(lineEl[headers.indexOf("nom/expo")]+"</br>");
	if(lineEl[headers.indexOf("Scéno/design")]){
		$('.stamp').append(lineEl[headers.indexOf("Scéno/design")]+"</br>");
	}
	$('.stamp').append(lineEl[headers.indexOf("description")]+"</br>");
	
	$('#ContenuPrincipal').append("<div id='mySlider' class='carousel slide'></div>");
	$('#mySlider').append("<div class='carousel-inner' role='listbox'></div>");
	
	var leftChevron = '<a class="left carousel-control" href="#mySlider" role="button" data-slide="prev">';
    leftChevron += '<span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>';
    leftChevron += '<span class="sr-only">Previous</span></a>';
	
	var rghtChevron = '<a class="right carousel-control" href="#mySlider" role="button" data-slide="next">';
    rghtChevron += '<span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>';
    rghtChevron += '<span class="sr-only">Next</span></a>';
 
	$('#mySlider').append(leftChevron);
	$('#mySlider').append(rghtChevron);
	
	$('#mySlider').append("<div id='closeBtn' onclick='closeCarousel()'>X</div>");
	
	var fileextension = CONFIG.imagesExt;
	var urlDIR = CONFIG.imagesDIR+lineEl[headers.indexOf("type")]+"/"+lineEl[headers.indexOf("dosPhoto")]+"/";
	$.ajax({
        url: urlDIR,
        success: function(data) {
			var cc = 0;
			$(data).find("a:contains(" + fileextension + ")").each(function () {
				var filename_arr = this.href.split('/');
				var filename = filename_arr[filename_arr.length - 1];
				
				var ID = id_el+"_"+cc;
				
				var urlPhoto = urlDIR+'/'+filename;
				
				$('.grid-elx').append('<div id="grid_elx_'+ID+'" class="grid-item-elx" ></div>');
				$('#grid_elx_'+ID).append('<img src="'+urlPhoto+'" >');		
				
				$('.carousel-inner').append("<div class='item'><img src='"+urlPhoto+"' ></div>");

				cc++;
		
			});
			
			var $grid = $('.grid-elx').masonry({
			  // options
			  itemSelector: '.grid-item-elx',
			  percentPosition: true,
			  columnWidth: '.grid-sizer-elx'
			});
			
			var $stamp = $grid.find('.stamp');
			$grid.imagesLoaded().progress( function() {
				$grid.masonry( 'stamp', $stamp );
				$grid.masonry('layout');

			});
						
			$(".grid-item-elx").css("cursor","pointer");
			
			$(".grid-item-elx").on("click",function(e){
				openSlider(e);		
			});

		}
    });

}
function openSlider(e){
		var idSrc = e.currentTarget.id;
		var d = idSrc.split("_");
		var nb = d[d.length -1];
		$("#mySlider").css("display","block");
		$('#mySlider').carousel('pause');
		var items = $(".carousel-inner").children();
		$(items[nb]).addClass( "active" );
		$("#closeBtn").css("display","block");
	}

function closeCarousel(){
	$("#mySlider").css("display","none");
	$("#closeBtn").css("display","none");
}
