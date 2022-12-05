import axios from "axios";


export function callAuthApi(api, methodType, params, token) {
  return new Promise((resolve, reject) => {
    let result = {};
    let data = {
        method: methodType,
        headers: { 
            "content-type": "application/json",
            "Authorization": token
        }
    };
    if (methodType === "POST") {
      data.body = JSON.stringify(params);
    }

    try {
        fetch(api,data)
        .then((res) => res.json())
        .then((json) => {
          if (json.status !== 200) {
            result = json;
          } 
            resolve(json);
        });
    } catch (error) {
        result = error;
        console.error('error', error);
        reject(error);
    } finally {
        console.log('api call end');
    }
    return result;
  })
}

export function callApi(api,params) {
  return new Promise((resolve, reject) => {
    let result = {};
    try {
        fetch(api, {
            method: "post",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(params)
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
        console.error('error', error);
        reject(error);
    } finally {
        console.log('api call end');
    }
    return result;
  });
}

export function callQuery(api,params) {
    //   const result = [];
    return new Promise((resolve, reject) => {
      let result = [];
      try {
        fetch(api, {
          method: "post",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({params})
        })
          .then((res) => res.json())
          .then((json) => {
            result = json;
            resolve(result);
          });
      } catch (error) {
        reject(error);
      }
    });
  }

/** 로그인 여부 체크  */
export function isLogin () {
  return !!localStorage.getItem("login-token");
}

/** 오늘날짜 가져오기 */
export function getToday() {
    let today = new Date();   

    let year = today.getFullYear(); // 년도
    let month = today.getMonth() + 1;  // 월
    let date = today.getDate();  // 날짜
    month = (String(month) || '0').length === 1? `0${month}` : month; 
    date = (String(date) || '0').length === 1? `0${date}` : date;
    return (year + '-' + month + '-' + date);
}

export function makeDate(targetDate) {

    let year = targetDate.getFullYear(); // 년도
    let month = targetDate.getMonth() + 1;  // 월
    let date = targetDate.getDate();  // 날짜
    let hours = targetDate.getHours();
    let minutes = targetDate.getHours();

    month = (String(month) || '0').length === 1? `0${month}` : month; 
    date = (String(date) || '0').length === 1? `0${date}` : date;
    hours= (String(hours) || '0').length === 1? `0${hours}` : hours;
    minutes= (String(minutes) || '0').length === 1? `0${minutes}` : minutes;

    return (
      year + "." + month + "."  + date + ". " + hours + "시" + minutes + "분" 
    )


}