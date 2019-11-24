import $ from 'jquery'

function authorizedPost({url, data, success, authToken}) {
  $.ajax({
    type: "POST",
    url: url,
    dataType: 'json',
    async: true,
    data: data,
    success: success,
    beforeSend: (xhr) => xhr.setRequestHeader("Authorization", "Bearer " + authToken)
  })
}

function authorizedGet({url, success, authToken}) {
  $.ajax({
    type: "GET",
    url: url,
    async: true,
    success: success,
    beforeSend: (xhr) => xhr.setRequestHeader("Authorization", "Bearer " + authToken)
  })
}

function simpleGet({url, success}) {
  $.ajax({
    type: "GET",
    url: url,
    async: true,
    success: success
  })
}

function empty_or_null(param) {
  return param ? param === "" : true
}

function getRequest(params) {
  empty_or_null(params.authToken) ? simpleGet(params) : authorizedGet(params)
}

export {getRequest, authorizedPost}
