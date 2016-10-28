/*点击切换函数jq
    采用事件代理
    parent:父元素
    child：父元素中的子元素
    actcls：活动类名
    eve：事件类型
*/
function switchover(parent, child, actcls, eve) {
    'use strict';
    var $parent = $(parent).eq(0);
    var $child = $parent.find(child);
    $parent.on(eve, $child, function(e) {
        var eTar = e.target;
        var $eTar = $(eTar); //转化为jq对象
        $eTar.addClass(actcls).siblings().removeClass(actcls);
        return false; //阻止a标签默认事件
    });
}

/*点击切换隐藏jq
  hcls 需要被隐藏的
  scls 需要被显示的
 */
function hoverShow(hcls, scls, eve) {
    'use strict';
    var $hideclass = $(hcls).eq(0);
    var $showclass = $(scls).eq(0);
    $class.on(eve, function() {
        $hideclass.hide();
        $showclass.show();
    })
}

/*侧边栏导航定位jq
navcls 表示导航按钮类名
wrapcls 表示被导航元素类名
*/
function xyf_sidebar(navcls, wrapcls) {
    var aa = $(navcls);
    var bb = $(wrapcls)
    var cc = [];
    bb.each(function(i) {
        cc.push($(this).offset().top);
    })
    var sdome = $(document).scrollTop();
    for (var i = 0; i < cc.length; i++) {
        if (sdome > cc[i] - 200) {
            turnTo(i);
        }
    }
    aa.each(function(i) {
        aa.eq(i).click(function() {
            $(this).addClass('on').siblings().removeClass('on');
        })
    })

    function turnTo(num) {
        aa.eq(num).addClass('on').siblings().removeClass('on');
    }

    $(window).scroll(function() {
        var ss = $(document).scrollTop();
        for (var i = 0; i < cc.length; i++) {
            if (ss > cc[i] - 200) {
                turnTo(i);
            }
        }
    })
}

//返回顶部js  速度由快到慢？
function goTop(acceleration, time) {
    acceleration = acceleration || 0.1;
    time = time || 16;
    var x1 = 0;
    var y1 = 0;
    var x2 = 0;
    var y2 = 0;
    var x3 = 0;
    var y3 = 0;
    if (document.documentElement) {
        x1 = document.documentElement.scrollLeft || 0;
        y1 = document.documentElement.scrollTop || 0;
    }
    if (document.body) {
        x2 = document.body.scrollLeft || 0;
        y2 = document.body.scrollTop || 0;
    }
    var x3 = window.scrollX || 0;
    var y3 = window.scrollY || 0;
    // 滚动条到页面顶部的水平距离
    var x = Math.max(x1, Math.max(x2, x3));
    // 滚动条到页面顶部的垂直距离
    var y = Math.max(y1, Math.max(y2, y3));
    // 滚动距离 = 目前距离 / 速度, 因为距离原来越小, 速度是大于 1 的数, 所以滚动距离会越来越小
    var speed = 1 + acceleration;
    window.scrollTo(Math.floor(x / speed), Math.floor(y / speed));
    // 如果距离不为零, 继续调用迭代本函数
    if (x > 0 || y > 0) {
        var invokeFunction = "goTop(" + acceleration + ", " + time + ")";
        window.setTimeout(invokeFunction, time);
    }
}

/*图片懒加载jq
lazyimg类名 表示要延迟加载的元素
dataimg类名 表示暂时存放图片路劲名的自定义属性,
delayTime 图片淡入时间
*/
function xyf_lazyload(lazyimg, dataimg, delayTime) {
    var delayTime = delayTime || 200;
    var $lazyimg = $(lazyimg);
    var $height = $(window).height(); //获取屏幕高度
    window.onscroll = function() {
        var prec1 = document.documentElement.scrollTop || document.body.scrollTop;
        $lazyimg.each(function(i) {
            var $this = $(this);
            var $top = $this.offset().top;
            if (prec1 > $top - $height + 100) {
                var $src = $this.attr(dataimg);
                $this.addClass('op').attr('src', $src).animate({
                    'opacity': 1
                }, delayTime); //op{opacity:0} 使得图片产生淡入的效果
            }
        })
    }
}

/*背景图片懒加载升级版 只显示屏幕加上上下300px的图片*/
function xyf_lazyload(lazyimg, dataimg) { //背景图片懒加载升级版
    var $lazyimg = $(lazyimg);
    var $height = autoHeight("classify", "menu", "search"); //获取屏幕高度
    var bodyBox = document.getElementById('classify');
    bodyBox.onscroll = function() {
        var prec1 = bodyBox.scrollTop; //局部元素滚动条滚动距离，不包含padding
        $lazyimg.each(function(i) {
            var $this = $(this);
            var $thisHeight = $this.height();
            var $top = $this.offset().top;
            if (prec1 + $height + 300 > $top && $top + 300 > 0) { //显示范围为 底部超出300px
                if ($this.hasClass('ok') && $this.hasClass('vhide')) { //保证已经位于显示屏内的元素不重复作用
                    $this.removeClass('vhide');
                } else {
                    if ($this.hasClass('ok')) {
                        return
                    } else {
                        var $src = $this.attr(dataimg);
                        $this.css('background-image', 'url(' + $src + ')').addClass('ok');
                    }
                }
            }
            if ($top + 3 * $height < 0) { //如果元素位于上方 顶部超出3当前滚动元素的3个高度时  将其隐藏
                if ($this.hasClass('vhide')) {
                    return
                } else {
                    $this.addClass('vhide')
                }
            }
        })
    }
}


/*阻止页面上下滑动 el为需要滑动的局部区域类名*/
var overscroll = function(el) {
    el.addEventListener('touchstart', function() {
        var top = el.scrollTop,
            totalScroll = el.scrollHeight,
            currentScroll = top + el.offsetHeight;
        if (top === 0) {
            el.scrollTop = 1;
        } else if (currentScroll === totalScroll) {
            el.scrollTop = top - 1;
        }
    });
    el.addEventListener('touchmove', function(evt) {
        if (el.offsetHeight < el.scrollHeight)
            evt._isScroller = true;
    });
}
overscroll(document.querySelector('.sidenav'));
overscroll(document.querySelector('.classify'));
document.body.addEventListener('touchmove', function(evt) {
    if (!evt._isScroller) {
        evt.preventDefault();
    }
});



/*wrap-list高度自适应  a:需要自适应高度的元素 b:屏幕可用高度 c、d:需要减去的元素高度 注意 在rem下 必须在页面加载完后执行*/
function autoHeight(a, c, d) {
    var a = document.getElementsByClassName(a)[0];
    var b = document.documentElement.clientHeight || document.body.clientHeight
    var c = document.getElementsByClassName(c)[0].offsetHeight || 0;
    var d = document.getElementsByClassName(d)[0].offsetHeight || 0;
    var e = b - c - d;
    $(a).css('height', e + 'px');
    return e
}


/*测试函数
目标：检测实现同样的样式效果,下面2种方法，哪种效率更高
         $this.addClass('vhide')；
         $this.css('display','none');
*/


//随机生成一个值.支持取值范围 random([min,max])
function random(range) {
    var max = Math.max(range[0], range[1]);
    var min = Math.min(range[0], range[1]);
    var diff = Math.random();
    var val = Math.floor(diff * (max - min + 1) + min);
    return val;
}


/*取整数 使用parseInt的话会检测的更多*/
function getZ(num) {
    var rounded;
    rounded = (0.5 + num) | 0;
    // A double bitwise not.
    rounded = ~~(0.5 + num);
    // Finally, a left bitwise shift.
    rounded = (0.5 + num) << 0;

    return rounded;
}

/*暴露揭示设计模式*/
var util = (function() {
    /*取整*/
    function getZ(num) {
        var rounded;
        rounded = (0.5 + num) | 0;
        // A double bitwise not.
        rounded = ~~(0.5 + num);
        // Finally, a left bitwise shift.
        rounded = (0.5 + num) << 0;

        return rounded;
    }
    /*随机获取范围整数*/
    function random(range) {
        var max = Math.max(range[0], range[1]);
        var min = Math.min(range[0], range[1]);
        var diff = Math.random();
        var val = Math.floor(diff * (max - min + 1) + min);
        return val;
    }
    return {
        getZ:getZ,
        random:random
    }
})()