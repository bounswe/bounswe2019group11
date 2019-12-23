import React from 'react'
import {instanceOf} from 'prop-types'
import $ from 'jquery';
import {app_config} from "../config";
import axios, { post } from 'axios';
import {withCookies, Cookies} from 'react-cookie'

class SimpleReactFileUpload extends React.Component {
    static propTypes = {cookies: instanceOf(Cookies).isRequired};
    constructor(props) {
        super(props);
       // const loggedIn = !!cookies.get('userToken');
        this.state ={
            file:null
        }
        this.onFormSubmit = this.onFormSubmit.bind(this)
        this.onChange = this.onChange.bind(this)
        this.fileUpload = this.fileUpload.bind(this)
    }
    onFormSubmit(e){
        let {cookies} = this.props
        e.preventDefault() // Stop form submit
        this.fileUpload(this.state.file).then((response)=>{
            console.log(response.data);
            cookies.set('user', response.data.user)
        })
    }
    onChange(e) {
        this.setState({file:e.target.files[0]})
    }
    fileUpload(file){

        const authToken = this.props.authToken;
        axios.defaults.headers.common['Authorization'] = "Bearer " + authToken;
        const url = app_config.api_url + '/upload/avatar';
        const formData = new FormData();
        formData.append('avatar',file)
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        }
        return  post(url, formData,config)
    }

    render() {
        return (
            <form onSubmit={this.onFormSubmit}>
                <input  type="file"  onChange={this.onChange} />
                <button class="ui green basic button"  type="submit">Upload</button>
            </form>
        )
    }
}



export default withCookies(SimpleReactFileUpload)
