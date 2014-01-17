
    //config
    var stl_file = 'models/default.stl'; 

    // three.js 
    if (!Detector.webgl) {
        Detector.addGetWebGLMessage();
    }
    var container, stats;
    var camera, controls, scene, renderer;
    var cross;
    init();
    animate();
    var mesh = null;
    function init() {

        camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.01, 1e10);
        camera.position.x = 1;
        camera.position.y = 1;
        camera.position.z = 1;
        controls = new THREE.TrackballControls(camera);

        controls.rotateSpeed = 5.0;
        controls.zoomSpeed = 5;
        controls.panSpeed = 2;

        controls.noZoom = false;
        controls.noPan = false;

        controls.staticMoving = true;
        controls.dynamicDampingFactor = 0.3;

        scene = new THREE.Scene();

        scene.add(camera);

        // light
         
        var dirLight = new THREE.DirectionalLight(0xffffff);
        dirLight.position.set(200, 200, 1000).normalize();

        camera.add(dirLight);
        camera.add(dirLight.target);

        var material = new THREE.MeshLambertMaterial({ color:0xffffff, side:THREE.DoubleSide });

        var loader = new THREE.STLLoader();
        loader.addEventListener('load', function (event) {

            var geometry = event.content;

            mesh = new THREE.Mesh(geometry, material);
            mesh.position.setY(0);
            mesh.rotateX(-1.4);
            scene.add(mesh);

        });
        loader.load(stl_file);
        // renderer

        if (Detector.webgl) {
          renderer = new THREE.WebGLRenderer({ antialias:false });
        }
        else {
          renderer = new THREE.CanvasRenderer({ antialias:false });
        }
        renderer.setClearColor(0xeeeeee, 1);
        //renderer.setClearColor( 0x000000, 1 );
        renderer.setSize(window.innerWidth, window.innerHeight);

        container = document.getElementById('stage');
        //container = document.createElement( 'div' )
        //document.body.appendChild( container );

        container.appendChild(renderer.domElement);

        // stats = new Stats();
        // stats.domElement.style.position = 'absolute';
        // stats.domElement.style.top = '30px';
        // container.appendChild(stats.domElement);

        //

        // window.addEventListener('resize', onWindowResize, false);

    }

    function animate() {

        requestAnimationFrame(animate);

        controls.update();
        renderer.render(scene, camera);

        // stats.update();

    }

    function onWindowResize() {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);

        controls.handleResize();

    }