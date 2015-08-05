String.prototype.toProperCase = function () {
  var result = this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});;
  return result.replace(/[-_]/g, " ");
};