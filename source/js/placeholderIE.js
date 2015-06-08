//ie
function placeHolderIE(){
    $('input[placeholder],textarea[placeholder]').each(function(index, el) {
        var that = this;
        var holderName = $(this).attr('placeholder');
        var _placeTemp = $('<div class="placeTemp">'+ holderName +'<div>');
        var inputPadLeft = $(this).css('paddingLeft');
        var inputPadTop = $(this).css('paddingTop');
        var inputHeight = $(this).css('height');
        var inputLineHeight = $(this).css('lineHeight');
        _placeTemp.insertAfter($(this)).css({
            'lineHeight': inputLineHeight,
            'height': inputHeight
        });
        _placeTemp.pin({
            base: $(that),
            selfXY: [0, 0],
            baseXY: [inputPadLeft, inputPadTop]
        })

        _placeTemp.click(function(event) {
            console.info(123)
            $(this).hide();
            $(that).focus();
        });

        if ($(this).val() != '') {
            _placeTemp.hide();
        };

        $(this).focus(function(event) {
            $(this).siblings('.placeTemp').hide();
        });
        $(this).keyup(function(event) {
            var that = this
            //若前后有空格
            if ($.trim($(that).val()) == '') {
                $(this).siblings('.placeTemp').show();
            }
            else {
                $(this).siblings('.placeTemp').hide();
            };
            //tab输入
            if (event.keyCode == 9) {   
                $(this).trigger('focus');
            }else{
                if ($.trim($(that).val()) == '') {
                    $(this).siblings('.placeTemp').show();
                }
                else {
                    $(this).siblings('.placeTemp').hide();
                };
            };
        });
        $(this).blur(function(event) {
            $(this).trigger('keyup');
        });
    });
}