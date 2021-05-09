/*
	script file for index.html
	sih2020 KB145
	Editha
	--------------------------------
	* sends the input to the server
	* display the progress of uploading file
	* display the result from the server to the user
	--------------------------------
*/

// after loading document
window.onload = function() {

	/*-----------------------------------VARIABLES----------------------------------------*/
	
	const DEBUG = {
		Log: false,
		Error: true
	};
	let resultText = ''
	let isSpeachOn = false
	console.log("Welcome to EDITHA KB145 PS 😉")
	
	/*-------------------------------EVENT LISTENETRS-------------------------------------*/
	
	/*
		get submit button
	 	and add event listener of click for uploading
		the user selected file via ajax
	*/
	document.querySelector ( ".dropdown-submit" ).addEventListener ( "click", fetchResult )

	// event on file select
	document.getElementById("img").addEventListener ( "change", handleSelectImage )

	// reset result when clicked on close button
	document.querySelector(".closeResult").addEventListener ( "click", function handleResultClose ( event ) {
		
		event.srcElement.parentElement.classList.add ( "hidden" )
        let status = document.querySelector(".text.text-upload")
		let fileE = document.getElementById("img")
		status.innerHTML = ""
		status.parentElement.classList.remove("done")
		status.parentElement.classList.remove("drop")
		fileE.value = ''
		resultText = ''
		
	})


	
	function makeResult ( responseText, search = false ) {

		if ( search == false ) {
			resultText = responseText
		}

		let outputHtml = ''
		
		outputHtml = responseText.replace(/\n/g,'</br>')
		
		document.querySelector(".outputResult").innerHTML = outputHtml
		document.querySelector("section.result").classList.remove("hidden")

		// scroll to result
		if ( search == false ) {
			scrollUpTo = document.querySelector("nav.navbar").scrollHeight + document.querySelector(".sectionDiv").scrollHeight
			window.scroll( 0, scrollUpTo - 100 )
		}

	}

	/*
		Detect file select changes and update status
	*/
	function handleSelectImage( event ) {
		
		// remove previous result
		// document.querySelector(".closeResult").click()
		
		let statusElement = document.querySelector(".text.text-upload")
		let choosenFile = event.srcElement.files[0]
		let imgElement = document.querySelector("#inputImage")
		let fileNameHolder = document.getElementById("fileName");
		
		if ( DEBUG.Log ) {
			console.log(choosenFile)
		}
		
		// text to display
		statusElement.innerHTML = "File: " + choosenFile.name
		// fileNameHolder.innerHTML = "File: " + choosenFile.name
		
		// if selected file is an image
		// then show the image preview in result
		if ( choosenFile.type.indexOf("image") != -1 ) {
		
			imgElement.style.background = "url(" + URL.createObjectURL(choosenFile) + ")"
			imgElement.parentElement.classList.remove ( "remove" )
			imgElement.onload = function() {
				URL.revokeObjectURL(this.src)
			}
			
		} else {
			imgElement.parentElement.classList.add("remove")
		}

		// show filename
		this.parentElement.classList.add("drop");
		this.parentElement.classList.remove("drag");

		
	}

	/*
		get the click event of input button
		and make a ajax request to the server
	*/
	function fetchResult ( event ) {

		// stop default operation
		event.preventDefault();
		let statusElement = document.querySelector(".text.text-upload")
		let fileElement = document.getElementById("img")

		// if no file selected
		if ( fileElement.files.length == 0 ) {
			statusElement.previousElementSibling.innerHTML = "Please Select or DROP a File"
			statusElement.previousElementSibling.classList.add("shake")
			return
		}
		
        fileToUplaod = fileElement.files[0]
        console.log(fileToUplaod)
		let formData = new FormData()

		formData.append("ajax","1")
		formData.append("file", fileToUplaod)

		// initaiate the ajax request
		let send = xhr(
			'POST', '/',

			function handleProgress ( event ) {
				let percentage = (event.loaded/event.total)*100
				statusElement.innerHTML = 'Uploading File: '+parseInt(percentage)+'%'
			},

			function handleUploaded ( event ) {
				statusElement.parentElement.classList.add("done")

				// show waiting after uploading image
				// and tick animation is over
				setTimeout(function startWaiting() {
					statusElement.innerHTML = "Done..."
                    statusElement.parentElement.classList.remove("done")
                    document.querySelector("section.result").classList.remove("hidden")
                }, 2000)
                
				if ( DEBUG.Log ) {
					console.log("done uploading")
				}
				
            }
            
		)
		
		// send the data to the server
		send(formData)
		.then(
			function handleResponse(  ) {
				
				// reverse back the upload status
				statusElement.innerHTML = ""
				statusElement.parentElement.classList.remove("done")
				statusElement.parentElement.classList.remove("drop")
				fileElement.value = ''
			}
		)
		.catch(
			function handleError( status ) {
				if ( DEBUG.Error ) {
                    
					console.error ( "Failed to get result", status, "😥" )
				}
			}
		)
		
	}

	/*
		create a ajax request
	*/
	function xhr( type, url, progressEvent, loadEvent ) {

		let xhr = new XMLHttpRequest()
		xhr.upload.addEventListener("progress", progressEvent )
		xhr.upload.addEventListener("load", loadEvent )
		
		return function( data ) {
			return new Promise( function (resolve, reject) {
				
				xhr.onreadystatechange = function() {
					if ( xhr.status == 200 && xhr.readyState == 4 ) {
						resolve ( xhr.responseText )
					} if ( xhr.readyState == 4 ) {
						reject ( xhr.status )
					}
				}
				
				xhr.open( type, url )
				xhr.send( data )
			})
		}

	}

}