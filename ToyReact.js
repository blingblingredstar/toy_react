class ElementWrapper {
  constructor(type) {
    this.element = document.createElement(type)
  }
  setAttribute(name, value) {
    if (name.match(/^on([\s\S]+)$/)) {
      const eventName = RegExp.$1.replace(/^[\s\S]/, (s) => s.toLowerCase())
      this.element.addEventListener(eventName, value)
    }
    if (name === 'className') {
      name = 'class'
    }
    this.element.setAttribute(name, value)
  }
  appendChild(vChild) {
    const range = document.createRange()
    if (this.element.children.length) {
      range.setStartAfter(this.element.lastChild)
      range.setEndAfter(this.element.lastChild)
    } else {
      range.setStart(this.element, 0)
      range.setEnd(this.element, 0)
    }
    vChild.mountTo(range)
  }
  /**
   * @param {Range} range
   */
  mountTo(range) {
    range.deleteContents()
    range.insertNode(this.element)
    this.range = range
  }
}

class TextWrapper {
  constructor(content) {
    this.element = document.createTextNode(content)
  }

  mountTo(range) {
    range.deleteContents()
    range.insertNode(this.element)
  }
}

export class Component {
  constructor() {
    this.children = []
    this.props = Object.create(null)
  }

  /**
   * 挂载方法
   * @param {Range} range
   */
  mountTo(range) {
    this.range = range
    this.update()
  }
  update() {
    const placeholder = document.createComment('placeholder')
    const range = document.createRange()
    range.setStart(this.range.endContainer, this.range.endOffset)
    range.setEnd(this.range.endContainer, this.range.endOffset)
    range.insertNode(placeholder)

    this.range.deleteContents()
    const vDom = this.render()
    vDom.mountTo(this.range)

    // placeholder.parentNode.removeChild(placeholder)
  }
  setAttribute(name, value) {
    this[name] = value
    this.props[name] = value
  }
  appendChild(vChild) {
    this.children.push(vChild)
  }
  setState(state) {
    const merge = (oldState, newState) => {
      Object.keys(newState).forEach((p) => {
        if (typeof newState[p] === 'object') {
          if (typeof oldState[p] !== 'object') {
            oldState[p] = {}
          }
          merge(oldState[p], newState[p])
        } else {
          oldState[p] = newState[p]
        }
      })
    }
    if (!this.state && state) {
      this.state = {}
    }
    merge(this.state, state)
    this.update()
    console.log(this.state)
  }
}

export const ToyReact = {
  createElement(type, attributes, ...children) {
    const element =
      typeof type === 'string' ? new ElementWrapper(type) : new type()

    Object.keys(attributes || {}).forEach((name) => {
      element.setAttribute(name, attributes[name])
    })

    const insertChildren = (children) => {
      children.forEach((child) => {
        if (Array.isArray(child)) {
          insertChildren(child)
        } else {
          if (
            !(child instanceof Component) &&
            !(child instanceof ElementWrapper) &&
            !(child instanceof TextWrapper)
          ) {
            child = String(child)
          }
          if (typeof child === 'string') {
            child = new TextWrapper(child)
          }
          element.appendChild(child)
        }
      })
    }
    insertChildren(children)

    return element
  },
  render(vDom, element) {
    const range = document.createRange()
    if (element.children.length) {
      range.setStartAfter(element.lastChild)
      range.setEndAfter(element.lastChild)
    } else {
      range.setStart(element, 0)
      range.setEnd(element, 0)
    }
    vDom.mountTo(range)
  },
}
