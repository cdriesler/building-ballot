<template>
    <div id="vt" ref="main">
        <div class="name">
            {{name.toUpperCase()}}
        </div>
        <div class="pct">
            <div class="fill" :style="{'width': fillWidth + 'px'}">
            </div>
        </div>
    </div>
</template>

<style scoped>
#vt {
    width: 100%;
    height: 50px;
}

.name {
    width: 100%;
    height: 25px;
    line-height: 25px;
    text-align: left;
}

.pct {
    height: 10px;
    width: 100%;

    background: gainsboro;
}

.fill {
    height: 10px;
    background: green;
}
</style>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
    name: "vote-total",
    props: ["name", "pct"],
    data() {
        return {
            w: 0,
        }
    },
    mounted() {
        this.w = (<Element>this.$refs.main).clientWidth;
    },
    computed: {
        fillWidth(): number {
            return this.w * this.pct;
        }
    }
})
</script>