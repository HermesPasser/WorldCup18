let ramuIsHide = false;
let editorIsHide = true;

function addCanvasToDiv(){
	let canvas = document.getElementsByTagName('canvas')[0];
	if (canvas){
		document.getElementsByClassName('code')[0].appendChild(canvas);
	}
}

function setVisibility(el, isHidden){
	el.style.visibility = isHidden ? 'hidden' : 'visible';
}

function showRamu(){
	console.log('o')
	ramuIsHide = !ramuIsHide;
	setVisibility(document.getElementsByTagName('canvas')[0], ramuIsHide);
}

function clearCode(){
	const href = window.location.href;
	const index = href.indexOf('?');
	if (index !== -1){		
		let newhref = href.substring(0, index);
		window.location.href = newhref;
	}
}

function execute(){
	const href = window.location.href;
	const index = href.indexOf('?');
	const value = document.getElementById('editor').value;
	if (index !== -1){		
		window.location.href = encodeURI(href.substring(0, index) + "?" + value);
	} else {
		window.location.href = encodeURI(href + "?" + value);
	}
	addCanvasToDiv();
}

function setUrlTextInEditor(){
	const codetext = document.getElementById('code').innerText;
	if (codetext !== '')
		document.getElementById('editor').innerText = codetext;
}

function editor(){
	editorIsHide = !editorIsHide;
	setUrlTextInEditor();
	setVisibility(document.getElementById('editor'), editorIsHide);
}

function addCode(){	
	const href = window.location.href;
	const index = href.indexOf('?');
	if (index !== -1){		
		const code = decodeURI(href.substring(index + 1));
		let scrtag = document.getElementById('code');
		scrtag.innerText = code;
		addCanvasToDiv();
	}
}

addCode();
setUrlTextInEditor();
