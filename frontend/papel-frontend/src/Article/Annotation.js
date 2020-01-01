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
    <div style={{backgroundColor: "#ada", marginTop: 4, borderRadius: 2}}>
      <div style={{backgroundColor: "#333", color: "#ddd"}}>{username}</div>
      {body.value}
    </div>
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
      annotationRange: {},
      newAnnotation: true,
      annotations: []
    }

    this.handleAnnotationTextChange = this.handleAnnotationTextChange.bind(this)
    this.handleHighlight = this.handleHighlight.bind(this)
  }

  componentDidMount() {
    get({
      url: app_config.annotation_server + "/annotation/article/" + this.props.article._id,
      success: (resp) => {
        this.setState({annotations: resp})
        this.getUsers(resp)
      },
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
    console.log(annotations)

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
                <Annotation key={annotation._id} username={body.creator.name + " " + body.creator.surname} body={body}/>
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
    if (this.state.newAnnotation) {
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
    else {
      const thisAnnotation = this.state.annotations.filter(annotation => annotation.target.selector.start === range.start)[0]
      const data = {
      }
      post({
        url: app_config.annotation_server + "/annotation/" + thisAnnotation._id,
        data: {
          type: "TextualBody",
          value: body,
          purpost: "commenting"
        },
        success: (resp) => window.location.reload(),
        authToken: authToken
      })
    }
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
      this.setState({
        annotationAddShow: true,
        annotationRange: range,
        newAnnotation: true
      })
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
          {this.state.pointer ? <span style={{marginLeft: 10}}><i>Select some text to annotate. Click on highlighted annotations to comment on them</i></span> : ""}
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
                   this.setState({annotationRange: range, annotationAddShow: true, newAnnotation: false})
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
    console.log(this.props.articleId)
    this.onChange = this.onChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  componentDidMount() {
    get({
      url: app_config.annotation_server + "/annotation/article/" + this.props.articleId,
      success: (resp) => this.handleAnnotations(resp),
      authToken: this.props.authToken
    })
  }

  handleAnnotations(annotations) {
    var imageAnnotations = annotations.filter(annotation => annotation.target.format.includes("image"))
    var stateAnnotations = imageAnnotations.map((annotation) => {
      const xywh = annotation.target.selector.value
        .split("=")[1]
        .split(",")
        .map(s => parseFloat(s))
      const geometry = {
        type: "RECTANGLE",
        x: xywh[0],
        y: xywh[1],
        width: xywh[2],
        height: xywh[3]
      }
      const data = {text: annotation.body[0].value}
      const username = annotation.creator.name + " " + annotation.creator.surname
      this.setState({
        annotation: {},
        annotations: this.state.annotations.concat({
          geometry,
          data: {
            ...data,
            username: username,
            id: Math.random()
          }
        })
      })
    })
  }

  onChange(annotation) {
    this.setState({annotation})
  }
  onSubmit(annotation) {
    const { geometry, data } = annotation
    const articleId = this.props.articleId
    const geometryValue = "xywh=" + geometry.x + "," + geometry.y + "," + geometry.width + "," + geometry.height

    post({
      url: app_config.annotation_server + "/annotation",
      data: {
        type: "Annotation",
        motivation: "highlighting",
        body: {
          type: "TextualBody",
          value: data.text,
          purpose: "commenting"
        },
        target: {
          id: articleId,
          format: 'image/jpeg',
          selector: {
            type: "FragmentSelector",
            conformsTo: "http://www.w3.org/TR/media-frags/",
            value: geometryValue
          }
        }
      },
      success: (resp) => {
        console.log(resp)
        this.setState({
          annotation: {},
          annotations: this.state.annotations.concat({
            geometry,
            data: {
              ...data,
              username: resp.body[0].creator.name + " " + resp.body[0].creator.surname,
              id: Math.random()
            }
          })
        })
      },
      authToken: this.props.authToken
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
        renderContent={({key, annotation}) => (
          <div style={{
            position: 'absolute',
            left: `${annotation.geometry.x}%`,
            top: `${annotation.geometry.y + annotation.geometry.height}%`
          }}>
            <div style={{backgroundColor: "#333", color: "white"}}>{annotation.data.username}</div>
            <div style={{backgroundColor: "#ada", color: "black"}}>{annotation.data.text}</div>
          </div>
        )}
      />
    )
  }
}

export {AnnotatedText, AnnotatedImage}
