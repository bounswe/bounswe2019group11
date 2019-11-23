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

export {authorizedPost}
