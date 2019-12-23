import React, {useRef, useState} from 'react'
import Highlightable from 'highlightable'
import {Popover, Overlay, OverlayTrigger, Button, Row, Col, Modal, Form} from 'react-bootstrap'
import {app_config} from '../config'
import {postRequest as post, getRequest as get} from '../helpers/request'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faEdit} from '@fortawesome/free-solid-svg-icons';
import './Annotation.css'
import ImageAnnotation from 'react-image-annotation/lib';

function Annotation({body, username}) {
  return (
    <>
      <span style={{backgroundColor: "#ddd"}}>{username}</span>
      <hr />
      {body.value}
    </>
  )
}

class AnnotatedText extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      ranges: [],
      popovers: [],
      pointer: false,
      annotating: false,
      annotationAddShow: false,
      annotationText: "",
      annotationRange: {}
    }

    this.handleAnnotationTextChange = this.handleAnnotationTextChange.bind(this)
    this.handleHighlight = this.handleHighlight.bind(this)
  }

  componentDidMount() {
    get({
      url: app_config.annotation_server + "/annotation/article/" + this.props.article._id,
      success: (resp) => this.getUsers(resp),
      authToken: this.props.authToken
    })
  }

  getUsers(annotations) {
    const ranges = this.state.ranges
    const article = this.props.article

    get({
      url: app_config.api_url + "/user",
      success: (resp) => this.constructAnnotations(resp, annotations)
    })
  }

  constructAnnotations(users, annotations) {
    const ranges= this.state.ranges
    const article = this.props.article
    var arr = []

    annotations.map(annotation => {
      const selector = annotation.target.selector
      const format = annotation.target.format
      if (format === "text/plain") {
        arr.push({
          start: selector.start,
          end: selector.end,
          text: article.body.slice(selector.start, selector.end),
          data: {
            body: (
              annotation.body.map(body =>
                <Annotation key={annotation._id} username={this.findUserById(users, body.creator)} body={body}/>
              )
            )
          }
        })
      }
    })
    this.setState({ranges: arr})
    console.log(ranges)
  }

  findUserById(users, id) {
    const user = users.filter(user => user._id === id).shift()
    return user ? user.name + " " + user.surname : "User not found"
  }


  createAnnotation(body, range) {
    const article = this.props.article
    const authToken = this.props.authToken

    post({
      url: app_config.annotation_server + "/annotation",
      success: (resp) => window.location.reload(),
      data: {
        type: "Annotation",
        motivation: "highlighting",
        body: {
          type: "TextualBody",
          value: body,
          purpose: "commenting"
        },
        target: {
          id: article._id,
          format: 'text/plain',
          selector: {
            type: "DataPositionSelector",
            start: range.start,
            end: range.end
          }
        }
      },
      authToken: authToken
    })
  }

  popover(data) {
    return (
      <Popover id="popover-basic">
        <Popover.Content>
          {data.body}
        </Popover.Content>
      </Popover>
    )
  }

  handleAnnotationTextChange(event) {
    this.setState({annotationText: event.target.value})
  }
  handleHighlight(range) {
    if (this.state.pointer){
      this.setState({annotationAddShow: true})
      this.setState({annotationRange: range})
    }
    else console.log("not annotating")

  }

  render() {
    const ranges = this.state.ranges
    const article = this.props.article

    return (
      <>
        <Modal
        show={this.state.annotationAddShow}
        onHide={() => this.setState({annotationAddShow: false})}
        >
          <Modal.Header>
            <Modal.Title>Add an annotation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Row>
                <Col sm={{span: 10}}>
                  <Form.Control type="text" placeholder="..." onChange={this.handleAnnotationTextChange} />
                </Col>
                <Col sm={{span: 2 }}>
                  <Button onClick={() =>
                    this.createAnnotation(this.state.annotationText, this.state.annotationRange)
                  }>Add</Button>
                </Col>
              </Row>
            </Form>
          </Modal.Body>
        </Modal>

        <Row>
          <div
          className={this.state.pointer ? "annotation-button-active" : "annotation-button-disabled"}
          onClick={() => this.setState({pointer: !this.state.pointer})}
          >
          <FontAwesomeIcon name="Annotate" icon={faEdit} />
          &nbsp;{this.state.pointer ? "Stop" : "Start"} Annotating
          </div>
          {this.state.pointer ? <span style={{marginLeft: 10}}><i>Select some text to annotate</i></span> : ""}
        </Row>
        <Row className={this.state.pointer? "cursor-text" : "cursor-default"}>
          <Highlightable
          ranges={ranges}
          enabled={true}
          highlightStyle={{backgroundColor: '#ffcc80'}}
          onTextHighlighted={this.handleHighlight}
          text={article.body}
          rangeRenderer={(nodes, range, index, onHiglight) => {
            nodes = nodes.map(node =>
              <span key={node.key}>
              <OverlayTrigger
                placement="right"
                delay={{ show: 250, hide: 400 }}
                overlay={this.popover(range.data)}
              >
               <span onClick={() => {
                 if (this.state.pointer) {
                   this.setState({annotationRange: range, annotationAddShow: true})
                 }
               }}>{node}</span>
              </OverlayTrigger>
              </span>
            )
            return nodes
          }}
          />
        </Row>
      </>
    )
  }
}

class AnnotatedImage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      annotations: [],
      annotation: {}
    }
    this.onChange = this.onChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  componentDidMount() {
    get({
      url: app_config.annotation_server + "/annotation/article/" + this.props.article._id,
      success: (resp) => this.getUsers(resp),
      authToken: this.props.authToken
    })
  }

  onChange(annotation) {
    this.setState({annotation})
  }
  onSubmit(annotation) {
    const { geometry, data } = annotation

    this.setState({
      annotation: {},
      annotations: this.state.annotations.concat({
        geometry,
        data: {
          ...data,
          id: Math.random()
        }
      })
    })
  }

  render(){
    return (
      <ImageAnnotation
        src={this.props.src}
        annotations={this.state.annotations}
        type={this.state.type}
        value={this.state.annotation}
        onChange={this.onChange}
        onSubmit={this.onSubmit}
      />
    )
  }
}

export {AnnotatedText, AnnotatedImage}
