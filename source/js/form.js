(function () {
  var me = {};
  var form = document.querySelector('.form-container');
  var closeButton = null;

  function onClose(e) {
    e.preventDefault();

    me.close();
    closeButton.removeEventListener('click', onClose);
  };

  me.open = function () {
    form.classList.remove('is-hidden');

    closeButton = document.querySelector('.form__close-button');
    closeButton.addEventListener('click', onClose);

  };

  me.close = function () {
    form.classList.add('is-hidden');
  };

  // home work for lesson-9
  window.onkeydown = function (event) {
    if (event.keyCode == 27) {
      // console.log('escape pressed');
        ITVDN.form.close();
    }
  };
  //--------------
  
  me.isValid = function () {
    var requiredFields = document.querySelectorAll('[data-valid="required"]');
    var emailValue = document.querySelector('[data-email]').value;
    var numberValue = document.querySelector('[data-number]').value;

    if (!me.isAllCompleted(requiredFields)) {
      console.log('Заполните все необходимые поля!');
      return false;
    } else if (!ITVDN.validation.isEmail(emailValue)) {
      console.log('Неверный EMail');
      return false;
    } else if (!ITVDN.validation.isNumber(numberValue)) {
      console.log('Неверный номер телефона');
      return false;
    }

    return true;
  };

  me.isAllCompleted = function (data) {
    var result = true;

    for (var i = 0; i < data.length; i++) {
      if (!ITVDN.validation.isNotEmpty(data[i].value)) {
        result = false;
        break;
      }

    }

    return result;
  };

  ITVDN.form = me;
}());