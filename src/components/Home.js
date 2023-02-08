import React from "react";
import Container from "react-bootstrap/esm/Container";
import Sellitem from "./Sellitem";

const Home = () => {
  return (
    <>
      <Container className="mt-5">
        <Sellitem />
      </Container>
    </>
  );
};

export default Home;
