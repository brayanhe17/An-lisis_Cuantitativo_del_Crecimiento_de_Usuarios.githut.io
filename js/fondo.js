import * as THREE from 'https://cdn.skypack.dev/three@0.136.0';

const container = document.getElementById('globe-container');

if (container) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    const earthGroup = new THREE.Group();
    scene.add(earthGroup);

    const loader = new THREE.TextureLoader();
    loader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg', (texture) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = texture.image.width;
        canvas.height = texture.image.height;
        ctx.drawImage(texture.image, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        const positions = [];
        
        for (let i = 0; i < imageData.length; i += 4 * 15) { 
            if (imageData[i] > 150) { 
                const index = i / 4;
                const x = index % canvas.width;
                const y = Math.floor(index / canvas.width);

                const phi = (y / canvas.height) * Math.PI;
                const theta = ((canvas.width - x) / canvas.width) * Math.PI * 2;

                const radius = 2.5; 
                positions.push(
                    radius * Math.sin(phi) * Math.cos(theta),
                    radius * Math.cos(phi),
                    radius * Math.sin(phi) * Math.sin(theta)
                );
            }
        }

        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        const mat = new THREE.PointsMaterial({ 
            color: 0x7c3aed, 
            size: 0.015, 
            transparent: true, 
            opacity: 0.6 
        });
        earthGroup.add(new THREE.Points(geo, mat));
    });

    camera.position.z = 6;

    function animate() {
        requestAnimationFrame(animate);
        earthGroup.rotation.y += 0.0008;
        renderer.render(scene, camera);
    }

    window.addEventListener('scroll', () => {
        const p = window.scrollY / (document.body.scrollHeight - window.innerHeight);
        earthGroup.rotation.y = p * Math.PI * 2;
        earthGroup.position.y = (p * 2) - 1;
    });

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    animate();
}

// Función para actualizar el color de la barra mientras se mueve
function updateSliderColor(e) {
    const slider = e.target;
    const min = slider.min || 0;
    const max = slider.max || 100;
    const value = slider.value;
    
    // Calculamos el porcentaje
    const percentage = ((value - min) / (max - min)) * 100;
    
    // Aplicamos el valor a la variable CSS --pct
    slider.style.setProperty('--pct', percentage + '%');
}

// Vincula esta función a tus sliders
const inputs = document.querySelectorAll('input[type=range]');
inputs.forEach(input => {
    // Actualizar al cargar la página
    const initialPct = ((input.value - input.min) / (input.max - input.min)) * 100;
    input.style.setProperty('--pct', initialPct + '%');

    // Actualizar al mover
    input.addEventListener('input', updateSliderColor);
});