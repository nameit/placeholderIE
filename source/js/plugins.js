if (!String.prototype.trim) {
  String.prototype.trim = function () {
    // Make sure we trim BOM and NBSP
    rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
    return this.replace(rtrim, "");
  }
}

	var B = (function(ua) {
	var b = {
		msie: /\b(?:msie |ie |trident)/.test(ua) && !/opera/.test(ua),
		opera: /opera/.test(ua),
		safari: /webkit/.test(ua) && !/chrome/.test(ua),
		firefox: /firefox/.test(ua),
		chrome: /chrome/.test(ua)
	};
	var vMark = "";
	for (var i in b) {
		if (b[i]) {
			vMark = "safari" == i ? "version" : i;
			break;
		}
	}
	b.version = vMark && RegExp("(?:" + vMark + ")[\\/: ]([\\d.]+)").test(ua) ? RegExp.$1 : "0";

	b.ie = b.msie;
	b.ie6 = b.msie && parseInt(b.version, 10) == 6;
	b.ie7 = b.msie && parseInt(b.version, 10) == 7;
	b.ie8 = b.msie && parseInt(b.version, 10) == 8;
	b.ie9 = b.msie && parseInt(b.version, 10) == 9;
	b.ie10 = b.msie && parseInt(b.version, 10) == 10;

	b.win2000 = ua.indexOf('windows nt 5.0') > 1 ? true : false;
	b.winxp = ua.indexOf('windows nt 5.1') > 1 ? true : false;
	b.win2003 = ua.indexOf('windows nt 5.2') > 1 ? true : false;
	b.winvista = ua.indexOf('windows nt 6.0') > 1 ? true : false;
	b.win7 = ua.indexOf('windows nt 6.1') > 1 ? true : false;
	b.win8 = ua.indexOf('windows nt 6.2') > 1 ? true : false;
	
	return b;
})(window.navigator.userAgent.toLowerCase());
var isIE6 = B.ie6

// 定义 Overlay 类
var Overlay = function (element, options) { 
    options = $.extend({}, $.fn.overlay.defaults, options);

    this.options = options;
    this.overlay = $(element);

    this.init(options);
};

Overlay.prototype = {

    constructor: Overlay,

    init: function (options) {
        this.overlay.addClass(this.options.className);

        // 添加外部自定义的样式
        this.overlay.attr('style', this.options.style);

        // 基本 CSS
        this.overlay.css({
            width: this.options.width,
            height: this.options.height,
            zIndex: this.options.zIndex
        });

        // 将浮出层插入 DOM 并进行定位
        this.overlay.appendTo($(this.options.parent));
        this.setPosition();

        // 窗口变化重新定位
        $(window).on('resize', $.proxy(this.setPosition, this));
    },

    show: function () {     
        this.overlay.show();
    },

    hide: function () {
        this.overlay.hide();
    },

    remove: function () {
        this.overlay.remove();
    },

    blurHide: function () {
        $(document).on('click', $.proxy(this.hide, this));
        this.overlay.on('click', function (e) {
            e.stopPropagation();
        });
    },

    setPosition: function () {
        this.overlay.pin({
            // 基准定位元素，默认为当前可视区域
            base: this.options.align.base,
            // element 的定位点，默认为中心
            selfXY: this.options.align.selfXY,
            // 基准定位元素的定位点，默认为中心
            baseXY: this.options.align.baseXY
        });
    }
};

// 注册插件
$.fn.overlay = function (options) {
    return this.each(function () {
        new Overlay(this, options);
    });
};

// 默认设置
$.fn.overlay.defaults = {
    className: '',
    style: '',
    width: 'auto',
    height: 'auto',
    zIndex: 999,
    parent: 'body',
    align: {
        base: null,
        selfXY: ['50%', '50%'],
        baseXY: ['50%', '50%']
    }
};

$.fn.overlay.Constructor = Overlay;
/**
 * 名称: pin.js
 * 描述: 通过两个对象分别描述定位元素及其定位点，然后将其定位点重合
 * 属性: 工具
 * 版本: 0.9.0
 * 依赖: jQuery ~> 1.7.2
 * 开发: wuwj
 */

$.fn.pin = function (options, fixed) {
    options = $.extend({
        base: null,
        selfXY: [0, 0],
        baseXY: [0, 0]
    }, options || {});

    // 是否相对于当前可视区域（Window）进行定位
    var isViewport = !options.base,

            // 定位 fixed 元素的标志位，表示需要特殊处理
            isPinFixed = false,

            parent = this.offsetParent(),

            // 基准元素的偏移量
            offsetLeft, offsetTop,

            // 基准元素根据定位点坐标 `baseXY` 分别获得纵横两个方向上的 size
            baseX, baseY,

            // 同上，根据定位点坐标 `selfXY` 获取的横纵两个方向上的 size
            selfX, selfY,

            // 定位元素位置
            left, top;

    // 设定目标元素的 position 为绝对定位
    // 若元素的初始 position 不为 absolute，会影响元素的 display、宽高等属性
    if (this.css('position') !== 'fixed' || isIE6) {
        this.css('position', 'absolute');
        isPinFixed = false;
    } else {
        isPinFixed = true;
    }

    // 修正 ie6 下 absolute 定位不准的 bug
    if (isIE6) {
        this.css('zoom', 1);
        parent.css('zoom', 1);
    }

    // 如果不定义基准元素，则相对于当前可视区域进行定位
    if (isViewport) {
        offsetLeft = $(document).scrollLeft();
        offsetTop = $(document).scrollTop();

        baseX = getSize($(window), options.baseXY[0], 'outerWidth');
        baseY = getSize($(window), options.baseXY[1], 'outerHeight');
    } else {
        // 判断定位元素的祖先是否被定位过，是的话用 `$.position()`，否则用 `$.offset()`
        var offsetFixed = (parent[0] === document.documentElement) ?
                                            options.base.offset() :
                                            options.base.position();

        offsetLeft = offsetFixed.left;
        offsetTop = offsetFixed.top;

        baseX = getSize(options.base, options.baseXY[0], 'outerWidth');
        baseY = getSize(options.base, options.baseXY[1], 'outerHeight');
    }

    selfX = getSize(this, options.selfXY[0], 'outerWidth');
    selfY = getSize(this, options.selfXY[1], 'outerHeight');

    // 计算定位元素位置
    // 若定位 fixed 元素，则父元素的 offset 没有意义
    left = (isPinFixed? 0 : offsetLeft) + baseX - selfX;
    top = (isPinFixed? 0 : offsetTop) + baseY - selfY;

    // 进行定位
    this.css({ left: left, top: top });
};

// 扩展：相对于当前可视区域页面上某一元素的居中定位
$.fn.pinCenter = function (options) {
    this.pin({
        base: (options) ? options.base : null,
        selfXY: ['50%', '50%'],
        baseXY: ['50%', '50%']
    });
};

/**
 * 根据坐标点获取对应尺寸值
 * @param  {jquery} object 被获取尺寸的元素
 * @param  {array}  coord  坐标点
 * @param  {string} type   尺寸类型
 * @return {number}
 */
function getSize(object, coord, type) {
    // 参考 `https://github.com/aralejs/position/blob/master/src/position.js`
    // 中的 `xyConverter` 方法
    // 先将坐标值转成字符串
    var x = coord + '';

    // 处理 alias，此处正则表达式内的 `:?` 表示此括号为非捕获型括号
    if (/\D/.test(x)) {
        x = x.replace(/(?:top|left)/gi, '0%')
                    .replace(/center/gi, '50%')
                    .replace(/(?:bottom|right)/gi, '100%');
    }

    // 处理 `px`
    if (x.indexOf('px') !== -1) {
        x = x.replace(/px/gi, '');
    }

    // 将百分比转为像素值
    if (x.indexOf('%') !== -1) {
        // 支持小数
        x = x.replace(/(\d+(?:\.\d+)?)%/gi, function (m, d) {
            return object[type]() * (d / 100.0);
        });
    }

    // 处理类似 100%+20px 的情况
    if (/[+\-*\/]/.test(x)) {
        try {
            x = (new Function('return ' + x))();
        } catch (e) {
            throw new Error('Invalid position value: ' + x);
        }
    }

    // 转回为数字
    return parseFloat(x, 10);
}

// 定义 Dialog 类
var Dialog = function (element, options) {
    options = $.extend({}, $.fn.dialog.defaults, options);

    this.options = options;
    this.hasInit = false;

    this.setup(element);
    this.element = element;
};

Dialog.prototype = {

    constructor: Dialog,

    init: function () {
        // 创建弹出层
        this.dialog = new Overlay(this.options.template, {
            className: this.options.dialogClass,
            width: this.options.width,
            height: this.options.height,
            zIndex: this.options.zIndex
        });

        if (this.options.hasMask) {
            var $mask = $('.' + this.options.maskClass);

            if ($mask.length === 0) {
                // 创建遮罩
                this.mask = new Overlay(document.createElement('div'), {
                    className: this.options.maskClass,
                    width: isIE6? $(document).outerWidth() : '100%',
                    height: isIE6? $(document).outerHeight() : '100%',
                    zIndex: this.options.zIndex - 1,
                    position: 'fixed'
                });
            } else {
                // 已有遮罩
                this.mask = $mask;
            }
        }

        // 内容填充
        this.render();

        // 先隐藏浮动层与遮罩
        this.dialog.hide();
        if (this.options.hasMask) {
            this.mask.hide();
        }

        // 关闭按钮事件绑定
        $(this.dialog.overlay).find('.js-close').on('click', $.proxy(this.hide, this));

        // 其它按钮事件绑定
        $(this.dialog.overlay).find('[data-role=confirm]').on('click', $.proxy(this.confirm, this));
        $(this.dialog.overlay).find('[data-role=cancel]').on('click', $.proxy(this.hide, this));

        // 初始化完成标志
        this.hasInit = true;
    },

    setup: function (element) {
        var that = this;

        if (element) {
            // 触发绑定
            $(element).on('click', function (e) {
                e.preventDefault();

                that.trigger();
            });
        } else {
            that.trigger();
        }

        // 用于一些初始化的操作
        if (that.options.once) {
            $(element).one('click', function (e) {
                e.preventDefault();
                that.options.once();
            });
        }
    },

    trigger: function () {
        if (!this.hasInit) {
            this.init();
        }

        this.show();
    },

    show: function () {
        if (this.options.beforeShow) {
            this.options.beforeShow.apply(this);
        }

        this.dialog.setPosition();
        this.dialog.show();
        if (this.options.hasMask) {
            this.mask.show();
        }

        if (this.options.afterShow) {
            this.options.afterShow.apply(this);
        }
    },

    hide: function () {
        if (this.options.beforeHide) {
            this.options.beforeHide.apply(this);
        }

        this.dialog.hide();
        if (this.options.hasMask) {
            this.mask.hide();
        }

        if (this.options.afterHide) {
            this.options.afterHide.apply(this);
        }

        if (this.options.needDestroy) {
            this.destroy();
        }
    },

    render: function () {
        var $head = $(this.dialog.overlay).find('.hd');
        var $body = $(this.dialog.overlay).find('.bd');
        var $close = $(this.dialog.overlay).find('.close');
        var html;

        if (!this.options.hasTitle) {
            $head.remove();
        } else {
            $head.find('h2').text(this.options.title);
        }

        if (this.options.noClose) {
            $close.remove();
        }

        if (this.options.confirmType) {
            html = '<p class="confirm-wrap"><i class="icon-sprite icon icon-' + this.options.confirmType + '-32"></i>' + this.options.message + '</p>'
        } else {
            html = this.options.content;
        }

        if (this.options.hasBtn) {
            var btnCls;
            html += '<div class="btn-wrap">';
            for (var i = 0; i < this.options.btnText.length; i++) {
                if (this.options.btnRole[i] === 'cancel') {
                    btnCls = 'gray';
                } else {
                    btnCls = 'blue';
                }

                html += '<input type="button" data-role="' + this.options.btnRole[i] + '" class="dialog_btn btn-default-' + btnCls + '" value="'+ this.options.btnText[i] +'"/>' 
            }
            html += '</div>'
        };

        $body.html(html).css('padding', this.options.padding);
    },

    closeDelay: function (time) {
        setTimeout($.proxy(this.hide, this), time);
    },

    destroy: function () {
        this.dialog.remove();
        if (this.options.hasMask) {
            this.mask.hide();
        }
        this.destroyed = true;
    },

    confirm: function () {
        this.options.confirm.apply(this);
    }
}

// 注册插件
$.fn.dialog = function (options) {
    return this.each(function () {
        new Dialog(this, options);
    });
};

// 默认设置
$.fn.dialog.defaults = {
    dialogClass: 'js-dialog',
    maskClass: 'js-mask',
    template: '<table> <tr> <td class="edge top-edge" colspan="3"></td> </tr> <tr> <td class="edge left-edge"></td> <td class="center"> <div class="content"> <div class="hd"> <h2>提示</h2> </div> <div class="bd"></div> <div class="close"> <a href="javascript:;" class="js-close">关闭</a> </div> </div> </td> <td class="edge right-edge"></td> </tr> <tr> <td class="edge bottom-edge" colspan="3"></td> </tr> </table>',
    width: 450,
    height: 'auto',
    zIndex: 999,
    hasMask: true,
    hasTitle: true,
    title: '提示',
    cotent: '',
    padding: '20px',
    hasBtn: false,
    btnText: ['确定', '取消'],
    btnRole: ['confirm', 'cancel'],
    message: ''
};

$.fn.dialog.Constructor = Dialog;



// 阅读并接受协议后，下一步才可点击
    $('#protocol').on('change', 'input[type=checkbox]', function () {
        if (this.checked) {
            $('#submitBtn').prop('disabled', false);
        } else {
            $('#submitBtn').prop('disabled', true);
        }
    });

