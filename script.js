const canvas = document.getElementById("drawingCanvas");
const ctx = canvas.getContext("2d");
const colorInput = document.getElementById("colorPicker");
const shapeDropdown = document.getElementById("shapeSelector");
const imageUpload = document.getElementById("imageUpload");
const drawImageButton = document.getElementById("drawImage");
const clearCanvasButton = document.getElementById("clearCanvas");

let drawingActive = false;
let pointArray = [];

canvas.addEventListener("mousedown", (event) => {
	if (shapeDropdown.value === "custom") {
		drawingActive = true;
		pointArray = []; // Reset points
		ctx.beginPath();
		ctx.moveTo(event.offsetX, event.offsetY);
	}
});

canvas.addEventListener("mousemove", (event) => {
	if (!drawingActive) return;
	const x = event.offsetX;
	const y = event.offsetY;
	pointArray.push({ x, y });
	ctx.lineTo(x, y);
	ctx.stroke();
});

canvas.addEventListener("mouseup", () => {
	drawingActive = false;
	ctx.closePath();
});

document.getElementById("generate3D").addEventListener("click", () => {
	generateShapeIn3D();
});

drawImageButton.addEventListener("click", () => {
	drawImageIn3D();
});

clearCanvasButton.addEventListener("click", () => {
	clearCanvas();
});

function generateShapeIn3D() {
	const selectedShape = shapeDropdown.value;
	const chosenColor = colorInput.value;
	let shapeGeometry = createShapeGeometry(selectedShape);

	const extrudeOptions = { depth: 50, bevelEnabled: false };
	const meshGeometry = new THREE.ExtrudeGeometry(shapeGeometry, extrudeOptions);
	const meshMaterial = new THREE.MeshBasicMaterial({ color: chosenColor });
	const mesh3D = new THREE.Mesh(meshGeometry, meshMaterial);

	const edges = new THREE.EdgesGeometry(meshGeometry);
	const edgeMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
	const edgeLines = new THREE.LineSegments(edges, edgeMaterial);

	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
	const renderer = new THREE.WebGLRenderer();
	renderer.setSize(600, 600);
	document.getElementById("canvas3DContainer").innerHTML = "";
	document.getElementById("canvas3DContainer").appendChild(renderer.domElement);
	camera.position.z = 200;

	const light = new THREE.PointLight(0xffffff);
	light.position.set(10, 10, 10);
	scene.add(light);
	scene.add(mesh3D);
	scene.add(edgeLines);

	alert("3D shape generated successfully!");

	function animate() {
		requestAnimationFrame(animate);
		mesh3D.rotation.x += 0.01;
		mesh3D.rotation.y += 0.01;
		edgeLines.rotation.x += 0.01;
		edgeLines.rotation.y += 0.01;
		renderer.render(scene, camera);
	}
	animate();
}

function createShapeGeometry(selectedShape) {
	let shapeGeometry;

	switch (selectedShape) {
		case "circle":
			shapeGeometry = new THREE.Shape();
			shapeGeometry.absarc(0, 0, 100, 0, Math.PI * 2, false);
			break;
		case "square":
			shapeGeometry = new THREE.Shape();
			shapeGeometry.moveTo(-100, -100);
			shapeGeometry.lineTo(100, -100);
			shapeGeometry.lineTo(100, 100);
			shapeGeometry.lineTo(-100, 100);
			shapeGeometry.lineTo(-100, -100);
			break;
		case "triangle":
			shapeGeometry = new THREE.Shape();
			shapeGeometry.moveTo(-100, -50);
			shapeGeometry.lineTo(100, -50);
			shapeGeometry.lineTo(0, 100);
			shapeGeometry.lineTo(-100, -50);
			break;
		case "pentagon":
			shapeGeometry = new THREE.Shape();
			const radius = 100;
			for (let i = 0; i < 5; i++) {
				const angle = i * ((Math.PI * 2) / 5) - Math.PI / 2;
				const x = radius * Math.cos(angle);
				const y = radius * Math.sin(angle);
				if (i === 0) shapeGeometry.moveTo(x, y);
				else shapeGeometry.lineTo(x, y);
			}
			shapeGeometry.closePath();
			break;
		default:
			shapeGeometry = new THREE.Shape();
			if (pointArray.length > 0) {
				shapeGeometry.moveTo(pointArray[0].x - 300, 300 - pointArray[0].y);
				pointArray.forEach((point) => {
					shapeGeometry.lineTo(point.x - 300, 300 - point.y);
				});
			}
			break;
	}

	return shapeGeometry;
}

function drawImageIn3D() {
	const imageUploadInput = document.getElementById("imageUpload");
	if (imageUploadInput.files.length > 0) {
		const file = imageUploadInput.files[0];
		const imageUrl = URL.createObjectURL(file);
		const loader = new THREE.TextureLoader();
		loader.load(imageUrl, (texture) => {
			const geometry = new THREE.PlaneGeometry(400, 400);
			const material = new THREE.MeshBasicMaterial({ map: texture });
			const plane = new THREE.Mesh(geometry, material);

			const scene = new THREE.Scene();
			const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
			const renderer = new THREE.WebGLRenderer();
			renderer.setSize(600, 600);
			document.getElementById("canvas3DContainer").innerHTML = "";
			document
				.getElementById("canvas3DContainer")
				.appendChild(renderer.domElement);
			camera.position.z = 500;

			scene.add(plane);

			function animate() {
				requestAnimationFrame(animate);
				plane.rotation.x += 0.01;
				plane.rotation.y += 0.01;
				renderer.render(scene, camera);
			}
			animate();

			alert("Image drawn in 3D successfully!");
		});
	}
}

function clearCanvas() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	pointArray = [];
	document.getElementById("canvas3DContainer").innerHTML = "";
}

/*
function createShapeGeometry(selectedShape) {
	let shapeGeometry;

	

	return shapeGeometry;
}

function drawImageIn3D() {
	const imageUploadInput = document.getElementById("imageUpload");
	if (imageUploadInput.files.length > 0) {
		const file = imageUploadInput.files[0];
		const imageUrl = URL.createObjectURL(file);
		const loader = new THREE.TextureLoader();
		loader.load(imageUrl, (texture) => {
			const geometry = new THREE.PlaneGeometry(400, 400);
			const material = new THREE.MeshBasicMaterial({ map: texture });
			const plane = new THREE.Mesh(geometry, material);

			
			renderer.setSize(600, 600);
			document.getElementById("canvas3DContainer").innerHTML = ""; // Clear previous content
			document
				.getElementById("canvas3DContainer")
				.appendChild(renderer.domElement);
			camera.position.z = 500;

			scene.add(plane);

			function animate() {
				requestAnimationFrame(animate);
				plane.rotation.x += 0.01;
				plane.rotation.y += 0.01;
				renderer.render(scene, camera);
			}
			animate();

			alert("Image drawn in 3D successfully!");
		});
	}
}

function clearCanvas() {
	pointArray = [];
	document.getElementById("canvas3DContainer").innerHTML = "";
}
*/
