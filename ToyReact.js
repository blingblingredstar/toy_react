class ElementWrapper {
  constructor(type) {
    this.element = document.createElement(type)
  }
  setAttribute(name, value) {
    this.element.setAttribute(name, value)
  }
  appendChild(vChild) {
    vChild.mountTo(this.element)
  }
  mountTo(parent) {
    parent.appendChild(this.element)
  }
}

class TextWrapper {
  constructor(content) {
    this.element = document.createTextNode(content)
  }

  mountTo(parent) {
    parent.appendChild(this.element)
  }
}

export class Components {
  constructor() {
    this.children = []
  }
  mountTo(parent) {
    const vDom = this.render()
    vDom.mountTo(parent)
  }
  setAttribute(name, value) {
    this[name] = value
  }
  appendChild(vChild) {
    this.children.push(vChild)
  }
}

export const ToyReact = {
  createElement(type, attributes, ...children) {
    console.log(type)
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
            !(child instanceof Components) &&
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
    vDom.mountTo(element)
  },
}
