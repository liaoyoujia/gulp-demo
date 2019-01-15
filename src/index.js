window.onload = function () {
       
    var timer = null;

    var timed=null;
    var aa=2313
    var imgList=[1,2,3,4,5,6,7,8,9,10,11,1,2,3,4,5,12,13];
    var keyList = ['1有','2有','3有','4有','5有','6有','7有','8有','没','没','没','1有','2有','3有','4有','5有','没','炸弹'];

    var a = document.getElementsByClassName('page-one')[0]
    var b = document.getElementsByClassName('page-two')[0]
    var c = document.getElementsByClassName('bar')[0]
    var d = document.getElementsByClassName('page-three')[0]
    var e = document.getElementsByClassName('page-four')[0]
    var f = document.getElementsByClassName('page-five')[0]
    var g = document.getElementsByClassName('area')[0]


    a.addEventListener('click', function () {
        a.classList.add("hidden");
        b.classList.add("show")



       var timerd=null;
        var currentDistance = 0;
        var step = 1;
        var target = 200;
        timerd = setInterval(function () {
            currentDistance += step;
            if ((target - currentDistance) < step) {
                currentDistance = target;
                clearInterval(timerd);
                b.classList.remove('show')
                d.classList.add('show')
            }
            c.style.width = currentDistance + 'px'


        })


    })

    d.addEventListener('click', function () {
        d.classList.remove('show')
        e.classList.add('show')
    })
    e.addEventListener('click', function () {
        $('.page-four').css('display','none')
        $('.page-five').css('display','block')
        ready();
        var time = 10.0
        // var timer = null

        timer = setInterval(function () {
             time = (time - 0.1).toFixed(1);
            g.innerHTML = time
            if(g.innerHTML == 0.0){
                aa=null
            }
            g.innerHTML == 0.0 && clearInterval(timer);
           

        }, 100);

    })
    var $redPackage = $('.gameGrea');
    var $redPackageBox = $('.gift');
    var redPackageWidth = $redPackage.width();
    var redPackageBoxWidth = $redPackageBox.width();
    //因为红包有角度旋转的问题，所以需要计算一下，避免旋转之后溢出屏幕
    var basePadding = 60;
    var maxLeftPx = redPackageWidth - redPackageBoxWidth - basePadding * 2;

    //每一个红包都是相对于父元素定位，通过z-index来设置层级
    let zIndex = 1;

    function bindEvent() {
        $redPackage.on('click', '.gift', function () {
            //拿到每个红包的数据
            var data = $(this).data('txt');
            // console.log(data,12323123)
            if(data.indexOf('有')!==-1){
              if(data.indexOf('1')!==-1){
                  $('.list i').eq(0).css('background-position','-1px -38px')
              } 
               if(data.indexOf('2')!==-1){
                  $('.list i').eq(1).css('background-position','-48px -38px')
              }   
              if(data.indexOf('3')!==-1){
                  $('.list i').eq(2).css('background-position','-95px -38px')
              }  
              if(data.indexOf('4')!==-1){
                  $('.list i').eq(3).css('background-position','-128px -38px')
              }  
              if(data.indexOf('5')!==-1){
                  $('.list i').eq(4).css('background-position','-172px -38px')
              }  
              if(data.indexOf('6')!==-1){
                  $('.list i').eq(5).css('background-position','-220px -38px')
              }  
              if(data.indexOf('7')!==-1){
                  $('.list i').eq(6).css('background-position','-258px -38px')
              }  
              if(data.indexOf('8')!==-1){
                  $('.list i').eq(7).css('background-position','-300px -38px')
              }  

            }else{
                clearInterval(timer)
                clearInterval(timed)
                if(data.indexOf("炸弹")){
                    $(this).children().eq(0).attr('src','./images/4_04.png')
                }
                $('.warn i').on('click',function(){
                    $('.warn').css('display','none')
                })
                $('.warn .try').on('click',function(){
                    $('.list i').eq(0).css('background-position','-1px -2px')
                  $('.list i').eq(1).css('background-position','-48px -2px')
                  $('.list i').eq(2).css('background-position','-95px -2px')
                  $('.list i').eq(3).css('background-position','-128px -2px')
                  $('.list i').eq(4).css('background-position','-172px -2px')
                  $('.list i').eq(5).css('background-position','-220px -2px')
                  $('.list i').eq(6).css('background-position','-258px -2px')
                  $('.list i').eq(7).css('background-position','-300px -2px')
                    $('.warn').css('display','none')
                    $('.page-five').css('display','none')
                    $('.page-four').css('display','block')
                })
               $('.warn').css('display','block')
            //    $()
            }
        })
    }

    //生成mix-max的随机数
    function getRandom(min, max) {
        return Math.round(Math.random() * (max - min) + min);
    }

    //红包的移动
    function redPackageBoxSpeed($el, time,leftValue) {
        $el.animate(
            {
                left: leftValue+'px',
                // left:0+'px',
                top: '83%',
            },
            time * 1000,
            function () {
                $el.remove();
            }
        );
    }

    //生成红包
    function createRedPackageNode() {
        let leftAddress=38;
        // let value=2
        let e=2
       for(var i=0; i<4;i++){
          
        //    value+=value
        var $newNode = $redPackageBox.clone(true);
        //红包携带的数据
        // console.log(keyList,213123)
        let txt = keyList.shift();
        keyList.push(txt);
        // console.log(txt,31212)
        var item=imgList.shift()
        imgList.push(item)
        $newNode.children().attr('src','./images/ts_'+item+'.png'); 

        $newNode.attr('data-txt', JSON.stringify(txt));
        
        //红包随机旋转-30～30度
        $newNode.css({
            'z-index': zIndex++,
            // left: getRandom(basePadding, maxLeftPx) + 'px',
            left:leftAddress+'px',
            transform: 'rotate(' + getRandom(-30, 30) + 'deg)',
        });
        $redPackage.append($newNode);

        redPackageBoxSpeed($newNode, e,leftAddress);
        leftAddress+=90
        e-=.2
       }
    }

    //红包的动态创建
    function createRedPackageRain() {
       
        timed = setInterval(() => {
            createRedPackageNode();
            if (!aa) {
                clearInterval(timed)
            }

        }, 300);
    }

    function ready() {
        bindEvent();
        createRedPackageRain();
    }

 




}
