function getRandomColor() {
    var colours = ['red', 'orange', 'yellow', 'olive', 'green',
		   'teal', 'blue', 'violet', 'purple', 'pink',
		   'brown', 'grey', 'black'];
    var colorIndex = Math.floor(Math.random() * ((colours.length -1) - 0 + 1)) + 0;
    return colours[colorIndex];
}

var samap = new Vue({
    el: '#southafrica',
    delimiters: ["[[","]]"],
    data:{
	geo: [],
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
	    for (var i=0; i < this.geo.length; i++){
	    	console.log('Plotting points');
	    	var myRenderer = L.canvas({ padding: 0.1 });
		var self = this;
		var k = i;
	    	L.geoJSON(this.geo[i].geo,{
		    filter: function(feature){
			// get the conditions for the particular geo
			var geography = self.geo[k];
			var conditions = filters.conditions[geography.name]["conditions"];
			var satisfied = true;
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
			layer.myTag = self.geo[i].name;
		    },
	    	    pointToLayer: function(feature,latlng){
	    		return L.circleMarker(latlng,{
	    		    renderer: myRenderer,
	    		    radius:4,
			    color: self.geo[i].colour
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
	    filters.conditions[data.name] = {
		"conditions": [],
		"colour":colour
	    };
	    var layerColumns = {"name": data.name, "columns": data.columns, 'colour':colour};
	    filters.columns.push(layerColumns);
	    filters.sources.push(data.name);
	    this.$set(tooltips.headers, data.name, {"columns": Object.keys(data.columns)});
	    var geoDetail = {"name": data.name, 'geo':data.data, 'colour':colour};
	    samap.geo.push(geoDetail);
	    layers.layers.push({'name': data.name, 'colour': colour});
	    $('.ui.modal').modal('hide');
	},
    }
});



//show the choosen datasets
var layers = new Vue({
    el: '#layers',
    delimiters: ["[[", "]]"],
    data:{
	layers: []
    },
    methods:{
	fetchLayers: function(){
	    $('.ui.modal').modal('show');
	    if (datasetOptions.datasets.length == 0){
		$.ajax({
		    dataType:"json",
		    url: "/api/v1/datasets",
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
	removeLayer(layer){
	    console.log("Removing the layer, and also remove it from the map");
	    // We also need to remove the filters as well.
	    for(var i=0; i < this.layers.length; i++){
		if (this.layers[i].name == layer.name){
		    this.layers.splice(i,1);
		    console.log('Remove layer.....');
		    break;
		}
	    }
	    console.log("removing layer from map");
	    samap.removeLayer(layer.name);
	    for (var k=0; k < samap.geo.length; k++){
		if (samap.geo[i].name == layer.name){
		    console.log("Found matching geojson,removing... ");
		    samap.geo.splice(k,1);
		    break;
		}
	    }
	}
    }
});

var tooltips = new Vue({
    el: '#tooltips',
    delimiters: ["[[","]]"],
    data:{
	headers:{},
    },
    watch:{
	headers: function(){
	    $('#multi-tooltip').dropdown();
	}
    }
});

var filters = new Vue({
    el:'#filters',
     delimiters: ["[[","]]"],
    data:{
	displayMenu: 'none',
	conditions:{},
	columns: [],
	sources: [],
	sourceSelected:'',
	columnSelected:'',
	valueSelected:'',
	currentColumns: [],
	currentValues: [],
    },
    methods:{
	removeCondition:function(layer, index){
	    console.log("removing condition from layer");
	    console.log(index);
	    this.conditions[layer.name].conditions.splice(index,1);
	    // We need to update the geo paramerters
	    
	    
	},
	filterColour(colour){
	    console.log("The current colour for this is");
	    console.log(colour);
	    return 'ui '+ colour +' ribbon label';
	},
	done: function(){
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
	    samap.geo.push();
	},
	addCondition: function(){
	    this.displayMenu = 'block';
	},
	onSelectedSource: function(){
	    console.log("The selected data source is");
	    console.log(this.sourceSelected);
	    console.log('We need to populate the colums from this datasource');
	    for (var k=0; k < this.columns.length;k++){
		if (this.columns[k].name == this.sourceSelected){
		    this.currentColumns = Object.keys(this.columns[k].columns);
		    break;
		}
	    }
	    
	    
	},
	onSelectedColumn: function(){
	    console.log("The column has been selected");
	    console.log(this.columnSelected);
	    console.log("we need to get the values for this column");
	    for (var i =0; i<= this.columns.length;i++){
		if (this.columns[i].name == this.sourceSelected){
		    console.log("Found the guy");
		    this.currentValues = this.columns[i].columns[this.columnSelected];
		    break;
		}
	    }
	    
	},
    }
});


$('.ui.search.dropdown')
  .dropdown({
    fullTextSearch: true
  });


$('.menu .item').tab();

$('.popup.item').popup();

$('.ui.sidebar').sidebar();

function map_init_basic (map, options) {
    samap.map = map;
}
