<template>
    <div id="heatmap">
        <div 
        class="svgar" 
        ref="svgar" 
        id="svgar" 
        v-html="svg"
        @mousemove="onMove">
            
        </div>
        <div class="db">
            
        </div>
    </div>
</template>

<style scoped>
#heatmap {
    width: 100%;
    height: 100%;
}

.svgar {
    width: 100%;
    height: 100%;

    outline: 2px solid black;

    box-sizing: border-box;
}

</style>

<script lang="ts">
import Vue from 'vue'
import { db } from './../firebase';
import Svgar, { Create, Update, Locate } from 'svgar';
import SvgarCube from 'svgar/dist/models/SvgarCube';
import SvgarPath from 'svgar/dist/models/SvgarPath';
import SvgarSlab from 'svgar/dist/models/SvgarSlab';

interface PathReference {
    id: string,
    xMin: number,
    yMin: number,
    xMax: number,
    yMax: number
}

export default Vue.extend({
    name: "heatmap-component",
    props: ["options"],
    data() {
        return {
            cube: {} as SvgarCube,
            paths: [] as PathReference[],
            w: 0,
            h: 0,
            prev: 0,
            firebase: {},
            optA: {} as SvgarSlab,
            optB: {} as SvgarSlab,
            optC: {} as SvgarSlab,
            heat: [] as SvgarSlab[],
        }
    },
    created() {    
        this.cube = Create().svgar.cube("heatmap").then.build();

        db.ref().on("child_added", doc => {
            this.firebase = doc.toJSON() || {};
        });

        let profile = {
            name: "default",
            attributes: {
                "stroke": "black",
                "fill": "white",
                "stroke-width": "2px",
            }
        }

        let pathA = new Svgar.Builder.Polyline(7.78, 0.81)
        .lineTo(8.85, 2.74)
        .lineTo(4.72, 5.02)
        .lineTo(6.72, 8.65)
        .lineTo(8.89, 7.45)
        .lineTo(9.95, 9.37)
        .lineTo(5.85, 11.63)
        .lineTo(1.72, 4.16)
        .close()
        .build();

        let optASlab = new Svgar.Slab("a");
        optASlab.setElevation(10);
        optASlab.setAllStyles([profile]);
        optASlab.setAllGeometry([pathA]);
        this.optA = optASlab;

        let pathB = new Svgar.Builder.Polyline(3.47, 1.74)
        .lineTo(6.53, 7.30)
        .lineTo(8.71, 6.10)
        .lineTo(9.77, 8.02)
        .lineTo(5.68, 10.29)
        .lineTo(1.55, 2.81)
        .close()
        .build()

        let optBSlab = new Svgar.Slab("b");
        optBSlab.setElevation(10);
        optBSlab.setAllStyles([profile]);
        optBSlab.setAllGeometry([pathB]);
        this.optB = optBSlab;

        let pathC = new Svgar.Builder.Polyline(7.74, 1.36)
        .lineTo(8.80, 3.30)
        .lineTo(5.60, 5.07)
        .lineTo(8.31, 9.97)
        .lineTo(6.38, 11.04)
        .lineTo(2.61, 4.21)
        .close()
        .build();

        let optCSlab = new Svgar.Slab("c");
        optCSlab.setElevation(10);
        optCSlab.setAllStyles([profile]);
        optCSlab.setAllGeometry([pathC]);
        this.optC = optCSlab;
    },
    mounted() {
        let el = (<Element>this.$refs.svgar);
        this.w = el ? el.clientWidth : 0;
        this.h = el ? el.clientHeight : 0;

        this.heat = this.makeGrid(12, 12, 1);

        let slab = Create().svgar.slab("cells").then.build();
        Update().svgar.cube(this.cube).camera.extentsTo(0, 0, 12, 12);
    },
    computed: {
        svg(): string {
            if (this.w == 0) {
                return "";
            }

            const optionSlabs:any = {
                "option1": this.optA,
                "option2": this.optB,
                "option3": this.optC
            }

            Update().svgar.cube(this.cube).slabs.to([...this.heat, optionSlabs[this.options]])

            return this.cube.compile(this.w, this.h);
        }
    },
    watch: {
        options: function() {
            this.heat = this.makeGrid(12, 12, 1);
        }
    },
    methods: {
        makeGrid(width: number, height: number, size: number): SvgarSlab[] {
            let slabs: SvgarSlab[] = [];

            this.paths = [];

            for(let i = 0; i * size < width; i += 1) {

                for(let j = 0; j * size < height; j += 1) {
                    let p: number[] = [
                        i * size,
                        j * size,
                        (i + 1) * size,
                        j * size,
                        (i + 1) * size,
                        (j + 1) * size,
                        i * size,
                        (j + 1) * size
                    ];

                    let slab = new SvgarSlab(`HM${i}${j}`);

                    let sq = new Svgar.Builder.Polyline(p[0], p[1])
                    .lineTo(p[2], p[3])
                    .lineTo(p[4], p[5])
                    .lineTo(p[6], p[7])
                    .close();

                    let path = sq.build();

                    slab.setAllGeometry([path]);
                    slab.setAllStyles([
                        {
                            name: "default",
                            attributes: {
                                "stroke": "red",
                                "stroke-width": "0.5px",
                                "fill": "red",
                                "opacity": "0"
                            }
                        }
                    ]);
                    slabs.push(slab);

                    this.paths.push({
                        id: slab.getId(),
                        xMin: p[0],
                        yMin: p[1],
                        xMax: p[4],
                        yMax: p[5]
                    });

                }

            }

            return slabs;
        },
        onMove(event: MouseEvent): void {
            
            let t = Date.now();
            if (t - this.prev < 50) {
                return;
            }

            const box = (<Element>this.$refs.svgar).getBoundingClientRect();
            let x = ((event.pageX - box.left) / this.w) * 12;
            let y = ((this.h - (event.pageY - box.top)) / this.h) * 12;

            //console.log(`${x}, ${y}`);

            let target = this.paths.find(p => p.yMax > y && p.yMin < y && p.xMax > x && p.xMin < x);

            let cell = Locate().svgar.slab.withId(target ? target.id : "").in.svgar.cube(this.cube);

            if(cell) {
                let o = cell.getAllStyles().find(x => x.name == "default");
                let op = o ? +o.attributes["opacity"] + 0.05 : 0;
                console.log(op);
                Update().svgar.slab(cell).styles.to([
                    {
                        name: "default",
                        attributes: {
                            "stroke": "red",
                            "sroke-width": "0.5px",
                            "fill": "red",
                            "opacity": op.toString(),
                        }
                    }
                ])
            }

            this.prev = t;
        }
    }
})
</script>