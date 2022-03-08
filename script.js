

function loading(status) {
  const searching = document.getElementById('loading');
  if (status) {
    searching.className = "is__loading";
  } else {
    searching.className = "not__loading";
  }
}

function setErrorMessage(msg) {
  const error = document.getElementById('error');
  error.innerText = msg;
}
/*
  A Function that is called on body load gets the keys(searched words) from
  local storage and iterate to render pills/chips style recent searches on screen.
*/ 
async function recentSearches() {
  await loading(true);
  let history = { ...localStorage };
  history = Object.keys(history);
  if (history.length) {
    let recentlySearched = "";
    for (let i of history) {
      recentlySearched += `<button  class="btn btn-light btn-sm chip"
       onclick="renderRecentlySearchedNews('${i}');">${i}</button>`;
    }

    document.getElementById(
      "recent"
    ).innerHTML = `Recently searched: ${recentlySearched}`;
  }
  await loading(false);
};


const getReadmore = (article) => {
  let lengthOfSummary = Math.floor(article.summary.length / 4);
  return `${article.summary.slice(0, lengthOfSummary)} <a href="${
    article.link
  }" target="_blank">read more</a>`;
};

async function renderRecentlySearchedNews(){
  await loading(true);
  renderNews(JSON.parse(localStorage.getItem(q)));
  await loading(false);
};

const renderNews = (response) => {
  const newsParent = document.getElementById("news");
  let news = "";
  let articles = response["articles"];
  for (let i = 0; i < articles.length; i++) {
    news += `
    <div class="col news__card">
    <div class="card h-100">
      <img src="${articles[i].media}" class="card-img-top" alt="...">
      <div class="card-body">
        <h5 class="card-title">${articles[i].title}</h5>
        <p class="card-text">${getReadmore(articles[i])}</p>
      </div>
      <div class="card-footer">
        <small class="text-muted">Published: ${
          articles[i].published_date
        }</small>
      </div>
    </div>
  </div>
    `;
  }
  newsParent.innerHTML = news;
};

async function search() {
  await loading(true);
  const q = document.getElementById("q");
  if (q.value === "") {
   setErrorMessage(`Search cannot be empty!!!`);
  } else {
    if (localStorage.getItem(q.value) === null) {
      const uri = `https://free-news.p.rapidapi.com/v1/search?q=${q.value}&lang=en`;
      fetch(uri, {
        method: "GET",
        headers: {
          "x-rapidapi-host": "free-news.p.rapidapi.com",
          "x-rapidapi-key": "880b0ba246mshe7a6c0e5491f12ap1347e9jsn1060b255d49c"
        }
      })
        .then((response) => response.json())
        .then((response) => {
          if (response.status === "ok") {
            localStorage.setItem(q.value, JSON.stringify(response));
            recentSearches();
            renderNews(response);
          } else {
            setErrorMessage(response.status);
          }
       
        })
        .catch((err) => {
          setErrorMessage(response.status);
          console.error(err);
        });
    } else {
      // console.log("From local storage");
      renderNews(JSON.parse(localStorage.getItem(q.value)));

    }
  }
  await loading(false);
}