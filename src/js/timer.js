$.mlsTime = {

  countdown: {
    init:           function (settings) {

      /* get collection of all countdown html components on page */
      var timers = document.querySelectorAll(settings.scope);

      /* update each countdown date item till expiration date */
      var updateClock = function (expirationDate, timeFrames, timerId) {
        var remainTime = $.mlsTime.countdown.getTimeLeft(expirationDate);

        $.mlsTime.countdown.renderTimeLeft(remainTime, timeFrames);
        if (timerId && remainTime.total <= 0) {
          clearInterval(timerId);
        }
      };

      for (var i = 0; i < timers.length; i++) {
        (function () {
          var expireDate    = timers[i].getAttribute(settings.expireDateAttribute);
          var timerElements = timers[i].querySelectorAll(settings.item);
          var timeInterval  = setInterval(function () {
            updateClock(expireDate, timerElements, timeInterval);
          }, 1000);
        })();
      }

    },
    getTimeLeft:    function (endtime) {
      var t       = Date.parse(endtime) - Date.parse(new Date());
      var seconds = Math.floor((t / 1000) % 60);
      var minutes = Math.floor((t / 1000 / 60) % 60);
      var hours   = Math.floor((t / (1000 * 60 * 60)) % 24);
      var days    = Math.floor(t / (1000 * 60 * 60 * 24));
      var months  = Math.floor(days / 30);

      return {
        'total':   t,
        'days':    months > 0 ? days - months * 30 : days,
        'hours':   hours,
        'minutes': minutes,
        'seconds': seconds,
        'months': months
      };
    },
    renderTimeLeft: function (time, elems) {
      var dataAttrName;
      var frameType;

      for (var i = 0; i < elems.length; i++) {
        dataAttrName       = Object.keys(elems[i].dataset)[0];
        frameType          = elems[i].dataset[dataAttrName];
        elems[i].innerHTML = (time[frameType] < 10) ? (time[frameType]) : time[frameType];
      }
    }
  }
};

$.mlsTime.countdown.init({
  scope: '[data-countdown]',
  item: '[data-countdown-item]',
  expireDateAttribute: 'data-countdown'
});