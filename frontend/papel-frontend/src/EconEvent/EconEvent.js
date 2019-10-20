import React from "react";
import "./EconEvent.css";
import {Editor, EditorState, RichUtils} from 'draft-js';
import 'draft-js/dist/Draft.css';
import {useParams} from 'react-router-dom';
import $ from 'jquery';

class EconEvent extends React.Component{
    constructor(props){
        super(props);
        this.state = {econevent:{}, star:0};
        var temp = Math.floor(Math.random() * 6) ;
        this.setState({star: temp});
        var stars = "";
        for (let i = 0; i < temp; i++) {
            stars+=<ion-icon name="heart"></ion-icon>;
        }
        
        this.state.star = stars;
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
                {this.state.star}
                </div>

                
            </div>
            </div>
        </div>
        );
    }
}
export default EconEvent;


























