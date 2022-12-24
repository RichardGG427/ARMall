window.onload = function () {
  getBannerList();
  fdApi();
  hotSaleApi();
  guesslikeApi();
  var j = 5;
  // ajax(
  //   'get',
  //   'js/hello.json',
  //   function (res) {
  //     console.log(res);
  //   },
  //   true
  // );

  //search box
  var searchInput = document.getElementById('searchInput');
  searchInput.addEventListener('keyup', debounce(getSuggest, 500), false);
  searchInput.addEventListener('blur', hideKeyword, false);
  searchInput.addEventListener('focus', showKeyword, false);

  function showKeyword() {
    if (searchInput.value !== '') {
      // getSuggest();
      document.getElementById('search-suggest').style.display = 'block';
    }
  }

  function hideKeyword() {
    document.getElementById('search-suggest').style.display = 'none';
  }

  //get suggest list
  function getSuggest() {
    ajax(
      'get',
      'suggest.json',
      function (res) {
        if (res.code == 0) {
          var suggest_list = document.getElementById('search-suggest'); //get drop-down list element
          var data = res.data;
          // console.log(data);
          var str = '';
          for (var i = 0; i < data.length; i++) {
            str += '<li>' + data[i].suggestname + '</li>';
          }
          suggest_list.innerHTML = str;
          // console.log(str);
          showKeyword();
        }
      },
      true
    );
  }

  // debounce function
  function debounce(fn, delay) {
    var handle;
    return function () {
      clearTimeout(handle);
      handle = setTimeout(function () {
        fn();
      }, delay);
    };
  }

  //slider
  function bannerOption() {
    var swiper = document.getElementById('swiper'); //get slider package element
    var swiperItem = swiper.getElementsByClassName('swiper_item'); //get slider list
    var prev = document.getElementsByClassName('prev')[0]; //get previous arrow
    var next = document.getElementsByClassName('next')[0]; //get next arrow
    var indicators = document.getElementsByClassName('indicator'); //get dot list
    var index = 0;
    var timer = null;

    //set slider move and opacity
    for (var i = 0; i < swiperItem.length; i++) {
      if (index == i) {
        swiperItem[i].style.opacity = 1;
      } else {
        swiperItem[i].style.opacity = 0;
      }
      swiperItem[i].style.transform =
        'translateX(' + -i * swiperItem[0].offsetWidth + 'px)'; //offsetwidth=width+border+padding
    }

    //set dot click event
    for (var k = 0; k < indicators.length; k++) {
      indicators[k].onclick = function () {
        clearInterval(timer);
        var clickIndex = parseInt(this.getAttribute('data-index'));
        index = clickIndex;
        changeImg();
      };
    }

    prev.onclick = function () {
      clearInterval(timer);
      index--;
      changeImg();
    };

    next.onclick = function () {
      clearInterval(timer);
      index++;
      changeImg();
    };

    //change img
    function changeImg() {
      if (index < 0) {
        index = swiperItem.length - 1;
      } else if (index > swiperItem.length - 1) {
        index = 0;
      }
      for (var j = 0; j < swiperItem.length; j++) {
        swiperItem[j].style.opacity = 0;
      }
      swiperItem[index].style.opacity = 1;
      setIndicatorOn();
    }

    //set on dot
    function setIndicatorOn() {
      for (var i = 0; i < indicators.length; i++) {
        indicators[i].classList.remove('on');
      }
      indicators[index].classList.add('on');
    }

    //auto change
    autoChange();
    function autoChange() {
      timer = setInterval(function () {
        index++;
        changeImg();
      }, 3000);
    }

    //mouse
    swiper.addEventListener(
      'mouseover',
      function () {
        clearInterval(timer);
      },
      false
    );

    swiper.addEventListener(
      'mouseout',
      function () {
        autoChange();
      },
      false
    );
  }

  //get slider list
  function getBannerList() {
    ajax(
      'get',
      'swiper.json',
      function (res) {
        if (res.code == 0) {
          // console.log(res);
          //slider list loop,add to container
          var data = res.data;
          var swiper = document.getElementById('swiper');
          var str = '';
          for (var i = 0; i < data.length; i++) {
            str +=
              '<li class="swiper_item"><a href="#"><img src="' +
              data[i].banner_img +
              '" alt=""></a></li>';
          }
          swiper.innerHTML = str;
          //dot list loop, add to container
          var indicators = document.getElementById('indicators');
          var str2 = '';
          for (var j = 0; j < data.length; j++) {
            if (i == 0) {
              str2 += '<div class="on indicator" data-index="' + i + '"></div>';
            } else {
              str2 += '<div class="indicator" data-index="' + i + '"></div>';
            }
          }
          indicators.innerHTML = str2;
          bannerOption();
        }
      },
      true
    );
  }

  //get flash deal data
  function fdApi() {
    ajax(
      'get',
      'flashdeal.json',
      function (res) {
        // console.log(res);
        if (res.code == 0) {
          var cd_time = res.data.fd_time;
          var goods_list = res.data.goods_list;
          countDown(cd_time);
          var flashDeal_list = document.getElementById('flashDeal_list');
          var str = '';
          for (var i = 0; i < goods_list.length; i++) {
            str +=
              '<div class="fd_item">' +
              '<a href="#" class="fd_item_lk">' +
              '<img src="' +
              goods_list[i].goods_img +
              '" alt="" class="fd_item_img" />' +
              '<p class="fd_item_name">' +
              goods_list[i].name +
              '</p>' +
              '<div class="fd_item_buy">' +
              '<span class="progress"><span class="progress_bar" style="width:' +
              goods_list[i].progress +
              '%"></span></span>' +
              '<span class="buy_num">Sold ' +
              goods_list[i].progress +
              '%</span>' +
              '</div>' +
              '<div class="fd_item_price clearfix">' +
              '<span class="cm_price new_price">$' +
              goods_list[i].new_price +
              '</span>' +
              '<span class="cm_price origin_price">$' +
              goods_list[i].old_price +
              '</span>' +
              '</div>' +
              '</a>' +
              '</div>';
          }
          flashDeal_list.innerHTML = str;
        }
      },
      true
    );
  }

  //flash deals count down
  function countDown(t) {
    var fd_time = t;
    var fd_timer = setInterval(function () {
      if (fd_time < 0) {
        clearInterval(fd_timer);
      } else {
        calTime(fd_time);
        fd_time--;
      }
    }, 1000);
  }

  function calTime(time) {
    var hours = Math.floor(time / 60 / 60);
    var minutes = Math.floor((time / 60) % 60);
    var seconds = Math.floor(time % 60);
    hours = formatTime(hours);
    minutes = formatTime(minutes);
    seconds = formatTime(seconds);

    document.getElementsByClassName('cd_hour')[0].innerHTML = hours;
    document.getElementsByClassName('cd_minute')[0].innerHTML = minutes;
    document.getElementsByClassName('cd_second')[0].innerHTML = seconds;
  }

  function formatTime(t) {
    if (t < 10) {
      t = '0' + t;
    }
    return t;
  }

  //get hot sale list
  function hotSaleApi() {
    ajax(
      'get',
      'hotsale.json',
      function (res) {
        // console.log(res);
        if (res.code == 0) {
          var list = res.data;
          var hotSaleList = document.getElementById('hotSaleList');
          var str = '';
          for (var i = 0; i < list.length; i++) {
            str +=
              '<li class="bs_item item">' +
              '<a href="">' +
              '<img src="' +
              list[i].goods_img +
              '" alt="" class="item_img" />' +
              '<p class="title">' +
              list[i].name +
              '</p>' +
              '<div class="line_2 clearfix">' +
              '<span class="comment">Comment<em>' +
              list[i].commentNum +
              '</em></span>' +
              '<span class="favorite">Favorite<em>' +
              list[i].collectNum +
              '</em></span>' +
              '</div>' +
              '<div class="line_3">' +
              '<span class="strong">' +
              list[i].new_price +
              '</span>' +
              '<span class="price_through">$' +
              list[i].old_price +
              '</span>' +
              '<span class="sell">Monthly Sales: ' +
              list[i].saleNum +
              '</span>' +
              '</div>' +
              '</a>' +
              '</li>';
          }
          hotSaleList.innerHTML = str;
        }
      },
      true
    );
  }

  //get just for you list
  function guesslikeApi() {
    ajax(
      'get',
      'guesslike.json',
      function (res) {
        // console.log(res);
        if (res.code == 0) {
          var list = res.data;
          var guessLikeList = document.getElementById('gl');
          var str = '';
          for (var i = 0; i < 5; i++) {
            str += `<li class="like_item item">
        <a href="">
          <img src="${list[i].goods_img}" alt="" class="item_img" />
        </a>
        <p class="title">${list[i].name}</p>
        <div class="line_3">
          <span class="strong">${list[i].new_price}</span>
          <span class="sell">Monthly Sales ${list[i].saleNum}</span>
        </div>
        <a href="#" class="item_more">Discover More</a>
      </li>`;
          }
          guessLikeList.innerHTML = str;
        }
      },
      true
    );
  }

  //   document.getElementById('loadMore').onclick = function () {
  //     var liNode = document.createElement('li');
  //     liNode.setAttribute('class', 'like_item item');
  //     var liContent = `<a href="">
  //   <img src="img/xbox.jpg" alt="" class="item_img" />
  // </a>
  // <p class="title">Xbox</p>
  // <div class="line_3">
  //   <span class="strong">899</span>
  //   <span class="sell">Monthly Sales 888</span>
  // </div>
  // <a href="#" class="item_more">Discover More</a>`;
  //     liNode.innerHTML = liContent;
  //     document.getElementById('gl').appendChild(liNode);
  //   };

  document.getElementById('loadMore').onclick = function () {
    ajax(
      'get',
      'guesslike.json',
      function (res) {
        // console.log(res);
        if (res.code == 0) {
          var list = res.data;
          var liNode = document.createElement('li');
          var obj = document.getElementById('NoMoreItems');
          var obj2 = document.getElementById('loadMore');
          liNode.setAttribute('class', 'like_item item');
          var liContent = '';

          if (j < list.length) {
            for (var i = j; i < j + 1; i++) {
              liContent += `<a href="">
            <img src="${list[i].goods_img}" alt="" class="item_img" />
          </a>
          <p class="title">${list[i].name}</p>
          <div class="line_3">
            <span class="strong">${list[i].new_price}</span>
            <span class="sell">Monthly Sales ${list[i].saleNum}</span>
          </div>
          <a href="#" class="item_more">Discover More</a>
        </li>`;
              liNode.innerHTML = liContent;
              document.getElementById('gl').appendChild(liNode);
            }
            j = i;
          } else {
            obj.style.display = 'block';
            obj2.style.display = 'none';
          }
        }
      },
      true
    );
  };
};

window.onscroll = function () {
  scrollShowBtn();
  var winPos = document.documentElement.scrollTop || document.body.scrollTop; //get scroll distance
  var hotSale = document.getElementById('hotSale');
  var hotHeight = hotSale.offsetTop + hotSale.offsetHeight; //guess you like height

  if (winPos < hotSale.offsetTop) {
    addOn(0);
  } else if (winPos >= hotSale.offsetTop && winPos < hotHeight) {
    addOn(1);
  } else {
    addOn(2);
  }
};

//add active status
function addOn(index) {
  var tool = document.getElementsByClassName('tool')[0];
  var toolItem = tool.getElementsByTagName('a');
  for (var i = 0; i < toolItem.length; i++) {
    toolItem[i].classList.remove('on');
  }
  toolItem[index].classList.add('on');
}

//display scroll bar
function scrollShowBtn() {
  var top = document.documentElement.scrollTop || document.body.scrollTop;
  if (top > 300) {
    document.getElementById('goTop').style.display = 'block';
  } else {
    document.getElementById('goTop').style.display = 'none';
  }
}

//go top
function goTop() {
  var topTimer = setInterval(function () {
    var scrollTop =
      document.documentElement.scrollTop || document.body.scrollTop;
    var iSpeed = Math.floor(-scrollTop / 4);

    if (scrollTop == 0) {
      clearInterval(topTimer);
    }
    document.documentElement.scrollTop = document.body.scrollTop =
      scrollTop + iSpeed;
  }, 30);
}
