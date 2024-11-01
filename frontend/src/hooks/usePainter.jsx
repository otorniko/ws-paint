import { useCallback, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

export const usePainter = () => {
  const canvas = useRef();

  const [isReady, setIsReady] = useState(false);
  const [isRegularMode, setIsRegularMode] = useState(true);
  const [isAutoWidth, setIsAutoWidth] = useState(false);
  const [isEraser, setIsEraser] = useState(false);
  const [canvasData, setCanvasData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [currentColor, setCurrentColor] = useState("#000000");
  const [currentWidth, setCurrentWidth] = useState(10);

  const [socket, setSocket] = useState(null);

  const requestCanvasData = useCallback(() => {
    if (socket) {
      console.log(socket.id, "requesting canvas data");
      socket.emit("requestCanvasData");
    }
  }, [socket]);

  const autoWidth = useRef(false);
  const selectedSaturation = useRef(100);
  const selectedLightness = useRef(50);
  const selectedColor = useRef("#000000");
  const selectedLineWidth = useRef(10);
  const lastX = useRef(0);
  const lastY = useRef(0);
  const hue = useRef(0);
  const isDrawing = useRef(false);
  const direction = useRef(true);
  const isRegularPaintMode = useRef(true);
  const isEraserMode = useRef(false);

  const ctx = useRef(canvas?.current?.getContext("2d"));

  useEffect(() => {
    const newSocket = io("http://10.10.10.10:3000", {
      pingTimeout: 60000,
      pingInterval: 25000,
    });
    setSocket(newSocket);

    newSocket.on('drawCanvas', (data) => {
      setCanvasData(data);
    });

    newSocket.on('disconnect', () => {
      console.log('disconnected');
    });
    newSocket.on('drawLine', (data) => {
      handleRemoteDraw(data);
    });

    newSocket.on('clear', () => {
      handleClear();
      console.log('cleared');
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);
  
/*
  useEffect(() => {
    if (canvasData.length > 0 && ctx.current && isReady) {
        setTimeout(() => {
        canvasData.forEach(item => handleRemoteDraw(item));
        setCanvasData([]);
      }, 3000);
      console.log("temporarily disabled")
    }
  }, [canvasData]);
  */

  const drawOnCanvas = useCallback((event) => {
    if (!ctx || !ctx.current) {
      return;
    }
    ctx.current.beginPath();
    ctx.current.moveTo(lastX.current, lastY.current);
    ctx.current.lineTo(event.offsetX, event.offsetY);
    ctx.current.stroke();
    socket.emit('draw', {
      id: socket.id,
      command: 'drawLine',
      color: selectedColor.current,
      width: selectedLineWidth.current,
      x1: lastX.current,
      y1: lastY.current,
      x2: event.offsetX,
      y2: event.offsetY
    });
    [lastX.current, lastY.current] = [event.offsetX, event.offsetY];
  }, [socket]);

  const handleRemoteDraw = useCallback((data) => {
    switch (data.command) {
      case "drawLine":
        ctx.current.strokeStyle = data.color;
        ctx.current.lineWidth = data.width;
        ctx.current.beginPath();
        ctx.current.moveTo(data.x1, data.y1);
        ctx.current.lineTo(data.x2, data.y2);
        ctx.current.stroke();
        break;
      default:
        console.warn("Unknown drawing command:", data.command);

    }
  });

  const handleMouseDown = useCallback((e) => {
    isDrawing.current = true;
    [lastX.current, lastY.current] = [e.offsetX, e.offsetY];
  }, []);

  const dynamicLineWidth = useCallback(() => {
    if (!ctx || !ctx.current) {
      return;
    }
    if (ctx.current.lineWidth > 90 || ctx.current.lineWidth < 10) {
      direction.current = !direction.current;
    }
    direction.current ? ctx.current.lineWidth++ : ctx.current.lineWidth--;
    setCurrentWidth(ctx.current.lineWidth);
  }, []);

  const drawNormal = useCallback(
    (e) => {
      if (!isDrawing.current || !ctx.current) return;

      if (isRegularPaintMode.current || isEraserMode.current) {
        ctx.current.strokeStyle = selectedColor.current;

        setCurrentColor(selectedColor.current);

        autoWidth.current && !isEraserMode.current
          ? dynamicLineWidth()
          : (ctx.current.lineWidth = selectedLineWidth.current);

        isEraserMode.current
          ? (ctx.current.globalCompositeOperation = "destination-out")
          : (ctx.current.globalCompositeOperation = "source-over");
      } else {
        setCurrentColor(
          `hsl(${hue.current},${selectedSaturation.current}%,${selectedLightness.current}%)`,
        );
        ctx.current.strokeStyle = `hsl(${hue.current},${selectedSaturation.current}%,${selectedLightness.current}%)`;
        ctx.current.globalCompositeOperation = "source-over";

        hue.current++;

        if (hue.current >= 360) hue.current = 0;

        autoWidth.current
          ? dynamicLineWidth()
          : (ctx.current.lineWidth = selectedLineWidth.current);
      }
      drawOnCanvas(e);
    },
    [drawOnCanvas, dynamicLineWidth],
  );

  const stopDrawing = useCallback(() => {
    isDrawing.current = false;
  }, []);

  const init = useCallback(() => {
    ctx.current = canvas?.current?.getContext("2d");
    if (canvas && canvas.current && ctx && ctx.current) {
      canvas.current.addEventListener("mousedown", handleMouseDown);
      //  canvas.current.addEventListener("touchstart", handleMouseDown);
      canvas.current.addEventListener("mousemove", drawNormal);
      //  canvas.current.addEventListener("touchmove", drawNormal);
      canvas.current.addEventListener("mouseup", stopDrawing);
      //  canvas.current.addEventListener("touchend", stopDrawing);
      canvas.current.addEventListener("mouseout", stopDrawing);

      canvas.current.width = window.innerWidth - 196;
      canvas.current.height = window.innerHeight;

      ctx.current.strokeStyle = "#000";
      ctx.current.lineJoin = "round";
      ctx.current.lineCap = "round";
      ctx.current.lineWidth = 10;
      if(canvasData.length > 0) { 
        console.log("canvasData received in init");
        canvasData.forEach(item => handleRemoteDraw(item))
        setCanvasData([])
      }
      setIsReady(true);
    }
  }, [drawNormal, handleMouseDown, stopDrawing, socket, canvasData]);

  const handleRegularMode = useCallback(() => {
    setIsRegularMode(true);
    isEraserMode.current = false;
    setIsEraser(false);
    isRegularPaintMode.current = true;
  }, []);

  const handleSpecialMode = useCallback(() => {
    setIsRegularMode(false);
    isEraserMode.current = false;
    setIsEraser(false);
    isRegularPaintMode.current = false;
  }, []);

  const handleColor = (e) => {
    setCurrentColor(e.currentTarget.value);
    selectedColor.current = e.currentTarget.value;
  };

  const handleWidth = (e) => {
    setCurrentWidth(e.currentTarget.value);
    selectedLineWidth.current = e.currentTarget.value;
  };

  const handleClear = useCallback(() => {
    if (!ctx || !ctx.current || !canvas || !canvas.current) {
      return;
    }
    ctx.current.clearRect(0, 0, canvas.current.width, canvas.current.height);
  }, []);

  const clearCanvas = useCallback(() => {
    handleClear();
    socket.emit('clear');
  }, [socket]);

  const handleEraserMode = (e) => {
    autoWidth.current = false;
    setIsAutoWidth(false);
    setIsRegularMode(true);
    isEraserMode.current = true;
    setIsEraser(true);
  };

  const setCurrentSaturation = (e) => {
    setCurrentColor(
      `hsl(${hue.current},${e.currentTarget.value}%,${selectedLightness.current}%)`,
    );
    selectedSaturation.current = e.currentTarget.value;
  };

  const setCurrentLightness = (e) => {
    setCurrentColor(
      `hsl(${hue.current},${selectedSaturation.current}%,${e.currentTarget.value}%)`,
    );
    selectedLightness.current = e.currentTarget.value;
  };

  const setAutoWidth = (e) => {
    autoWidth.current = e.currentTarget.checked;
    setIsAutoWidth(e.currentTarget.checked);

    if (!e.currentTarget.checked) {
      setCurrentWidth(selectedLineWidth.current);
    } else {
      setCurrentWidth(ctx?.current?.lineWidth ?? selectedLineWidth.current);
    }
  };

  return [
    {
      canvas,
      isReady,
      currentWidth,
      currentColor,
      isRegularMode,
      isAutoWidth,
      isEraser,
    },
    {
      requestCanvasData,
      init,
      handleRegularMode,
      handleSpecialMode,
      handleColor,
      handleWidth,
      clearCanvas,
      handleEraserMode,
      setAutoWidth,
      setCurrentSaturation,
      setCurrentLightness,
    },
  ]
};