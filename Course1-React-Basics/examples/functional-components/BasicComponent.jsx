// functional-components/BasicComponent.jsx
import React from 'react';

// Basic functional component
function BasicComponent() {
  return (
    <div>
      <h1>Hello from Basic Component!</h1>
      <p>This is a simple functional component.</p>
    </div>
  );
}

// Arrow function component
const ArrowComponent = () => {
  return (
    <div>
      <h2>Arrow Function Component</h2>
      <p>This component uses arrow function syntax.</p>
    </div>
  );
};

// Component with implicit return
const ImplicitReturnComponent = () => (
  <div>
    <h3>Implicit Return Component</h3>
    <p>This component uses implicit return (no curly braces).</p>
  </div>
);

// Component with props
function PropsComponent({ title, description, isImportant }) {
  return (
    <div className={isImportant ? 'important' : 'normal'}>
      <h4>{title}</h4>
      <p>{description}</p>
      {isImportant && <span>⭐ Important!</span>}
    </div>
  );
}

// Component with default props
function ComponentWithDefaults({ name = 'Anonymous', age = 0 }) {
  return (
    <div>
      <p>Name: {name}</p>
      <p>Age: {age}</p>
    </div>
  );
}

// Main component that uses all the above
function FunctionalComponentsExample() {
  return (
    <div className="functional-components-example">
      <h1>Functional Components Examples</h1>
      
      <BasicComponent />
      <ArrowComponent />
      <ImplicitReturnComponent />
      
      <PropsComponent 
        title="Props Example"
        description="This component receives props from its parent."
        isImportant={true}
      />
      
      <ComponentWithDefaults />
      <ComponentWithDefaults name="John" age={25} />
    </div>
  );
}

export default FunctionalComponentsExample;
