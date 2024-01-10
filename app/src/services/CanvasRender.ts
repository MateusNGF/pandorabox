export class CanvasRender {
    
    // CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D
    private  context : any

    constructor(
        private canvas : OffscreenCanvas
    ) {
        this.context = this.canvas.getContext('2d')
    }


    draw(frame : VideoFrame){
        const { displayHeight, displayWidth } = frame

        this.canvas.width = displayWidth
        this.canvas.height = displayHeight
        this.context.drawImage(frame, 0, 0, displayWidth, displayHeight)

        frame.close()
    }

    getRenderer() { 
        const renderer = this

        let peddingFrame : VideoFrame = null

        // tecnica para renderizar mais rapido
        return (frame : VideoFrame) => {
            if (!peddingFrame){

                // https://developer.mozilla.org/pt-BR/docs/Web/API/window/requestAnimationFrame
                requestAnimationFrame(() => {
                    renderer.draw(peddingFrame)
                    peddingFrame = null
                })
                
            }else {
                peddingFrame.close()
            }


            peddingFrame = frame
        }
    
    }
}