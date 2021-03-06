import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import "../../semantic-ui/semantic.less";
import SDK from "./sdk";

import { host_ip_address } from "./sdk/constants/APIS";

import {
  EBANKING,
  MOBILE_BANKING,
  KHALTI,
  CONNECT_IPS,
  SCT,
} from "./sdk/constants/literal";

const Widget = () => {
  const [passed_props, setProps] = useState(null);
  const hideModal = () => {
    const data = {widget_id: window.activeWidget};
    window.parent.postMessage({ realm: "hide", payload: data}, "*");
  };

  const receiveMessage = ({data, origin}) => {
    if (!data.realm) {
      return;
    } else if (data.realm === 'paymentInfo') {
      if (data.payload) {
        let payload = JSON.parse(JSON.stringify(data.payload));
        window.activeWidget = data.payload.widgetId
        setProps(payload);
      }
    } else if (data.realm === 'ebankingResponse') {
      if (data.payload && data.payload.idx) {
        window.parent.postMessage(
          { realm: "walletPaymentVerification", payload: {widget_id: window.activeWidget, ...data.payload} },
          "*"
        );
      } else {
        window.parent.postMessage({ realm: "widgetError", payload: data.payload.idx }, "*");
      }
    }

  };

  // const receiveMessage = ({data, origin}) => {
  //   console.log(data, origin, host_ip_address)
  //   if (data && data.payload) {
  //     let payload = JSON.parse(JSON.stringify(data.payload));
  //     window.activeWidget = data.payload.widgetId
  //     setProps(payload);
  //   }

  //   if (origin !== host_ip_address) return;

  //   let _data = data;
  //   if (_data && _data.realm && _data.realm === 'paymentInfo') return;
  //   if (typeof data === 'string') {
  //     _data = JSON.parse(data)
  //   }
  //   _data.widget_id = window.activeWidget;
  //   if (_data && _data.idx) {
  //     window.parent.postMessage(
  //       { realm: "walletPaymentVerification", payload: _data },
  //       "*"
  //     );
  //   } else {
  //     window.parent.postMessage({ realm: "widgetError", payload: _data }, "*");
  //   }
  // };

  useEffect(() => {
    window.addEventListener("message", receiveMessage, false);
    return () => {
      window.removeEventListener("message", receiveMessage);
    };
  }, []);

  useEffect(() => {
    window.parent.postMessage({ realm: "widgetLoad", payload:  {...passed_props, loaded: true}}, "*");
  }, []);

  return (
    <React.Fragment>
      {passed_props && Object.keys(passed_props).length && (
        <SDK {...passed_props} hideModal={hideModal} />
      )}
    </React.Fragment>
  );
};

ReactDOM.render(<Widget />, document.getElementById("index"));
