import { ToyReact, Components } from './ToyReact'

class MyComponent extends Components {
  render() {
    return (
      <div>
        cool
        <span>1</span>
        <span>2</span>
        <div>
          {true}
          {this.children}
        </div>
      </div>
    )
  }
}

const a = (
  <MyComponent name="a" id="ida">
    <div>1</div>
    <div>12</div>
    <div>123</div>
  </MyComponent>
)

ToyReact.render(a, document.body)
