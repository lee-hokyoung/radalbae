$(document).ready(function () {
  $('#summernote').summernote({
    height:300,
    minHeight:null
  });
});
function fnWrite(){
  let title = document.querySelector('input[name="title"]');
  let writer = document.querySelector('input[name="writer"]');
  let content = $('#summernote').summernote('code');
  let boardType = document.querySelector('input[name="boardType"]');
  if(!title.value){
    alert('제목을 입력해주세요');
    title.focus();
    return false;
  }
  if(!writer.value){
    alert('작성자를 입력해주세요');
    writer.focus();
    return false;
  }
  if(!$(content).text()){
    alert('내용을 입력해주세요');
    return false;
  }
  let xhr = new XMLHttpRequest();
  xhr.open('POST', '/board/' + boardType.value, true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onreadystatechange = function(){
    if(this.readyState === XMLHttpRequest.DONE && this.status === 200){
      let res = this.response;
      console.log('res : ', res);
      alert('정상적으로 등록되었습니다.');
      location.href = '/board/' + boardType.value;
    }
  };
  xhr.send(JSON.stringify({
    title:title.value,
    writer:writer.value,
    content:content
  }));
}
// 댓글작성
function fnReplyCreate(content_id){
  let name = document.querySelector('input[name="name"]');
  let pw = document.querySelector('input[name="pw"]');
  let content = document.querySelector('textarea');
  if(!name.value){
    alert('이름을 입력해주세요');
    name.focus();
    return false;
  }
  if(!pw.value){
    alert('비밀번호를 입력해주세요');
    pw.focus();
    return false;
  }
  if(!content.value){
    alert('내용을 입력해주세요');
    content.focus();
    return false;
  }
  let xhr = new XMLHttpRequest();
  xhr.open('POST', '/board/reply/' + content_id);
  xhr.setRequestHeader('Content-type', 'application/json');
  xhr.onreadystatechange = function(){
    if(this.readyState === XMLHttpRequest.DONE && this.status === 200){
      let res = JSON.parse(this.response);
      if(res.code !== 1){
        alert(res.message);
        return false;
      }
      fnGenerateReplyHTML(res.result, name.value, content.value);
    }
  };
  xhr.send(JSON.stringify({name:name.value, pw:pw.value, content:content.value}));
}

// 댓글 HTML 생성
function fnGenerateReplyHTML(res, name, content){
  let html = '<li class="list-group-item list-group-item-primary">' +
    '<div class="row">' +
      '<div class="col-md-2 text-primary">' + name + ' 님</div>' +
      '<div class="col-md-10">' + content + '</div>' +
    '</div>' +
  '</li>';
  $('#reply_list').append(html);
}