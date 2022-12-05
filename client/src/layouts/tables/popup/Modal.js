/* eslint-disable react/prop-types */
import React from 'react';
import './modal.css';
import MDButton from "components/MDButton";

export default class Modal extends React.PureComponent {
   
    render() {
      const {close, open, header, children, callback}  = this.props;
      const sendWork = e => {
          e.preventDefault();
          callback('data');
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
                  <MDButton variant="contained" color="info" onClick={sendWork}>등록하기</MDButton>
                  &nbsp;&nbsp;
                  <MDButton variant="contained" color="info" onClick={close}>close</MDButton>
                </footer>
              </section>
            ) : null}
          </div>
        );
  }
};