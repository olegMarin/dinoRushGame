import React, { Component } from "react";
import Lottie from 'react-lottie';
import * as defaultData from '../assets/lotties/dinorush.json'
import * as bookData from '../assets/lotties/dinoBook.json'
import * as glassesData from '../assets/lotties/dinoGlasses.json'
import * as bookGlassesData from '../assets/lotties/dinoGlassesBook.json'

export default function Dino(props) {


  let defaultOptions = {
      loop: true,
      autoplay: true, 
      animationData: defaultData,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
      }
    }; 

    switch(props.type) {
      case 'default':
        defaultOptions.animationData = defaultData
        break;
      
      case 'book':
        defaultOptions.animationData = bookData
        break;

      case 'glasses':
        defaultOptions.animationData = glassesData
        break;

      case 'book_glasses':
        defaultOptions.animationData = bookGlassesData
        break;

      default:
        defaultOptions.animationData = defaultData
    }
         return (
          <Lottie options={defaultOptions}
                  height={159}
                  width={167}
                  isStopped={props.isStopped}
                  isPaused={props.isPaused}
                  style={{overflow: 'visible', paddingTop: 26}}/>
                  
        );
    
}
