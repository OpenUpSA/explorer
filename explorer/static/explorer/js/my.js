function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

var samap = new Vue({
    el: '#southafrica',
    delimiters: ["[[","]]"],
    data:{
	geo: [],
	map: '',
    },
    watch:{
	geo: function(){
	    console.log('Plotting points on the map');
	    console.log(this.geo.length);
	    // for (var i=0; i <= this.geo.length; i++){
	    // 	console.log('Plotting points');
	    // 	var color = getRandomColor();
	    // 	var myRenderer = L.canvas({ padding: 0.1 });
	    // 	L.geoJSON(this.geo.geo[i],{
	    // 	    pointToLayer: function(feature,latlng){
	    // 		return L.circleMarker(latlng,{
	    // 		    renderer: myRenderer,
	    // 		    radius:2,
	    // 		    color: color
	    // 		});
	    // 	    }
	    // 	}).addTo(this.map);
	    // }
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
	    var layerDetail = {"name": data.name, "conditions":[]};
	    filters.conditions.push(layerDetail);
	    var geoDetail = {"name": data.name, 'geo':data.data};
	    samap.geo.push(geoDetail);
	    layers.layers.push(data.name);
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
    }
});


var filters = new Vue({
    el:'#filters',
     delimiters: ["[[","]]"],
    data:{
	conditions:[],
	source: [],
	sourceSelected:'',
	columnSelected:'',
	valueSelected:''
    },
    methods:{
	addCondition: function(){
	    
	}
    }
});

var conditionFilterMenu = new Vue({
    el: '#filter-condition',
    delimiters: ["[[","]]"],
    data:{
	showConditionMenu: 'none',
	columns: [],
	values: {},
	colvalues: [],
	columnSelected: '',
	valueSelected: ''
	
    },
    methods:{
	onChange :function(event){
	    // get all the values that correspond to the selected column
	    this.colvalues = [];
	    console.log("selected column is ");
	    console.log(this.values[this.columnSelected]);
	    this.colvalues = this.values[this.columnSelected];
	},
	done: function(){
	    console.log("Saving and closing condition");
	    for (var i =0; i < mainFilterMenu.filterLayer.length; i++){
		if (mainFilterMenu.filterLayer[i].dataset == mainFilterMenu.currentFilter){
		    mainFilterMenu.filterLayer[i].conditions[this.columnSelected] = this.valueSelected;
		    mainFilterMenu.conditions.push(this.columnSelected);
		    break;
		}
	    }
	    // We need to add these conditions
	    this.showConditionMenu = 'none';
	} 
    }
});

var mainFilterMenu = new Vue({
    el: '#filter-menu',
    delimiters: ["[[","]]"],
    data: {
	showFilterMenu: 'none',
	filterLayer:[],
	currentFilter: '',
	conditions: []
    },
    methods: {
	addCondition: function(){
	    console.log("Adding new filter, first checking current dataaset");
	    console.log(this.currentFilter);
	    conditionFilterMenu.showConditionMenu = 'block';
	    conditionFilterMenu.colvalues = [];
	    for (var i=0; i < this.filterLayer.length; i++ ){
	    	console.log("Lopping through filter layers to find the correct one");
	    	if (this.filterLayer[i].dataset == this.currentFilter){
	    	    console.log("populating the columns");
	    	    conditionFilterMenu.columns = Object.keys(this.filterLayer[i].columns);
		    conditionFilterMenu.values = this.filterLayer[i].columns;
		    break;
	    	}
	    }
	    //We need to collect all the possible values from the geojson dataset for each column
	}
    }
});

//Show all the filters for a particular dataset

Vue.component('layer-group', {
    props: ['dataset'],
    delimiters: ["[[","]]"],
    data: function(){
	return {
	    count: 1
	};
    },
    template:`
<div>
<a class="ui item filter" v-on:click="showFilter">
[[dataset.name]] <i class="dropdown icon"></i>
</a>
</div>`,
    methods: {
	showFilter(event){
	    if (this.count == 1){
		$('#osm-map').attr('class', 'six wide column');
		mainFilterMenu.showFilterMenu = 'block';
		if (mainFilterMenu.filterLayer.length == 0){
		    console.log("Filter Conditions have not been created, creating a new one");
		    // We have to collect all the values from all the columns
		    mainFilterMenu.filterLayer.push({
			"dataset": this.dataset.name,
			"columns": this.dataset.columns,
			"conditions": {}
		    });
		    mainFilterMenu.currentFilter = this.dataset.name;
		    this.count = 2;
		}else{
		    console.log("There exists some FilterLayers, appending a new Filter Layer");
		    // Check where a Filter already exists, if so, show the conditions
		    mainFilterMenu.filterLayer.push({
				"dataset": this.dataset.name,
				"columns": this.dataset.columns,
				"conditions": {}
			    });
		    mainFilterMenu.currentFilter = this.dataset.name;
		    mainFilterMenu.conditions = [];
		    // for (var i = 0; i < mainFilterMenu.filterLayer.lengh; i++){
		    // 	if (mainFilterMenu.filterLayer[i].dataset == mainFilterMenu.currentFilter){
		    // 	    mainFilterMenu.conditions = Object.keys(mainFilterMenu.filterLayer[i].conditions);
		    // 	}else{
		    // 	    mainFilterMenu.filterLayer.push({
		    // 		"dataset": this.dataset.name,
		    // 		"columns": this.dataset.columns,
		    // 		"conditions": {}
		    // 	    });
		    // 	    mainFilterMenu.currentFilter = this.dataset.name;
		    // 	}
		    // }
		    this.count = 2;
		}
	    }else if (this.count == 2){
		mainFilterMenu.showFilterMenu = 'none';
		$('#osm-map').attr('class', 'twelve wide column');
		this.count = 1;
	    }
	}
    },
 });

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
