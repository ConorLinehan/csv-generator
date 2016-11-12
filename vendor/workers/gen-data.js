
importScripts('/assets/faker.js');
importScripts('/assets/papaparse.js');

function generateData(paths, rows, headers) {
  var generatorFuncs = buildGeneratorFunctions(paths);
  var generatorFuncsLength = generatorFuncs.length;

  var arr = new Array(rows);

  for (var i = 0; i < rows; i++) {
    var row = [];
    for(var j = 0; j < generatorFuncsLength; j++) {
      row[j] = generatorFuncs[j]();
    }
    arr[i] = row;
  }

  return arr;
}

function buildGeneratorFunctions(paths) {
  return paths.map(function(pathString) {
    var path = pathString.split('.');
    return faker[path[0]][path[1]];
  });
}


self.addEventListener('message', function(e) {
  var csvArray = generateData(e.data.paths, e.data.rows, e.data.headers);
  postMessage(Papa.unparse(csvArray));
});
