/* eslint-disable react/prop-types */
import React from 'react';
import './modal.css';
import MDButton from "components/MDButton";

/**
 * @see   회의실예약_팝업창
 */
export default class Modal extends React.PureComponent {
   
    render() {
      const {close, open, header, children, callback}  = this.props;
      
      const book = e => {
          e.preventDefault();
          callback();
      }

      return (
          // 모달이 열릴때 openModal 클래스가 생성된다.
          <div className={open ? 'openModal modal' : 'modal'} >
            {open ? (
              <section>
                <header>
                  {header}
                  <button type="button" className="close" onClick={close} >
                  &times;
                  </button>
                </header>
                <main>{children}</main>
                <footer>
                  <MDButton variant="contained" color="info" onClick={book}>예약하기</MDButton>
                  &nbsp;&nbsp;
                  <MDButton variant="contained" color="info" onClick={close}>close</MDButton>
                </footer>
              </section>
            ) : null}
          </div>
        );
  }
};