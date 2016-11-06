function save(string, name) {
  let data = new Blob([string], { type: 'text/csv; charset=utf-8;'});
  if (navigator.msSaveBlob) {
      window.navigator.msSaveBlob(data, name);
  } else {
      var link = document.createElement('a');
      link.href = window.URL.createObjectURL(data);
      link.setAttribute('download', name);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  }
}

export default {
  save: save
};
