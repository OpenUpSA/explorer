// I'm assuming only a couple of layers will be selected.
function getRandomColor() {
    var colours = ['red', 'orange', 'yellow', 'olive', 'green',
		   'teal', 'blue', 'violet', 'purple', 'pink',
		   'brown', 'grey', 'black'];
    var colorIndex = Math.floor(Math.random() * ((colours.length -1) - 0 + 1)) + 0;
    return colours[colorIndex];
}

//show the points on the map
var samap = new Vue({
    el: '#southafrica',
    delimiters: ["[[","]]"],
    data:{
	geo: {},
	map: '',
    },
    methods: {
	removeLayer: function(tagName){
	    console.log("Removing Map from Layer");
	    var self = this;
	    this.map.eachLayer(function(layer){
		if (layer.myTag == tagName){
		    self.map.removeLayer(layer);
		}
	    });
	}
    },
    watch:{
	geo: function(){
	    console.log('Plotting points on the map');
	    var renderer = L.canvas({padding: 0.1});
	    for (const [key, value] of Object.entries(this.geo)){
		L.geoJSON(value.geo,{
		    filter: function(feature){
			var satisfied = true;
			var conditions = filters.conditions[key].conditions;
			for (var i=0; i < conditions.length; i++){
			    if(feature.properties[conditions[i].column] == conditions[i].value){
				satisfied = true;
			    }else{
				satisfied = false;
			    }
			    
			}
			return satisfied;
		    },
		    onEachFeature:function(feature, layer){
			layer.myTag = key;
			var header  = '<h4><i class="bars icon"> Point</i></h4>';
			var table = '<table class="table">';
			if (key in tooltips.tooltipSelection){
			    for (var i=0;i < tooltips.tooltipSelection[key].length; i++){
				var columnName = tooltips.tooltipSelection[key];
				var row = "<tr>"+
				    "<td><b>" + columnName[i] + "</b></td>"+
				    "<td>" + feature.properties[columnName[i]] + "</td>" +
				    "</tr>";
				table = table + row;
			    }
			    var endtable = '</table>';
			    table = table + endtable;   
			}
			else{
			    var longitude = feature.geometry.coordinates[0];
			    var latitude = feature.geometry.coordinates[1];
			    var lat = "<tr><td><b>Latitude</b></td><td>" + latitude + '</td></tr>';
			    var lng = "<tr><td><b>Longitude</b></td><td>" + longitude + '</td></tr>';
			    table = table + lat + lng;
			}
			header = header + table;
			layer.bindTooltip(header).openTooltip();
		    },
	    	    pointToLayer: function(feature,latlng){
	    		return L.circleMarker(latlng,{
	    		    renderer: renderer,
	    		    radius:4,
			    color: value.colour,
			    fillColor: value.colour
	    		});
	    	    }
		}).addTo(this.map);
	    }
	}
    }
});

//Show the avaliable datasets
var datasetOptions = new Vue({
    el: '#datasetOptions',
    delimiters: ["[[", "]]"],
    data: {
	datasets: []
    },
    methods:{
	addToLayer: function(data){
	    var colour = getRandomColor();
	    var self = this;
	    $.ajax({
		dataType: 'json',
		url: 'api/v1/datasets/'+data.id,
		method: 'GET',
		success: function(result){
		    self.$set(filters.conditions, data.name,
			      {"conditions":[], "colour": colour});
		    self.$set(filters.columns, data.name,
			      {"columns": result.columns, "colour": colour});
		    filters.sources.push(data.name);	    
		    self.$set(tooltips.headers, data.name, {"columns": Object.keys(result.columns)});
	    
		    self.$set(samap.geo, data.name,
			      {"geo": result.data,"colour": colour,
			       "count": 0});
	    
		    self.$set(layers.layers, data.name, {"colour": colour});
		    $('.ui.modal').modal('hide');
		},
		error: function(error){
		    console.log(error);
		}
	    });
	    
	},
    }
});



//show the choosen datasets
var layers = new Vue({
    el: '#layers',
    delimiters: ["[[", "]]"],
    data:{
	layers: {},
	boundaries:{
	    "Provincial": "PR",
	    "District": "DC",
	    "Municipal": "MN"
	},
	boundarySelected: '',
	map: ''
    },
    watch:{
	boundarySelected: function(){
	    var self = this;
	    if (this.boundarySelected == ''){
		console.log("Nothing to do");
	    }else{
		self.map.eachLayer(function(layer){
		    if (layer.myTag == "boundary"){
			self.map.removeLayer(layer);
		    }
		});
		url = 'https://mapit.code4sa.org/areas/' +
		    this.boundaries[this.boundarySelected] +
		    '.geojson?generation=2&simplify_tolerance=0.005';
		//var self = this;
		$.ajax({
		    dataType:"json",
		    url:url,
		    method:"GET",
		    success:function(data){
			var style = {
			    "clickable": false,
			    "color": "#00d",
			    "fillColor": "#ccc",
			    "weight": 1.0,
			    "opacity": 0.3,
			    "fillOpacity": 0.3,
			};
			L.geoJSON(data,{
			    style:style,
			    onEachFeature(feature,layer){
				layer.myTag = "boundary";
				layer.on('click', function() {
				    layer.bindPopup(feature.properties.name).openPopup();
				});
			    }
			}).addTo(self.map);
		    },
		    error:function(error){
			console.log("Uable to get Boundry");
		    }
		});
	    }
	}
    },
    methods:{
	fetchLayers: function(){
	    $('.ui.modal').modal('show');
	    if (datasetOptions.datasets.length == 0){
		$.ajax({
		    dataType:"json",
		    url: "api/v1/datasets",
		    method: "GET",
		    success: function(data){
			datasetOptions.datasets = data;
		    },
		    error: function(error){
			console.log("We cant find anything here");
		    }
		});
	    }
	},
	layerColour(layer){
	    return 'ui ' + layer.colour +' empty circular label'; 
	},
	removeLayer(name){
	    console.log("Removing the layer");
	    this.$delete(this.layers, name);

	    //remove sources
	    for (var i=0; i< filters.sources.length;i++){
		if (filters.sources[i] == name){
		    filters.sources.splice(i,1);
		    break;
		}
	    }
	    //remove layer tooltips
	    this.$delete(tooltips.headers, name);
	    this.$delete(tooltips.tooltipSelection, name);
	    this.$delete(tooltips.tipSelected, name);
	    console.log("Removing all the layer filters");
	    this.$delete(filters.conditions, name);
	    this.$delete(filters.columns,name);
	    
	    console.log("Removng the layer from the map");
	    samap.removeLayer(name);

	    console.log("removing from geo list");
	    this.$delete(samap.geo, name);
	}
    }
});

var tooltips = new Vue({
    el: '#tooltips',
    delimiters: ["[[","]]"],
    data:{
	headers:{},
	tooltipSelection:{},
	tipSelected: {},
    },
    methods:{
	done:function(layer){
	    var count = Math.floor(Math.random() * ((100 -1) - 0 + 1)) + 0;
	    var key = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
	    console.log(key);
	    console.log("saving tooltips");
	    console.log(this.tipSelected[layer]);
	    if (this.tipSelected[layer]){
		this.$set(this.tooltipSelection, layer, this.tipSelected[layer].split(","));
	    }else{
		this.$set(this.tooltipSelection, layer, []);
	    }
	    this.$set(samap.geo, key, count);
	},
    },
    watch:{
	headers: function(){
	    setTimeout(() => {
		$(".dropdown").dropdown();
	    }, 0);
	}
    }
});

var filters = new Vue({
    el:'#filters',
     delimiters: ["[[","]]"],
    data:{
	displayMenu: 'none',
	conditions:{},
	columns: {},
	sources: [],
	sourceSelected:'',
	columnSelected:'',
	valueSelected:'',
	currentColumns: [],
	currentValues: [],
    },
    methods:{
	removeCondition:function(layer, index){
	    var count = Math.floor(Math.random() * ((100 -1) - 0 + 1)) + 0;
	    var key = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
	    console.log("removing condition from layer");
	    console.log(index);
	    this.conditions[layer].conditions.splice(index,1);
	    // We need to update the map without this filter, retrigger geo
	    // There must be a better way of doing this.
	    this.$set(samap.geo, key, count);
	    
	    
	    
	    
	},
	filterColour(colour){
	    console.log("The current colour for this is");
	    console.log(colour);
	    return 'ui '+ colour +' ribbon label';
	},
	done: function(){
	    var count = Math.floor(Math.random() * ((100 -1) - 0 + 1)) + 0;
	    var key = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
	    console.log('Saving the new filter');
	    console.log(this.valueSelected);
	    
	    this.conditions[this.sourceSelected].conditions.push({
		"column": this.columnSelected,
		"value":this.valueSelected
	    });
	    console.log("entered new filter condition");
	    samap.removeLayer(this.sourceSelected);
	    this.sourceSelected = '';
	    this.columnSelected = '';
	    this.valueSelected = '';
	    this.currentColumns = '';
	    this.currentvalues = '';
	    this.displayMenu = 'none';
	    this.$set(samap.geo, key, count);
	},
	addCondition: function(){
	    this.displayMenu = 'block';
	},
	onSelectedSource: function(){
	    console.log("The selected data source is");
	    console.log(this.sourceSelected);
	    console.log('We need to populate the colums from this datasource');
	    this.currentColumns = Object.keys(this.columns[this.sourceSelected].columns);
	},
	onSelectedColumn: function(){
	    console.log("The column has been selected");
	    console.log(this.columnSelected);
	    console.log("we need to get the values for this column");
	    this.currentValues = this.columns[this.sourceSelected].columns[this.columnSelected];	    
	},
    }
});

$(document).ready(function(){
    $('#filter-dropdown').dropdown({
	fullTextSearch: true
    });
    
    $('.ui.dropdown').dropdown();

    $('.menu .item').tab();

    $('.popup.item').popup();

    $('.ui.sidebar').sidebar();
});


function map_init_basic (map, options) {
    samap.map = map;
    layers.map = map;
}

