import React, { Component } from 'react';
import Navigation from './componnents/Navigation';
import ImageLinkForm from './componnents/ImageLinkForm';
import Rank from './componnents/Rank';
import FaceRec from './componnents/FaceRec/FaceRec';
import './App.css';
import Particles from 'react-particles-js';

const Clarifai = require('clarifai');
      
// Instantiate a new Clarifai app by passing in your API key.
const app = new Clarifai.App({apiKey: '867cbc9dfc044364a4ed93128a3cbf54'});

const particelsOptions ={
particles: {
      value:40,
      density:{
        enable:true,
        value_area:800
      }

}} ;


class App extends Component {
constructor(){
  super();
  this.state = {
    input: '',
    imageurl:'',
    famousname:'',
    box: [{}],
    personDetails:""
  }
}

calculateFaceLocation = (data) => {
  const output = data.outputs[0].data;
  let personDetails = {};
  if(data.outputs[0].data.regions.length === 1)
  {
    personDetails = 
    {
      age: output.regions[0].data.concepts[0].name,
      gender: output.regions[0].data.concepts[20].name,
      demogrhafics: output.regions[0].data.concepts[22].name

    }

  }
  console.log(personDetails)
  console.log(data);
  const boundingarray = data.outputs[0].data.regions.map(r =>  {
    return (
      {
      top: r.region_info.bounding_box.top_row*500,
      left: r.region_info.bounding_box.left_col*500,
      bottom: 500 - r.region_info.bounding_box.bottom_row*500,
      right: 500 - r.region_info.bounding_box.right_col*500
      }
      )
  });
  return {
          box:boundingarray , 
          pepoleD: personDetails
         } 

}

//apiceleb cant update state
apiceleb = (url) => {
  app.models.predict("e466caa0619f444ab97497640cefc4dc", url).then(
    function(response) {
      let x = response.outputs[0].data.regions[0].data.concepts[0].name;
      console.log(x);
      return x; 
    },
    function(err) {
    }
  );
}
//updates the input prop
onInputChange = (event) => {
  this.setState({input: event.target.value });
}


displayfacebox = (obj) => {
  this.setState({box: obj.box});
  this.setState({personDetails: `We estimate the person in the picture details as followes: age- ${obj.pepoleD.age} , gender- ${obj.pepoleD.gender} , demogrhafics- ${obj.pepoleD.demogrhafics}`}); 
}


onButtonClick = () => {
   this.setState({imageUrl: this.state.input});
  app.models.predict("c0c0ac362b03416da06ab3fa36fb58e3", this.state.input)
  .then(response => this.displayfacebox(this.calculateFaceLocation(response)))
  .catch(err => alert("image url can't be reached, try to use different image or address"));

  // app2.models.predict("c0c0ac362b03416da06ab3fa36fb58e3", this.state.input)
  // .then(response => console.log(response))
  // .catch(err => alert("image url can't be reached, try to use different image or address"));

}
render(){
  return(
    <div>
      <Particles className='particels' params={particelsOptions}/>
      <Navigation/>
      <Rank personDetails={this.state.personDetails} famousname={this.famousname}/>
      <ImageLinkForm onButtonClick={this.onButtonClick} onInputChange={this.onInputChange}/>
      <FaceRec  box={this.state.box} imgurl={this.state.input}/>
    </div>
  );
}
}
    



export default App;
