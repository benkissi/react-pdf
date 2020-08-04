  export const bringCanvasOnTop = (index) => {
    const currentCanvas = document.querySelectorAll('.konvajs-content')[index]
    const parent = currentCanvas.parentNode
    parent.style.cssText = "position: absolute; top: 0; left: 0; z-index: 1000"
  }

