function getSortedKeys(obj) {
  var keys = keys = Object.keys(obj);
  keys.sort(function(a,b){return obj[b]-obj[a]});

  const newArray = []
  for(let i = 0; i < keys.length; i++) {
    const item = _.find(obj, keys[i])
    newArray.push(item)
  }

  return newArray
}

function stripPrefix(array,prefix) {
  const string = JSON.stringify(array)
  const replaced = string.replace(new RegExp(prefix, 'g'), '')
  return JSON.parse(replaced)
}
