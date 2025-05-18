const loginForm = document.getElementById("login");
const courseIDDiv = document.getElementById("courseIDDiv");
const answerSheet = document.getElementById("answerSheet");
const courseIDform = document.getElementById("courseIDForm");
const courseID = document.getElementById("courseID");

let currentIndex = 1;
let _token = "";
let isLogin = false;

const proxyURL = "https://web-production-d524d.up.railway.app/";
const moonIdentityAPI = "https://identity.moon.vn/api/user/login";
const courseAPI = "https://courseapi.moon.vn/api/Course";

document.addEventListener("keydown", (e) => {
  if (e.code === "Home" && isLogin) {
    clearAnswer();
    courseIDDiv.classList.remove("isHidden");
  }
});

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch(proxyURL + moonIdentityAPI, {
      method: "POST",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password, rememberMe: true }),
    });

    if (res.status !== 200) {
      alert("Tên đăng nhập hoặc mật khẩu không chính xác");
      return;
    }

    const data = await res.json();
    _token = data.token;
    isLogin = true;

    loginForm.classList.add("isHidden");
    courseIDDiv.classList.remove("isHidden");
  } catch (error) {
    console.error("Login failed:", error);
    alert("Có lỗi xảy ra khi đăng nhập.");
  }
});

courseIDform.addEventListener("submit", async (e) => {
  e.preventDefault();
  currentIndex = 1;

  const id = courseID.value;

  clearAnswer();

  await loadTest(`${courseAPI}/TestingEnglish/${id}/4`);
  await loadTest(`${courseAPI}/Testing/${id}/1`);
  await loadTest(`${courseAPI}/TestingEnglish/${id}/1`);

  courseIDDiv.classList.add("isHidden");
});

async function fetchWithAuth(url) {
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${_token}`,
        referer: "https://beta.moon.vn/",
      },
    });

    if (!res.ok) {
      alert("Không hợp lệ");
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error("Fetch error:", error);
    alert("Có lỗi khi lấy dữ liệu.");
    return null;
  }
}

async function loadTest(url) {
  const data = await fetchWithAuth(url);
  if (!data) return;

  data.forEach((entry) => {
    renderListening_Writing(entry);

    if (entry.testingList) {
      entry.testingList.forEach((q) => renderAnswer(q));
    } else {
      renderAnswer(entry);
    }
  });
}

function clearAnswer() {
  answerSheet.innerHTML = "";
}

function renderListening_Writing(e) {
  const html = `
    <div class="box">
      <div class="solution">${e.content || ""}</div>
    </div>
    <div class="box">
      <div class="solution">${e.answer || ""}</div>
    </div>
  `;
  answerSheet.innerHTML += html;
}

function renderAnswer(e) {
  const html = `
    <div class="box">
      <div class="qna">
        <p class="question"><strong>${currentIndex}. </strong>${
    e.questionText || ""
  }</p>
        <p class="selection"><strong>A.</strong> ${e.a || ""}</p>
        <p class="selection"><strong>B.</strong> ${e.b || ""}</p>
        <p class="selection"><strong>C.</strong> ${e.c || ""}</p>
        <p class="selection"><strong>D.</strong> ${e.d || ""}</p>
        <p class="answer">Đáp án: <strong style="color: red">${
          e.key || "?"
        }</strong></p>
      </div>
      <div class="solution">${e.answer || ""}</div>
    </div>
  `;
  answerSheet.innerHTML += html;
  currentIndex++;
}
