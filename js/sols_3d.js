        function change(r, g, b) {
            mesh.material.color.r = r;
            mesh.material.color.g = g;
            mesh.material.color.b = b;
        }
        function changeDim(coor, action) {
            switch (coor) {
                case 'x':
                    if (action == 'increase')
                        mesh.scale.x += .1;
                    else
                        mesh.scale.x -= .1;
                    break;
                case 'y':
                    if (action == 'increase')
                        mesh.scale.y += .1;
                    else
                        mesh.scale.y -= .1;
                    break;
                case 'z':
                    if (action == 'increase')
                        mesh.scale.z += .1;
                    else
                        mesh.scale.z -= .1;
                    break;
            }
        }


    // Given a THREE.Geometry, create an STL string
    function generateSTL(geometry) {
        var vertices = geometry.vertices;
        var tris = geometry.faces;

        var stl = "solid vcg\n";
        for (var i = 0; i < tris.length; i++) {
            stl += "  facet normal " + tris[i].normal.x + "  " + tris[i].normal.y + "  " + tris[i].normal.z + "\n";
            stl += "    outer loop \n";
            stl += "      vertex   " + vertices[tris[i].a].x + "  " + vertices[tris[i].a].y + "  " + vertices[tris[i].a].z + "\n";
            stl += "      vertex   " + vertices[tris[i].b].x + "  " + vertices[tris[i].b].y + "  " + vertices[tris[i].b].z + "\n";
            stl += "      vertex   " + vertices[tris[i].c].x + "  " + vertices[tris[i].c].y + "  " + vertices[tris[i].c].z + "\n";
            stl += "    endloop \n";
            stl += "  endfacet \n";
        }
        stl += "endsolid vcg";
        return stl;
    }


    // Use FileSaver.js 'saveAs' function to save the string
    function saveSTL(geometry, name) {
        var stlString = generateSTL(geometry);

        var blob = new Blob([stlString], {type:'text/plain'});

        saveAs(blob, name + '.stl');

    }
    function createSTL() {
        saveSTL(mesh.geometry, 'download');
    }
    
















