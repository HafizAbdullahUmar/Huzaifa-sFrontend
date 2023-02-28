import { Container } from "@mui/material";
import React from "react";
import useKhataStore from "../store/khataStore";

const YouwillRecieve = () => {
  const { willRecieve } = useKhataStore((state) => ({
    willRecieve: state.willRecieve,
  }));
  return (
    <>
      <Container className="mt-5 purchase-div">
        <h3>You will Recieve</h3>
        <p>{Math.abs(willRecieve)}</p>
      </Container>
    </>
  );
};

export default YouwillRecieve;
