/*!
 * Bright 0.0.5
 *
 * Copyright 2012, Sergiy Lavryk (jagermesh@gmail.com)
 * Dual licensed under the MIT or GPL Version 2 licenses.
  * http://brightfw.com
 *
 */

;(function ($, window) {

  function BrEditable(ctrl, options) {

    var _this = this;
    _this.ctrl = $(ctrl);
    if (br.isFunction(options)) {
      options = { onSave: options };
    }
    options = options || {};
    _this.options = options;
    _this.editor = null;
    _this.savedWidth = '';
    _this.click = function(element, e) {
      if (!_this.activated()) {
        var content = '';
        if (typeof _this.ctrl.attr('data-editable') != 'undefined') {
          content = _this.ctrl.attr('data-editable');
        } else {
          content = _this.ctrl.text();
        }
        _this.ctrl.data('brEditable-original-html', _this.ctrl.html());
        _this.ctrl.data('brEditable-original-width', _this.ctrl.css('width'));
        var width = _this.ctrl.innerWidth();
        var height = _this.ctrl.innerHeight();
        _this.ctrl.text('');
        _this.editor = $('<input type="text" />');
        if (_this.ctrl.attr('data-editable-style')) {
          _this.editor.attr('style', _this.ctrl.attr('data-editable-style'));
        }
        _this.editor.addClass('form-control');
        _this.editor.css('width', '100%');
        if (br.isEmpty(_this.editor.css('height'))) {
          _this.editor.css('height', '100%');
        }
        _this.editor.css('min-height', '30px');
        _this.editor.css('font-size', _this.ctrl.css('font-size'));
        _this.editor.css('font-weight', _this.ctrl.css('font-weight'));
        _this.editor.css('box-sizing', '100%');
        _this.editor.css('-webkit-box-sizing', 'border-box');
        _this.editor.css('-moz-box-sizing', 'border-box');
        _this.editor.css('-ms-box-sizing', 'border-box');
        _this.editor.css('margin-top', '2px');
        _this.editor.css('margin-bottom', '2px');
        _this.ctrl.append(_this.editor);
        if (_this.options.onGetContent) {
          content = _this.options.onGetContent.call(_this.ctrl, _this.editor, content);
        }
        _this.editor.val(content);
        _this.ctrl.css('width', width - 10);
        _this.editor.focus();
        if (_this.options.saveOnLoosingFocus) {
          _this.editor.attr('data-original-title', 'WARNING!!! Changes will be saved after leaving input box or by pressing [Enter]. Press [Esc] to cancel changes.');
        } else {
          _this.editor.attr('data-original-title', 'Press [Enter] to save changes, [Esc] to cancel changes.');
        }
        _this.editor.tooltip({placement: 'bottom', trigger: 'focus'});
        _this.editor.tooltip('show');
        if (_this.options.saveOnLoosingFocus) {
          $(_this.editor).on('blur', function(e) {
            _this.editor.tooltip('hide');
            var content = $(this).val();
            if (_this.options.onSave) {
              _this.options.onSave.call(_this.ctrl, content, 'blur');
            } else {
              _this.apply(content);
            }
          });
        }
        $(_this.editor).keyup(function(e) {
          if (e.keyCode == 13) {
            _this.editor.tooltip('hide');
            var content = $(this).val();
            if (_this.options.onSave) {
              _this.options.onSave.call(_this.ctrl, content, 'keyup');
            } else {
              _this.apply(content);
            }
          }
          if (e.keyCode == 27) {
            _this.editor.tooltip('hide');
            _this.cancel();
          }
        });
      }
    };

    _this.activated = function() {
      return _this.editor !== null;
    };

    _this.apply = function(content) {
      _this.editor.tooltip('hide');
      _this.editor.remove();
      _this.editor = null;
      _this.ctrl.html(content);
      if (typeof _this.ctrl.attr('data-editable') != 'undefined') {
        _this.ctrl.attr('data-editable', content);
      }
      _this.ctrl.css('width', '');
    };

    _this.cancel = function() {
      _this.editor.tooltip('hide');
      _this.editor.remove();
      _this.editor = null;
      _this.ctrl.html(_this.ctrl.data('brEditable-original-html'));
      _this.ctrl.css('width', '');
    };

  }

  window.br = window.br || {};

  window.br.editable = function(selector, callback, value) {
    if (typeof callback == 'string') {
      var data = $(selector).data('brEditable-editable');
      if (!data) {
        $(selector).data('brEditable-editable', (data = new BrEditable($(selector), callback)));
      }
      if (data) {
        data[callback](value);
      }
    } else {
      $(document).on('click', selector, function(e) {
        var $this = $(this), data = $this.data('brEditable-editable');
        if (!data) {
          $this.data('brEditable-editable', (data = new BrEditable(this, callback)));
        }
        data.click(e);
      });
    }
  };

})(jQuery, window);
