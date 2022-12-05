/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
// import MDButton from "components/MDButton";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

import MDInput from "components/MDInput";
import Modal from "./popup/Modal";

import * as common from "../../utils/utils";

function Reservation() {
  // 전역변수
  const rightFloat = { float: "right" };
  // state 관리
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [revDate, setRevDate] = useState("");
  const [revTimeFrom, setRevTimeFrom] = useState("00:00");
  const [revTimeTo, setRevTimeTo] = useState("00:00");
  const [booker, setBooker] = useState("");
  // const [calendarData, setCalendarData] = useState([
  //   { title: "10:00~11:00 SF회의", date: "2022-07-20" },
  //   { title: "11:00~12:00 TD회의", date: "2022-07-20" },
  //   { title: "12:00~13:00 주간업무회의", date: "2022-07-20" },
  //   { title: "14:00~15:00 OJT", date: "2022-07-21" },
  // ]);
  const [calendarData, setCalendarData] = useState();

  useEffect(async () => {
    let data = [];
    const queryStr = "SELECT from_date, to_date, booker, title, date FROM reservation";
    data = await common.callQuery(queryStr);
    setCalendarData(data);
    // fetch("http://10.106.16.67:3001/callQuery", {
    //   method: "post",
    //   headers: {
    //     "content-type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     query: "SELECT from_date, to_date, booker, title, date FROM reservation",
    //   }),
    // })
    //   .then((res) => res.json())
    //   .then((json) => {
    //     setCalendarData(json);
    //   });
  }, []);

  // const handleDarkSidenav = () => {
  //   fetch("http://10.106.16.67:3001/callQuery", {
  //     method: "post",
  //     headers: {
  //       "content-type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       query: "SELECT from_date, to_date, booker, title, date FROM reservation",
  //     }),
  //   })
  //     .then((res) => res.json())
  //     .then((json) => {
  //       setCalendarData(json);
  //     });
  // };
  const handleDateClick = (data) => {
    // bind with an arrow function
    setCalendarOpen(true);
    setRevDate(data.dateStr);

    console.log("data >> ", data);
  };

  const handleEventClick = (e) => {
    e.jsEvent.preventDefault();

    const eventObj = e.event;
    const eventDetail = eventObj.extendedProps;

    setTitle(eventObj.title);
    setBooker(eventDetail.booker);
    setRevDate("");
    setRevTimeFrom(common.makeTimeFormat(eventDetail.from_date, ""));
    setRevTimeTo(common.makeTimeFormat(eventDetail.to_date));
    setCalendarOpen(true);

    console.log("event Obj", e);
    console.log("org toDate", String(eventDetail.to_date));
    console.log("obj", eventObj);
    console.log("title", eventObj.title);
  };

  const renderEventContent = (eventInfo) => (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </>
  );

  // 예약명, 예약자 등 데이터 초기화
  const initData = () => {
    setTitle("");
    setBooker("");
    setRevDate("");
    setRevTimeFrom("");
    setRevTimeTo("");
  };

  // Reservation 테이블 데이터 입력
  const insertData = () => {
    const params = {
      from_date: revTimeFrom,
      to_date: revTimeTo,
      booker,
      title,
      revDate,
    };
    fetch("http://localhost:3001/insertRevData", {
      method: "post",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(params),
    }).then((res) => {
      if (String(res.status || "200") !== "200") {
        console.error("error", res);
      } else {
        console.log("success", res);
      }
    });
  };

  // 회의실예약 팝업창 닫힐 때
  const closeCalendar = () => {
    initData();
    setCalendarOpen(false);
  };

  // 회의실 예약버튼 눌렀을 때
  const bookMeetingRoom = () => {
    const makeTitle = () => `${revTimeFrom}~${revTimeTo}  ${title}`;

    setCalendarData([
      ...calendarData,
      {
        title: makeTitle(),
        date: revDate,
      },
    ]);
    insertData();
    initData();
  };

  // 회의실예약 calendar 콜백
  const callbackCalendar = () => {
    console.log("callback calendar");

    if ((title || "") === "") {
      alert("예약명은 필수입력 항목입니다");
      return;
    }

    if ((booker || "") === "") {
      alert("예약자는 필수입력 항목입니다");
      return;
    }

    if ((revTimeFrom || "") === "") {
      alert("예약시작 시간은 필수입력 항목입니다");
      return;
    }

    if ((revTimeTo || "") === "") {
      alert("예약종료 시간은 필수입력 항목입니다");
      return;
    }

    bookMeetingRoom();
    setCalendarOpen(false);
  };

  // 회의실 예약명칭 변경 시
  const changeTitle = (e) => {
    e.preventDefault();
    setTitle(e.target.value);
  };

  // 회의실 예약시작 시간 변경 시
  const changeRevTimeFrom = (e) => {
    e.preventDefault();
    setRevTimeFrom(e.target.value || "");
  };

  // 회의실 예약종료 시간 변경 시
  const changeRevTimeTo = (e) => {
    e.preventDefault();
    setRevTimeTo(e.target.value || "");
  };

  // 예약자 변경 시
  const changeBooker = (e) => {
    e.preventDefault();
    setBooker(e.target.value || "");
  };

  // var calProps = {
  //   plugins : [ 'interaction', 'dayGrid' ] //월 캘린더

  //   , header : { left  :''
  //       , center : 'title'
  //       , right : ''//'prevYear,prev,next,nextYear'
  //          }
  //   //, locale : 'ko' // 한국어 설정이다. 하지만 date Cell 포맷팅이 어려우니 그냥 주석으로
  //   , titleFormat : function(date) { // title 설정
  //     return date.date.year +"년 "+(date.date.month +1)+"월";
  //     }
  //   , columnHeaderText : function(date) {
  //     return weekList[date.getDay()]; // 헤더 var weekList = ['일','월','화','수','목','금','토'];
  //       } , defaultDate : strToday // 기준일자
  //   , editable : false
  //   , eventLimit : true // allow "more" link when too many events
  //   , height  : 'parent'
  //   // , eventColor : '#5c6a96' // 이벤트 색상
  //   , eventBorderColor : '#5c6a96'
  //   , eventBackgroundColor : '#ffffff'
  //   , events : eventData
  //   , eventClick : fn_calEventClick // 이벤트 클릭 시
  //   , dateClick : fn_calDateClick // 백그라운드 클릭시
  //   , droppable : true // this allows things to be dropped onto the calendar
  //   , drop : fn_calDrop  // 그리드에서 긁어올 때
  //   // , eventAllow :function (dropInfo, draggedEvent) { //드롭 가능한 위치 설정
  //   // , dropAccept : '.cool-event' // 긁어올 수 있는 draggable 설정
  //   // , eventReceive : function (event, xhr) { debugger; return false;    } // drag 종료 시
  //   // , eventOverlap: function(stillEvent, movingEvent) {debugger; return false;    } // 이벤트가 겹칠 때
  //   // , eventSourceSuccess : function(content, xhr) {debugger; return false;    }
  //   // , eventDragStop : function(stillEvent, movingEvent) {debugger; return false;    }
  //   // , eventDrop  : function(stillEvent, movingEvent) {debugger; return false;    }
  //       };
  //   calendarId = new FullCalendar.Calendar(calendarEl, calProps );
  //   calendarId.render();

  return (
    <DashboardLayout>
      {/* <MDButton color="dark" variant="gradient">
        DB Connecting
      </MDButton> */}
      <div className="App">
        <FullCalendar
          initialView="dayGridMonth"
          locale="ko"
          plugins={[dayGridPlugin, interactionPlugin]}
          events={calendarData}
          dateClick={handleDateClick}
          eventContent={renderEventContent}
          dayMaxEventRows={4}
        />
      </div>

      <Modal
        open={calendarOpen}
        close={closeCalendar}
        header="회의실예약"
        callback={callbackCalendar}
      >
        <div>
          예약명
          <span style={rightFloat}>
            {(title || "") !== "" ? (
              <MDInput
                success
                id="title"
                style={{ width: "16em" }}
                onChange={changeTitle}
                type="text"
                value={title}
              />
            ) : (
              <MDInput
                error
                id="title"
                style={{ width: "16em" }}
                onChange={changeTitle}
                type="text"
                value={title}
              />
            )}
          </span>
        </div>
        <div>&nbsp;</div>
        <div>
          예약일{" "}
          <span style={rightFloat}>
            <MDInput type="date" label="예약일" value={revDate} disabled />{" "}
          </span>
        </div>
        <div>&nbsp;</div>
        <div>
          예약시간{" "}
          <span style={rightFloat}>
            <MDInput type="time" value={revTimeTo} onChange={changeRevTimeTo} />
          </span>
          <span style={rightFloat}>
            <MDInput type="time" value={revTimeFrom} onChange={changeRevTimeFrom} />
            &nbsp;-&nbsp;
          </span>
        </div>
        <div>&nbsp;</div>
        <div>
          예약자
          <span style={rightFloat}>
            {(booker || "") !== "" ? (
              <MDInput
                success
                id="booker"
                style={{ width: "16em" }}
                onChange={changeBooker}
                type="text"
                value={booker}
              />
            ) : (
              <MDInput
                error
                id="booker"
                style={{ width: "16em" }}
                onChange={changeBooker}
                type="text"
                value={booker}
              />
            )}
          </span>
        </div>
        <div>&nbsp;</div>
      </Modal>
    </DashboardLayout>
  );
}

export default Reservation;
