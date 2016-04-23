var db,
    new_search_timeout;

var xhr = new XMLHttpRequest();
xhr.open('GET', '../gurbani.sqlite', true);
xhr.responseType = 'arraybuffer';

xhr.onload = function(e) {
  var uInt8Array = new Uint8Array(this.response);
  db = new SQL.Database(uInt8Array);
};
xhr.send();

var $search = document.getElementById("search");
var $shabad = document.getElementById("shabad");
var $results = document.getElementById("results");
var $session = document.getElementById("session");

$search.addEventListener("keyup", typeSearch);
$results.addEventListener("click", clickResult);
$session.addEventListener("click", clickSession);

function typeSearch() {
  clearTimeout(new_search_timeout);
  new_search_timeout = setTimeout(search, 500);
}

function search() {
  var search_query = $search.value;
  if (search_query.length > 2) {
    var content = db.exec("SELECT ID, Gurmukhi, ShabadID FROM Shabad WHERE FirstLetters LIKE '%" + search_query + "%'");
    if (content.length > 0) {
      $results.innerHTML = "";
      content[0].values.forEach(function(item, i) {
        $results.innerHTML = $results.innerHTML + "<li><a href='#' class='panktee' data-shabad-id='" + item[2] + "'>" + item[1] + "</a></li>";
      });
    } else {
      $results.innerHTML = "<li class='english'>No results.</li>";
    }
  } else {
    $results.innerHTML = "";
  }
}

function clickResult(e) {
  if (e.target.classList.contains("panktee")) {
    var $panktee = e.target;
    var ShabadID = $panktee.dataset.shabadId;
    $session.innerHTML = $session.innerHTML + '<li><a href="#" class="panktee" data-shabad-id="' + ShabadID + '">' + $panktee.innerText + '</a></li>';
    loadShabad(ShabadID);
  }
}

function clickSession(e) {
  if (e.target.classList.contains("panktee")) {
    var $panktee = e.target;
    var ShabadID = $panktee.dataset.shabadId;
    loadShabad(ShabadID);
  }
}

function loadShabad(ShabadID) {
  var content = db.exec("SELECT ID, Gurmukhi FROM Shabad WHERE ShabadID = '" + ShabadID + "'");
  if (content.length > 0) {
    $shabad.innerHTML = "";
    content[0].values.forEach(function(item, i) {
      $shabad.innerHTML = $shabad.innerHTML + '<li><a href="#" class="panktee">' + item[1] + '</a></li>';
    });
  }
}