import parser from "prettier/parser-html";
import prettier from "prettier/standalone";
import svgo from "svgo";

// process (format/clean/etc/) svg code in steps
export const process = (code) => {
  code = optimize(code);
  code = opinionate(code);
  code = prettify(code);
  return code;
};

// convert svg source code to dom element
export const parse = (code) => {
  const doc = new DOMParser().parseFromString(code, "image/svg+xml");
  const svg = doc.querySelector("svg");
  const error = doc.querySelector("parsererror");
  if (error) return;
  if (svg) return svg;
};

// run code through prettier
export const prettify = (code) => {
  try {
    return prettier.format(code, {
      parser: "html",
      plugins: [parser],
    });
  } catch (error) {
    return code;
  }
};

// svgo config options
const config = {
  js2svg: {
    indent: 2,
    pretty: true,
  },
  removeDoctype: true,
  removeXMLProcInst: true,
  removeComments: true,
  removeMetadata: true,
  removeEditorsNSData: true,
  cleanupAttrs: true,
  inlineStyles: true,
  minifyStyles: true,
  cleanupIDs: true,
  removeUselessDefs: true,
  cleanupNumericValues: true,
  convertColors: true,
  removeUnknownsAndDefaults: true,
  removeNonInheritableGroupAttrs: true,
  removeUselessStrokeAndFill: true,
  removeViewBox: true,
  cleanupEnableBackground: true,
  removeHiddenElems: true,
  removeEmptyText: true,
  convertShapeToPath: false,
  convertEllipseToCircle: true,
  moveElemsAttrsToGroup: true,
  moveGroupAttrsToElems: true,
  collapseGroups: true,
  convertPathData: true,
  convertTransform: true,
  removeEmptyAttrs: true,
  removeEmptyContainers: true,
  mergePaths: true,
  removeUnusedNS: true,
  sortDefsChildren: true,
  removeTitle: true,
  removeDesc: true,
  removeXMLNS: false,
  convertStyleToAttrs: true,
  prefixIds: true,
  cleanupListOfValues: true,
  removeRasterImages: true,
  sortAttrs: true,
  removeDimensions: true,
  removeAttrs: true,
  removeAttributesBySelector: true,
  removeElementsByAttr: true,
  addClassesToSVGElement: true,
  addAttributesToSVGElement: true,
  removeOffCanvasPaths: true,
  removeStyleElement: true,
  removeScriptElement: true,
  reusePaths: true,
};

// run code through svgo
const optimize = (code) => {
  try {
    return svgo.optimize(code, config).data;
  } catch (error) {
    return code;
  }
};

// acceptable presentation attributes
const presentation = [
  "style",
  "fill",
  "stroke",
  "stroke-width",
  "stroke-linecap",
  "stroke-linejoin",
  "stroke-dasharray",
  "stroke-dashoffset",
  "opacity",
  "transform",
];

// acceptable tags and their attributes
const tags = {
  svg: ["xmlns", "viewBox"],
  g: presentation,
  path: ["d", ...presentation],
  line: ["x1", "x2", "y1", "y2", ...presentation],
  polyline: ["points", ...presentation],
  rect: ["x", "y", "width", "height", "rx", "ry", ...presentation],
  circle: ["cx", "cy", "r", ...presentation],
  ellipse: ["cx", "cy", "rx", "ry", ...presentation],
};

// run code through own cleaning
const opinionate = (code) => {
  const svg = parse(code);
  if (!svg) return code;

  const elements = Array.from(svg.querySelectorAll("*"));
  elements.unshift(svg);

  // go through all elements in svg
  for (const element of elements) {
    let { tagName, attributes } = element;
    const allowedAttributes = tags[tagName];

    // filter tags
    if (!allowedAttributes) {
      element.replaceWith(...element.children);
      continue;
    }

    // filter attributes
    attributes = [...attributes];
    for (const { name } of attributes) {
      if (!allowedAttributes.includes(name)) element.removeAttribute(name);
    }
  }

  // fit view box to contents
  document.body.append(svg);
  let { x, y, width, height } = svg.getBBox();
  if (width > height) {
    y -= (width - height) / 2;
    height = width;
  }
  if (height > width) {
    x -= (height - width) / 2;
    width = height;
  }
  svg.remove();
  const viewBox = [x, y, width, height].map((n) => n.toFixed(2)).join(" ");
  svg.setAttribute("viewBox", viewBox);
  return svg.outerHTML;
};
