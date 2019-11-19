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