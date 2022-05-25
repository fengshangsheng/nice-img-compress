module.exports = function(byte) {
  let result = ''
  if (byte >= 1073741824) {
    // B => GB
    result = byte % 1073741824 === 0 ? byte / 1073741824 + 'G' : Math.trunc(byte / 1073741824) + 'G'
  } else if (byte >= 1048576) {
    // B => MB
    result = byte % 1048576 === 0 ? byte / 1048576 + 'MB' : Math.trunc(byte / 1048576) + 'MB'
  } else if (byte >= 1024) {
    // B => KB
    result = byte % 1024 === 0 ? byte / 1024 + 'KB' : Math.trunc(byte / 1024) + 'KB'
  } else {
    result = byte + 'B'
  }
  return result;
}

