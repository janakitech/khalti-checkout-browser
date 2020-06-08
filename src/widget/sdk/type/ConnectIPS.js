import React, { useState } from "react";
import { ebanking_initiation_api, queryToString } from "../constants/APIS";
import {CONNECT_IPS_BANNER} from '../../../assets/constants';

import * as styles from "./BankStyles.css";

const ConnectIPS = ({
  public_key,
  product_identity,
  product_name,
  amount,
  product_url,
}) => {
  const [mobile, setMobileNumber] = useState(null);
  const [errMobile, setErrMobile] = useState(false);

  const changeMobile = () => {
    setMobileNumber(event.target.value);
  };
  const initiatePay = async () => {
    event.preventDefault();
    0;
    if (mobile && mobile.toString().length == 10) {
      setErrMobile(false);

      try {
        var myWindow = window.open(
          `${ebanking_initiation_api}?${queryToString({
            public_key,
            product_identity,
            product_name,
            amount,
            payment_type: "connectips",
            bank: "connectips",
            source: "web",
            mobile,
            product_url,
          })}`
        );
      } catch (err) {
        console.log(err, "--err");
      }
    } else {
      setErrMobile(true);
    }
  };
  return (
    <div className={styles.tabHeight}>
      <div className="ui grid centered">
        <div className="twelve wide computer sixteen wide mobile column">
          <div className="ui padded basic segment">
            {" "}
            <div
              className={styles.bannerImage}
              style={{
                backgroundImage:
                  `url(${CONNECT_IPS_BANNER})`,
              }}
            ></div>
            <form className="ui form">
              <div className="field">
                <input
                  type="text"
                  name="first-name"
                  placeholder=" Mobile Number"
                  onChange={changeMobile}
                />
                {errMobile && (
                  <div class="ui negative message">
                    <p>Please enter a valid mobile number.</p>
                  </div>
                )}
              </div>
              {amount && (
                <button
                  className="ui button primary"
                  type="submit"
                  onClick={initiatePay}
                >
                  Pay Rs. {amount / 100} /-
                </button>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectIPS;
