export function callAuthApi(api, methodType, params, token) {
  return new Promise((resolve, reject) => {
    let result = {};
    let data = {
      method: methodType,
      headers: {
        "content-type": "application/json",
        Authorization: token,
      },
    };
    if (methodType === "POST") {
      data.body = JSON.stringify(params);
    }

    try {
      fetch(api, data)
        .then((res) => res.json())
        .then((json) => {
          if (json.status !== 200) {
            result = json;
          }
          resolve(json);
        });
    } catch (error) {
      result = error;
      console.error("error", error);
      reject(error);
    } finally {
      console.log("api call end");
    }
    return result;
  });
}

export function callApi(api, params) {
  return new Promise((resolve, reject) => {
    let result = {};
    try {
      fetch(api, {
        method: "post",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(params),
      })
        .then((res) => res.json())
        .then((json) => {
          if (json.status !== 200) {
            result = json;
          }
          resolve(json);
        });
    } catch (error) {
      result = error;
      console.error("error", error);
      reject(error);
    } finally {
      console.log("api call end");
    }
    return result;
  });
}

/** 로그인 여부 체크  */
export function isLogin() {
  return !!localStorage.getItem("login-token");
}

/** 오늘날짜 가져오기 */
export function getToday() {
  let today = new Date();

  let year = today.getFullYear(); // 년도
  let month = today.getMonth() + 1; // 월
  let date = today.getDate(); // 날짜
  month = (String(month) || "0").length === 1 ? `0${month}` : month;
  date = (String(date) || "0").length === 1 ? `0${date}` : date;
  return year + "-" + month + "-" + date;
}

export function makeDate(targetDate) {
  let year = targetDate.getFullYear(); // 년도
  let month = targetDate.getMonth() + 1; // 월
  let date = targetDate.getDate(); // 날짜
  let hours = targetDate.getHours();
  let minutes = targetDate.getHours();

  month = (String(month) || "0").length === 1 ? `0${month}` : month;
  date = (String(date) || "0").length === 1 ? `0${date}` : date;
  hours = (String(hours) || "0").length === 1 ? `0${hours}` : hours;
  minutes = (String(minutes) || "0").length === 1 ? `0${minutes}` : minutes;

  return year + "." + month + "." + date + ". " + hours + "시" + minutes + "분";
}

export const makeWorkRequestListColumn = (
  [
    { field: "id", headerName: "요청ID", flex: 1 },
    { field: "title", headerName: "제목", flex: 1 },
    { field: "requestedBy", headerName: "작성자", flex: 1 },
    { field: "date", headerName: "작성일시", flex: 1 },
    { field: "totList", headerName: "헤더 왜 안사라짐", flex: 1, hide: true },
  ]
)

export function makeWorkRequestListRows(workRequestList) {
  return Array.isArray(workRequestList)
    ? workRequestList.map((v, i) => {
        return {
          id: v["id"],
          title: v["title"] || "",
          requestedBy: v["requestedBy"],
          date: makeDate(new Date(v["createdAt"])),
          totList: v,
        };
      })
    : {
        id: workRequestList["id"],
        title: workRequestList["title"] || "",
        requestedBy: workRequestList["requestedBy"],
        date: makeDate(new Date(workRequestList["createdAt"])),
        totList: workRequestList,
      };
}

export function isFunc (func) {
  return (typeof func == 'function');
}
