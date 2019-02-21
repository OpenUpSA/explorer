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
	    console.log(this.geo.length);
	    for (var i=0; i < this.geo.length; i++){
	    	console.log('Plotting points');
	    	var myRenderer = L.canvas({ padding: 0.1 });
		var self = this;
	    	L.geoJSON(this.geo[i].geo,{
		    filter: function(feature){
			// get the conditions for the geo.
			for(var i=0; i < filters.conditions.length;i++){
			    if(filters.conditions[i].name == self.geo[i].name){
				for(var k=0;k< filters.conditions[i].conditions.length;k++){
				    var column = filters.conditions[i].conditions[i].column;
				    var value = filters.conditions[i].conditions[i].value;
				    if (feature.properties[column] == value){
					continue;
				    }
				}
			    }
			}
		    },
		    onEachFeature:function(feature, layer){
			layer.myTag = self.geo[i].name;
		    },
	    	    pointToLayer: function(feature,latlng){
	    		return L.circleMarker(latlng,{
	    		    renderer: myRenderer,
	    		    radius:2,
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
	    var layerDetail = {"name": data.name, "conditions":[], 'colour':colour };
	    filters.conditions.push(layerDetail);
	    var layerColumns = {"name": data.name, "columns": data.columns, 'colour':colour};
	    filters.columns.push(layerColumns);
	    filters.sources.push(data.name);
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


var filters = new Vue({
    el:'#filters',
     delimiters: ["[[","]]"],
    data:{
	displayMenu: 'none',
	conditions:[],
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
	    for(var i = 0; i <= this.conditions.length; i++){
		if (this.conditions[i].name == layer.name){
		    this.conditions[i].conditions.splice(index,1);
		    break;
		}
	    }
	    // We need to update the geo paramerters
	    
	    
	},
	filterColour(condition){
	    console.log("The current colour for this is");
	    console.log(condition);
	    return 'ui '+ condition.colour +' ribbon label';
	},
	done: function(){
	    console.log('Saving the new filter');
	    console.log(this.valueSelected);
	    for (var i =0;i < this.conditions.length;i++){
		if (this.conditions[i].name == this.sourceSelected){
		    this.conditions[i].conditions.push({
			"column": this.columnSelected,
			"value":this.valueSelected
		    });
		    console.log("entered new filter condition");
		    break;
		}
	    }
	    this.sourceSelected = '';
	    this.columnSelected = '';
	    this.valueSelected = '';
	    this.currentColumns = '';
	    this.currentvalues = '';
	    this.displayMenu = 'none';
	    //we need to update the geo for this layer
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

// var conditionFilterMenu = new Vue({
//     el: '#filter-condition',
//     delimiters: ["[[","]]"],
//     data:{
// 	showConditionMenu: 'none',
// 	columns: [],
// 	values: {},
// 	colvalues: [],
// 	columnSelected: '',
// 	valueSelected: ''
	
//     },
//     methods:{
// 	onChange :function(event){
// 	    // get all the values that correspond to the selected column
// 	    this.colvalues = [];
// 	    console.log("selected column is ");
// 	    console.log(this.values[this.columnSelected]);
// 	    this.colvalues = this.values[this.columnSelected];
// 	},
// 	done: function(){
// 	    console.log("Saving and closing condition");
// 	    for (var i =0; i < mainFilterMenu.filterLayer.length; i++){
// 		if (mainFilterMenu.filterLayer[i].dataset == mainFilterMenu.currentFilter){
// 		    mainFilterMenu.filterLayer[i].conditions[this.columnSelected] = this.valueSelected;
// 		    mainFilterMenu.conditions.push(this.columnSelected);
// 		    break;
// 		}
// 	    }
// 	    // We need to add these conditions
// 	    this.showConditionMenu = 'none';
// 	} 
//     }
// });

// var mainFilterMenu = new Vue({
//     el: '#filter-menu',
//     delimiters: ["[[","]]"],
//     data: {
// 	showFilterMenu: 'none',
// 	filterLayer:[],
// 	currentFilter: '',
// 	conditions: []
//     },
//     methods: {
// 	addCondition: function(){
// 	    console.log("Adding new filter, first checking current dataaset");
// 	    console.log(this.currentFilter);
// 	    conditionFilterMenu.showConditionMenu = 'block';
// 	    conditionFilterMenu.colvalues = [];
// 	    for (var i=0; i < this.filterLayer.length; i++ ){
// 	    	console.log("Lopping through filter layers to find the correct one");
// 	    	if (this.filterLayer[i].dataset == this.currentFilter){
// 	    	    console.log("populating the columns");
// 	    	    conditionFilterMenu.columns = Object.keys(this.filterLayer[i].columns);
// 		    conditionFilterMenu.values = this.filterLayer[i].columns;
// 		    break;
// 	    	}
// 	    }
// 	    //We need to collect all the possible values from the geojson dataset for each column
// 	}
//     }
// });

//Show all the filters for a particular dataset

// Vue.component('layer-group', {
//     props: ['dataset'],
//     delimiters: ["[[","]]"],
//     data: function(){
// 	return {
// 	    count: 1
// 	};
//     },
//     template:`
// <div>
// <a class="ui item filter" v-on:click="showFilter">
// [[dataset.name]] <i class="dropdown icon"></i>
// </a>
// </div>`,
//     methods: {
// 	showFilter(event){
// 	    if (this.count == 1){
// 		$('#osm-map').attr('class', 'six wide column');
// 		mainFilterMenu.showFilterMenu = 'block';
// 		if (mainFilterMenu.filterLayer.length == 0){
// 		    console.log("Filter Conditions have not been created, creating a new one");
// 		    // We have to collect all the values from all the columns
// 		    mainFilterMenu.filterLayer.push({
// 			"dataset": this.dataset.name,
// 			"columns": this.dataset.columns,
// 			"conditions": {}
// 		    });
// 		    mainFilterMenu.currentFilter = this.dataset.name;
// 		    this.count = 2;
// 		}else{
// 		    console.log("There exists some FilterLayers, appending a new Filter Layer");
// 		    // Check where a Filter already exists, if so, show the conditions
// 		    mainFilterMenu.filterLayer.push({
// 				"dataset": this.dataset.name,
// 				"columns": this.dataset.columns,
// 				"conditions": {}
// 			    });
// 		    mainFilterMenu.currentFilter = this.dataset.name;
// 		    mainFilterMenu.conditions = [];
// 		    // for (var i = 0; i < mainFilterMenu.filterLayer.lengh; i++){
// 		    // 	if (mainFilterMenu.filterLayer[i].dataset == mainFilterMenu.currentFilter){
// 		    // 	    mainFilterMenu.conditions = Object.keys(mainFilterMenu.filterLayer[i].conditions);
// 		    // 	}else{
// 		    // 	    mainFilterMenu.filterLayer.push({
// 		    // 		"dataset": this.dataset.name,
// 		    // 		"columns": this.dataset.columns,
// 		    // 		"conditions": {}
// 		    // 	    });
// 		    // 	    mainFilterMenu.currentFilter = this.dataset.name;
// 		    // 	}
// 		    // }
// 		    this.count = 2;
// 		}
// 	    }else if (this.count == 2){
// 		mainFilterMenu.showFilterMenu = 'none';
// 		$('#osm-map').attr('class', 'twelve wide column');
// 		this.count = 1;
// 	    }
// 	}
//     },
//  });

$('.ui.search.dropdown')
  .dropdown({
    fullTextSearch: true
  });

$('.ui.dropdown')
  .dropdown()
;

$('.menu .item')
  .tab()
;

function map_init_basic (map, options) {
    samap.map = map;
}
