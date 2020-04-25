function replace(pasteContent) {

  let REGEX = /(--.*?): *?(.*?);/gi;

  let rootMatch = pasteContent.match(/:root.*?{([\s\S\n]*?)}/gm);

  if(rootMatch){
    let root = rootMatch[0];

    let allVars = new Map();

    while ((m = REGEX.exec(root)) !== null) {

      if(!isVar(m[2])){
        allVars.set(m[1].trim(), m[2].trim())
      }
      else{
        let varname = m[2].replace(/var\((--.*?)\)/gi, '$1').trim();
        allVars.set(m[1], allVars.get(varname));
      }
    }

    let noRoot = pasteContent.replace(/:root.*?{[\s\S\n]*?}\n*/gm, '');


    for (let [key, value] of allVars) {
      let pattern = 'var\\(\\s*?'+key+'\\s*?\\)';
      let re = new RegExp(pattern, "gm");
      noRoot = noRoot.replace(re, value);
    }

    return noRoot.replace(/\s*?--.*?:.*?;\n/g, '');
  }
  else{
    return pasteContent;
  }

}

function isVar(string){
  let REGEX = /var\(--(.*?)\)/gi;

  return REGEX.test(string);
}


let pasteArea = document.getElementById('pasteEditor')

var pasteEditor = CodeMirror.fromTextArea(pasteArea, {
  value: pasteArea.value,
  mode: "css",
  lineNumbers: true,
  styleActiveLine: true,
  matchBrackets: true
});

let convertArea = document.getElementById('convertEditor')

var convertEditor = CodeMirror.fromTextArea(convertArea, {
  value: convertArea.value,
  mode: "css",
  lineNumbers: true,
  styleActiveLine: true,
  matchBrackets: true
});

let convertButton = document.getElementById('convertButton');

convertButton.addEventListener('click', ()=>{
  convertEditor.setValue(replace(pasteEditor.getValue()));
})
