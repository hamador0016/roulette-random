import React, { useRef, useState } from 'react';
import './App.css';

const RouletteWheel = () => {
  const canvasRef = useRef(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [wheelValues, setWheelValues] = useState("");
  const [options, setOptions] = useState([]);

  const drawRouletteWheel = (ctx) => {
    if (ctx) {
      const outsideRadius = 200;
      const textRadius = 160;
      const insideRadius = 125;

      ctx.clearRect(0, 0, 500, 500); // Clear the canvas

      ctx.strokeStyle = "black";
      ctx.lineWidth = 2;

      ctx.font = 'bold 12px Helvetica, Arial';

      for(let i = 0; i < options.length; i++) {
        const angle = startAngle + i * arc;
        ctx.fillStyle = getColor(i, options.length);

        ctx.beginPath();
        ctx.arc(250, 250, outsideRadius, angle, angle + arc, false);
        ctx.arc(250, 250, insideRadius, angle + arc, angle, true);
        ctx.stroke();
        ctx.fill();

        ctx.save();
        ctx.shadowOffsetX = -1;
        ctx.shadowOffsetY = -1;
        ctx.shadowBlur    = 0;
        ctx.shadowColor   = "rgb(220,220,220)";
        ctx.fillStyle = "black";
        ctx.translate(250 + Math.cos(angle + arc / 2) * textRadius, 
                      250 + Math.sin(angle + arc / 2) * textRadius);
        ctx.rotate(angle + arc / 2 + Math.PI / 2);
        const text = options[i];
        ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
        ctx.restore();
      } 

      //Arrow
      ctx.fillStyle = "black";
      ctx.beginPath();
      ctx.moveTo(250 - 4, 250 - (outsideRadius + 5));
      ctx.lineTo(250 + 4, 250 - (outsideRadius + 5));
      ctx.lineTo(250 + 4, 250 - (outsideRadius - 5));
      ctx.lineTo(250 + 9, 250 - (outsideRadius - 5));
      ctx.lineTo(250 + 0, 250 - (outsideRadius - 13));
      ctx.lineTo(250 - 9, 250 - (outsideRadius - 5));
      ctx.lineTo(250 - 4, 250 - (outsideRadius - 5));
      ctx.lineTo(250 - 4, 250 - (outsideRadius + 5));
      ctx.fill();
    }
  }

  const spin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    spinAngleStart = Math.random() * 10 + 10;
    spinTime = 0;
    spinTimeTotal = Math.random() * 3 + 4 * 1000;
    rotateWheel();
  };

  const rotateWheel = () => {
    spinTime += 30;
    if (spinTime >= spinTimeTotal) {
      stopRotateWheel();
      return;
    }
    const spinAngle = spinAngleStart - easeOut(spinTime, 0, spinAngleStart, spinTimeTotal);
    startAngle += (spinAngle * Math.PI / 180);
    drawRouletteWheel(canvasRef.current.getContext('2d'));
    spinTimeout.current = setTimeout(rotateWheel, 30);
  };

  const stopRotateWheel = () => {
    clearTimeout(spinTimeout.current);
    //Ruleta Original
    // const degrees = startAngle * 180 / Math.PI + 90;
    // const arcd = arc * 180 / Math.PI;
    // const index = Math.floor((360 - degrees % 360) / arcd);
    //Ruleta Trucada
    // Seleccionar aleatoriamente uno de los primeros cuatro elementos del array options
    const randomIndex = Math.floor(Math.random() * Math.min(options.length, 4));
    const selectedOption = options[randomIndex];

    const ctx = canvasRef.current.getContext('2d');
    ctx.save();
    ctx.font = 'bold 30px Helvetica, Arial';
    //const text = options[index];
    ctx.fillText(/*text*/ selectedOption, 250 - ctx.measureText(/*text*/selectedOption).width / 2, 250 + 10);
    ctx.restore();
    setIsSpinning(false);
  };

  const easeOut = (t, b, c, d) => {
    const ts = (t /= d) * t;
    const tc = ts * t;
    return b + c * (tc + -3 * ts + 3 * t);
  };

  const handleInputChange = (e) => {
    setWheelValues(e.target.value);
    const values = e.target.value.split('\n').filter(val => val.trim()); // Filter out empty lines
    setOptions(values);
  };

  let startAngle = 0;
  const arc = Math.PI / (options.length / 2);
  let spinAngleStart = 10;
  let spinTime = 0;
  let spinTimeTotal = 0;
  const spinTimeout = useRef(null);

  const getColor = (item, maxitem) => {
    const phase = 0;
    const center = 128;
    const width = 127;
    const frequency = Math.PI * 2 / maxitem;
    
    const red = Math.sin(frequency * item + 2 + phase) * width + center;
    const green = Math.sin(frequency * item + 0 + phase) * width + center;
    const blue = Math.sin(frequency * item + 4 + phase) * width + center;
    
    return '#' + ((1 << 24) + (Math.round(red) << 16) + (Math.round(green) << 8) + Math.round(blue)).toString(16).slice(1);
  }

  return (
    <div className="roulette-container">
      <h2>Una ruleta creada por un serio programador de UTP</h2>
      <textarea
        rows="6"
        placeholder="Enter wheel values (one per line)"
        value={wheelValues}
        onChange={handleInputChange}
      ></textarea>
      <input type="button" value="Spin" onClick={spin} disabled={isSpinning} />
      <canvas id="canvas" width="500" height="500" ref={canvasRef}></canvas>
    </div>
  );
};

export default RouletteWheel;
