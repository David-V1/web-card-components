// const grayScaleImg = "https://picsum.photos/200/300?grayscale";
const imgEndpoint = "https://picsum.photos";
const cardComponents = document.querySelectorAll("image-card");

function getImageDimensions(arrayCards) {
	const width = [];
	const height = [];
	arrayCards.forEach((card) => {
		let w = card.getAttribute("width");
		width.push(w);
		let h = card.getAttribute("height");
		height.push(h);
	});
	return { width, height };
}

async function getImages(cards) {
	const results = getImageDimensions(cards);
	try {
		if (cards.length) {
			for (let i = 0; i < cards.length; i++) {
				const response = await fetch(
					`${imgEndpoint}/${results.width[i]}/${results.height[i]}/?grayscale`
				);
				let img = document.createElement("img");
				img.src = response.url;
				document.body.appendChild(img);
			}
		}
	} catch (error) {
		console.log("error", error);
	}
	console.log(images);
	return images;
}

// creating Web Component
const template = document.createElement("template");
template.innerHTML = `
    <style>
        .grid-item {
            background-color: rgba(255, 255, 255, 0.25);
            border: 1px solid #ffffff8d;
            padding: 20px;
            font-size: clamp(16px, 1.5vw, 28px);
            text-align: center;
        }
    </style>
    <div class="grid-item">
        <img />
        <h2></h2>
        <p></p>
    </div>
    `;

class ImageCard extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: "open" });
		this.shadowRoot.appendChild(template.content.cloneNode(true));

		const width = this.getAttribute("width");
		const height = this.getAttribute("height");

		fetch(`${imgEndpoint}/${width}/${height}/?grayscale`)
			.then((response) => {
				if (response.ok) {
					this.shadowRoot.querySelector("img").src = response.url;
					return response.blob();
				}
				throw new Error("Image request failed");
			})
			.catch((error) => {
				console.log("Error:", error);
			});

		this.shadowRoot.querySelector("h2").innerText =
			this.getAttribute("heading");
		this.shadowRoot.querySelector("p").innerText =
			this.getAttribute("imgText");
	}
}

window.customElements.define("image-card", ImageCard);
