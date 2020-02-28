import $ from 'jquery';
import 'fullcalendar';
import moment from 'moment';
import 'fullcalendar/dist/locale/ru';
import '../../../base/styles/plugins/fullcalendar.css';
import VueBus from '../../../base/scripts/vue-bus';

window.moment = moment;
class CheckoutCalendar {
  constructor() {
    this.calendarContainer = $('.checkout-calendar__wrapper');
    this.windowWidth = '';
    this.type = '';
    this.view = {
      agenda7Day: {
        type: 'agenda',
        duration: { days: 7 },
      },
      agendaTwoDay: {
        type: 'agenda',
        duration: { days: 2 },
      },
    };

    if (window.innerWidth < 768) {
      this.windowWidth = 'small';
      this.type = 'agendaTwoDay';
    } else {
      this.windowWidth = 'big';
      this.type = 'agenda7Day';
    }

    this.initCalendar();

    window.addEventListener('resize', () => {
      if (window.innerWidth < 768) {
        this.checkFlag('small');
      } else {
        this.checkFlag('big');
      }
    });
  }
  static declOfNum(number, titles) {
    const cases = [2, 0, 1, 1, 1, 2];
    return titles[((number % 100) > 4 && (number % 100) < 20) ?
      2 : cases[((number % 10) < 5) ? (number % 10) : 5]];
  }
  initCalendar() {
    let { bookedHours } = window;
    if (bookedHours && bookedHours.length > 0) {
      // eslint-disable-next-line
      bookedHours = window.bookedHours.map((el) => {
        return {
          start: el[0],
          end: el[1],
          disabled: true,
        };
      });
    } else {
      bookedHours = [];
    }
    let inited = false;
    const now = moment().utcOffset(3).format();
    const data = now.substr(0, now.length - 15);
    let curDateStart = `${data}T08:00:00+03:00`;
    let curDateEnd = `${data}T09:00:00+03:00`;
    if (bookedHours) {
      const bookedHour = bookedHours.findIndex(el => el.start === curDateStart);
      if (bookedHour !== -1) {
        const hours = bookedHours.slice(bookedHour);
        hours.forEach((hour) => {
          if (hour.start === curDateStart) {
            const start = moment(hour.start).unix();
            const end = moment(hour.end).unix();
            let curStart = moment(curDateStart).unix();
            curStart += (end - start);
            curDateStart = moment(curStart * 1000).utcOffset(3).format();
            curDateEnd = moment((end + 3600) * 1000).utcOffset(3).format();
          }
        });
      }
    }
    let addedEvents = [{
      start: curDateStart,
      end: curDateEnd,
      selected: true,
    }];
    this.calendarContainer.fullCalendar({
      lang: 'ru',
      titleFormat: 'Время бронирования, MMMM YYYY',
      defaultView: this.type,
      views: this.view,
      longPressDelay: 20,
      header: {
        left: 'title',
        center: '',
        right: 'today, prev,next',
      },
      height: 'auto',
      columnHeaderFormat: 'ddd DD',
      allDaySlot: false,
      dragScroll: false,
      slotDuration: '01:00:00',
      minTime: '08:00:00',
      maxTime: '24:00:00',
      slotLabelFormat: [
        'HH:mm - HH:mm',
        'HH:mm - HH:mm',
      ],
      selectable: true,
      unselectCancel: 'html',
      selectConstraint: {
        start: '08:00',
        end: '24:00',
      },
      dayClick: (date, jsEvent, view) => {
        if (view.name === 'month') {
          this.changeView(this.type);
          this.calendarContainer.fullCalendar('gotoDate', date);
        }
      },
      eventRender: (event, element) => {
        /* eslint-disable no-underscore-dangle */
        const from = event.start._i;
        const to = event.end._i;
        if (event.selected && !inited) {
          VueBus.$emit('dateSelect', {
            reserveFrom: from.substr(0, from.length - 9),
            reserveTo: to.substr(0, to.length - 9),
          });
          inited = true;
        }
        if (event.disabled === true) {
          element.addClass('event-disabled');
        }
        const diff = event.end.diff(event.start);
        const hours = moment.duration(diff).hours();
        element.html(`<div class="js-full-selected" style="width:100%;text-align:right;padding:10px;box-sizing: border-box;">${hours} ${this.constructor.declOfNum(hours, ['час', 'часа', 'часов'])}</div>`);
        element.on('touchstart', () => {
          if ($('.js-full-selected').length !== 0) {
            this.calendarContainer.fullCalendar('unselect');
          }
        });
      },
      select: (start, end) => {
        this.calendarContainer.fullCalendar('removeEventSource', addedEvents);
        addedEvents = [];
        addedEvents.push({
          selected: true,
          start,
          end,
        });
        this.calendarContainer.fullCalendar('addEventSource', addedEvents);
        const fromFormatted = start.format();
        const toFormatted = end.format();
        VueBus.$emit('dateSelect', {
          reserveFrom: fromFormatted.substr(0, fromFormatted.length - 3),
          reserveTo: toFormatted.substr(0, toFormatted.length - 3),
        });
      },
      timezone: 'Europe/Moscow',
      eventSources: [bookedHours, addedEvents],
      validRange: {
        start: moment().startOf('day'),
      },
      selectAllow: (info) => {
        const diff = info.end.diff(info.start);
        const hours = moment.duration(diff).hours();
        let count = 0;
        this.calendarContainer.fullCalendar('clientEvents').forEach((item) => {
          if (item.start >= info.start && item.end <= info.end &&
            info.start.unix() >= moment().unix()) {
            count += 1;
          }
        });
        return hours !== count;
      },
      selectOverlap(event) {
        return (event.disabled !== true);
      },
      selectHelper: true,
      viewRender: (view, element) => {
        const start = 8;
        if ($(element).parent()
          .prev()
          .find('.fc-month-button').length === 0) {
          $(element).parent()
            .prev()
            .find('.fc-right')
            .prepend('<label class="fc-month-button"><input type="text" class="fc-month-input"/><span class="fc-icon fc-icon--month-icon"></span></label>');
          const datepickerEl = window.$(element).parent()
            .prev()
            .find('.fc-month-input');
          datepickerEl.datepicker({
            classes: 'fc-datepicker',
            showOtherMonths: true,
            minDate: new Date(),
            range: false,
            multipleDates: false,
            toggleSelected: false,
            dateFormat: 'm',
            onShow: (inst) => {
              if (inst.$datepicker.find('.datepicker--bottom-buttons').length === 0) {
                const buttonCancel = '<button class="datepicker--custom-button datepicker--custom-button__cancel">Отменить</button>';
                const buttonOk = '<button class="datepicker--custom-button">Применить</button>';

                inst.$datepicker.append(`<div class="datepicker--bottom-buttons">${buttonCancel}${buttonOk}</div>`);

                inst.$datepicker.find('.datepicker--custom-button').each((key, item) => {
                  item.addEventListener('click', () => {
                    inst.hide();
                  });
                });
              }
            },
            onSelect: (format, date) => {
              this.calendarContainer.fullCalendar('gotoDate', date);
              datepickerEl.data('datepicker').hide();
            },
          });
        }
        $(element).find('.fc-widget-header .fc-axis').html('<div style="display:flex;align-items: center;justify-content: space-between;"><div>Время</div><span class="fc-axis__arrow"></span></div>');
        $(element).find('.fc-axis.fc-time').each((key, item) => {
          let index = start + key;
          let sindex = index + 1;
          if (index < 10) {
            index = `0${index}`;
            if (index < 9) {
              sindex = `0${sindex}`;
            }
          }
          item.children[0].innerHTML = `${index}:00 - ${sindex}:00`;
        });
      },
    });
    $(window).on('load', () => {
      $(this.calendarContainer).fullCalendar('render');
    });
  }

  checkFlag(width) {
    if (this.windowWidth !== width) {
      if (width === 'big') {
        this.changeView('agenda7Day');
      } else {
        this.changeView('agendaTwoDay');
      }

      this.windowWidth = width;
    }
  }

  changeView(view) {
    this.calendarContainer.fullCalendar('changeView', view);
  }
}

export default CheckoutCalendar;
