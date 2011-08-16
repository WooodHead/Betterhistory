var groupResults;
(function() {
  var interval = 15;

  function hours(militaryHours) {
    if(militaryHours === 0) {
      return 12;
    } else {
      return (militaryHours > 12 ? militaryHours - 12 : militaryHours);
    }
  }

  function period(hours) {
    return (hours < 12 ? 'AM' : 'PM');
  }

  function minute(minutes) {
    minutes = Math.floor(minutes / interval) * interval;
    return (minutes === 0 ? '00' : minutes);
  }

  function standardTimeByInterval(date) {
    return hours(date.getHours()) + ':' + minute(date.getMinutes()) + ' ' + period(date.getHours());
  }

  groupResults = function(pageVisits) {
    var dateVisits = new DateVisits();
    $.each(pageVisits.models, function(index, pageVisit) {
      var lastVisitTime = new Date(pageVisit.get('lastVisitTime'));

      var date = lastVisitTime.toLocaleDateString(),
          time = standardTimeByInterval(lastVisitTime);

      if(dateVisits.pluck('date').indexOf(date) === -1) {
        dateVisits.add([{date: date, timeVisits:new TimeVisits()}]);
      }

      var dateVisit = dateVisits.at(dateVisits.pluck('date').indexOf(date));
      var timeVisits = dateVisit.get('timeVisits');

      if(timeVisits.pluck('time').indexOf(time) === -1) {
        dateVisit.get('timeVisits').add([{time: time, pageVisits:[]}]);
      }

      var timeVisit = timeVisits.at(timeVisits.pluck('time').indexOf(time));
      var pageVisits = timeVisit.get('pageVisits');

      if(pageVisits.length === 0) {
        pageVisits.push(pageVisit);
      } else {
        if(pageVisit.compare(previous)) {
          if(pageVisits[pageVisits.length - 1].length === undefined) {
            pageVisits.remove(-1);
            pageVisits.push(new GroupedVisits([previous, pageVisit]));
          } else {
            pageVisits[pageVisits.length - 1].add(pageVisit);
          }
        } else {
          pageVisits.push(pageVisit);
        }
      }

      previous = pageVisit;
    });
    return dateVisits;
  }
})();
