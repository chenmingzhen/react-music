/*时间戳转换*/
export function timestampToTime(timestamp, exact = false) {
  let l = timestamp.toString().length;
  let date;
  // coldplay 1584288000000
  //时间戳为10位需*1000，时间戳为13位的话不需乘1000
  if (l === 10) {
    date = new Date(timestamp * 1000);
  } else {
    date = new Date(timestamp);
  }
  let Y = date.getFullYear() + "-";
  let M =
    (date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1) + "-";
  let D = (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + " ";
  let h =
    (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":";
  let m =
    (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) +
    ":";
  let s = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
  if (!exact) {
    return Y + M + D;
  }
  return Y + M + D + h + m + s;
}

export function formatDuration(mss) {
  //let days = parseInt(mss / (1000 * 60 * 60 * 24));
  //let hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  let minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
  let seconds = Math.floor((mss % (1000 * 60)) / 1000);
  if (minutes < 10) minutes = "0" + minutes;
  if (seconds < 10) seconds = "0" + seconds;
  return minutes + ":" + seconds;
}

export function highlightWord(text, search) {
  let keywords = text;
  const cut = keywords.split(new RegExp(search, "ig"));
  const tmp = new RegExp(search, "ig").exec(keywords); //用于英文的大小写
  return cut.join('<span style="color:#1E90FF;">' + tmp + "</span>");
}
