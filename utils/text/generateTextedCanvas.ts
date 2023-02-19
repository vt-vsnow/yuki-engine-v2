const serializer = new XMLSerializer();
// @ts-ignore
function blobToDataURL(blob, callback) {
  var a = new FileReader();

  a.onload = function (e) {
    // @ts-ignore
    callback(e.target.result);
  };
  a.readAsDataURL(blob);
}
export const generateTextedCanvas = (
  text: string,
  options: {
    width: number;
    height: number;
    maxWidth?: number;
    html?: boolean;
    canvas?: HTMLCanvasElement;
    originalRatio?: boolean;
  }
) => {
  return new Promise<{
    canvas: HTMLCanvasElement;
    width: number;
    height: number;
  }>(async (resolve) => {
    const templateDiv = document.createElement("div");
    if (options.html) {
      templateDiv.innerHTML = text;
    } else {
      templateDiv.innerText = text;
    }
    templateDiv.style.width = "fit-content";
    options.maxWidth && (templateDiv.style.maxWidth = options.maxWidth + "px");
    templateDiv.style.background = "black";
    templateDiv.style.color = "white";
    templateDiv.style.fontFamily = "sans-serif";
    templateDiv.style.lineHeight = "1.5em";
    // templateDiv.style.letterSpacing = ".0875em";
    // document.body.appendChild(templateDiv);
    const serializedHtml = serializer.serializeToString(templateDiv);
    let vw = options.width;
    let vh = options.height;
    const svgDiv = document.createElement("div");
    svgDiv.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0, 0, ${vw}, ${vh}" width="${options.width}" height="${options.height}" preserveAspectRatio="none">
      <foreignObject width="100%">
        ${serializedHtml}
      </foreignObject>
    </svg>`;
    const foreignElement = svgDiv.querySelector("svg > foreignObject > *")!;
    document.body.appendChild(svgDiv);
    const rect = foreignElement.getBoundingClientRect();
    document.body.removeChild(svgDiv);
    // console.log(rect);
    vw = rect.right - rect.left;
    vh = rect.bottom - rect.top;
    // console.log(vw, vh);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0, 0, ${vw}, ${vh}" width="${
      options.width
    }" height="${options.height}"${
      !options.originalRatio ? ' preserveAspectRatio="none"' : ""
    }>
    <foreignObject width="100%" height="100%">
      ${serializedHtml}
    </foreignObject>
  </svg>`;
    const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    // const url = (self.URL || self.webkitURL || self).createObjectURL(blob);

    const url = await new Promise<string>((resolve) => {
      blobToDataURL(blob, resolve);
    });
    // console.log(url);
    const image = new Image();
    image.src = url;
    image.onload = () => {
      ctx?.drawImage(image, 0, 0);
      // (self.URL || self.webkitURL || self).revokeObjectURL(url);
      resolve({ canvas, width: vw, height: vh });
    };
    const canvas = options.canvas || document.createElement("canvas");
    canvas.width = options.width;
    canvas.height = options.height;
    // canvas.style.border = "solid";
    const ctx = canvas.getContext("2d");
    ctx!.fillStyle = "rgb( 0, 0, 0)";
    ctx?.fillRect(0, 0, canvas.width, canvas.height);
  });
};
