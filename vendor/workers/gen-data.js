importScripts('/assets/faker.js');
importScripts('/assets/papaparse.js');

var PROGRESS_INTERVAL = 100;

function generateData(paths, rows, headers) {
  var pathsLength = paths.length;

  var arr = new Array(rows);

  for (var i = 0; i < rows; i++) {

    // Post back progress message
    if (i % PROGRESS_INTERVAL === 0) {
      var progress = (i / rows) * 100;
      postMessage({ progress: progress });
    }

    var row = [];
    for(var j = 0; j < pathsLength; j++) {
      row[j] = faker[paths[j][0]][paths[j][1]]();
    }
    arr[i] = row;
  }

  if (headers) {
    arr = [headers].concat(arr);
  }
  return arr;
}

self.addEventListener('message', function(e) {
  var csvArray = generateData(e.data.paths, e.data.rows, e.data.headers);
  postMessage({ result: Papa.unparse(csvArray) });
});
