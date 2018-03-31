angular.module('app', []);
angular.module('app')
   .controller('controller', ['$scope', '$http', function($scope, $http){
       window.scope = $scope;
       console.log('ree');

       $scope.generateChartByField= function(field, remove){
           if ($scope.dataset){
               bubbleChart(generateDataSet($scope.dataset, field), remove);
           }
       };

       loadPosts(0, 10000, function(data){
           loadPosts(10000, 20000, function(secondData){
               $scope.dataset = data.concat(secondData);
               bubbleChart(generateDataSet($scope.dataset));
           });
       });

       function loadPosts(start, count, success) {
           var url = "http://chrozera.xyz:4040/getPosts?start=" + start + (count ? "&amount=" + count : "");
           $http({
               method: 'GET',
               url: url
           }).then(function successCallback(response) {
               success(response.data)
               // console.log(response);
               // $scope.posts = response.data;
           }, function errorCallback(error) {
               console.error(error);
           });
       }

       function generateDataSet(posts, key){
           if (!key) {
               key = "subreddit"
           }
           var exampleData = [{"Name":"Olives","Count":4319},
               {"Name":"Tea","Count":4159},
               {"Name":"Mashed Potatoes","Count":2583},
               {"Name":"Boiled Potatoes","Count":2074},
               {"Name":"Milk","Count":1894},
               {"Name":"Chicken Salad","Count":1809},
               {"Name":"Vanilla Ice Cream","Count":1713},
               {"Name":"Cocoa","Count":1636},
               {"Name":"Lettuce Salad","Count":1566},
               {"Name":"Lobster Salad","Count":1511},
               {"Name":"Chocolate","Count":1489},
               {"Name":"Apple Pie","Count":1487},
               {"Name":"Orange Juice","Count":1423},
               {"Name":"American Cheese","Count":1372},
               {"Name":"Green Peas","Count":1341},
               {"Name":"Assorted Cakes","Count":1331},
               {"Name":"French Fried Potatoes","Count":1328},
               {"Name":"Potato Salad","Count":1306},
               {"Name":"Baked Potatoes","Count":1293},
               {"Name":"Roquefort","Count":1273},
               {"Name":"Stewed Prunes","Count":1268}];

           function reducer(accumulator, currentValue) {
                if(accumulator[currentValue[key]]){
                accumulator[currentValue[key]]++
                } else {
                    accumulator[currentValue[key]] = 1;
                }
               return accumulator;
           }

           var postData = posts.reduce(reducer, {});




           var realdata = [];

           Object.keys(postData).forEach(function(key){
                 realdata.push({
                     "Name": key,
                     "Count": postData[key]
                 })
           });

           var average = realdata.reduce(function(acc, cur){
               return acc + cur.Count;
           }, 0) / realdata.length;


           realdata = realdata.filter(function (item){
              return item.Count > Math.ceil(average);
           });

           realdata = realdata.sort(function(a,b){
              return a.Count > b.Count;
           });

           realdata = realdata.slice(0,20);

           console.log(average, 'a', realdata.length)

           var dataset = {
               "children": realdata ? realdata : exampleData
           };


           return dataset;
       }

       function bubbleChart(dataset, remove){
           if (remove){
               $('#graph').remove();
           }
           var diameter = 600;
           var color = d3.scaleOrdinal(d3.schemeCategory10);

           var bubble = d3.pack(dataset)
               .size([diameter, diameter])
               .padding(1.5);

           // var svg = d3.select("body")
           var svg = d3.select("#chartContainer")
               .append("svg")
               .attr("width", diameter)
               .attr("align", "center")
               .attr("id", "graph")
               .attr("height", diameter)
               .attr("class", "bubble");

           var nodes = d3.hierarchy(dataset)
               .sum(function(d) { return d.Count; });

           var node = svg.selectAll(".node")
               .data(bubble(nodes).descendants())
               .enter()
               .filter(function(d){
                   return  !d.children
               })
               .append("g")
               .attr("class", "node")
               .attr("transform", function(d) {
                   return "translate(" + d.x + "," + d.y + ")";
               });

           // node.append("title")
           //     .text(function(d) {
           //         return d.Name + ": " + d.Count;
           //     });

           node.append("circle")
               .attr("r", function(d) {
                   return d.r;
               })
               .style("fill", function(d,i) {
                   return color(i);
               });

           node.append("text")
               .attr("dy", ".2em")
               .style("text-anchor", "middle")
               .text(function(d) {
                   return d.data.Name.substring(0, d.r / 3);
               })
               .attr("font-family", "sans-serif")
               .attr("font-size", function(d){
                   return d.r/5;
               })
               .attr("fill", "white");

           node.append("text")
               .attr("dy", "1.3em")
               .style("text-anchor", "middle")
               .text(function(d) {
                   return d.data.Count;
               })
               .attr("font-family",  "Gill Sans", "Gill Sans MT")
               .attr("font-size", function(d){
                   return d.r/5;
               })
               .attr("fill", "white");

           d3.select(self.frameElement)
               .style("height", diameter + "px");

       }

   }]);