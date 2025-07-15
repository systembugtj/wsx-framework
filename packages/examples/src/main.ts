import '@systembug/wsx-components';

document.getElementById('app')!.innerHTML = `
  <h1>WSX Framework Examples</h1>
  <p>Example components:</p>
  
  <h2>XyButton Component</h2>
  <xy-button>Default Button</xy-button>
  <xy-button type="primary">Primary Button</xy-button>
  <xy-button type="danger">Danger Button</xy-button>
  
  <h2>ColorPicker Component</h2>
  <color-picker></color-picker>
  
  <h2>Button Group</h2>
  <xy-button-group>
    <xy-button>First</xy-button>
    <xy-button>Second</xy-button>
    <xy-button>Third</xy-button>
  </xy-button-group>
`;
