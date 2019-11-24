
function getFormattedAddress({latitude, longitude}) {
  const geocoder = new window.google.maps.Geocoder
  const latLng = {lat: latitude, lng: longitude}
  return new Promise(resolve => {
    geocoder.geocode({'location': latLng}, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          var arr = results[0].formatted_address.split(',')
          arr.splice(0, arr.length-2)
          arr[0] = arr[0].split("/").pop()
          resolve( { status: 'success', result: arr.join(",") })
        }
        else
          resolve( { status: 'error', message: 'No results' })
      }
      else resolve( { status: 'error', message: 'Geocoding failed' })
    })
  })
}

export {getFormattedAddress}
