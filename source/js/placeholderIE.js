//ie
function placeHolderIE(){
    var isSupportInput = 'placeholder' in document.createElement('input');
    var isSupportTextarea = 'placeholder' in document.createElement('textarea');
    if(!isSupportInput && !isSupportTextarea){
        $('input[placeholder],textarea[placeholder]').each(function(index, el) {
            var that = this;
            var holderName = $(this).attr('placeholder');
            var _placeTemp = $('<div class="placeTemp">'+ holderName +'<div>');
            var inputPadLeft = $(this).css('paddingLeft');
            var inputPadTop = $(this).css('paddingTop');
            var inputHeight = $(this).css('height');
            var inputLineHeight = $(this).css('lineHeight');

            //去重
            if($(this).next().hasClass('placeTemp')) {
                $(this).next().remove();
            }
            //插入dom中添加样式
            _placeTemp.insertAfter($(this)).css({
                'lineHeight': inputLineHeight,
                'height': inputHeight
            });

            // 定位--基准元素除去padding-left和padding-top的位置成为定位元素的左上角[0,0]
            _placeTemp.pin({
                base: $(that),
                selfXY: [0, 0],
                baseXY: [inputPadLeft, inputPadTop]
            });

            //定位元素交互
            _placeTemp.click(function(event) {
                $(this).hide();
                $(that).focus();
            });

            // 若基准元素值不为空，基准元素隐藏
            if ($(this).val() !== '') {
                _placeTemp.hide();
            }

            // 基准元素交互
            $(this).focus(function(event) {
                $(this).siblings('.placeTemp').hide();
            });
            $(this).keyup(function(event) {
                var that = this;
                //若前后有空格
                if ($.trim($(that).val()) === '') {
                    $(this).siblings('.placeTemp').show();
                }
                else {
                    $(this).siblings('.placeTemp').hide();
                }
                //tab输入
                if (event.keyCode == 9) {   
                    $(this).trigger('focus');
                }else{
                    if ($.trim($(that).val()) === '') {
                        $(this).siblings('.placeTemp').show();
                    }
                    else {
                        $(this).siblings('.placeTemp').hide();
                    }
                }
            });
            $(this).blur(function(event) {
                $(this).trigger('keyup');
            });
        });
    }
}

placeHolderIE();