var noTaskbar = 0;
var alwaysHideNSFW = true;
var idList = [];
var globalStoryDict = {};

function myFolder() {
  this.after = '';
  this.count = 0;
  this.emailDict = {};
  this.subredditname = '';
  this.strippedID = '';
}
var spawnEdge = 100;

function generateUid() {
  var uid = Math.floor((Math.random() * 100000) + 1);
  if (idList.indexOf(uid) > -1) {
    generateUid();
    return;
  }
  return uid;
}

function myWindow(type, state, tofield, ccfield, subjectfield, bodyfield, isLogin) {
  this.type = type;
  this.state = state;
  this.id = String(generateUid());
  this.tofield = tofield;
  this.ccfield = ccfield;
  this.subjectfield = subjectfield;
  this.bodyfield = bodyfield;
  this.idfinder = '#' + String(this.id);
  this.minfinder = '#m' + String(this.id);
  this.isMaxed = false;
  this.oldHeight = null;
  this.oldWidth = null;
  this.oldLeft = null;
  this.oldTop = null;
  globalWindowDict[this.id] = this;
  var html = '<div id="%id" class="emailwindow" style="position:absolute;left:100px;top:300px;"><div class="closebuttons"></div><div class="minimize"></div><div class="maximize"></div><div class="windowclose"></div><div class="upperleftemailwindow"></div><div class="emailwindowbanner"></div><div class="emailbuttons"></div><div class="emailbuttonsbanner"></div><div class="emailcomposewindow"><input type="button" value="Send" class="sendbutton"  tabindex="%tabindex5"><div class="emailcomposebuttons"></div><input type="text" rows="1" cols="40" class="afield tofield" tabindex="%tabindex1" value="%tofield"><input type="text" rows="1" cols="19" class="afield ccfield" tabindex="%tabindex2" value="%ccfield"><input type="text" rows="1" cols="19" tabindex="%tabindex3" class="afield subjectfield" value="%subjectfield"><textarea tabindex="%tabindex4" class="emailcomposebody">%bodyfield</textarea></div></div>';
  if (isLogin) {
    html = html.replace('type="text" rows="1" cols="19" class="afield ccfield', 'type="password" rows="1" cols="19" class="afield ccfield');
  }
  $('.outlookminhi').removeClass('outlookminhi');
  var tempNum = Math.floor(Math.random() * 1000);
  html = html.replace('%tabindex1', tempNum + 1);
  html = html.replace('%tabindex2', tempNum + 2);
  html = html.replace('%tabindex3', tempNum + 3);
  html = html.replace('%tabindex4', tempNum + 4);
  html = html.replace('%tabindex5', tempNum + 5);
  html = html.replace('%id', String(this.id));
  html = html.replace('%bodyfield', bodyfield);
  html = html.replace('%tofield', tofield);
  html = html.replace('%subjectfield', subjectfield);
  html = html.replace('%ccfield', ccfield);
  $('body').append(html);
  $(this.idfinder).css({
    'left': spawnEdge,
    'top': spawnEdge
  });
  spawnEdge += 50;
  if (spawnEdge > $(window).height() - 200) {
    spawnEdge = 50;
  }
  $(this.idfinder).children('.emailcomposewindow').children('.tofield').focus();
  if (tofield.substr(0, 5) == 'reply') {
    $(this.idfinder).children('.emailcomposewindow').children('.emailcomposebody').focus();
  }
  var html = '<div id="m%id" class="emailmin emailminhigh"></div>';
  html = html.replace("%id", String(this.id));
  $('.emailminhigh').removeClass('emailminhigh');
  $('.minholder').append(html);
  var scopeidfinder = this.idfinder;
  var resizeFunc = function() {
    $(scopeidfinder).children('.emailcomposewindow').height($(scopeidfinder).height() - 152);
    var tempheight = $(scopeidfinder).children('.emailcomposewindow').height();
    var tempwidth = $(scopeidfinder).children('.emailcomposewindow').width();
    $(scopeidfinder).children('.emailcomposewindow').children('.emailcomposebody').height(tempheight - 112);
    $(scopeidfinder).children('.emailcomposewindow').children('.emailcomposebody').width(tempwidth - 34);
    $(scopeidfinder).children('.emailcomposewindow').children('.afield').width(tempwidth - 133);
  }
  resizeFunc();
  this.resizeFunc = resizeFunc;
  $(this.idfinder).draggable({
    containment: 'window'
  });
  $(this.idfinder).resizable({
    minHeight: 320,
    minWidth: 673,
    resize: resizeFunc
  });
  $(this.idfinder).children('.emailcomposewindow').children('.sendbutton').click(function() {
    var tofield = $(this).parent().children('.tofield').val();
    var ccfield = $(this).parent().children('.ccfield').val();
    var subjectfield = $(this).parent().children('.subjectfield').val();
    var body = $(this).parent().children('.emailcomposebody').val();
    var id = $(this).parent().parent().attr('id');
    handleEmailSend(id, tofield, ccfield, subjectfield, body);
  });
  $(this.minfinder).click(function() {
    var minid = $(this).attr('id');
    var id = minid.substr(1);
    if ($(this).hasClass('emailminhigh')) {
      $('#' + id).css('display', 'none');
      $('#' + minid).removeClass('emailminhigh');
    } else {
      globalWindowDict[id].bringToFront();
    }
  });
  $(this.idfinder).mousedown(function() {
    globalWindowDict[$(this).attr('id')].bringToFront();
  });
  $(this.idfinder).children('.minimize').click(function() {
    globalWindowDict[$(this).parent().attr('id')].minimize();
  });
  $(this.idfinder).children('.windowclose').click(function() {
    globalWindowDict[$(this).parent().attr('id')].close();
  });
  $(this.idfinder).children('.maximize').click(function() {
    globalWindowDict[$(this).parent().attr('id')].maximize();
  });
  this.bringToFront = function() {
  debugLog("bringToFront called for window " + this.id);
    $('.outlookminhi').removeClass('outlookminhi');
    $('.emailwindow').css('z-index', 50);
    $(this.idfinder).css('z-index', 51);
    $(this.idfinder).css('display', 'block');
    $('.emailminhigh').removeClass('emailminhigh');
    $(this.minfinder).addClass('emailminhigh');
  }
  this.minimize = function() {
    $(this.minfinder).removeClass('emailminhigh');
    $(this.idfinder).css('display', 'none');
  }
  this.close = function() {
    delete globalWindowDict[this.id];
    $(this.minfinder).css('display', 'none');
    $(this.idfinder).css('display', 'none');
    spawnEdge = 100;
  }
  this.maximize = function() {
    $('.outlookminhi').removeClass('outlookminhi')
    if (!this.isMaxed) {
      this.bringToFront();
      var width = $(window).width();
      var height = $(window).height() - 55;
      this.oldWidth = $(this.idfinder).css('width');
      this.oldHeight = $(this.idfinder).css('height');
      this.oldLeft = $(this.idfinder).css('left');
      this.oldTop = $(this.idfinder).css('top');
      $(this.idfinder).css('width', String(width) + 'px');
      $(this.idfinder).css('height', String(height) + 'px');
      $(this.idfinder).css('position', 'absolute');
      $(this.idfinder).css('top', '0px');
      $(this.idfinder).css('left', '0px');
      $(this.idfinder).draggable('disable');
      this.resizeFunc();
      this.isMaxed = true;
    } else {
      this.bringToFront();
      $(this.idfinder).css({
        'width': this.oldWidth,
        'height': this.oldHeight,
        'left': this.oldLeft,
        'top': this.oldTop
      });
      this.resizeFunc();
      $(this.idfinder).draggable('enable');
      this.isMaxed = false;
    }
  }
}

function myStory(parentJson, folder, addToDom) {
  var rootJson = parentJson.data;
  this.rootJson = rootJson;
  this.folder = folder;
  var previewHTML = '<div id="%id" class="anemail emailunread"><span class="subreddit"><b>JS</b></span><span class="emailpreview">%title</span></div>';
  var author = rootJson.author;
  this.id = rootJson.name;
  var num_comments = rootJson.num_comments;
  var score = rootJson.score;
  this.url = rootJson.url;
  this.title = rootJson.title;
  if (rootJson.over_18) {
    if (!alwaysHideNSFW || true) {
      this.title = this.title + '<b><font style="color:red"> NSFW</font></b>';
    }
  }
  previewHTML = previewHTML.replace('%author', author);
  previewHTML = previewHTML.replace('%score', score);
  previewHTML = previewHTML.replace('%title', this.title);
  previewHTML = previewHTML.replace('%subreddit', rootJson.subreddit[0].toString().toUpperCase());
  previewHTML = previewHTML.replace('%domain', rootJson.domain);
  previewHTML = previewHTML.replace('%id', this.id);
  this.previewHTML = previewHTML;
  this.bodyHTML = '';
  folder.emailDict[this.id] = this;
  globalStoryDict[this.id] = this;
  if (addToDom) {
    $('#previewarea').append(previewHTML);
  }
  this.addToArea = function($container) {
    $container.append(this.previewHTML);
  }
}

function getRedditDomain() {
  return (window.location.protocol === 'https:') ?
    'https://pay.reddit.com' :
    'http://www.reddit.com';
}

function populateStory(id) {
  debugLog("populateStory called with id: " + id);
  var story = globalStoryDict[id];
  currentStory = id;
  if (story == null) {
    debugLog("Story not found: " + id);
    return 0;
  }
  if (story.bodyHTML.length > 1) {
    debugLog("Story already loaded: " + id);
    return 0;
  }
  $('div.theemailbody').html('')//('<img src="loading.gif">');
  var storyName = id.substr(3);
  var link = getRedditDomain() + '/comments/' + storyName + '.json';
  link = link + '?jsonp=commentsCallback';
  debugLog("Fetching story from link: " + link);
  $.get(link, commentsCallback, 'jsonp');
  return true;
}
currentStory = null;

function commentsCallback(storyJSON) {
  debugLog("commentsCallback called");
  mainJSON = storyJSON[0].data.children[0].data;
  var theStoryID = mainJSON.name;
  var story = globalStoryDict[theStoryID];

  if (isImgur(mainJSON.url)) {
    var expando = makeImgurExpando(mainJSON.url, mainJSON.title);
    story.bodyHTML += expando;
  } else {
    story.bodyHTML += '<span class="functionauthor">function </span><span class="commentauthor"> ' + mainJSON.title + '</span><span class="commentsymbol">(</span><a href="https://www.reddit.com' + mainJSON.permalink + '" target="_blank">' + mainJSON.subreddit + '</a><span class="commentsymbol">) {</span><br/>';
    if (mainJSON.selftext_html) {
      story.bodyHTML += mainJSON.selftext_html;
    }
  }

  if (mainJSON.isSelf && mainJSON.selftext_html != null) {
    story.bodyHTML += mainJSON.selftext_html;
  }

  story.bodyHTML = unEncode(story.bodyHTML);
  story.bodyHTML += '<div class="storycommentline"></div>';

  // 🔑 Ora passiamo direttamente level=0
  var commentsRoot = storyJSON[1].data.children;
  var commentsHTML = getChildComments(commentsRoot, 0);

  story.bodyHTML += commentsHTML;

  if (currentStory == theStoryID) {
    $('.theemailbody').html(story.bodyHTML);
    onStoryLoad();
  }
}

function makeCommentHeader(score, author, body_html, id, isChild) {
  let commentsHTML = '';
  body_html = replaceEmojis(body_html);
  body_html = stripGifImages(body_html);
  if (!isChild) {
    // Struttura completa per root comment
    commentsHTML += '<div id="' + id + '" class="commentroot">';
    commentsHTML += '<div class="authorandstuff showhover">';
    commentsHTML += '<span class="functionauthor">function <span class="commentauthor">' + author +
                    '</span><span class="commentsymbol">(</span>' +
                    '<span class="score">' + score + '</span>' +
                    '<span class="commentsymbol">) {</span>';
    commentsHTML += '</div>';
    commentsHTML += '<div class="commentbody">' +
                    body_html.replaceAll('<p>', '<p style="margin-bottom: 0px;">')
                    .replaceAll('</p><br>','</p>')
                    .replaceAll('<br/>','') +
                    '</div>';
  } else {
    // Struttura ridotta per risposte annidate → random "code-like" template
    const templates = [
      `<span class="ifauthor">if</span><span class="commentsymbol">(</span>${author}<span class="symbol"> == </span>${score}<span class="commentsymbol">) {</span>`,
      `<span class="ifauthor">while</span><span class="commentsymbol">(</span>${author}<span class="symbol"> &lt; </span><span class="score">${score}</span><span class="commentsymbol">) {</span>`,
      `<span class="ifauthor">for</span><span class="commentsymbol">(</span><span class="var">let</span> ${author}<span class="symbol">=</span><span class="score">0</span><span class="symbol">;</span>i<span class="symbol">&lt;</span><span class="score">${score}</span><span class="symbol">;</span>i<span class="symbol">++</span><span class="commentsymbol">) {</span>`,
    ];

    // Scelgo un template casuale
    const codeLine = templates[Math.floor(Math.random() * templates.length)];

    commentsHTML += '<div id="' + id + '" class="commentchild">';
    commentsHTML += '<div class="authorandstuff">' + codeLine + '</div>';
    commentsHTML += '<div class="commentbody">' +
                    body_html.replaceAll('<p>', '<p style="margin-bottom: 0px;">')
                    .replaceAll('</p><br>','</p>')
                    .replaceAll('<br/>','') +
                    '</div>';
  }

  return commentsHTML;
}

function replaceEmojis(text) {
  return text.replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '<span class="commentsymbol>[</span>emoji<span class="commentsymbol>]</span>');
}
function stripGifImages(html) {
  let temp = document.createElement("div");
  temp.innerHTML = html;

  // trova tutte le img
  temp.querySelectorAll("img").forEach(img => {
    if (img.src && img.src.toLowerCase().includes(".gif")) {
      let link = document.createElement("a");
      link.href = img.src;
      link.target = "_blank";
      link.textContent = "[GIF]";
      img.replaceWith(link);
    }
  });

  return temp.innerHTML;
}

function getChildComments(jsonroot, level) {
  if (!jsonroot) return '';

  let tempHTML = '';

  for (let i = 0; i < jsonroot.length; i++) {
    if (jsonroot[i].kind === 'more') continue;

    let commentjson = jsonroot[i].data;
    let author = commentjson.author;
    let body_html = unEncode(commentjson.body_html);
    let score = commentjson.ups - commentjson.downs;
    let id = commentjson.name;

    // root → isChild = false, figli → true
    tempHTML += makeCommentHeader(score, author, body_html, id, level > 0);

    tempHTML += '<div class="childrencomments child' + level + '">';
    try {
      tempHTML += getChildComments(commentjson.replies.data.children, level + 1);
    } catch (err) {}
    tempHTML += '</div></div>';
    tempHTML += '<div class="closeauthorandstuff"><span class="commentsymbol"">}</span></div>';
  }

  return tempHTML;
}

function unEncode(text) {
  text = text.replace(/&lt;/ig, '<');
  text = text.replace(/&gt;/ig, '>');
  text = text.replace(/\n/g, '<br/>');
  text = text.replace(/&#3232;/g, '?');
  text = text.replace(/&amp;/ig, '&');
  debug = false;
  if (text.indexOf('uploads') != -1) {
    debug = true;
  }
  numcaptures = 4;
  results = /<a href="(http:.*?\.(jpg|jpeg|png|gif|JPEG|GIF|PNG))".*?>(.*?)<\/a>/gi.exec(text);
  while (results != null) {
    var complete = results[0];
    var url = results[1];
    var title = results[3];
    var tempHTML = makeImgurExpando(url, title);
    text = text.replace(complete, tempHTML);
    var tosearch = text.substr(text.indexOf(tempHTML) + tempHTML.length);
    results = /<a href="(http:.*?\.(jpg|jpeg|png|gif|JPEG|GIF|PNG))".*?>(.*?)<\/a>/gi.exec(text.substr(text.indexOf(tempHTML) + tempHTML.length));
  }
  results = /<a.*?href="(http:\/\/imgur.com\/(\w+))".*?>(.*?)<\/a>/g.exec(text);
  while (results != null) {
    for (var i = 0; i < results.length; i += 4) {
      var complete = results[i];
      var url = results[i + 1];
      var code = results[i + 2];
      var title = results[i + 3];
      if (url.toLowerCase().indexOf(".gifv") > -1) {
        url = 'http://i.imgur.com/' + code;
      } else {
        url = 'http://i.imgur.com/' + code + '.jpg';
      }
      var tempHTML = makeImgurExpando(url, title);
      text = text.replace(complete, tempHTML);
    }
    results = /<a.*?href="(http:\/\/imgur.com\/(\w+))".*?>(.*?)<\/a>/g.exec(text);
  }
  results = /<a.*?href="(http:.*?youtube.com.*?v=([-\w]+)).*?".*?>(.*?)<\/a>/gi.exec(text);
  if (results == null) {
    results = /<a.*?href="(http:.*?youtu\.be\/([-\w]+)).*?".*?>(.*?)<\/a>/gi.exec(text);
  }
  while (results != null) {
    var complete = results[0];
    var url = results[1];
    var code = results[2];
    var title = results[3];
    var tempHTML = makeYoutubeExpando(url, title);
    text = text.replace(complete, tempHTML);
    results = /<a.*?href="(http:\.*?youtube.com\.*?v=(\w+))".*?>(.*?)<\/a>/gi.exec(text);
    if (results == null) {
      results = /<a.*?href="(http:.*?youtu\.be\/([-\w]+)).*?".*?>(.*?)<\/a>/gi.exec(text);
    }
  }
  results = /<a href="(http:.*?)".*?>(.*?)<\/a>/gi.exec(text);
  if (results != null) {
    if (results[0].indexOf('youtube.com') == -1 && results[0].indexOf('reddit.com') == -1) {
      var complete = results[0];
      var url = results[1];
      var title = results[2];
      var tempHTML = getLynxdump(url, title);
      text = text.replace(complete, tempHTML);
    }
  }
  return text;
}

function expandoClick() {
  var tempid = $(this).attr('id');
  var finder = '#img' + tempid;
  $(finder).toggle();
  $(finder).children('img.normal')
  .css({
    width: "400px",
    height: "auto"
  })
  .resizable({
    aspectRatio: true,
    resize: resizeFunc
  });
  var resizeFunc = function() {
    var idFinder = finder;
    var height = $(idFinder).children('.ui-wrapper').height();
    var width = $(idFinder).children('.ui-wrapper').width() - 10;
    $(idFinder).children('.ui-wrapper').children('.ui-resizable-e').width(width);
    $(idFinder).children('.ui-wrapper').children('.ui-resizable-e').height(height);
    $(idFinder).children('.ui-wrapper').children('.ui-resizable-e').css('top', '-' + String(height) + 'px');
  }
  $(finder).children('img.normal').resizable({
    'aspectRatio': true,
    resize: resizeFunc
  });
  resizeFunc();
}
function makeImgurExpando(externallink, title) {
  if (externallink.indexOf('i.imgur.com') == -1 && externallink.indexOf('imgur.com') != -1) {
    externallink.replace('imgur.com', 'i.imgur.com');
  }
  if (externallink.substr(-4, 1) != '.' && externallink.indexOf('.jpeg') == -1 && externallink.indexOf('.gifv') == -1) {
    externallink += '.jpg';
    externallink = externallink.replace('?full', '');
  }
  var randId = String(Math.floor(Math.random() * 10000));
  var expando = '<div class="showhover expando" id="' + randId + '" >const</div>';
  if (externallink.indexOf('.gifv') >= 0) {
    externallink = externallink.replace(".gifv", ".mp4");
    expando += '<a href="javascript:void(0)" class="expando" id="' + randId + '">' + title + '</a>';
    expando += '<div id="' + 'img' + randId + '" style="width:100%;display:none">';
    expando += '<video class="normal" id="' + 'ig' + randId + '" class="expandoimg" style="width:100%;" autoplay loop><source src="' + externallink + '" type="video/mp4"></video>';
  } else {
    expando += '<a href="javascript:void(0)" class="expando" id="' + randId + '">' + title + '</a>';
    expando += '<div id="' + 'img' + randId + '" style="width:100%;display:none">';
    expando += '<img class="normal" id="' + 'ig' + randId + '" class="expandoimg" src="' + externallink + '" style="width:100%;" alt="redditlol"/>';
  }
  expando += '</div>';
  return expando;
}

function makeYoutubeExpando(externallink, title) {
  var normallink = /youtube\.com\/watch\?.*?v=([-\w]+)/ig.exec(externallink);
  if (normallink == null) {
    normallink = /youtu\.be\/([-\w]+)/ig.exec(externallink);
  }
  var videoid = normallink[1];
  var expando = '<div class="expando showhover" id="' + videoid + '" >V</div>';
  expando += '<a href="javascript:void(0)" class="expando" id="' + videoid + '">' + title + '</a>';
  expando += '<div style="display:none" id="img' + videoid + '">';
  expando += '<iframe ' + videoid + '" width="560" height="349"';
  expando += ' src="http://www.youtube.com/embed/' + videoid + '" frameborder="0" allowfullscreen></iframe>';
  expando += '</div>';
  return expando;
}

function getLynxdump(externallink, title) {
  var randId = String(Math.floor(Math.random() * 100000));
  //var expando = '<div class="lynxexpando showhover" id="' + randId + '">Lynx</div>';
  //expando += '<a id="lynxlink' + randId + '" href="' + externallink + '">' + title + '</a>';
  //expando += '<div id="lynxexpando' + randId + '" class="lynxexpandodiv" style="display:none"></div>';
  var expando = '<a id="lynxlink' + randId + '" href="' + externallink + '">' + title + '</a>';
  return expando;
}

function isYoutube(externallink) {
  if (externallink.indexOf('youtube.com') != -1 || externallink.indexOf('youtu.be') != -1) {
    return true;
  } else {
    return false;
  }
}

function isImgur(externallink) {
  var filetype = externallink.substr(-3, 3).toLowerCase();
  if (externallink.indexOf('imgur.com') != -1) {
    return true;
  } else if (filetype == 'png' || filetype == 'peg' || filetype == 'jpg' || filetype == 'gif') {
    return true;
  } else {
    return false;
  }
}

function isActuallyImgur(externallink) {
  if (externallink.indexOf('imgur.com') != -1) {
    return true;
  } else {
    return false;
  }
}

function onResize() {
  $('.right').width($(window).width() - 640 + noTaskbar * 60);
}

function onReload() {
  $('.anemail').click(emailClick);
}

function onStoryLoad() {
  $('.expando').click(expandoClick);
}

function votingCallback(data) {
  var id = data.id;
  var finder = '';
  if (data.dir == 1) {
    finder = 'u' + id;
  } else {
    finder = 'd' + id;
  }
  makeSoftpopup('Voting on ' + id.substr(1) + ' was successful');
  $('#' + finder).addClass('arrowshadow');
  var holder = $('#' + finder).parent().children('.authorandstuff').children('.score');
  var theScore = Number(holder.html());
  theScore += Number(data.dir);
  holder.html(String(theScore));
}

function spawnReplyWindow(id) {
  var asd = new myWindow('', '', 'reply ' + id, '', 'Type your reply below:', '\n\n', false);
}
firsttime = true;

function folderClick(folder_name) {
  debugLog("folderClick called for " + folder_name);
  var thefolder = globalFolderDict[folder_name];
  var subredditname = thefolder.subredditname;
  currentStory = null;
  current_folder = globalFolderDict[folder_name];
  var length = Object.keys(thefolder.emailDict).length;

  if (length > 0) {
    // già popolato
    displayFolder(folder_name);
  } else {
    // loading + chiamata AJAX
    $(".theemailbody").html('')//('<img src="loading.gif">');

    var subredditname = folder_name.substr(7);
    var link = getRedditDomain() + '/r/' + subredditname + '/.json?limit=5';
    if (subredditname == 'FrontPage') {
      link = getRedditDomain() + '/r/all/.json?limit=5';
    }
    link = link + '&jsonp=folderCallback';
    tempFolderName = folder_name;
    $.get(link, folderCallback, 'jsonp');

  }
}

globalScrollDict = {};

function moarButton() {
  $('.afolder').unbind('click');
  let baseUrl;
  if (current_folder.subredditname == 'Front Page') {
    baseUrl = getRedditDomain() + '/.json';
  } else {
    baseUrl = getRedditDomain() + '/r/' + current_folder.subredditname + '/.json';
  }

  const link = baseUrl +
    '?limit=5' +
    '&count=' + current_folder.count +
    '&after=' + current_folder.after +
    '&jsonp=folderCallback';

  $.get(link, folderCallback, 'jsonp');
}

tempFolderName = null;

function folderCallback(data) {
  var thefolder = globalFolderDict[tempFolderName];

  var after = data.data.after;
  thefolder.after = after;
  thefolder.count += 5;

  for (var i = 0; i < data.data.children.length; i++) {
    var story = new myStory(data.data.children[i], thefolder, false);
  }

  displayFolder(tempFolderName);
}

function displayFolder(folderId) {
  var thefolder = globalFolderDict[folderId];
  var $container = $("#" + folderId + "_threads"); // sotto la cartella

  $container.html("");

  for (var key in thefolder.emailDict) {
    thefolder.emailDict[key].addToArea($container);
  }

  $container.append('<button id="moarButton" onclick="moarButton()">+ Add More</button>');
  onReload();
}

function handleEmailSend(id, tofield, ccfield, subjectfield, body) {
  if (tofield.substr(0, 9) == 'subreddit') {
    $(globalWindowDict[id].idfinder).css('display', 'none');
    $(globalWindowDict[id].minfinder).css('display', 'none');
    results = tofield.split(' ');
    for (var i = 1; i < results.length; i++) {
      makeFolder(results[i]);
      $('.afolder').click(folderIconClick);
    }
    return 0;
  }
  if (tofield.indexOf('http://') != -1 && tofield.indexOf('reddit.com') != -1) {
    $(globalWindowDict[id].idfinder).css('display', 'none');
    $(globalWindowDict[id].minfinder).css('display', 'none');
    if (tofield.substr(-1) != '/') {
      tofield += '/';
    }
    var link = tofield += '/.json';
    link = link.replace(/\s/g, '');
    link = link + '?jsonp=randomLinkCallback';
    $.get(link, randomLinkCallback, 'jsonp');
    $('.theemailbody').html('<img src="loading.gif">');
    $('.anemailhi').removeClass('anemailhi');
    return 0;
  }
  var tempHolder = $(globalWindowDict[id].idfinder).children('.emailcomposewindow').children('.emailcomposebody');
  var tempVal = tempHolder.val();
  tempHolder.val('Error!!! Read below:\n' + tempVal);
}

function subredditCallback(data) {
  var subList = data.data.children;
  var tempAlreadyThere = {};
  for (key in globalFolderDict) {
    tempAlreadyThere[globalFolderDict[key].subredditname] = 'yo';
  }
  for (var i = subList.length - 1; i >= 0; i--) {
    var subName = subList[i].data.display_name;
    if (tempAlreadyThere[subName] == null) {
      makeFolder2(subName, true);
    }
  }
  makeSoftpopup('Got all your subreddits');
}

function makePopup(string) {
  $('body').append('<div style="display:none"class="popup notclosed">' + string + '</div>');
  $('.notclosed').slideToggle(400);
  setTimeout('closePopup()', 3000);
  $('.popup').click(function() {
    $(this).slideUp(400);
  });
}

function closePopup() {
  $('.popup').slideUp(400);
}

function makeSoftpopup(string) {
  $('body').append('<div style="display:none" class="softpopup spnotdone">' + string + '</div>');
  $('.spnotdone').fadeIn();
  setTimeout('closeSoftpopup()', 3000);
}

function closeSoftpopup() {
  $('.spnotdone').fadeOut(function() {
    $('.spnotdone').remove();
  });
}

function randomLinkCallback(data) {
  var story = new myStory(data[0].data.children[0], current_folder, true);
  commentsCallback(data);
  $('.theemailbody').html(current_folder.emailDict[story.id].bodyHTML);
  $('.anemail').unbind('click');
  onReload();
  onStoryLoad();
}
var username = '';
var sessionID = '';

function emailClick() {
  if (currentStory != null) {
    globalScrollDict[currentStory] = $('.theemailbody').scrollTop();
  }
  var id = $(this).attr('id');
  if (!populateStory(id)) {
    $('.theemailbody').html(current_folder.emailDict[id].bodyHTML);
    if (globalScrollDict[currentStory] != null) {
      $('.theemailbody').scrollTop(globalScrollDict[currentStory]);
    } else {
      $('.theemailbody').scrollTop(0);
    }
  }
  $('.anemailhi').removeClass('anemailhi');
  $(this).addClass('anemailhi');
  $(this).removeClass('emailunread');
  onStoryLoad();
}

function makeFolder(name) {
  makeFolder2(name, false);
}

function makeFolder2(name, custom) {
  var strippedID = 'folder_' + name.replace(/\s/g, '');
  globalFolderDict[strippedID] = new myFolder();
  globalFolderDict[strippedID].strippedID = strippedID;
  globalFolderDict[strippedID].subredditname = name;
  var tempHTML = `
    <div class="afolderwrapper">
      <div class="afolder closed" id="${strippedID}">${name}</div>
      <div class="threads-container" id="${strippedID}_threads"></div>
    </div>`;
  if (custom) {
    tempHTML = tempHTML.replace('afolderwrapper', 'afolderwrapper customfolder');
  }
  $('.foldwraphi').removeClass('foldwraphi');
  $('.folderholder').append(tempHTML);
  $('#' + strippedID).click(folderIconClick);
  return globalFolderDict[strippedID];
}

function folderIconClick() {
  var $folder = $(this);
  var folderId = $folder.attr("id");
  debugLog("folderIconClick called for " + folderId);
  var $threads = $("#" + folderId + "_threads");

  if ($folder.hasClass("closed")) {
    // Se ha la classe open → è chiusa → la apriamo
    $folder.removeClass("closed"); // tolgo open = apro
    $threads.show();

    var thefolder = globalFolderDict[folderId];
    var length = Object.keys(thefolder.emailDict).length;

    if (length === 0) {
      folderClick(folderId); // carico i post solo la prima volta
    }
  } else {
    // Se NON ha open → è aperta → la chiudiamo
    $folder.addClass("closed");  // aggiungo open = chiudo
    $threads.hide();
  }
}
globalWindowDict = {};
globalFolderDict = {};
function debugLog(msg) {
  var debugDiv = document.getElementById('debugDiv');
  if (!debugDiv) {
    debugDiv = document.createElement('div');
    debugDiv.id = 'debugDiv';
    debugDiv.style.position = 'fixed';
    debugDiv.style.bottom = '0';
    debugDiv.style.left = '0';
    debugDiv.style.backgroundColor = 'white';
    debugDiv.style.zIndex = 9999;
    debugDiv.style.maxHeight = '200px';
    debugDiv.style.overflowY = 'auto';
    document.body.appendChild(debugDiv);
  }
  debugDiv.innerHTML += msg + '<br>';
}
function addSubReddit() {
    var subreddit = prompt("Please enter a subreddit name");
    if (subreddit != null) {
        makeFolder(subreddit);
    }
}
let current_folder = null;
$(document).ready(function() {
    debugLog("DOM pronto - inizio setup");

    onResize();
    $(window).resize(onResize);
    $('.newemailbutton').click(addSubReddit);
    debugLog("Eventi principali registrati");

    main_inbox = makeFolder('Front Page');
    debugLog("Cartella 'Front Page' creata");

    makeFolder('gaming');
    makeFolder('pics');
    makeFolder('askreddit');
    makeFolder('jokes');
    makeFolder('funny');
    makeFolder('iama');
    makeFolder('wtf');
    debugLog("Altre cartelle create");

    $('#folder_FrontPage').parent().addClass('foldwraphi');
    current_folder = globalFolderDict["folder_FrontPage"];
    debugLog("Cartella corrente:", current_folder);

    $('.outlookmin').click(function() {
        debugLog("Minimizza tutto cliccato");
        for (key in globalWindowDict) {
            globalWindowDict[key].minimize();
        }
        $(this).addClass('outlookminhi');
    });

    debugLog("Setup completato");
});
