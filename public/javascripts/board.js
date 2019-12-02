$(document).ready(function () {
  $('#summernote').summernote({
    height: 300,
    minHeight: null
  });
});

function fnWrite() {
  let title = document.querySelector('input[name="title"]');
  let writer = document.querySelector('input[name="writer"]');
  let content = $('#summernote').summernote('code');
  let boardType = document.querySelector('input[name="boardType"]');
  if (!title.value) {
    alert('제목을 입력해주세요');
    title.focus();
    return false;
  }
  if (!writer.value) {
    alert('작성자를 입력해주세요');
    writer.focus();
    return false;
  }
  if (!$(content).text()) {
    alert('내용을 입력해주세요');
    return false;
  }
  let xhr = new XMLHttpRequest();
  xhr.open('POST', '/board/' + boardType.value, true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onreadystatechange = function () {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      let res = this.response;
      console.log('res : ', res);
      alert('정상적으로 등록되었습니다.');
      location.href = '/board/' + boardType.value;
    }
  };
  xhr.send(JSON.stringify({
    title: title.value,
    writer: writer.value,
    content: content
  }));
}

// 댓글작성
function fnReplyCreate(content_id) {
  let content = document.querySelector('textarea');
  if (!content.value) {
    alert('내용을 입력해주세요');
    content.focus();
    return false;
  }
  let xhr = new XMLHttpRequest();
  xhr.open('POST', '/board/reply/' + content_id);
  xhr.setRequestHeader('Content-type', 'application/json');
  xhr.onreadystatechange = function () {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      let res = JSON.parse(this.response);
      if (res.code !== 1) {
        alert(res.message);
        return false;
      }
      console.log('start');
      fnGenerateReplyHTML(content);
    }
  };
  xhr.send(JSON.stringify({content: content.value}));
}

// 댓글 HTML 생성
function fnGenerateReplyHTML(content) {
  let profile_img = document.querySelector('input[name="profile_img"]');
  let user_profile = '';
  if (profile_img) user_profile = profile_img.value;
  let user_name = document.querySelector('input[name="reply_writer"]');
  let html = '<div class="d-flex justify-content-start py-2 reply-wrap bg-warning">' +
    `<div class="reply-profile-img" style="background-image:url(${user_profile})"></div>` +
    '<div class="d-flex flex-column pl-2">' +
    '<div class="reply-header">' +
    `<strong>${user_name.value}</strong>` +
    '<span class="text-muted">지금</span>' +
    '</div>' +
    '<div class="reply-content">' +
    `<span style="white-space:pre">${content.value}</span>` +
    '</div>' +
    '</div>' +
    '</div>';
  $('#reply-list').append(html);
  setTimeout(function () {
    console.log('start fade out');
    $('.reply-wrap').removeClass('bg-warning');
  }, 500);
  content.value = '';
}