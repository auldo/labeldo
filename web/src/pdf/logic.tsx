import * as pdfUtils from "pdfjs-dist"
import {getDocument, PageViewport, PDFDocumentProxy, PDFPageProxy, RenderTask, renderTextLayer} from "pdfjs-dist";
import {TextContent} from "pdfjs-dist/types/src/display/api";

const worker = require("pdfjs-dist/build/pdf.worker.entry")
pdfUtils.GlobalWorkerOptions.workerSrc = worker

export async function loadPdf(canvasId: string, mockPdf: any): Promise<boolean> {
    try {
        const pdfDoc: PDFDocumentProxy = await getDocument(mockPdf).promise
        const pdfPage: PDFPageProxy = await pdfDoc.getPage(1)

        const scale: number = 1.5;
        const viewport: PageViewport = pdfPage.getViewport({ scale: scale });
        const outputScale: number = window.devicePixelRatio || 1;

        const optCanvas: HTMLElement | null = document.getElementById(canvasId);
        const optRootDiv: HTMLElement | null = document.getElementById("pdf-root");

        if(optCanvas && optRootDiv) {
            const canvas: HTMLCanvasElement = optCanvas as HTMLCanvasElement
            const context: CanvasRenderingContext2D | null = canvas.getContext('2d');
            if(context) {
                canvas.width = Math.floor(viewport.width * outputScale);
                canvas.height = Math.floor(viewport.height * outputScale);
                canvas.style.width = Math.floor(viewport.width) + "px";
                canvas.style.height =  Math.floor(viewport.height) + "px";
                const transform: number[] = outputScale !== 1
                    ? [outputScale, 0, 0, outputScale, 0, 0]
                    : [];
                let renderContext = {
                    canvasContext: context,
                    viewport: viewport,
                    transform: transform
                }
                await pdfPage.render(renderContext).promise
                const textContent: TextContent = await pdfPage.getTextContent()
                const textLayer: HTMLDivElement = document.querySelector(".textLayer") as HTMLDivElement
                textLayer.style.left = canvas.offsetLeft + 'px';
                textLayer.style.top = canvas.offsetTop + 'px';
                textLayer.style.height = canvas.offsetHeight + 'px';
                textLayer.style.width = canvas.offsetWidth + 'px';
                pdfUtils.renderTextLayer({
                    textContent: textContent,
                    container: textLayer,
                    viewport: viewport,
                    textDivs: []
                });
                return true;
            } else {
                console.log("No context found.")
                return false;
            }
        } else {
            console.log("No such canvas.")
            return false;
        }
    } catch(e) {
        return false;
    }
}