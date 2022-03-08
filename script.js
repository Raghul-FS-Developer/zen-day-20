
// Global function called in body onload event
function init() {
  getBrews();
}

// Global variables 
var brews = null; // contains brews
var brew_filter_types = null; // contains brew types
var brew_filter_states = null; // contains state's that brew present
const error = document.getElementById('error');

const setError = (msg) => {
  error.innerText = msg;
}

// Function called when user selects state/type to filter with respect to state/type using onchange event
function filter(type) {
  if (type === "state") {
    let stateSeleted = document.getElementById("stateFilter").value;
    if (stateSeleted === "all") renderBrews(brews);
    else renderBrews(brews.filter((brew) => brew.state.includes(stateSeleted)));
  } else {
    let typeSeleted = document.getElementById("typeFilter").value;
    if (typeSeleted === "all") renderBrews(brews);
    else
      renderBrews(
        brews.filter((brew) => brew.brewery_type.includes(typeSeleted))
      );
  }
}

// Function called when user enters the search word in the search box using oninput event
const searchBrew = () => {
  setError('');
  let searchKey = document.getElementById("search").value;
  let searchedBrew = brews.filter((brew) => brew.name.includes(searchKey));
  if (searchKey.length === 0) setError('');
  else {
    if (searchedBrew.length === 0 ) 
      setError(`Brewery with name "${searchKey}" not found!!!!`);
    
    else renderBrews(searchedBrew);
  }

};

// Function called after the response is received from the api to get all the types
const getTypeFilters = (response) => {
  brew_filter_types = brews.map((brew) => brew.brewery_type);
  let typeFilter = document.getElementById("typeFilter");
  let filterOptions = "";
  for (let i of new Set(brew_filter_types)) {
    filterOptions += `<option value="${i}">${i}</option>`;
  }
  filterOptions = ` 
  <option selected>Filter by type</option>
  <option value="all">All</option>
  ${filterOptions}
`;
  typeFilter.innerHTML = filterOptions;
};

// Function called after the response is received from the api to get all the state's
const getStateFilters = (response) => {
  brew_filter_states = brews.map((brew) => brew.state);
  let stateFilter = document.getElementById("stateFilter");
  let filterOptions = "";
  for (let i of new Set(brew_filter_states)) {
    filterOptions += `<option value="${i}">${i}</option>`;
  }
  filterOptions = ` 
  <option selected>Filter by state</option>
  <option value="all">All</option>
  ${filterOptions}
`;
  stateFilter.innerHTML = filterOptions;
};

// Function called after the response is received from the api to render the brews
const renderBrews = (response) => {
  let container = document.getElementById("container");
  container.innerHTML = "";
  let brews = "";
  for (let i = 0; i < response.length; i++) {
    brews += `<div class="col-sm-12 col-md-6"> <div class="card text-dark mb-3 mt-3 brew__card">
    <div class="card-body">
      <div class="row">
        <div class="col-8">
          <h5 class="card-title"><i class="fas fa-beer beer__mug"></i>&nbsp;${
            response[i].name
          }</h5>
        </div>
        <div class="col-md-4 col-sm-12">
          <i class="fas fa-filter beer__type"></i>&nbsp;${
            response[i].brewery_type
          }
        </div>
      </div>
      <hr />
      <p class="card-text">
        <i class="fas fa-map-marker-alt locate"></i>
        ${response[i].street === null ? "" : `${response[i].street},`}
        ${response[i].address_2 === null ? "" : `${response[i].address_2},`}
        ${response[i].address_3 === null ? "" : `${response[i].address_3},`}
        ${response[i].city === null ? "" : `${response[i].city},`}
        ${response[i].state === null ? "" : `${response[i].state},`}
        ${
          response[i].county_province === null
            ? ""
            : `${response[i].county_province},`
        }
        ${response[i].country === null ? "" : `${response[i].country},`}
        ${response[i].postal_code === null ? "" : `${response[i].postal_code}.`}
        


      </p>
    </div>
    <div class="card-body" align="right">
      ${
        response[i].phone === null
          ? ""
          : `<span class="card-link card__links phone"><i class="fas fa-phone-alt"></i>&nbsp;${response[i].phone}</span>`
      }
      ${
        response[i].longitude === null
          ? ""
          : `<a href="https://www.google.com/maps?q=${response[i].latitude},${response[i].longitude}" class="card-link card__links locate"  target="_blank"><i class="fas fa-map-marker-alt"></i>&nbsp;locate</a>`
      }
      
      ${
        response[i].website_url === null
          ? ""
          : `<a href="${response[i].website_url}"  target="_blank" class="card-link card__links website"><i class="fas fa-globe"></i>&nbsp;website</a>`
      }

    </div>
  </div></div>`;
  }

  container.innerHTML = `<div class="row">${brews}</div>`;
};

// Function called to get the brews from the api
async function getBrews() {
  setError('');
  await fetch("https://api.openbrewerydb.org/breweries")
    .then((response) => response.json())
    .then((response) => {
      brews = response;
      renderBrews(brews);
      getTypeFilters();
      getStateFilters();
    })
    .catch((err) => {
      setError('Try again after sometime!');
    });
}

