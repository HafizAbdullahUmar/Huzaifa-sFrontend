import { Container } from "@mui/system";
import React from "react";
import useKhataStore from "../store/khataStore";

const YouwillPay = () => {
  const { willGive } = useKhataStore((state) => ({
    willGive: state.willGive,
  }));
  return (
    <>
      <Container className="mt-5 purchase-div">
        <h3>You will Pay</h3>
        <p>{Math.abs(willGive)}</p>
      </Container>
    </>
  );
};

export default YouwillPay;
