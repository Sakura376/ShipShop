import React from "react";
import Products from "../components/ProductCard/Products";
import SliderController from "../components/Slider/SliderController";
import Header from "../components/Header/Header"; 

const Home = () => {
  return (
    <div>
      <main>
        <Header />
        <Products />
        <SliderController />
      </main>
    </div>
  );
};

export default Home;
