const loginForm = document.getElementById("login");
const courseIDDiv = document.getElementById("courseIDDiv");
const answerSheet = document.getElementById("answerSheet");

let _token = "";
loginForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  fetch("https://identity.moon.vn/api/user/login", {
    method: "POST",
    body: JSON.stringify({
      username: username,
      password: password,
      rememberMe: true,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  }).then(function (res) {
    if (res.status != 200) {
      alert("Tên đăng nhập hoặc mật khẩu không chính xác");
    } else {
      loginForm.classList.add("isHidden");
      courseIDDiv.classList.remove("isHidden");
      res.json().then(function (e) {
        _token = e["token"];
      });
    }
  });
});

const courseIDform = document.getElementById("courseIDForm");

courseIDform.addEventListener("submit", function (e) {
  console.log(_token);
  e.preventDefault();
  const courseID = document.getElementById("courseID");
  fetch(`https://courseapi.moon.vn/api/Course/Testing/${courseID.value}/1`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${_token}`,
      referer: "https://beta.moon.vn/",
    },
  }).then(function (res) {
    if (res.status != 200) {
      alert("Không hợp lệ");
    } else
      res.json().then(function (data) {
        clearAnswer();
        data.forEach((e) => {
          renderAnswer(e);
        });
      });
  });
});

function clearAnswer() {
  answerSheet.innerHTML = "";
}

function captureAnswer() {}

function renderAnswer(e) {
  let i = 1;
  const detail = `
  <div class="box">
    <div class="qna">
      <p class="question"> <strong>${i++}. </strong>${e["questionText"]}</p>
      <p class="selection"><strong>A.</strong> ${e["a"]}</p>
      <p class="selection"><strong>B.</strong> ${e["b"]}</p>
      <p class="selection"><strong>C.</strong> ${e["c"]}</p>
      <p class="selection"><strong>D.</strong> ${e["d"]}</p>
      <p class="answer"> Đáp án: <strong style="color: red">${
        e["key"]
      }</strong></p>
    </div>
      
      <div class="solution">${e["answer"]}</div>
  </div>    
  `;
  answerSheet.innerHTML += detail;
}
