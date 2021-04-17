import React, { Component } from "react";
import Lottie from 'react-lottie';
import * as animationData from '../assets/lotties/dinorush.json'

export default function Dino(props) {


  const defaultOptions = {
      loop: true,
      autoplay: true, 
      animationData: animationData,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
      }
    }; 

    return (
      <Lottie options={defaultOptions}
              height={150}
              width={150}
              isStopped={this.state.isStopped}
              isPaused={this.state.isPaused}/>

    );
  
}
