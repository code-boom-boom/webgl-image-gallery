/**
 * Media Component
 */
import { Mesh, Program, Texture } from "ogl";

import fragment from "shaders/image-fragment.glsl";
import vertex from "shaders/image-vertex.glsl";
import Number from "./Number";

export default class {
    constructor({ geometry, gl, image, index, length, renderer, scene, screen, text, viewport }) {
        this.extra = 0;

        this.geometry = geometry;
        this.gl = gl;
        this.image = image;
        this.index = index;
        this.length = length;
        this.renderer = renderer;
        this.scene = scene;
        this.screen = screen;
        this.text = text;
        this.viewport = viewport;

        this.createShader();

        this.createMesh();
    }

    createShader() {
        const texture = new Texture(this.gl, {
            generateMipmaps: false
        });

        this.program = new Program(this.gl, {
            depthTest: false,
            depthWrite: false,
            fragment,
            vertex,
            uniforms: {
                tMap: { value: texture },
                uPlaneSizes: { value: [0, 0] },
                uImageSizes: { value: [0, 0] },
                uViewportSizes: { value: [this.viewport.width, this.viewport.height] },
                uSpeed: { value: 0 },
                uTime: { value: 100 * Math.random() }
            },
            transparent: true
        });

        const image = new Image();

        image.src = this.image;

        image.onload = _ => {
            texture.image = image;

            this.program.uniforms.uImageSizes.value = [image.naturalWidth, image.naturalHeight];
        }

    }

    createMesh() {
        this.plane = new Mesh(this.gl, {
            geometry: this.geometry,
            program: this.program
        });

        this.plane.setParent(this.scene);
    }

    createTitle() {
        this.number = new Number({
            gl: this.gl,
            plane: this.plane,
            renderer: this.renderer,
            text: this.index % (this.length / 2)
        });
    }
}