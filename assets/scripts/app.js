// pdfjs

// script.js
const certPdf = 'assets/media/pdfs/cert.pdf';
const resumePdf = 'assets/media/pdfs/resume.pdf';

const pageNum = document.querySelector('#page_num');
const pageCount = document.querySelector('#page_count');
const currentPage = document.querySelector('#current_page');
const previousPage = document.querySelector('#prev_page');
const nextPage = document.querySelector('#next_page');


const resumeInitialState = {
	pdfDoc: null,
	currentPage: 1,
	pageCount: 0,
	zoom: 1.25,
};

const certInitialState = {
	pdfDoc: null,
	currentPage: 1,
	pageCount: 0,
	zoom: 1.25,
};

// Render the page. Resume
const renderResume = () => {
	// Load the first page.
	resumeInitialState.pdfDoc
		.getPage(resumeInitialState.currentPage)
		.then((page) => {
			console.log('page', 1);

			const canvas = document.querySelector('#resumeCanvas');
			const ctx = canvas.getContext('2d');
			const viewport = page.getViewport({
				scale: resumeInitialState.zoom,
			});

			canvas.height = viewport.height;
			canvas.width = viewport.width;

			// Render the PDF page into the canvas context.
			const renderCtx = {
				canvasContext: ctx,
				viewport: viewport,
			};

			page.render(renderCtx);

			pageNum.textContent = 1;
		});
};

// Render the page. cert
const renderCert = () => {
	// Load the first page.
	certInitialState.pdfDoc
		.getPage(certInitialState.currentPage)
		.then((page) => {
			console.log('page', 1);

			const canvas = document.querySelector('#certCanvas');
			const ctx = canvas.getContext('2d');
			const viewport = page.getViewport({
				scale: certInitialState.zoom,
			});

			canvas.height = viewport.height;
			canvas.width = viewport.width;

			// Render the PDF page into the canvas context.
			const renderCtx = {
				canvasContext: ctx,
				viewport: viewport,
			};

			page.render(renderCtx);

			pageNum.textContent = 1;
		});
};

// Load the document.
//cert
pdfjsLib
	.getDocument(certPdf)
	.promise.then((data) => {
		certInitialState.pdfDoc = data;
		console.log('assets/media/pdfs/cert.pdf', certInitialState.pdfDoc);

		pageCount.textContent = 1;

		renderCert();

        
	})
	.catch((err) => {
		alert(err.message);
	});
// resume
pdfjsLib
	.getDocument(resumePdf)
	.promise.then((data) => {
		resumeInitialState.pdfDoc = data;
		console.log('assets/media/pdfs/resume.pdf', resumeInitialState.pdfDoc);

		pageCount.textContent = 1;

		renderResume();

        
	})
	.catch((err) => {
		alert(err.message);
	});

// JavaScript to handle the toggle button click event
document.addEventListener('DOMContentLoaded', function () {
    var buttonContainerCollapse = new mdb.Collapse(document.getElementById('buttonContainerCollapse'), {
        toggle: false // Disable automatic toggling
    });

    document.querySelector('.navbar-toggler').addEventListener('click', function () {
        buttonContainerCollapse.toggle();
    });
});

$(document).ready(function () {
    $(".navbar-toggler").on("click", function () {
        // Toggle visibility of computer navbar links and mobile button container
        $(".navbar-nav.d-lg-flex").toggle();
        $(".mobile-nav").toggle();
    });
});

// Hero text
var words = ['It\'s a pleasure to meet you', 'I look forward to working with you', 'I'],
    part,
    i = 0,
    offset = 0,
    len = words.length,
    forwards = true,
    skip_count = 0,
    skip_delay = 15,
    speed = 70;
var wordflick = function () {
  setInterval(function () {
    if (forwards) {
      if (offset >= words[i].length) {
        ++skip_count;
        if (skip_count == skip_delay) {
          forwards = false;
          skip_count = 0;
        }
      }
    }
    else {
      if (offset == 0) {
        forwards = true;
        i++;
        offset = 0;
        if (i >= len) {
          i = 0;
        }
      }
    }
    part = words[i].substr(0, offset);
    if (skip_count == 0) {
      if (forwards) {
        offset++;
      }
      else {
        offset--;
      }
    }
    $('.hero-text').text(part);
  },speed);
};

$(document).ready(function () {
  wordflick();
});
