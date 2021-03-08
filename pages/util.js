function js_date_time(unixtime) {
  var dateTime = new Date((unixtime))
  var year = dateTime.getFullYear();
  var month = dateTime.getMonth() + 1 > 9 ? dateTime.getMonth() + 1 : '0' + (dateTime.getMonth() + 1);
  var day = dateTime.getDate() > 9 ? dateTime.getDate() : '0' + dateTime.getDate();
  var hour = dateTime.getHours() > 9 ? dateTime.getHours() :'0' + dateTime.getHours();
  var minute = dateTime.getMinutes() > 9 ? dateTime.getMinutes() : '0' + dateTime.getMinutes();
  var second = dateTime.getSeconds() > 9 ? dateTime.getSeconds() : '0' + dateTime.getSeconds();
  var now = new Date();
  var now_new = Date.parse(now.toDateString());  //typescript转换写法
  var milliseconds = now_new - dateTime;
  var timeSpanStr = year + '-' + month + '-' + day + ' ' + hour + ':' + minute;
  return timeSpanStr;
}
module.exports = {
  js_date_time: js_date_time
}
