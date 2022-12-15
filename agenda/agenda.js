// Agenda par Ann MB - Licence CC BY-SA 4.0 - ann-mb.carrd.co
'use strict';
class RightTime {
  constructor(a,m,j,h,min) {
    0 !== arguments.length ? (!m && (m = 1), !j && (j = 1), !h && (h = 0), !min && (min = 0),
    this.Now = new Date(a, m - 1, j, h, min)) : this.Now = new Date();
    this.Year = this.Now.getFullYear();
    this.Month = this.Now.getMonth() + 1;
    this.Day = this.Now.getDate();
    this.locale = navigator.languages != undefined ? navigator.languages[0] : navigator.language;
  }
  get Months() {
    var baseDate = new Date(1900,0), months = [null];
    for(var i = 1; i < 13; i++) {
      months.push(baseDate.toLocaleDateString(this.locale, { month: 'long' }));
      baseDate.setMonth(i);
    }
    Object.freeze(months);
    return months
  }
  get DaysOfWeek() {
    var baseDate = new Date(1900, 0, 1), weekDays = [null];
    for(var i = 0; i < 7; i++) {
      weekDays.push(baseDate.toLocaleDateString(this.locale, { weekday: 'long' }));
      baseDate.setDate(baseDate.getDate() + 1);
    }
    Object.freeze(weekDays);
    return weekDays
  }
  get DayOfWeek() { return 0 == this.Now.getDay() ? 7 : this.Now.getDay() }
  get DayOfWeekName() { return this.DaysOfWeek[this.DayOfWeek] }
  get DayOfYear() { return Math.floor((this.Now - new Date(this.Year, 0, 0)) / 86400000) }
  get IsBissextile() { return ((this.Year % 4 === 0 && this.Year % 100 > 0) || (this.Year % 400 === 0)) ? 1 : 0 }
  get MonthName() { return this.Months[this.Month] }
  ml = [null, 31, [28,29], 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  get MonthLength() { return this.Month == 2 ? this.ml[this.Month][this.IsBissextile] : this.ml[this.Month] }
  get PrevMonthLength() {return this.Month -1 == 0 ? 31 : this.Month -1 == 2 ? this.ml[this.Month - 1][this.IsBissextile] : this.ml[this.Month -1]}
  get FirstDayOfMonth() { let test1 = new Date(this.Year, this.Month - 1, 1).getDay(); return (0 == test1) ? 7 : test1 }
  get LastDayOfMonth() { let test2 = new Date(this.Year, this.Month, 0).getDay(); return (0 == test2) ? 7 : test2 }
  get DaysInWeekPrev() { return this.FirstDayOfMonth - 1 }
  get DaysInWeekNext() { return 7 - this.LastDayOfMonth }
  get Zodiac() {
    var m = this.Month;
    return {
      get Emote() { return [null,'\u2652','\u2653','\u2648','\u2649','\u264a','\u264b','\u264c','\u264d','\u264e','\u264f','\u2650','\u2651'][m] },
      get Bound() { return [null, 21, 20, 21, 21, 21, 22, 23, 23, 23, 23, 21, 20][m] },
      get Name() { return [null,'verseau','poissons','b\u00e9lier','taureau','g\u00e9meaux','cancer','lion','vierge','balance','scorpion','sagittaire','capricorne'][m] }
    }
  }
  get Moon() {
    var x = this.Year, y = this.Month, z = this.Day;
    return {
      get Age() {
        var d = x, b = y, c = z;
        d = void 0 === d ? new Date() : new Date(d,b-1,c);
        b = d.getTime();
        d = d.getTimezoneOffset();
        b = (b / 86400000 - d / 1440 - 10962.6) / 29.530588853;
        b -= Math.floor(b);
        0 > b && (b += 1);
        return 29.530588853 * b;
      },
      get NextFull() { return this.Age > 14.765294427 ? 44.29588328 - this.Age : 14.765294427 - this.Age },
      get NextNew() { return 29.530588853 - this.Age },
      get Number() { let mn = Math.round((this.Age * 8) / 29.530588853); return mn >= 8 ? 0 : mn },
      get Name() { return ['Nouvelle Lune', 'Premier Croissant', 'Premier quartier', 'Gibbeuse ascendante', 'Pleine Lune', 'Gibbeuse descendante', 'Dernier Quartier', 'Dernier Croissant'][this.Number] },
      get Emote() { return ['\u{1F311}','\u{1F312}','\u{1F313}','\u{1F314}','\u{1F315}','\u{1F316}','\u{1F317}','\u{1F318}'][this.Number] }
    }
  }
  get WeekOfYear() {
    var date = new Date(this.Year,this.Month-1,this.Day);
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    var week1 = new Date(date.getFullYear(), 0, 4);
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
  }
  ShiftDays(n) {
    let d = new Date(this.Year,this.Month-1,this.Day);
    d.setDate(d.getDate() + n);
    return new RightTime(d.getFullYear(), d.getMonth()+1, d.getDate())
  }
}
var nowMonth,
    thisMonth,
    evtL = evt.length,
    events = [], eventsLength,
    storeFocus,
    soonEvents = 0,
    minMonth = [2021,12],
    showMoonPhases = true,
    showZodiacs = true;

nowMonth = thisMonth = new RightTime();

const
$ = (id) => { return document.getElementById(id) },
calGrid = $('cal-grid'),
details = $('cal-details'),
//sleep = (m) => { return new Promise(r => setTimeout(r, m)) },
correctHeight = () => { document.documentElement.style.setProperty('--vh', (window.innerHeight * 0.01)+'px') },
exitDetails = (e) => {
  e.preventDefault();
  details.style.bottom = '-100%';
  details.setAttribute('aria-hidden','true');
  storeFocus.focus();
  storeFocus = void 0;
},
showDetails = (a,e) => {
  e.preventDefault();
  storeFocus = a;
  a = evt[a.getAttribute('data-index')];
  if (a.TimeStart) {
    var s = a.TimeStart.split(':'), longhour;
    if (a.TimeEnd) {
      var t = a.TimeEnd.split(':');
      longhour = `de ${s[0]}h${s[1]} \u00e0 ${t[0]}h${t[1]}`;
    } else {
      longhour = `\u00e0 ${s[0]}h${s[1]}`;
    }
  }
  var u = a.DayStart.split('/'), dr;
  if (a.DayEnd) {
    var v = a.DayEnd.split('/'),
        r = thisMonth.Months;
        dr = `Du ${u[0]} ${r[u[1]]} ${u[2]} au ${v[0]} ${r[v[1]]} ${v[2]}`
  } else {
    dr = `Le ${u[0]} ${thisMonth.Months[u[1]]} ${u[2]}`;
  }
  $('details-title').innerHTML = a.Title;
  $('details-time').innerHTML = dr + ' ' + (longhour || '');
  $('details-place').innerHTML = a.Place || '';
  $('details-link').innerHTML = a.Link ? (`<a href="${a.Link}" rel="external noreferrer">${a.Link}</a>`) : '';
  $('details-desc').innerHTML = a.Desc ? (a.Desc.replace(/\[\[(.+?)\]\]/gi,'<a href="$1" rel="external noreferrer">$1</a>')) : '';
  $('details-dl').setAttribute('data-dl',storeFocus.getAttribute('data-index'))
  details.style.bottom = '0';
  details.setAttribute('aria-hidden','false');
  details.focus();
},
generateWeek = () => {
  var arr = thisMonth.DaysOfWeek, arrl = arr.length,
      dys = document.querySelector('.days-names').querySelectorAll('div');
  for (let i = 0 ; i < arrl - 1 ; i++) {
    dys[i].innerHTML = arr[i + 1].replace(/([a-z]{1})([a-z]{2})([a-z]+)/i,'$1<span>$2<span>$3</span></span>')
  }
},
generateMonth = () => {
  /*async*/ function generateEvents(a,m,j,d) {
    for (let i = eventsLength ; i--;) {
      var x = events[i], eventDate = x.DayStart, thisDate = j+'/'+m+'/'+a;
      if (eventDate == thisDate) {
        let evnt = document.createElement('a');
        d.setAttribute('tabindex','0');
        d.setAttribute('aria-label', `${thisMonth.DayOfWeekName} ${j} ${thisMonth.Months[m]} ${a}`);
        d.setAttribute('role','gridcell');
        evnt.className += ' cal-event' + (x.Type ? ` evt-${x.Type}` : '');
        x.DayEnd && x.pos && (evnt.className += ` pos-${x.pos}`);
        x.long && (evnt.className += ` long long-${x.long}`)
        evnt.setAttribute('data-index', x.index);
        evnt.setAttribute('href','#');
        evnt.addEventListener('click', function(e) { showDetails(this,e) });
        evnt.innerHTML = (x.TimeStart ? x.TimeEnd ? `<b>${x.TimeStart} - ${x.TimeEnd}</b><br/>` : `<b>${x.TimeStart}</b><br/>` : '') + `<div class="evt-title">${x.Title}</div>`;
        d.appendChild(evnt);
      }
      //await sleep(5);
    }
  }
  var date = thisMonth, b = date.DaysInWeekPrev;
  calendarBoudaries(date.Year,date.Month);
  calGrid.innerHTML = '';
  calGrid.style.counterReset = `curr-days next-days prev-days ${date.PrevMonthLength - b}`;
  $('month-year').innerHTML = `${date.MonthName}, ${date.Year}`;
  document.title = `Calendrier - ${date.MonthName}, ${date.Year}`;
  for (let i = 0; i < b ; i++) {
    let el = document.createElement('div');
    el.className += ' cal-prev';
    calGrid.appendChild(el)
  }

  var c = date.MonthLength, v = nowMonth.Year == date.Year && nowMonth.Month == date.Month, f = nowMonth.Day,
      fmd = Math.round(1 + new RightTime(date.Year, date.Month, 1).Moon.NextFull),
      nmd = Math.round(1 + new RightTime(date.Year, date.Month, 1).Moon.NextNew);

  for (let i = 0; i < c ; i++) {
    let el = document.createElement('div');
    el.className += ' cal-curr';
    switch (i+1) {
      case f : { v && (el.className += ' cal-today'); break }
      case fmd : { if (showMoonPhases) {let el2 = document.createElement('div'); el2.className = 'moon full'; el2.innerHTML = '\u{1F315}'; el.appendChild(el2)} break}
      case nmd : { if (showMoonPhases) {let el3 = document.createElement('div'); el3.className = 'moon new'; el3.innerHTML = '\u{1F311}' ; el.appendChild(el3)} break}
      case date.Zodiac.Bound : { if (showZodiacs) {let el4 = document.createElement('div'); el4.className = 'zod'; el4.innerHTML = `<span>${date.Zodiac.Name}</span> ${date.Zodiac.Emote}&#xfe0e;`; el.appendChild(el4)} break}
    }
    generateEvents(thisMonth.Year,thisMonth.Month,i+1,el);
    calGrid.appendChild(el)
  }
  var d = date.DaysInWeekNext;
  for (let i = 0 ; i < d ; i++) {
    let el = document.createElement('div');
    el.className += ' cal-next';
    calGrid.appendChild(el)
  }
},
calendarBoudaries = (y,m) => {
  if (typeof minMonth !== 'undefined') {
    if (y == minMonth[0] && m == minMonth[1]) {
      $('go-prev').classList.add('hide');
      $('go-prev').setAttribute('aria-hidden','true');
    }
    else {
      $('go-prev').classList.remove('hide')
      $('go-prev').removeAttribute('aria-hidden','false');
    }
  }
  if (typeof maxMonth !== 'undefined') {
    if (y == maxMonth[0] && m == maxMonth[1]) {
      $('go-next').classList.add('hide');
      $('go-next').setAttribute('aria-hidden','true');
    }
    else {
      $('go-next').classList.remove('hide')
      $('go-next').removeAttribute('aria-hidden','false');
    }
  }
},
changeMonth = (a,e) => {
  e.preventDefault();
  var m = thisMonth.Month + a, y = thisMonth.Year;
  13 == m && (m = 1, y++);
  0 == m && (m = 12, y--);
  thisMonth = new RightTime(y,m);
  generateMonth(y,m);
};

function init() {
  for (var i = 0 ; i < evtL; i++) {
    var start = evt[i].DayStart.split('/');
    if (evt[i].DayEnd) {
      let end = evt[i].DayEnd.split('/')[0],
          duration = end - start[0] + 1;
      for (var j = 0 ; j < duration ; j++) {
        let newe = Object.assign({}, evt[i])
        newe.DayStart = end - j + '/' + start[1] + '/' + start[2];
        newe.pos = newe.DayStart == evt[i].DayStart ? 's' : newe.DayStart == evt[i].DayEnd ? 'e' : 'm';
        1 == (new RightTime(start[2],start[1],end-j).DayOfWeek) && (newe.long = 1) // too much recursions
        newe.index = i;
        events.push(newe);
      }
    } else {
      let newe = Object.assign({}, evt[i])
      newe.index = i;
      events.push(newe)
    }
    if (start[1] == nowMonth.Month && start[2] == nowMonth.Year && start[0] >= nowMonth.Day) {
      soonEvents++
    }
    if (i == evtL - 1) {
      eventsLength = events.length;
      generateWeek();
      generateMonth(nowMonth.Year,nowMonth.Month);
    }
  }
  $('go-prev').addEventListener('click', function(e) {changeMonth(-1,e)},!1);
  $('go-next').addEventListener('click', function(e) {changeMonth(1,e)},!1);
  $('details-exit').addEventListener('click', function(e) { exitDetails(e) },!1);
}

function ical_download(a) {
  let details = evt[a],
      offset = ("0" + ((new Date()).getTimezoneOffset() / 60)).slice(-2),
      daystart = details.DayStart.split("/"),
      dayend = details.DayEnd ? details.DayEnd.split("/") : false,
      end,
      start;

  var vstart = daystart[2] + (0 + daystart[1]).slice(-2) + (0 + daystart[0]).slice(-2);

  if (details.TimeStart) {
    let tz = ';TZID=Europe/Paris:'
    let split1 = details.TimeStart.split(':');
    start = tz + vstart + 'T' + split1[0] + split1[1] + '00';

    if (details.TimeEnd) {
      end = tz + (dayend
                   ? dayend[2] + (0 + dayend[1]).slice(-2) + (0 + dayend[0]).slice(-2)
                   : vstart
                 )
               + 'T' + details.TimeEnd.replace(':','') + '00';

    } else {
        end = tz + (dayend
                     ? dayend[2] + (0 + dayend[1]).slice(-2) + (0 + dayend[0]).slice(-2)
                     : vstart
                   ) +
              'T' +
              split1[0] + split1[1] + '00'
    }
  } else {
    start = ';VALUE=DATE:' + vstart;
    if (dayend) {
      end = ';VALUE=DATE:' + dayend[2] + (0 + dayend[1]).slice(-2) + (0 + dayend[0]).slice(-2);
    } else {
      end = ';VALUE=DATE:' + daystart[2] + (0 + daystart[1]).slice(-2) + ('0' + (+daystart[0]+1)).slice(-2);
    }
  }

	const _save = function(fileURL) {
    var filename = details.Title.normalize("NFD").replace(/[\u0300-\u036f]/gi, '').replace(/[ ']/gi,'_').replace(/&[a-z]+;/gi,'').replace(/[^\w]/gi,'').substring(0, 20) +'.ics'
		if (!window.ActiveXObject) {
			var save = document.createElement('a');
			save.href = fileURL;
			save.target = '_blank';
			save.download = filename || 'unknown';

			var evt = new MouseEvent('click', {
				'view': window,
				'bubbles': true,
				'cancelable': false
			});
			save.dispatchEvent(evt);

			(window.URL || window.webkitURL).revokeObjectURL(save.href);
		}

		// for IE < 11
		else if (!!window.ActiveXObject && document.execCommand) {
			var _window = window.open(fileURL, '_blank');
			_window.document.close();
			_window.document.execCommand('SaveAs', true, filename || fileURL)
			_window.close();
		}
	}


	var now = new Date(),
      uid = 'event-'+now.getTime()+'@ressfem86',
      loc = (details.Place ? details.Place.replace(/<br\/>/g,' - ') : ''),
      link = details.Link ? details.Link : '',
      title = details.Title.replace(/&nbsp;/g,' '),
      geo = details.Geo ? details.Geo : '',
      desc = details.Desc ? details.Desc : '',
      dtstamp = now.toISOString().replace(/([0-9]+)-([0-9]+)-([0-9]+)T([0-9]+):([0-9]+):([0-9]+)\.([0-9]+)Z/g,'$1$2$3T$4$500'),
      ics_lines =
`BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//mtpgi.github.io/86/agenda//Ann MB//FR
X-WR-CALNAME:Ressources Féministes Queer 86
NAME:Feed Title
X-WR-TIMEZONE:Europe/Paris
CALSCALE:GREGORIAN
BEGIN:VTIMEZONE
TZID:Europe/Paris
TZURL:http://tzurl.org/zoneinfo-outlook/Europe/Paris
X-LIC-LOCATION:Europe/Paris
BEGIN:DAYLIGHT
TZNAME:CEST
TZOFFSETFROM:+0100
TZOFFSETTO:+0200
DTSTART:19700329T020000
RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU
END:DAYLIGHT
BEGIN:STANDARD
TZNAME:CET
TZOFFSETFROM:+0200
TZOFFSETTO:+0100
DTSTART:19701025T030000
RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU
END:STANDARD
END:VTIMEZONE
BEGIN:VEVENT
UID:${uid}
DTSTAMP:${dtstamp}
DTSTART${start}
DTEND${end}
SUMMARY:${title}
DESCRIPTION:${desc}
LOCATION:${loc}
GEO:${geo}
URL:${link}
SEQUENCE:0
BEGIN:VALARM
ACTION:DISPLAY
DESCRIPTION:${title}
TRIGGER:-P1D
END:VALARM
END:VEVENT
END:VCALENDAR`;

  var dlurl = 'data:text/calendar;utf8,' + encodeURIComponent(ics_lines);
  _save(dlurl);
}

document.getElementById('details-dl').addEventListener('click', function(){
  ical_download(this.getAttribute('data-dl'))
});

window.addEventListener('DOMContentLoaded', function(){
  init();
  correctHeight();
  ($('incoming') && soonEvents > 0) && ($('incoming').innerHTML = soonEvents);
},!1);
window.addEventListener('resize', correctHeight, !1);
