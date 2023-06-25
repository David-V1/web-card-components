const imgEndpoint = "https://picsum.photos";

// creating Web Component

const template = document.createElement("template");
template.innerHTML = `
    <style>
        .grid-item {
            background-color: rgba(255, 255, 255, 0.20);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border: 1px solid #ffffff8d;
            padding: 20px;
            font-size: clamp(16px, 1.5vw, 28px);
            text-align: center;
        }
        h2 {
            font-size: clamp(1.5rem, 3vw, 3rem);
            font-family: "Racing Sans One", cursive;
            letter-spacing: 5px;
            text-align: center;
        }
        p {
            font-size: clamp(1rem, 2vw, 1.5rem);
            font-family: 'Ysabeau SC', sans-serif;
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
		// edge case: if no width or height is provided, use a default image
		if (!this.getAttribute("width") || !this.getAttribute("height")) {
			fetch(`${imgEndpoint}/200/?grayscale`)
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
		}

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

// keeping track of the DOM visibility
const observer = new IntersectionObserver((entries) => {
	entries.forEach((entry) => {
		if (entry.isIntersecting) {
			entry.target.classList.add("show");
		} else {
			entry.target.classList.remove("show");
		}
	});
});

const hiddenElements = document.querySelectorAll(".hidden");
hiddenElements.forEach((element) => {
	console.log(element);
	observer.observe(element);
});
