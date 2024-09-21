// itaycode.com

function initSimulation() {
    const Engine = Matter.Engine,
      Render = Matter.Render,
      World = Matter.World,
      Bodies = Matter.Bodies,
      MouseConstraint = Matter.MouseConstraint,
      Mouse = Matter.Mouse,
      Events = Matter.Events;
  
    const engine = Engine.create(),
      world = engine.world;
  
    const containerElement = document.querySelector(".tag-canvas");
    const containerWidth = containerElement.clientWidth;
    const containerHeight = containerElement.clientHeight;
  
    // Set up Matter.js renderer
    const render = Render.create({
      element: containerElement,
      engine: engine,
      options: {
        width: containerWidth,
        height: containerHeight,
        background: "transparent", // No default background
        wireframes: false
      }
    });
  
    Render.run(render);
    Engine.run(engine);
  
    // Create boundaries
    const ground = Bodies.rectangle(
      containerWidth / 2,
      containerHeight + 50,
      containerWidth,
      100,
      { isStatic: true }
    );
    const wallLeft = Bodies.rectangle(
      -50,
      containerHeight / 2,
      100,
      containerHeight,
      {
        isStatic: true
      }
    );
    const wallRight = Bodies.rectangle(
      containerWidth + 50,
      containerHeight / 2,
      100,
      containerHeight,
      { isStatic: true }
    );
    const roof = Bodies.rectangle(containerWidth / 2, -50, containerWidth, 100, {
      isStatic: true
    });
  
    World.add(world, [ground, wallLeft, wallRight, roof]);
  
    // Sync Matter.js bodies with HTML elements
    const tags = document.querySelectorAll(".tag");
    const tagBodies = Array.from(tags).map((tag) => {
      const width = tag.offsetWidth;
      const height = tag.offsetHeight;
  
      const x = Math.random() * (containerWidth - width) + width / 2;
      const y = Math.random() * containerHeight;
  
      const body = Bodies.rectangle(x, y, width, height, {
        chamfer: { radius: height / 2 }, // Rounded corners
        density: 0.01,
        friction: 0.1,
        restitution: 0.8, // Bouncy effect
        render: {
          fillStyle: "transparent" // Disable Matter.js background rendering
        }
      });
  
      World.add(world, body);
      return { body, element: tag };
    });
  
    // Sync positions and rotation with Matter.js
    Events.on(engine, "afterUpdate", () => {
      tagBodies.forEach(({ body, element }) => {
        const { x, y } = body.position;
  
        element.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(${body.angle}rad)`;
      });
    });
  
    // Add mouse interactivity
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2
      }
    });
  
    World.add(world, mouseConstraint);
  
    // Adjust rendering and bounds on resize
    window.addEventListener("resize", () => {
      render.canvas.width = containerElement.clientWidth;
      render.canvas.height = containerElement.clientHeight;
      render.options.width = containerElement.clientWidth;
      render.options.height = containerElement.clientHeight;
    });
  }
  
  const containerElement = document.querySelector(".tag-canvas");
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        initSimulation();
      }
    });
  });
  
  observer.observe(containerElement);
  