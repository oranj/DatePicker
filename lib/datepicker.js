"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var DatePicker = (function () {
    /**
     * @param {!Node} picker
     * @param {?Object} options
     * @constructor
     */
    function DatePicker(picker, options) {
        var _this = this;
        this.picker = picker;
        this.offset = 0;
        this.options = {
            outputFormat: 'Y-m-d',
            days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            months: ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"],
            next: '▶',
            prev: '◀',
            date: new Date(),
            minDate: null,
            maxDate: null,
            onPick: function () { },
            triggerChangeEvent: true,
            offsetX: 0,
            offsetY: 0
        };
        this.options = __assign({}, this.options, options);
        this.calendar = document.createElement('div');
        this.calendar.className = 'DatePicker';
        var body = document.querySelector('body');
        if (!body) {
            throw "Failed to find body tag";
        }
        body.appendChild(this.calendar);
        var hideTimeout = 0;
        this.picker.addEventListener('focus', function () {
            clearTimeout(hideTimeout);
            _this.display();
        });
        this.picker.addEventListener('blur', function () {
            hideTimeout = setTimeout(_this.hide.bind(_this), 300);
        });
        this.render();
        this.hide();
    }
    DatePicker.prototype.hide = function () {
        this.calendar.style.display = 'none';
    };
    DatePicker.prototype.display = function () {
        var pageRect = function (elm) {
            var top = 0, left = 0, rect = elm.getBoundingClientRect();
            do {
                top += elm.offsetTop || 0;
                left += elm.offsetLeft || 0;
                elm = elm.offsetParent;
            } while (elm);
            return {
                top: top,
                bottom: top - (rect.top - rect.bottom),
                left: left,
                right: left - (rect.left - rect.right)
            };
        };
        var rect = pageRect(this.picker), bottom = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        this.calendar.style.top = (rect.bottom + this.options.offsetX) + "px";
        this.calendar.style.left = (rect.left + this.options.offsetY) + "px";
        this.calendar.style.display = 'inline-block';
        this.calendar.style.visibility = 'inherit';
        var calrect = this.calendar.getBoundingClientRect();
        if (calrect.bottom > bottom) {
            this.calendar.style.top = ((rect.top - calrect.height) + this.options.offsetX) + "px";
        }
    };
    /**
     * @param {!Date} date
     * @returns {number}
     */
    DatePicker.prototype.getDaysInMonth = function (date) {
        for (var i = 27; i <= 32; i++) {
            var workingDate = new Date(date.getFullYear(), date.getMonth(), i);
            if (workingDate.getMonth() != date.getMonth()) {
                return i - 1;
            }
        }
        throw "Days in Month Unknown!";
    };
    /**
     * @param {Date} date
     */
    DatePicker.prototype.setPickerDate = function (date) {
        this.picker.value = this.format(date, this.options.outputFormat);
    };
    /**
     * @param {!number} month
     */
    DatePicker.prototype.setMonth = function (month) {
        this.options.date.setMonth(month);
        this.render();
    };
    /**
     * @param {!number} year
     */
    DatePicker.prototype.setYear = function (year) {
        this.options.date.setFullYear(year);
        this.render();
    };
    /**
     * @param {?Date} date
     */
    DatePicker.prototype.setMinDate = function (date) {
        this.options.minDate = date;
        this.render();
    };
    /**
     * @param {?Date} date
     */
    DatePicker.prototype.setMaxDate = function (date) {
        this.options.maxDate = date;
        this.render();
    };
    /**
     * @param callback
     */
    DatePicker.prototype.setOnPick = function (callback) {
        this.options.onPick = callback;
    };
    /**
     * @returns {Date}
     */
    DatePicker.prototype.getWorkingDate = function () {
        return (new Date(this.options.date.getFullYear(), this.options.date.getMonth(), 1));
    };
    DatePicker.prototype.render = function () {
        var _this = this;
        var that = this;
        this.calendar.innerHTML = '';
        var workingDate = this.getWorkingDate();
        var header = document.createElement('div');
        header.className = 'DatePicker-header';
        header.innerHTML = this.format(workingDate, 'F Y');
        this.calendar.appendChild(header);
        var next = document.createElement('span');
        next.className = 'DatePicker-next-month';
        next.innerHTML = this.options.next;
        next.addEventListener('click', function () {
            _this.setMonth(_this.options.date.getMonth() + 1);
            _this.picker.focus();
        });
        var prev = document.createElement('span');
        prev.className = 'DatePicker-prev-month';
        prev.innerHTML = this.options.prev;
        prev.addEventListener('click', function () {
            _this.setMonth(_this.options.date.getMonth() - 1);
            _this.picker.focus();
        });
        header.appendChild(next);
        header.appendChild(prev);
        var tbl = document.createElement('table');
        this.calendar.appendChild(tbl);
        var wday = workingDate.getDay() - this.offset;
        var tr = document.createElement('tr');
        tbl.appendChild(tr);
        var count = wday + 1;
        if (wday > 0) {
            var startTd = document.createElement('td');
            startTd.colSpan = wday;
            startTd.innerHTML = '&nbsp;';
            tr.appendChild(startTd);
        }
        for (var i = 1; i <= this.getDaysInMonth(this.options.date); i++) {
            var td = document.createElement('td');
            td.innerHTML = i.toString();
            td.className = 'DatePicker-date';
            var dayDate = new Date(workingDate.getFullYear(), workingDate.getMonth(), i);
            if ((this.options.minDate === null || this.options.minDate <= dayDate) && (this.options.maxDate === null || this.options.maxDate >= dayDate)) {
                td.addEventListener('click', function (date) {
                    return function () {
                        that.setPickerDate(date);
                        that.options.onPick.apply(that.picker);
                        if (that.options.triggerChangeEvent) {
                            if (that.picker.dispatchEvent) {
                                var evt = document.createEvent("HTMLEvents");
                                evt.initEvent('change', true, true);
                                return !that.picker.dispatchEvent(evt);
                            }
                        }
                    };
                }(dayDate));
            }
            else {
                td.className += " DatePicker-date-disabled";
            }
            tr.appendChild(td);
            if (count > 6) {
                tr = document.createElement('tr');
                tbl.appendChild(tr);
                count = 0;
            }
            count++;
        }
        if (count != 1) {
            var endTd = document.createElement('td');
            endTd.colSpan = 8 - count;
            endTd.innerHTML = '&nbsp;';
            tr.appendChild(endTd);
        }
    };
    /**
     * From: http://www.electricprism.com/aeron/calendar/
     *
     * License:
     * MIT-style license.
     *
     * Copyright:
     * Copyright (c) 2008 [Aeron Glemann](http://www.electricprism.com/aeron/)
     *
     * @param date
     * @param format
     * @returns {string}
     */
    DatePicker.prototype.format = function (date, format) {
        var str = '';
        if (date) {
            var j = date.getDate(), w = date.getDay(), l = this.options.days[w], n = date.getMonth() + 1, f = this.options.months[n - 1], y = date.getFullYear() + '';
            for (var i = 0, len = format.length; i < len; i++) {
                var cha = format.charAt(i);
                switch (cha) {
                    case 'y':// xx - xx
                        str += y.substr(2);
                        break;
                    case 'Y':// 19xx - 20xx
                        str += y;
                        break;
                    case 'm':// 01 - 12
                        if (n < 10) {
                            str += '0' + n;
                        }
                        else {
                            str += n;
                        }
                        break;
                    case 'n':// 1 - 12
                        str += n;
                        break;
                    case 'M':// Jan - Dec
                        str += f.substr(0, 3);
                        break;
                    case 'F':// January - December
                        str += f;
                        break;
                    case 'd':// 01 - 31
                        if (j < 10) {
                            str += '0' + j;
                        }
                        else {
                            str += j;
                        }
                        break;
                    case 'j':// 1 - 31
                        str += j;
                        break;
                    case 'D':// Sun - Sat
                        str += l.substr(0, 3);
                        break;
                    case 'l':// Sunday - Saturday
                        str += l;
                        break;
                    case 'N':// 1 - 7
                        str += w + 1;
                        break;
                    case 'w':// 0 - 6
                        str += w;
                        break;
                    case 'S':// st, nd, rd or th (works well with j)
                        if (j % 10 == 1 && j != 11) {
                            str += 'st';
                        }
                        else if (j % 10 == 2 && j != 12) {
                            str += 'nd';
                        }
                        else if (j % 10 == 3 && j != 13) {
                            str += 'rd';
                        }
                        else {
                            str += 'th';
                        }
                        break;
                    default:
                        str += cha;
                }
            }
        }
        return str;
    };
    return DatePicker;
}());
if (typeof module !== "undefined" && module.exports) {
    module.exports = DatePicker;
}
if (typeof define === "function") {
    define([], function () {
        return DatePicker;
    });
}
