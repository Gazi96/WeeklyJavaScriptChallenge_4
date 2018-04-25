"use strict";

window.onscroll = loadGifs;

const input = document.getElementsByClassName("form__input")[0];
const buttonSearch = document.getElementsByClassName("form__button")[0];
let amountOfScroll = 0;

getLocalStorage();

buttonSearch.addEventListener("click", () =>{
	validateData(input.value);
});

function getLocalStorage(){
	const local = localStorage.getItem('input');
	input.value = local;
	
	validateData(input.value);
}

function loadGifs(){
	const container = document.getElementsByClassName("container");
	const containerHeight = container[0].offsetHeight;
	
	const yOffset = window.pageYOffset;
	const y = yOffset + window.innerHeight;
	
	if(y >= containerHeight){
		amountOfScroll ++;
		setParameters(input.value, amountOfScroll);
	}
}

function debounce(func, wait, immediate){
	var timeout;
	return function() {
		var context = this, args = arguments;
		clearTimeout(timeout);
		timeout = setTimeout(function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		}, wait);
		if (immediate && !timeout) func.apply(context, args);
	};
}

var debounceInput = debounce(function() {
	validateData(input.value);
}, 500);
input.addEventListener("input", debounceInput);

function validateData(data){
	try{
		if(data.length == 0){
			throw "Proszę wprowadzić wartość";
		}
		else if(!isNaN(data)){
			throw "Wprowadzona wartość nie powinna być liczbą";
		}
		else{
			startLoadGifs(data);	
		}
	}
	catch(err) {
		messageError(err);
	}
}

function startLoadGifs(data){
	amountOfScroll = 0;
	removePreviewsGifs();
	localStorage.setItem('input', data);
	setParameters(data, 0);
	messageError("");
}

function removePreviewsGifs(){
	const container = document.getElementsByClassName("container")[0];
	container.textContent = "";
}

function setParameters(data, amountOfScroll){
	const apiUrl = "https://api.giphy.com/v1/gifs/search?";
	const apiKey = "P0lvvK6f6MnvvJr1uJjjznwmRsJPVQmE";
	const apiSearch = encodeURIComponent(data).replace(/%20/g, "+");
	const limitGif = 9 + 9 * amountOfScroll;
		
	const urlGifs = `${apiUrl}q=${apiSearch}&api_key=${apiKey}&limit=${limitGif}`;
	
	fetchApi(urlGifs);
}

function fetchApi(urlGifs){

	fetch(urlGifs)
		.then(resp => resp.json())
		.then(resp => {
			iterationData(resp.data, amountOfScroll);
		})
		.catch(error => messageError(error));
}

function messageError(err){
	
	const message = document.getElementsByClassName("message")[0];
	message.textContent = err;
}

function iterationData(data){

	for(let i = 9 * amountOfScroll; i < data.length; i++){
		addSrc(data[i].images.original_mp4.mp4);
	}
}

function addSrc(src){
	const videoElement = createVideoElement();
	const videoContainer = document.getElementsByClassName("container")[0];
		
	videoElement.children[0].src = src;
	videoElement.children[1].src = src;
	
	videoContainer.appendChild(videoElement);
}

function createVideoElement(){
	const video = document.createElement("video");
	const sourceMp4 = document.createElement("source");
	const sourceOpp = document.createElement("source");
		
	addAtrribute(video, sourceMp4, sourceOpp);
	addChild(video, sourceMp4, sourceOpp);
	
	return video;
}

function addAtrribute(video, sourceMp4, sourceOpp){
	video.setAttribute("autoplay", "");
	video.setAttribute("loop", "");
	
	sourceMp4.classList = "video__source";
	sourceMp4.type = "video/mp4";
	
	sourceOpp.classList = "video__source";
	sourceOpp.type = "video/ogg";
}
  
function addChild(video, sourceMp4, sourceOpp){
	video.appendChild(sourceMp4);
	video.appendChild(sourceOpp);
}




