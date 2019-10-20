import React from "react";
import "./EconEvent.css";
import {Editor, EditorState, RichUtils} from 'draft-js';
import 'draft-js/dist/Draft.css';
import {useParams} from 'react-router-dom';
import $ from 'jquery';

class EconEvent extends React.Component{
    constructor(props){
        super(props);
        this.state = {econevent:{}, star:{}};
        let temp = Math.floor(Math.random() * 5)+1 ; 
        var ar = ["star-outline","star-outline","star-outline","star-outline","star-outline"];
        for (let i = 0; i < temp; i++) {
            ar[i] = "star";
        }
        this.state.star = ar;
       
    }
    componentDidMount(){
        fetch('https://jsonplaceholder.typicode.com/posts/1')
        .then(response => response.json())
        .then(json => {
          console.log(json);
          this.setState({econevent: json});
        });  
    }

    render(){
        var econevent = this.state.econevent;
        return (
        <div className="container">
            <div className="row">
            <div className="col-6 offset-3">
                <div className="row">
                <h3>{econevent.title}</h3>
                </div>
                <div className="row">
                <div className="econevent"> {econevent.body} </div>
                </div>
                <div className="row">
                <ion-icon name = {this.state.star[0]}></ion-icon>
                <ion-icon name = {this.state.star[1]}></ion-icon>
                <ion-icon name = {this.state.star[2]}></ion-icon>
                <ion-icon name = {this.state.star[3]}></ion-icon>
                <ion-icon name = {this.state.star[4]}></ion-icon>
                
                </div>

                
            </div>
            </div>
        </div>
        );
    }
}
export default EconEvent;


























