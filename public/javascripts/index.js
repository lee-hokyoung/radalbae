// 회원가입
function fnSubmit() {
  let user_id = document.querySelector('input[name="user_name"]');
  let user_pw = document.querySelector('input[name="user_pw"]');
  let user_pw_confirm = document.querySelector('input[name="user_pw_confirm"]');
  if (!user_id.value) {
    alert('아이디를 입력해주세요');
    user_id.focus();
    return false;
  }
  if (!user_pw.value) {
    alert('비밀번호를 입력해주세요');
    user_pw.focus();
    return false;
  }
  if (user_pw.value !== user_pw_confirm.value) {
    alert('입력한 비밀번호가 서로 다릅니다.');
    user_pw.focus();
    return false;
  }
  let xhr = new XMLHttpRequest();
  xhr.open('POST', '/users/register', true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onreadystatechange = function () {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      let res = JSON.parse(this.response);
      alert(res.message);
      if (res.code === 1) {
        location.href = '/';
      }
    }
  };
  xhr.send(JSON.stringify({user_id: user_id.value, user_pw: user_pw.value}));
}
// 로그인
function fnLogin(){
  let user_id = document.querySelector('input[name="user_id"]');
  let user_pw = document.querySelector('input[name="user_pw"]');
  if(!user_id.value){
    alert('아이디를 입력해주세요.');
    user_id.focus();
    return false;
  }
  if(!user_pw.value){
    alert('비밀번호를 입력해주세요.');
    user_pw.focus();
    return false;
  }
  console.log('start : 0');
  let xhr = new XMLHttpRequest();
  xhr.open('POST', '/users/login');
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onreadystatechange = function () {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      location.href = '/';
    }
  };
  xhr.send(JSON.stringify({user_id: user_id.value, user_pw: user_pw.value}));
}