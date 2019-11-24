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

function simplePost({url, data, success}) {
  $.ajax({
    type: "POST",
    url: url,
    dataType: 'json',
    data: data,
    success: success
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

function authorizedDelete({url, success, authToken}) {
  $.ajax({
    type: "DELETE",
    url: url,
    async: true,
    success: success,
    beforeSend: (xhr) => xhr.setRequestHeader("Authorization", "Bearer " + authToken)
  })
}

function simpleDelete(params) {
  console.log("Delete requests are not safe unauthorized")
}

function empty_or_null(param) {
  return param ? param === "" : true
}

function postRequest(params) {
  empty_or_null(params.authToken) ? simplePost(params) : authorizedPost(params)
}

function getRequest(params) {
  empty_or_null(params.authToken) ? simpleGet(params) : authorizedGet(params)
}

function deleteRequest(params) {
  empty_or_null(params.authToken) ? simpleDelete(params) : authorizedDelete(params)
}

export {getRequest, postRequest, deleteRequest}
